const texts = {
  es: {
    common: { showPassword: 'Mostrar contraseña', hidePassword: 'Ocultar contraseña' },
    welcome: {
      title: 'UberClone Conductor',
      subtitle: 'Recibe viajes y consulta tus ganancias',
      logIn: 'Iniciar sesión',
      signUp: 'Registrarse',
    },
    login: {
      title: 'Iniciar sesión',
      email: 'Correo electrónico',
      emailPlaceholder: 'conductor@correo.com',
      password: 'Contraseña',
      passwordPlaceholder: 'Tu contraseña',
      submit: 'Entrar',
      submitting: 'Entrando...',
      noAccount: '¿No tienes cuenta?',
      signUpLink: 'Regístrate',
    },
    register: { title: 'Registro del conductor', comingSoon: 'Aquí irán las 3 pestañas del registro.' },
    home: { title: 'Inicio', logOut: 'Cerrar sesión' },
    errors: {
      emailEmpty: 'Escribe tu correo',
      emailInvalid: 'El correo no es válido',
      passwordEmpty: 'Escribe tu contraseña',
      passwordShort: 'Debe tener mínimo 6 caracteres',
    },
  },
  en: {
    common: { showPassword: 'Show password', hidePassword: 'Hide password' },
    welcome: {
      title: 'UberClone Driver',
      subtitle: 'Get trips and check your earnings',
      logIn: 'Log in',
      signUp: 'Sign up',
    },
    login: {
      title: 'Log in',
      email: 'Email',
      emailPlaceholder: 'driver@email.com',
      password: 'Password',
      passwordPlaceholder: 'Your password',
      submit: 'Log in',
      submitting: 'Logging in...',
      noAccount: "Don't have an account?",
      signUpLink: 'Sign up',
    },
    register: { title: 'Driver registration', comingSoon: 'The 3 registration tabs will go here.' },
    home: { title: 'Home', logOut: 'Log out' },
    errors: {
      emailEmpty: 'Enter your email',
      emailInvalid: 'The email is not valid',
      passwordEmpty: 'Enter your password',
      passwordShort: 'Must have at least 6 characters',
    },
  },
};


const language = 'es';

export const t = texts[language];