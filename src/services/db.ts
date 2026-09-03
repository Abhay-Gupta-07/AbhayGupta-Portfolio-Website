import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import type { PortfolioData } from '../data/portfolioData';
import { initialPortfolioData } from '../data/portfolioData';

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const STORAGE_KEY_DATA = 'abhay_portfolio_data_v7';
const STORAGE_KEY_CONFIG = 'spidey_admin_firebase_config_v1';
const BROADCAST_CHANNEL_NAME = 'spidey_portfolio_sync_v7';
const IDB_NAME = 'AbhayPortfolioDB_v7';
const IDB_STORE = 'portfolio_store';

let cachedFirestoreDB: any = null;
let cachedAppProjectId: string = '';

/**
 * Initialize or reuse Firebase Firestore instance dynamically based on active credentials
 */
export const getFirestoreDB = (config: FirebaseConfig = getFirebaseConfig()) => {
  if (!config.projectId) return null;
  if (cachedFirestoreDB && cachedAppProjectId === config.projectId) {
    return cachedFirestoreDB;
  }

  try {
    const existingApps = getApps();
    const app = existingApps.length > 0
      ? getApp()
      : initializeApp({
          apiKey: config.apiKey || 'AIzaSy_dummy_key_for_firestore_read',
          authDomain: config.authDomain || `${config.projectId}.firebaseapp.com`,
          projectId: config.projectId,
          storageBucket: config.storageBucket || `${config.projectId}.appspot.com`,
          messagingSenderId: config.messagingSenderId || '100000000000',
          appId: config.appId || '1:100000000000:web:abcdef123456',
        });
    cachedFirestoreDB = getFirestore(app);
    cachedAppProjectId = config.projectId;
    return cachedFirestoreDB;
  } catch (err) {
    console.warn('Firebase SDK initialization notice:', err);
    return null;
  }
};

/**
 * IndexedDB helper for persistent storage without 5MB LocalStorage quota limits.
 */
const openIDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject('IndexedDB unavailable');
    }
    const request = window.indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveToIDB = async (key: string, val: any): Promise<void> => {
  try {
    const db = await openIDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(val, key);
    return new Promise((res, rej) => {
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  } catch (e) {
    console.warn('IDB Save notice:', e);
  }
};

export const getFromIDB = async (key: string): Promise<any> => {
  try {
    const db = await openIDB();
    const tx = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(key);
    return new Promise((res, rej) => {
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
  } catch (e) {
    console.warn('IDB Read notice:', e);
    return null;
  }
};

/**
 * Ensures portfolio data is strictly valid and populated with defaults for any missing arrays or properties.
 */
export const ensureValidPortfolioData = (data: any): PortfolioData => {
  if (!data || typeof data !== 'object') {
    return initialPortfolioData;
  }

  const validProjects = Array.isArray(data.projects)
    ? data.projects
    : initialPortfolioData.projects;

  const validCertificates = Array.isArray(data.certificates)
    ? data.certificates
    : initialPortfolioData.certificates;

  const validSkills = Array.isArray(data.skills)
    ? data.skills
    : initialPortfolioData.skills;

  const validServices = Array.isArray(data.services)
    ? data.services
    : initialPortfolioData.services;

  const validTimeline = Array.isArray(data.timeline) && data.timeline.length >= initialPortfolioData.timeline.length
    ? data.timeline
    : initialPortfolioData.timeline;

  const validPersonal = {
    ...initialPortfolioData.personal,
    ...(data.personal || {}),
    email: 'abbaabhayyy@gmail.com',
    socials: {
      ...initialPortfolioData.personal.socials,
      ...(data.personal?.socials || {})
    },
    stats: Array.isArray(data.personal?.stats) ? data.personal.stats : initialPortfolioData.personal.stats
  };

  return {
    personal: validPersonal,
    projects: validProjects,
    certificates: validCertificates,
    skills: validSkills,
    services: validServices,
    timeline: validTimeline,
  };
};

/**
 * Broadcast channel helper to sync portfolio updates across browser tabs in real-time.
 */
let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not initialized:', e);
  }
}

export const subscribeToDataSync = (callback: (data: PortfolioData) => void): (() => void) => {
  if (!syncChannel && typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      syncChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    } catch (e) {
      console.warn('Could not initialize BroadcastChannel:', e);
    }
  }

  const handler = (event: MessageEvent) => {
    if (event.data && event.data.type === 'SYNC_PORTFOLIO_DATA' && event.data.data) {
      const valid = ensureValidPortfolioData(event.data.data);
      callback(valid);
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', handler);
  }

  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', handler);
    }
  };
};

