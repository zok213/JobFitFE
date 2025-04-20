// Session persistence utilities
import { Session } from '@supabase/supabase-js';

const SESSION_KEY = 'jobfit_session';

// Check if browser storage is available
export const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Store session in localStorage
export const persistSession = (session: Session): void => {
  try {
    if (isStorageAvailable('localStorage')) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch (error) {
    console.error('Error persisting session:', error);
  }
};

// Get persisted session from localStorage
export const getPersistedSession = (): Session | null => {
  try {
    if (isStorageAvailable('localStorage')) {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (sessionStr) {
        return JSON.parse(sessionStr);
      }
    }
    return null;
  } catch (error) {
    console.error('Error retrieving persisted session:', error);
    return null;
  }
};

// Clear persisted session
export const clearPersistedSession = (): void => {
  try {
    if (isStorageAvailable('localStorage')) {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (error) {
    console.error('Error clearing persisted session:', error);
  }
};

// Get session expiry time (in milliseconds)
export const getSessionExpiryTime = (session: Session | null): number => {
  if (!session || !session.expires_at) {
    // Return a default expiry time of 1 hour from now if no session exists
    return Date.now() + 60 * 60 * 1000;
  }
  
  // Convert expires_at to milliseconds (it's stored as seconds)
  return session.expires_at * 1000;
};

// Setup session refresh timer
export const setupSessionRefresh = (
  refreshCallback: () => Promise<void>,
  buffer: number = 5 * 60 * 1000 // 5 minutes before expiry
): { cancel: () => void } => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  const checkAndScheduleRefresh = () => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // Get current session
    const session = getPersistedSession();
    const expiryTime = getSessionExpiryTime(session);
    
    if (!expiryTime) return;
    
    // Calculate time until refresh (with buffer)
    const now = Date.now();
    const timeUntilRefresh = expiryTime - now - buffer;
    
    // Schedule refresh if needed
    if (timeUntilRefresh > 0) {
      timeoutId = setTimeout(async () => {
        await refreshCallback();
        checkAndScheduleRefresh(); // Re-schedule after refresh
      }, timeUntilRefresh);
    } else {
      // Session is already expired or close to expiry, refresh now
      refreshCallback().then(checkAndScheduleRefresh);
    }
  };
  
  // Initial schedule
  checkAndScheduleRefresh();
  
  // Return function to cancel the timer
  return {
    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
  };
}; 