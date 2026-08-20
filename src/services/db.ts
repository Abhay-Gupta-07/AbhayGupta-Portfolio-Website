import type { PortfolioData } from '../data/portfolioData';

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

  // Fallback to import.meta.env if defined
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
 * Save portfolio data to Cloud Database (Firebase Firestore REST API + LocalStorage backup).
 */
export const savePortfolioDataToDB = async (
  data: PortfolioData
): Promise<{ success: boolean; source: 'firestore' | 'local'; error?: string }> => {
  // Always update LocalStorage immediately for instant local caching
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }

  const config = getFirebaseConfig();

  // If Firebase Project ID is configured, save to Firestore via REST API
  if (config.projectId) {
    try {
      const collection = 'portfolio';
      const documentId = 'mainData';
      const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${collection}/${documentId}`;

      const payload = {
        fields: {
          jsonContent: { stringValue: JSON.stringify(data) },
          updatedAt: { stringValue: new Date().toISOString() },
        },
      };

      const response = await fetch(`${url}?currentDocument.exists=true`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok && response.status === 404) {
        // If document does not exist yet, create it with POST/PATCH without pre-condition
        await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      return { success: true, source: 'firestore' };
    } catch (err: any) {
      console.warn('Error syncing to Firestore REST API:', err);
      return { success: false, source: 'local', error: err?.message || 'Firestore sync failed' };
    }
  }

  return { success: true, source: 'local' };
};

/**
 * Fetch portfolio data from Cloud Database (Firebase Firestore REST API fallback to LocalStorage).
 */
export const fetchPortfolioDataFromDB = async (): Promise<{
  data: PortfolioData | null;
  source: 'firestore' | 'local' | 'default';
  error?: string;
}> => {
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
        if (jsonContentStr) {
          const parsedData = JSON.parse(jsonContentStr) as PortfolioData;
          // Update local cache
          localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(parsedData));
          return { data: parsedData, source: 'firestore' };
        }
      }
    } catch (err: any) {
      console.warn('Failed to fetch from Firestore, checking localStorage:', err);
    }
  }

  // Fallback to LocalStorage
  try {
    const localSaved = localStorage.getItem(STORAGE_KEY_DATA);
    if (localSaved) {
      const parsed = JSON.parse(localSaved) as PortfolioData;
      return { data: parsed, source: 'local' };
    }
  } catch (e) {
    console.error('Error reading localStorage portfolio data:', e);
  }

  return { data: null, source: 'default' };
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
