# UberClone Driver 🚗

## Descripción del proyecto

UberClone Driver es una aplicación móvil para conductores, inspirada en el funcionamiento de Uber. La desarrollé como proyecto académico utilizando React Native, Expo y Firebase.

Mi objetivo fue construir una aplicación que permitiera a un conductor registrarse, administrar su información, compartir su ubicación, recibir solicitudes de viajes, realizar recorridos y consultar sus ganancias.

También implementé un backend para gestionar la asignación automática de viajes y procesar pagos.

## Tecnologías utilizadas

Para desarrollar el proyecto utilicé las siguientes tecnologías:

- **React Native:** desarrollo de la aplicación móvil.
- **Expo SDK 58:** ejecución y desarrollo de la aplicación.
- **JavaScript:** lógica del proyecto.
- **React Navigation:** navegación entre pantallas.
- **Firebase Authentication:** registro e inicio de sesión.
- **Cloud Firestore:** almacenamiento de conductores, ubicaciones y viajes.
- **Cloudinary:** almacenamiento de fotografías del conductor, vehículo y documentos.
- **React Native Maps:** visualización del mapa.
- **Expo Location:** obtención de la ubicación del conductor.
- **OSRM:** consulta de rutas.
- **Node.js y Express:** backend de la aplicación.
- **Stripe Sandbox:** simulación de pagos electrónicos.
- **Git y GitHub:** control de versiones.

## Funcionalidades desarrolladas

### 1. Registro e inicio de sesión

Implementé el registro de conductores mediante correo electrónico y contraseña.

Durante el registro solicito información personal, datos del vehículo, licencia de conducción, SOAT y los documentos correspondientes.

Utilicé Firebase Authentication para gestionar las cuentas y Firestore para almacenar los datos del conductor.

### 2. Aprobación del conductor

Implementé un sistema de estados para controlar la aprobación del registro.

Un conductor registrado inicialmente queda pendiente de aprobación. Para acceder a las funciones que requieren autorización, su registro debe estar aprobado.

También configuré reglas de seguridad en Firestore para impedir que un conductor modifique directamente su propio estado de aprobación.

### 3. Ubicación y disponibilidad

Implementé la obtención de la ubicación del conductor mediante Expo Location.

La aplicación permite visualizar la posición en el mapa y cambiar la disponibilidad para recibir solicitudes de viaje.

La información de ubicación se actualiza en Firestore.

### 4. Solicitudes de viaje

Desarrollé un sistema de asignación automática de viajes utilizando el backend y Firestore.

Cuando se crea una solicitud, el sistema puede asignarla a un conductor disponible.

El conductor dispone de un tiempo limitado de 15 segundos para responder a la solicitud.

### 5. Recorridos y tarifas

Implementé el flujo de un viaje desde su aceptación hasta su finalización.

Para calcular las tarifas utilicé los siguientes parámetros:

| Concepto | Valor |
|---|---|
| Tarifa base | $3.500 COP |
| Costo por kilómetro | $1.200 COP |
| Costo por minuto | $250 COP |
| Tarifa mínima | $6.000 COP |
| Comisión de la plataforma | 20 % |

También contemplé multiplicadores según la categoría del vehículo:

| Categoría | Multiplicador |
|---|---|
| Economy | 1,0 |
| XL | 1,4 |
| Premium | 1,8 |

Separé el cálculo de tarifas de las pantallas para facilitar su reutilización y mantenimiento.

### 6. Métodos de pago

Implementé dos métodos de pago:

**Stripe Sandbox:** permite realizar pruebas de pagos electrónicos sin utilizar dinero real.

**Efectivo:** permite registrar la confirmación de un pago recibido directamente por el conductor.

La lógica financiera contempla la comisión de la plataforma y el valor correspondiente al conductor.

### 7. Ganancias del conductor

Desarrollé una pantalla independiente para consultar la información financiera de los viajes.

La pantalla contempla los viajes realizados, valores facturados, comisiones, propinas, ganancias y balance del conductor, con resúmenes por períodos.

### 8. Historial de viajes

Implementé una pantalla para consultar los recorridos anteriores del conductor a partir de la información almacenada en Firestore.

### 9. Perfil del conductor

Desarrollé una pantalla que permite consultar y modificar información personal y documentos.

Entre sus funciones se encuentran:

- Actualización del número de celular.
- Edición del número de licencia.
- Modificación de fechas de vencimiento.
- Actualización de fotografías mediante Cloudinary.
- Cambio de contraseña mediante Firebase Authentication.

También corregí problemas de permisos en Firestore y ajusté el desplazamiento del formulario para que el teclado no cubra los campos de texto.

## Estructura del proyecto

Organicé los archivos por responsabilidades:

```text
UberCloneDriver/
├── backend/
│   ├── server.js
│   └── autoAssignTrips.js
├── docs/
│   └── AI_LOG.md
├── src/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── hooks/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── theme/
│   └── utils/
├── .env.example
├── package.json
└── README.md
```

## Instalación y ejecución

### Requisitos

Para ejecutar el proyecto necesito Node.js, npm, un dispositivo Android con Expo Go y acceso al proyecto configurado en Firebase.

### 1. Clonar el repositorio

```bash
git clone https://github.com/fabianalexanderchirivi-a11y/UberCloneDriver.git
```

### 2. Entrar al proyecto