/**
 * Subscribe to online Cloud Database updates in real-time via Firestore onSnapshot
 */
export const subscribeToCloudDB = (callback: (data: PortfolioData) => void): (() => void) => {
  const config = getFirebaseConfig();
  const db = getFirestoreDB(config);

  if (!db || !config.projectId) {
    return () => {};
  }

  try {
    const docRef = doc(db, 'portfolio', 'mainData');
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const snapData = docSnap.data();
          if (snapData && snapData.jsonContent) {
            try {
              const parsed = JSON.parse(snapData.jsonContent);
              const valid = ensureValidPortfolioData(parsed);
              callback(valid);
            } catch (err) {
              console.warn('Error parsing Firestore snapshot JSON:', err);
            }
          }
        }
      },
      (err) => {
        console.warn('Firestore real-time subscription notice:', err.message);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Could not establish Firestore subscription:', err);
    return () => {};
  }
};

/**
 * Get current Firebase configuration from localStorage or environment variables.
 */
export const getFirebaseConfig = (): FirebaseConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.projectId) return parsed;
    }
  } catch (e) {
    console.warn('Could not parse saved firebase config from localStorage:', e);
  }

  const env = (import.meta as any).env || {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.VITE_FIREBASE_APP_ID || '',
  };
};

/**
 * Save Firebase configuration to localStorage.
 */
export const saveFirebaseConfig = (config: FirebaseConfig): void => {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
};

/**
 * Save portfolio data to IndexedDB, LocalStorage, Broadcast to Open Tabs, and Online Firestore DB.
 */
