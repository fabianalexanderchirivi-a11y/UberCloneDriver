import { auth, db } from './firebase';
export const testFirebase = () => {
  console.log('Firebase conectado:', !!auth && !!db);
};