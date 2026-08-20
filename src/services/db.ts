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

const STORAGE_KEY_DATA = 'abhay_portfolio_data_v1';
const STORAGE_KEY_CONFIG = 'spidey_admin_firebase_config_v1';
const BROADCAST_CHANNEL_NAME = 'spidey_portfolio_sync_v1';

/**
 * Ensures portfolio data is strictly valid and populated with defaults for any missing arrays or properties.
 */
export const ensureValidPortfolioData = (data: any): PortfolioData => {
  if (!data || typeof data !== 'object') {
    return initialPortfolioData;
  }

  const validProjects = Array.isArray(data.projects) && data.projects.length > 0
    ? data.projects
    : initialPortfolioData.projects;

  const validCertificates = Array.isArray(data.certificates)
    ? data.certificates
    : initialPortfolioData.certificates;

  const validSkills = Array.isArray(data.skills) && data.skills.length > 0
    ? data.skills
    : initialPortfolioData.skills;

  const validServices = Array.isArray(data.services) && data.services.length > 0
    ? data.services
    : initialPortfolioData.services;

  const validTimeline = Array.isArray(data.timeline) && data.timeline.length > 0
    ? data.timeline
    : initialPortfolioData.timeline;

  const validPersonal = {
    ...initialPortfolioData.personal,
    ...(data.personal || {}),
    email: 'abbaabhayyy@gmail.com', // Always ensure primary email
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
 * Get current Firebase configuration from localStorage or Vite environment variables.
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
 * Save Firebase configuration to localStorage for persistent admin access.
 */
export const saveFirebaseConfig = (config: FirebaseConfig): void => {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
};

/**
 * Save portfolio data to LocalStorage, Broadcast to Open Tabs, and optional Cloud DB.
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

  // 1. Immediately write to LocalStorage for offline persistence
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(payloadToStore));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }

  // 2. Broadcast change instantly to all other open browser tabs
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'SYNC_PORTFOLIO_DATA', data: payloadToStore });
    } catch (e) {
      console.warn('Failed to broadcast data update:', e);
    }
  }

  // 3. If Firebase Project ID is configured, save to Firestore via REST API
  const config = getFirebaseConfig();
  if (config.projectId) {
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
        console.warn(`Firestore sync warning (${response.status}):`, errText);
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
 * Fetch portfolio data from LocalStorage or Cloud Database.
 */
export const fetchPortfolioDataFromDB = async (): Promise<{
  data: PortfolioData;
  source: 'firestore' | 'local' | 'default';
  error?: string;
}> => {
  // 1. Read existing LocalStorage cache first
  let localData: PortfolioData | null = null;
  let localTime = 0;
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

  // 2. If Firebase Project ID configured, fetch from Firestore REST API
  const config = getFirebaseConfig();
  if (config.projectId) {
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

          // Only overwrite local storage if cloud data is newer or equal
          if (!localData || cloudTime >= localTime) {
            localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify({ ...cloudData, updatedAt: cloudUpdatedAt }));
            return { data: cloudData, source: 'firestore' };
          }
        }
      }
    } catch (err: any) {
      console.warn('Failed to fetch from Firestore, using local cache:', err);
    }
  }

  // 3. Fallback to LocalStorage data if available
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

