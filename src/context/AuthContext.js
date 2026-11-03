import { createContext, useState, useCallback } from 'react';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const signIn = useCallback(() => {
    setIsSignedIn(true);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setIsSignedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}