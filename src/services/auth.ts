import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize or reuse Firebase app
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/forms.body'
];

export const createGoogleProvider = () => {
  const p = new GoogleAuthProvider();
  SCOPES.forEach((scope) => p.addScope(scope));
  p.setCustomParameters({
    prompt: 'consent',
    access_type: 'offline'
  });
  return p;
};

const provider = createGoogleProvider();

const TOKEN_KEY = 'TRITUE_G_ACCESS_TOKEN';

let isSigningIn = false;
let cachedAccessToken: string | null =
  typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(TOKEN_KEY) : null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const token = await getAccessToken();
      if (onAuthSuccess) onAuthSuccess(user, token);
    } else {
      cachedAccessToken = null;
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(TOKEN_KEY);
      }
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (forceConsent = true): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const authProvider = createGoogleProvider();
    if (forceConsent) {
      authProvider.setCustomParameters({
        prompt: 'consent',
        access_type: 'offline'
      });
    }
    const result = await signInWithPopup(auth, authProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Không lấy được access token từ Google Sign-in');
    }

    cachedAccessToken = credential.accessToken;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(TOKEN_KEY, credential.accessToken);
    }
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.message?.includes('popup-closed-by-user')
    ) {
      // User closed the popup window voluntarily, treat as a clean cancellation
      return null;
    }
    console.error('Lỗi đăng nhập Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  if (typeof sessionStorage !== 'undefined') {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) {
      cachedAccessToken = saved;
      return saved;
    }
  }
  return null;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(TOKEN_KEY);
  }
};
