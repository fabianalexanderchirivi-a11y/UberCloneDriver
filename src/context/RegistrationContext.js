import { createContext, useState, useCallback } from 'react';
import {
  validatePersonalData,
  validateVehicleData,
  hasErrors,
} from '../utils/validations';
const initialPersonalData = {
  photo: null,
  fullName: '',
  documentNumber: '',
  phone: '',
  birthDate: null,
  gender: '',
  email: '',
  language: 'es',
};

const initialVehicleData = {
  category: '',
  plate: '',
  brand: '',
  model: '',
  year: '',
  color: '',
  capacity: '',
  vehiclePhoto: null,
};

const showOnlyTouched = (errors, touched) =>
  Object.fromEntries(
    Object.entries(errors).map(([field, error]) => [
      field,
      touched[field] ? error : '',
    ]),
  );

const allFieldsTouched = (data) =>
  Object.fromEntries(
    Object.keys(data).map((field) => [field, true]),
  );

export const RegistrationContext = createContext(null);

// AI-assisted: see docs/AI_LOG.md #42 y 43
export function RegistrationProvider({ children }) {
  const [personalData, setPersonalData] = useState(initialPersonalData);
  const [vehicleData, setVehicleData] = useState(initialVehicleData);

  const [personalTouched, setPersonalTouched] = useState({});
  const [vehicleTouched, setVehicleTouched] = useState({});

  const updatePersonal = useCallback((field, value) => {
    setPersonalData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }, []);

  const updateVehicle = useCallback((field, value) => {
    setVehicleData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }, []);

  const touchPersonal = useCallback((field) => {
    setPersonalTouched((previous) => ({
      ...previous,
      [field]: true,
    }));
  }, []);

  const touchVehicle = useCallback((field) => {
    setVehicleTouched((previous) => ({
      ...previous,
      [field]: true,
    }));
  }, []);

  const touchAllPersonal = useCallback(() => {
    setPersonalTouched(allFieldsTouched(initialPersonalData));
  }, []);

  const touchAllVehicle = useCallback(() => {
    setVehicleTouched(allFieldsTouched(initialVehicleData));
  }, []);

  const resetRegistration = useCallback(() => {
    setPersonalData(initialPersonalData);
    setVehicleData(initialVehicleData);
    setPersonalTouched({});
    setVehicleTouched({});
  }, []);
  const personalErrors = validatePersonalData(personalData);
  const vehicleErrors = validateVehicleData(vehicleData);

  const value = {
    personalData,
    vehicleData,
    updatePersonal,
    updateVehicle,
    touchPersonal,
    touchVehicle,
    touchAllPersonal,
    touchAllVehicle,
    resetRegistration,
    personalErrors: showOnlyTouched(personalErrors, personalTouched),
    vehicleErrors: showOnlyTouched(vehicleErrors, vehicleTouched),
    isPersonalValid: !hasErrors(personalErrors),
    isVehicleValid: !hasErrors(vehicleErrors),
  };
  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}
