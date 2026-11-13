import { createContext,  useState,   useEffect,  useCallback,} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { texts } from '../i18n';

const LANGUAGE_STORAGE_KEY = '@uberclone_language';

export const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState('es');
    const [isLanguageReady, setIsLanguageReady] = useState(false);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem(
                    LANGUAGE_STORAGE_KEY,
                );

                if (savedLanguage === 'es' || savedLanguage === 'en') {
                    setLanguageState(savedLanguage);
                }
            } catch (error) {
                console.error('Error cargando idioma:', error);
            } finally {
                setIsLanguageReady(true);
            }
        };

        loadLanguage();
    }, []);

    const setLanguage = useCallback(async (newLanguage) => {
        if (newLanguage !== 'es' && newLanguage !== 'en') {
            return;
        }

        try {
            await AsyncStorage.setItem(
                LANGUAGE_STORAGE_KEY,
                newLanguage,
            );

            setLanguageState(newLanguage);
        } catch (error) {
            console.error('Error guardando idioma:', error);
        }
    }, []);

    const t = useCallback((key) => {
        const value = key.split('.').reduce(
            (current, part) => current?.[part],
            texts[language],
        );

        if (value !== undefined) {
            return value;
        }

        return key.split('.').reduce(
            (current, part) => current?.[part],
            texts.es,
        ) ?? key;
    }, [language]);

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                t,
                isLanguageReady,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}
