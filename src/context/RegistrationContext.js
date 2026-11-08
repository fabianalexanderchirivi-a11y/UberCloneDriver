
import { createContext, useState, useCallback } from 'react';
import {
  validatePersonalData,
  validateVehicleData,
  validateDocumentsData,
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

const initialDocumentsData = {
  licenseNumber: '',
  licensePhoto: null,
  licenseExpiry: null,
  soatPhoto: null,
  soatExpiry: null,
  technicalReviewPhoto: null,
  technicalReviewExpiry: null,
  mercadoPagoEmail: '',
  acceptedTerms: false,
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
  const [documentsData, setDocumentsData] = useState(initialDocumentsData);

  const [personalTouched, setPersonalTouched] = useState({});
  const [vehicleTouched, setVehicleTouched] = useState({});
  const [documentsTouched, setDocumentsTouched] = useState({});

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

  const updateDocuments = useCallback((field, value) => {
    setDocumentsData((previous) => ({
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

  const touchDocuments = useCallback((field) => {
    setDocumentsTouched((previous) => ({
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

  const touchAllDocuments = useCallback(() => {
    setDocumentsTouched(allFieldsTouched(initialDocumentsData));
  }, []);

  const resetRegistration = useCallback(() => {
    setPersonalData(initialPersonalData);
    setVehicleData(initialVehicleData);
    setDocumentsData(initialDocumentsData);
    setPersonalTouched({});
    setVehicleTouched({});
    setDocumentsTouched({});
  }, []);

  const personalErrors = validatePersonalData(personalData);
  const vehicleErrors = validateVehicleData(vehicleData);

  const documentsErrors = validateDocumentsData(
    documentsData,
    vehicleData.year,
  );

  const value = {
    personalData,
    vehicleData,
    documentsData,
    updatePersonal,
    updateVehicle,
    updateDocuments,
    touchPersonal,
    touchVehicle,
    touchDocuments,
    touchAllPersonal,
    touchAllVehicle,
    touchAllDocuments,
    resetRegistration,

    personalErrors: showOnlyTouched(
      personalErrors,
      personalTouched,
    ),

    vehicleErrors: showOnlyTouched(
      vehicleErrors,
      vehicleTouched,
    ),

    documentsErrors: showOnlyTouched(
      documentsErrors,
      documentsTouched,
    ),

    isPersonalValid: !hasErrors(personalErrors),
    isVehicleValid: !hasErrors(vehicleErrors),
    isDocumentsValid: !hasErrors(documentsErrors),
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}