export const savePortfolioDataToDB = async (
  data: PortfolioData
): Promise<{ success: boolean; source: 'firestore' | 'local'; error?: string }> => {
  const timestamp = new Date().toISOString();
  const validData = ensureValidPortfolioData(data);

  const payloadToStore = {
    ...validData,
    updatedAt: timestamp
  };

  // 1. Immediately write to IndexedDB & LocalStorage for persistent offline storage
  await saveToIDB(STORAGE_KEY_DATA, payloadToStore);
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(payloadToStore));
  } catch (e) {
    console.warn('LocalStorage limit reached, data safely persisted in IndexedDB:', e);
  }

  // 2. Broadcast change instantly to all open browser tabs
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'SYNC_PORTFOLIO_DATA', data: payloadToStore });
    } catch (e) {
      console.warn('Failed to broadcast data update:', e);
    }
  }

  // 3. Save to Firebase Firestore Cloud Database
  const config = getFirebaseConfig();
  if (config.projectId) {
    // 3a. Try Firebase Web SDK
    const db = getFirestoreDB(config);
    if (db) {
      try {
        const docRef = doc(db, 'portfolio', 'mainData');
        await setDoc(docRef, {
          jsonContent: JSON.stringify(payloadToStore),
          updatedAt: timestamp,
        });
        return { success: true, source: 'firestore' };
      } catch (sdkErr: any) {
        console.warn('Firestore SDK save warning, trying REST API fallback:', sdkErr.message);
      }
    }

    // 3b. REST API Fallback
    try {
      const collection = 'portfolio';
      const documentId = 'mainData';
      const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${collection}/${documentId}`;

      const payload = {
        fields: {
          jsonContent: { stringValue: JSON.stringify(payloadToStore) },
          updatedAt: { stringValue: timestamp },
        },
      };

      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return { success: true, source: 'firestore' };
      } else {
        const errText = await response.text();
        console.warn(`Firestore REST sync warning (${response.status}):`, errText);
        return { success: false, source: 'local', error: `Firestore status ${response.status}` };
      }
    } catch (err: any) {
      console.warn('Error syncing to Firestore REST API:', err);
      return { success: false, source: 'local', error: err?.message || 'Firestore sync failed' };
    }
  }

  return { success: true, source: 'local' };
};

/**
 * Fetch portfolio data from IndexedDB, LocalStorage, or Online Cloud Database.
 */
export const fetchPortfolioDataFromDB = async (): Promise<{
  data: PortfolioData;
  source: 'firestore' | 'local' | 'default';
  error?: string;
}> => {
  // 1. Read existing Local/IndexedDB cache first
  let localData: PortfolioData | null = null;
  let localTime = 0;

  try {
    const idbSaved = await getFromIDB(STORAGE_KEY_DATA);
    if (idbSaved) {
      localData = ensureValidPortfolioData(idbSaved);
      if (idbSaved?.updatedAt) {
        localTime = new Date(idbSaved.updatedAt).getTime();
      }
    }
  } catch (e) {
    console.warn('Error reading from IDB:', e);
  }

  if (!localData) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        localData = ensureValidPortfolioData(parsed);
        if (parsed?.updatedAt) {
          localTime = new Date(parsed.updatedAt).getTime();
        }
      }
    } catch (e) {
      console.error('Error reading localStorage portfolio data:', e);
    }
  }

  // 2. If Firebase Project ID configured, fetch from Firestore
  const config = getFirebaseConfig();
  if (config.projectId) {
    // 2a. Try Firebase Web SDK
    const db = getFirestoreDB(config);
    if (db) {
      try {
        const docRef = doc(db, 'portfolio', 'mainData');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const snapData = docSnap.data();
          if (snapData && snapData.jsonContent) {
            const cloudData = ensureValidPortfolioData(JSON.parse(snapData.jsonContent));
            const cloudTime = snapData.updatedAt ? new Date(snapData.updatedAt).getTime() : 0;

            if (localData && localTime > cloudTime) {
              console.log('Local data is newer than Cloud DB. Syncing local to Cloud DB...');
              savePortfolioDataToDB(localData);
              return { data: localData, source: 'local' };
            }

            await saveToIDB(STORAGE_KEY_DATA, { ...cloudData, updatedAt: snapData.updatedAt });
            try {
              localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify({ ...cloudData, updatedAt: snapData.updatedAt }));
            } catch (e) {}

            return { data: cloudData, source: 'firestore' };
          }
        }
      } catch (sdkErr) {
        console.warn('Firestore SDK fetch warning, trying REST API fallback:', sdkErr);
      }
    }

    // 2b. REST API Fallback
    try {
      const collection = 'portfolio';
      const documentId = 'mainData';
      const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${collection}/${documentId}`;

      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        const jsonContentStr = json?.fields?.jsonContent?.stringValue;
        const cloudUpdatedAt = json?.fields?.updatedAt?.stringValue;

        if (jsonContentStr) {
          const cloudData = ensureValidPortfolioData(JSON.parse(jsonContentStr));
          const cloudTime = cloudUpdatedAt ? new Date(cloudUpdatedAt).getTime() : 0;

          if (localData && localTime > cloudTime) {
            console.log('Local data is newer than Cloud DB. Syncing local to Cloud DB...');
            savePortfolioDataToDB(localData);
            return { data: localData, source: 'local' };
          }

          await saveToIDB(STORAGE_KEY_DATA, { ...cloudData, updatedAt: cloudUpdatedAt });
          try {
            localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify({ ...cloudData, updatedAt: cloudUpdatedAt }));
          } catch (e) {}

          return { data: cloudData, source: 'firestore' };
        }
      }
    } catch (err: any) {
      console.warn('Failed to fetch from Firestore REST API, using local cache:', err);
    }
  }

  // 3. Fallback to Local Data if available
  if (localData) {
    return { data: localData, source: 'local' };
  }

  // 4. Fallback to initial static portfolio data
  return { data: initialPortfolioData, source: 'default' };
};

/**
 * Test Firebase Cloud Database Connection
 */
