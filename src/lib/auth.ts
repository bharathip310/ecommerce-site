export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

const MOCK_USERS_KEY = 'mock_users_db';
const MOCK_CURRENT_USER_KEY = 'mock_current_user';

function getMockUsers(): Record<string, any> {
  const usersStr = localStorage.getItem(MOCK_USERS_KEY);
  if (usersStr) return JSON.parse(usersStr);
  return {};
}

function saveMockUser(user: any) {
  const users = getMockUsers();
  users[user.email] = user;
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

let currentUser: User | null = null;
let cachedAccessToken: string | null = null;

let authStateListeners: ((user: User | null) => void)[] = [];

function notifyAuthListeners(user: User | null) {
  authStateListeners.forEach(listener => listener(user));
}

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  const savedUser = localStorage.getItem(MOCK_CURRENT_USER_KEY);
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    cachedAccessToken = 'mock_token_123';
  } else {
    currentUser = null;
    cachedAccessToken = null;
  }

  const listener = (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken || 'mock_token_123');
    } else {
      if (onAuthFailure) onAuthFailure();
    }
  };
  
  authStateListeners.push(listener);
  // Initial notification
  listener(currentUser);

  return () => {
    authStateListeners = authStateListeners.filter(l => l !== listener);
  };
};

export const googleSignIn = async (): Promise<{ user: User; accessToken?: string } | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser: User = {
        uid: 'google_mock_user_123',
        email: 'user@gmail.com',
        displayName: 'Google User',
        photoURL: null
      };
      currentUser = mockUser;
      cachedAccessToken = 'mock_google_token_123';
      localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(currentUser));
      notifyAuthListeners(currentUser);
      resolve({ user: mockUser, accessToken: cachedAccessToken });
    }, 500);
  });
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getMockUsers();
      const user = users[email];
      if (!user) {
        return reject({ code: 'auth/user-not-found', message: 'No user found' });
      }
      if (user.password !== password) {
        return reject({ code: 'auth/wrong-password', message: 'Invalid password' });
      }
      
      currentUser = {
        uid: `email_mock_${Date.now()}`,
        email: user.email,
        displayName: user.email.split('@')[0],
        photoURL: null
      };
      cachedAccessToken = 'mock_email_token_123';
      localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(currentUser));
      notifyAuthListeners(currentUser);
      resolve(currentUser);
    }, 500);
  });
};

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getMockUsers();
      if (users[email]) {
        return reject({ code: 'auth/email-already-in-use', message: 'Email in use' });
      }
      if (password.length < 6) {
        return reject({ code: 'auth/weak-password', message: 'Weak password' });
      }

      const newUser = { email, password };
      saveMockUser(newUser);

      currentUser = {
        uid: `email_mock_${Date.now()}`,
        email: email,
        displayName: email.split('@')[0],
        photoURL: null
      };
      cachedAccessToken = 'mock_email_token_123';
      localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(currentUser));
      notifyAuthListeners(currentUser);
      resolve(currentUser);
    }, 500);
  });
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  currentUser = null;
  cachedAccessToken = null;
  localStorage.removeItem(MOCK_CURRENT_USER_KEY);
  notifyAuthListeners(null);
};