```bash
cd UberCloneDriver
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Creo un archivo `.env` a partir de `.env.example` y completo los valores correspondientes a Firebase.

No incluyo credenciales privadas en el repositorio.

### 5. Ejecutar la aplicación

```bash
npx expo start
```

Después abro Expo Go en mi dispositivo y escaneo el código QR.

### 6. Ejecutar el backend

El backend se encuentra en la carpeta `backend`. Debo instalar sus dependencias, configurar sus variables de entorno y ejecutarlo por separado para utilizar las funciones que dependen del servidor.

Las credenciales privadas de Stripe y de Firebase Admin deben permanecer exclusivamente en el backend.

## Pruebas realizadas

Durante el desarrollo realicé pruebas manuales en Expo Go y Firebase.

Entre las pruebas se encuentran:

- Registro e inicio de sesión.
- Validaciones de formularios.
- Visualización del perfil del conductor.
- Obtención de ubicación y disponibilidad.
- Asignación automática de solicitudes.
- Simulación de viajes mediante documentos en Firestore.
- Guardado de cambios del perfil.
- Corrección del error `permission-denied`.
- Corrección de campos cubiertos por el teclado.
- Integración de pagos con Stripe Sandbox.

También realicé una simulación de viaje con los siguientes datos:

**Pasajero:** Juan Pérez  
**Categoría:** XL  
**Origen:** Unicentro, Medellín, Colombia  
**Destino:** Centro Comercial Los Molinos, Medellín, Colombia  
**Método de pago:** Efectivo

Confirmé que la simulación del viaje funcionó mediante la asignación automática.

Algunas verificaciones individuales de funcionalidades complementarias pueden requerir pruebas adicionales.

## Seguridad

Implementé reglas de Firestore para controlar el acceso a los registros, ubicaciones y viajes.

Utilicé Firebase Authentication para identificar al conductor y restringí las operaciones según el usuario autenticado y los estados permitidos.

También mantuve separadas las variables públicas de configuración y las credenciales privadas del backend.

## Uso de inteligencia artificial

Durante el desarrollo utilicé herramientas de inteligencia artificial como apoyo para comprender conceptos, revisar código, solucionar errores e implementar funcionalidades.

Documenté ese apoyo en la bitácora del proyecto, incluyendo objetivos, prompts, respuestas, archivos involucrados, verificaciones y aprendizajes.

La bitácora se encuentra en:

[docs/AI_LOG.md](docs/AI_LOG.md)

## Control de versiones

Utilicé Git y GitHub para gestionar los cambios del proyecto.

Trabajé principalmente en la rama `developer`, realizando commits durante las diferentes etapas de implementación.
## Librerías y dependencias

Para desarrollar UberClone Driver utilicé las siguientes librerías, instaladas mediante npm y Expo.

### Framework y componentes principales

| Librería | Versión | Función |
|---|---|---|
| `expo` | ^58.0.21 | Entorno de desarrollo de la aplicación |
| `react` | 19.3.0 | Construcción de componentes |
| `react-native` | 0.88.0 | Desarrollo de la interfaz móvil |
| `expo-status-bar` | ~58.0.4 | Control de la barra de estado |
| `@expo/vector-icons` | ^15.0.2 | Iconos de la interfaz |

### Navegación

| Librería | Versión | Función |
|---|---|---|
| `@react-navigation/native` | ^7.5.1 | Sistema principal de navegación |
| `@react-navigation/native-stack` | ^7.21.0 | Navegación entre pantallas tipo Stack |
| `@react-navigation/bottom-tabs` | ^7.21.0 | Navegación mediante pestañas inferiores |
| `react-native-screens` | ~4.30.0 | Integración de pantallas nativas |
| `react-native-safe-area-context` | ~5.10.1 | Adaptación a las áreas seguras del dispositivo |

### Firebase y almacenamiento local

| Librería | Versión | Función |
|---|---|---|
| `firebase` | ^13.2.0 | Autenticación y base de datos Firestore |
| `@react-native-async-storage/async-storage` | 2.2.0 | Almacenamiento persistente local |

### Mapas, ubicación y documentos

| Librería | Versión | Función |
|---|---|---|
| `react-native-maps` | 1.29.11 | Visualización del mapa |
| `expo-location` | ~58.0.20 | Acceso a la ubicación del dispositivo |
| `expo-image-picker` | ~58.0.10 | Selección de fotografías desde cámara o galería |
| `@react-native-community/datetimepicker` | 9.2.1 | Selección de fechas de vencimiento |

### Servicios externos

Además de las librerías instaladas, integré Firebase Authentication, Cloud Firestore, Cloudinary, OSRM y Stripe Sandbox.

Para el backend utilicé Node.js y Express. Sus dependencias se administran por separado de las de la aplicación móvil.

### Instalación

Para instalar las dependencias de la aplicación utilizo:

```bash
npm install
```

Para iniciar Expo:

```bash
npx expo start
```

Las versiones anteriores corresponden a las dependencias declaradas en el archivo `package.json` de la aplicación móvil.

## Aprendizajes

Con este proyecto fortalecí mis conocimientos de React Native, navegación, hooks, Firebase, desarrollo de servicios y conexión entre una aplicación móvil y un backend.

También aprendí a trabajar con reglas de seguridad, administrar estados de viajes, implementar cálculos financieros y solucionar problemas relacionados con permisos, formularios y comunicación con servicios externos.

Una de las experiencias más importantes fue comprender cómo integrar varias tecnologías dentro de una misma aplicación, manteniendo separadas sus responsabilidades.

## Autor

**Fabian Alexander Chirivi**

Proyecto académico — UberClone Driver.

Desarrollado individualmente con React Native, Expo y Firebase.

**Año:** 2026