export const testDBConnection = async (config: FirebaseConfig): Promise<{ success: boolean; message: string }> => {
  if (!config.projectId) {
    return { success: false, message: 'No Project ID provided.' };
  }

  try {
    const db = getFirestoreDB(config);
    if (db) {
      const docRef = doc(db, 'portfolio', 'mainData');
      await getDoc(docRef);
      return { success: true, message: `Successfully connected to Firebase Firestore Project: ${config.projectId}` };
    }
  } catch (err: any) {
    console.warn('SDK connection test warning, trying REST API:', err.message);
  }

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`;
    const res = await fetch(url);
    if (res.status === 200 || res.status === 404) {
      return { success: true, message: `Successfully connected to Firebase Project: ${config.projectId}` };
    } else {
      const errText = await res.text();
      return { success: false, message: `Connection failed (${res.status}): ${errText.slice(0, 100)}` };
    }
  } catch (err: any) {
    return { success: false, message: `Network error: ${err?.message || 'Could not connect'}` };
  }
};

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}

/**
 * Save user contact message to local storage, IndexedDB, and Cloud Database (Spidey Admin Inbox Only)
 */
export const saveAdminMessageToDB = async (
  msg: Omit<AdminMessage, 'id' | 'date'> & { id?: string; date?: string }
): Promise<AdminMessage> => {
  const newMsg: AdminMessage = {
    id: msg.id || `msg-${Date.now()}`,
    name: msg.name,
    email: msg.email,
    message: msg.message,
    date: msg.date || new Date().toLocaleString(),
  };

  try {
    const existingStr = localStorage.getItem('spidey_admin_messages_v1');
    const existing: AdminMessage[] = existingStr ? JSON.parse(existingStr) : [];
    const updated = [newMsg, ...existing];
    localStorage.setItem('spidey_admin_messages_v1', JSON.stringify(updated));
    await saveToIDB('spidey_admin_messages_v1', updated);
  } catch (e) {
    console.warn('Notice saving message locally:', e);
  }

  // Also sync to Cloud DB if configured
  const config = getFirebaseConfig();
  if (config.projectId) {
    const db = getFirestoreDB(config);
    if (db) {
      try {
        const docRef = doc(db, 'portfolio', 'inboxMessages');
        const existingDoc = await getDoc(docRef);
        let cloudMsgs: AdminMessage[] = [];
        if (existingDoc.exists()) {
          const snapData = existingDoc.data();
          if (snapData && snapData.jsonContent) {
            cloudMsgs = JSON.parse(snapData.jsonContent);
          }
        }
        const mergedMsgs = [newMsg, ...cloudMsgs.filter((m) => m.id !== newMsg.id)];
        await setDoc(docRef, {
          jsonContent: JSON.stringify(mergedMsgs),
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Notice syncing message to Firestore:', e);
      }
    }
  }

  return newMsg;
};

/**
 * Fetch contact messages for Spidey Admin Inbox
 */
export const fetchAdminMessagesFromDB = async (): Promise<AdminMessage[]> => {
  let localMsgs: AdminMessage[] = [];
  try {
    const idbSaved = await getFromIDB('spidey_admin_messages_v1');
    if (Array.isArray(idbSaved)) {
      localMsgs = idbSaved;
    } else {
      const saved = localStorage.getItem('spidey_admin_messages_v1');
      if (saved) localMsgs = JSON.parse(saved);
    }
  } catch (e) {}

  const config = getFirebaseConfig();
  if (config.projectId) {
    const db = getFirestoreDB(config);
    if (db) {
      try {
        const docRef = doc(db, 'portfolio', 'inboxMessages');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const snapData = docSnap.data();
          if (snapData && snapData.jsonContent) {
            const cloudMsgs: AdminMessage[] = JSON.parse(snapData.jsonContent);
            if (Array.isArray(cloudMsgs) && cloudMsgs.length >= localMsgs.length) {
              localStorage.setItem('spidey_admin_messages_v1', JSON.stringify(cloudMsgs));
              await saveToIDB('spidey_admin_messages_v1', cloudMsgs);
              return cloudMsgs;
            }
          }
        }
      } catch (e) {}
    }
  }

  return localMsgs;
};

/**
 * Delete a specific admin message
 */
export const deleteAdminMessageFromDB = async (msgId: string): Promise<AdminMessage[]> => {
  let msgs: AdminMessage[] = [];
  try {
    const saved = localStorage.getItem('spidey_admin_messages_v1');
    if (saved) msgs = JSON.parse(saved);
  } catch (e) {}

  const updated = msgs.filter((m) => m.id !== msgId);
  localStorage.setItem('spidey_admin_messages_v1', JSON.stringify(updated));
  await saveToIDB('spidey_admin_messages_v1', updated);

  const config = getFirebaseConfig();
  if (config.projectId) {
    const db = getFirestoreDB(config);
    if (db) {
      try {
        const docRef = doc(db, 'portfolio', 'inboxMessages');
        await setDoc(docRef, {
          jsonContent: JSON.stringify(updated),
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {}
    }
  }

  return updated;
};

/**
 * Clear all messages from Spidey Admin Inbox
 */
export const clearAllAdminMessagesFromDB = async (): Promise<void> => {
  localStorage.removeItem('spidey_admin_messages_v1');
  await saveToIDB('spidey_admin_messages_v1', []);

  const config = getFirebaseConfig();
  if (config.projectId) {
    const db = getFirestoreDB(config);
    if (db) {
      try {
        const docRef = doc(db, 'portfolio', 'inboxMessages');
        await setDoc(docRef, {
          jsonContent: JSON.stringify([]),
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {}
    }
  }
};




