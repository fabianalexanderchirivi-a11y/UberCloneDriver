
import {
  createContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import { colors } from '../theme';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        await auth.authStateReady();

        const user = auth.currentUser;

        if (!user) {
          return;
        }

        const registrationRef = doc(
          db,
          'driverRegistrations',
          user.uid
        );

        const snapshot = await getDoc(registrationRef);

        if (!active) return;

        if (
          snapshot.exists() &&
          snapshot.data().status === 'approved'
        ) {
          setIsSignedIn(true);
        } else {
          await firebaseSignOut(auth);

          if (active) {
            setIsSignedIn(false);
          }
        }
      } catch (error) {
        console.error(
          'Error al restaurar la sesión:',
          error.code || error.message
        );

        if (active) {
          setIsSignedIn(false);
        }
      } finally {
        if (active) {
          setIsAuthLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(() => {
    setIsSignedIn(true);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setIsSignedIn(false);
  }, []);

  if (isAuthLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        isAuthLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
