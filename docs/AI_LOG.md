# Bitácora de uso de IA — UberClone, Versión Conductor


### Entrada #1
- Fecha: 2026-10-21
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Entender el proyecto, proponer un plan por etapas, señalar los puntos de riesgo y definir cómo trabajar (par revisor y tutor, sin código completo)
- Prompt (adjunto: PDF "UberClone — Versión Conductor"):

````text
Vas a actuar como mi PAR REVISOR y TUTOR técnico (peer review), no como quien programa por mí.

## Quién soy
Soy estudiante de desarrollo móvil. Trabajo con React Native + Expo (Expo Go, SDK 57), React Navigation, Context API, hooks y AsyncStorage. Aprendo mejor con explicaciones sencillas y cortas, en español. Mi proyecto anterior fue ReservaClassEnglish (reserva de clases de inglés): ahí ya apliqué useState, .map/FlatList, props, Context + hook personalizado con AsyncStorage, navegación Stack + tabs hechas a mano, y la idea de "fuente única de verdad" (calcular los valores a partir de los datos guardados en vez de guardar el resultado).

## El proyecto nuevo
Te adjunto el PDF "UberClone — Versión Conductor". Léelo completo antes de responder: incluye las fórmulas de tarifa (están como imagen en la página 5), el modelo de datos, los estados del viaje, las reglas de seguridad, la bitácora de IA y los entregables.

## Qué está decidido y qué no
- DECIDIDO: el backend será Firebase.
- NO DECIDIDO: todo lo demás. Aún no he elegido la pasarela de pago (Mercado Pago o Stripe), ni los servicios de mapas y rutas (Google Directions / Distance Matrix u opciones gratuitas como OSRM u OpenRouteService), ni el servicio de imágenes (Cloudinary u otro), ni la geocodificación (por ejemplo Nominatim), ni las demás APIs opcionales del PDF.
- No asumas ninguna de esas opciones como elegida. Cuando llegue el momento de cada una, ayúdame a compararlas (costo, límites gratuitos, facilidad con Expo y con Firebase, riesgos y lo que exige el PDF) y deja que yo decida. Si una decisión afecta etapas posteriores, avísame antes de que la tome.

## Cómo quiero que trabajes
1. NO me des el código completo ni la solución lista. Tu papel es orientar, preguntar y revisar.
2. Cuando te pregunte cómo hacer algo, respóndeme con: qué concepto aplica, qué pasos seguir y qué errores comunes evitar. Como máximo un fragmento muy corto de 2 a 5 líneas si es indispensable para aclarar una idea.
3. Cuando yo te pase mi código, revísalo como un compañero senior:
   - Dime qué está bien.
   - Señala los problemas por orden de importancia (bugs, luego diseño, luego estilo).
   - Explica por qué es un problema, no solo qué cambiar.
   - Pregúntame antes de asumir mi intención.
4. Usa el PDF como criterio. Compara mi trabajo contra lo que exige (validaciones, hooks obligatorios, estados del viaje, seguridad, entregables) y avísame si me falta algo o me desvío.
5. Si algo del PDF es ambiguo o falta (por ejemplo, la rúbrica que menciona la sección 9 no está incluida), dímelo en vez de inventarlo.
6. Si te mando un error, ayúdame a deducir la causa con preguntas y pistas antes de darme la respuesta. Si después de dos intentos sigo trabado, ahí sí puedes ser más directo.
7. Habla en español, con frases sencillas, sin tecnicismos innecesarios. Si usas un término técnico, explícalo en una línea.
8. Antes de que yo empiece una etapa, dime brevemente qué debería tener terminado y cómo puedo comprobar que funciona (cómo probarlo en el emulador o en Expo Go).
9. No me hagas preguntas de sustentación ni de repaso al terminar cada etapa, a menos que yo te lo pida.

## Reglas de seguridad y honestidad académica (importantes)
- Nunca me pidas ni aceptes que pegue llaves de API, access_token, secret keys ni datos personales reales (tampoco el contenido de mi configuración de Firebase con claves privadas). Si lo hago por error, avísame.
- Recuérdame que las credenciales secretas van solo en el backend, en variables de entorno o .env fuera de Git, y que el repo lleva un .env.example sin valores.
- Debo llevar la bitácora de IA (docs/AI_LOG.md) con la plantilla del PDF: fecha, integrante, herramienta, objetivo, prompt, resumen de la respuesta en 2 o 3 líneas, qué usé / modifiqué / descarté, archivos y commit, verificación y aprendizaje.
- Lleva tú un registro interno de cada ayuda que me des durante toda la conversación, con esos mismos campos. Los prompts míos van completos, tal como los escribí, sin resumir. El campo de commit déjalo en blanco para que yo lo llene.
- Cuando yo te lo pida (al final del proyecto), entrégame la bitácora COMPLETA en formato Markdown, lista para copiar a docs/AI_LOG.md, con todas las entradas numeradas desde la #1. No la entregues antes de que te la pida, salvo que yo te pregunte por ella.
- Recuérdame marcar el código asistido con un comentario "// AI-assisted: see docs/AI_LOG.md #N", indicándome qué número de entrada corresponde.
- No me ayudes a ocultar el uso de IA.

## Cómo empezar
En tu primera respuesta, NO escribas código. Haz esto:
1. Resume en pocas líneas qué pide el proyecto, para confirmar que lo entendiste.
2. Propón un plan por etapas, de menor a mayor riesgo, marcando en cada etapa qué decisiones de API o servicio tengo pendientes. Por ejemplo: configuración de tarifas y función pura de cálculo, registro del conductor con validaciones, Inicio y disponibilidad, solicitudes con temporizador, viaje en curso, pagos, ganancias e historial, y entrega.
3. Señala los 3 puntos del PDF más riesgosos o fáciles de olvidar.
4. Hazme solo las preguntas que necesites sobre mi equipo y mi tiempo antes de empezar.
````

- Resumen de la respuesta: Resumió el proyecto, propuso un plan de 11 etapas (0 a 10) con las decisiones de API pendientes en cada una y señaló tres puntos fáciles de olvidar (secretos y bitácora, limpieza de useEffect y cupo de APIs, y manejo del dinero con calculateFare). Avisó que Expo Go puede no alcanzar para módulos nativos, que Cloud Functions suele pedir plan Blaze, que no hay app del pasajero y que falta la rúbrica. Terminó con preguntas sobre equipo y tiempo.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno (solo conversación) — commit: 
- Verificación: Contraste del plan con el PDF (completar)
- Aprendizaje: Entendí que antes de programar conviene leer el PDF completo, ordenar el trabajo por etapas y detectar los riesgos (secretos, limpieza de useEffect, manejo del dinero). Y que las APIs sin decidir se comparan después, no se asumen.

### Entrada #2
- Fecha: 2026-10-21
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Ajustar el plan a mi situación (trabajo solo, Android, sin fecha de entrega) y preparar la etapa 0
- Prompt:

````text
en android y solo soy yo, todavia no tenemos fecha de entrega
````

- Resumen de la respuesta: Señaló que el PDF pide ramas por integrante y Pull Requests revisados, y sugirió preguntar a la profesora qué hacer al trabajar solo. Indicó que Expo Go en Android sirve para las primeras etapas y que un development build se evalúa más adelante. Describió qué terminar en la etapa 0 (proyecto base, Git, .gitignore, .env.example, docs/AI_LOG.md, carpetas) y cómo comprobarlo.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno (solo conversación) — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que trabajar solo no elimina los requisitos del PDF (ramas y Pull Requests) y que conviene preguntarle a la profe lo que el PDF no aclara. Una etapa está terminada cuando se puede probar.

### Entrada #3
- Fecha: 2026-10-21
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para organizar la estructura de carpetas del proyecto
- Prompt:

````text
voy a crear esa estrucutra de carpetas ya cree el proyecto
````

- Resumen de la respuesta: Recomendó una carpeta por responsabilidad (config, utils, hooks, context, screens), usar los nombres que exige el PDF (src/config/pricing.js y los hooks useDriverLocation, useTripRequests, useEarnings) y no crear carpetas por si acaso. Explicó que Git no guarda carpetas vacías y que se resuelve con un archivo como .gitkeep.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: estructura de carpetas en src/ — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que cada carpeta debe tener una sola responsabilidad y que Git no guarda carpetas vacías, por eso se usa .gitkeep.

### Entrada #4
- Fecha: 2026-10-21
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar mi estructura de carpetas y preparar la etapa 1 (pricing.js y calculateFare)
- Prompt (adjunta una captura del árbol de carpetas del proyecto en el editor):

````text
listo ya quedo, le coloque eso para que se suban al git ya que git no supe carpetas vacias
````

- Resumen de la respuesta: Confirmó que el uso de .gitkeep es correcto y que la estructura es ordenada. Indicó que .env.example va en la raíz, que la letra U significa archivo sin seguimiento y que hay que correr git status antes del primer commit. Describió la etapa 1: parámetros en pricing.js, orden del cálculo (multiplicador, mínima, redondeo, comisión), propina sin comisión, manejo de decimales y los casos de prueba del PDF (8,5 km y 22 min).
- Qué se usó / modificó / descartó: Estructura creada por mí con .gitkeep (completar el resto)
- Archivos y commit: src/config/pricing.js, src/utils/calculateFare.js (pendientes de crear en esta entrada) — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que .env.example va en la raíz y que debo revisar git status antes de cada commit. Y que calculateFare debe ser una función pura con un orden claro: multiplicador, mínima, redondeo y comisión, con la propina aparte.

### Entrada #5
- Fecha: 2026-10-21
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Comprobar que el archivo .env no se sube a Git
- Prompt:

````text
si va en la raiz, y no aparace ningun .env
````

- Resumen de la respuesta: Explicó que si todavía no existe un .env, que no aparezca no prueba nada. Indicó revisar el .gitignore, crear un .env de prueba, correr git status y borrarlo después, y confirmar que .env.example sí aparece. Sugirió el primer commit en main y una rama para la etapa 1.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: .gitignore, .env.example — commit: 
- Verificación: Informé que no aparecía ningún .env en git status (completar con la prueba del .env de prueba)
- Aprendizaje: Entendí que "no aparece en git status" no prueba que .env esté ignorado: hay que crear un .env de prueba y revisar el .gitignore.

### Entrada #6
- Fecha: 2026-10-21
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Decidir si hacer el diseño antes de la lógica y cómo plantearlo
- Prompt (adjunta una captura de la lista de commits del repositorio en GitHub):

````text
listo ya quedo, y ya coloque pa subirlo en la rama developer y antes de iniciar con eso quisiera hacer como el diseño
````

- Resumen de la respuesta: Recordó que el repo es privado y que el profesor necesitará acceso. Aclaró que el PDF no pide diseño visual y propuso tres alcances: A) bocetos, B) tema y componentes en código, C) ambos. Sugirió bocetar las pantallas del PDF, definir una paleta corta y un tema, limitar el tiempo y no elegir una librería de componentes sin comparar antes.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el PDF no exige diseño visual, que conviene ponerle un límite de tiempo y que el diseño empieza por bocetos y un tema, sin elegir librerías antes de compararlas.

### Entrada #7
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Elegir por dónde empezar el diseño, sin plan general
- Prompt:

````text
listo ahora si , con que inicio? que me recomiendas por el momento no nesecito un plan general si no ir avanzando poco a poco
````

- Resumen de la respuesta: Recomendó empezar por el boceto de la pantalla Inicio, que no depende de ninguna API. Indicó qué elementos del PDF debe mostrar (mapa, interruptor Disponible / No disponible, estado Pendiente de aprobación, acceso al Drawer) y que se dibujen los tres estados.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: boceto de la pantalla Inicio (fuera del repo) — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que un boceto debe mostrar todos los estados de la pantalla (no disponible, disponible y pendiente de aprobación), no solo el caso ideal.

### Entrada #8
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Aclarar si el PDF incluye login y registro
- Prompt:

````text
espera pero no hay algo de loguearse o registrarse?
````

- Resumen de la respuesta: Reconoció que había pasado por alto la entrada a la app. Explicó que el PDF define el registro y la sesión, pero no incluye una pantalla de login en su lista ni pide contraseña, y que el método de autenticación lo decido yo. Propuso un flujo de entrada (entrada, registro, pendiente de aprobación, Inicio) y pidió bocetar la pantalla de entrada.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el PDF puede tener huecos (no define el login ni la contraseña) y que esos huecos se deciden y se anotan, no se inventan en silencio.

### Entrada #9
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Que la entrada pida correo y contraseña y revisar mi boceto
- Prompt (adjunta una imagen con el boceto de la pantalla de entrada y de Inicio):

````text
nesecito que sea pida correo y contraseña
````

- Resumen de la respuesta: Anotó la decisión de usar correo y contraseña. Revisó el boceto contra el PDF: faltaba la pantalla de datos de login, el estado Pendiente de aprobación y el lugar de la contraseña en el registro; sobraban la barra "¿A dónde vamos?" y los botones de redes sociales. Preguntó por "Próximo viaje", la calificación y los dos mapas. Indicó que la contraseña la maneja Firebase Authentication y no se guarda en AsyncStorage ni en Firestore.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: boceto (fuera del repo) — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí qué elementos del boceto eran del pasajero y no del conductor (como "¿A dónde vamos?") y que la contraseña la maneja Firebase Authentication: yo no la guardo.

### Entrada #10
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para armar las pantallas de bienvenida, login y registro
- Prompt:

````text
espera quiero inicar hacer la pestaña de donde esta loguin y registrar que me recomiendas que tenga y haga y me ayudas de como armarlo
````

- Resumen de la respuesta: Delimitó el alcance a interfaz y validaciones locales, sin conectar Firebase todavía. Propuso un orden: tema mínimo, componente de campo de texto reutilizable, funciones de validación, pantalla de login, navegación con dos grupos (sin sesión y con sesión) y pantalla de bienvenida. Listó errores comunes (Alert en lugar de error bajo el campo, guardar la contraseña, olvidar trim, teclado tapando el botón) y pruebas en Expo Go.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/theme, src/components, src/utils, src/screens, src/navigation — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí el orden para construir una pantalla: tema, componente reutilizable, validaciones, pantalla y navegación. Y que la navegación cambia sola según la sesión, no se navega a mano a Inicio.

### Entrada #10-bis
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Confirmar las librerías de navegación a instalar
- Prompt:

````text
para iniciar voy a instalar algunas librerias que tambien nos la ha dado la profe npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
````

- Resumen de la respuesta: Confirmó que el comando es correcto y que con esas librerías basta para el Stack del flujo de entrada. Indicó dejar Tabs y Drawer para cuando se usen, y explicó cómo comprobar la instalación (package.json, arranque sin errores, limpiar caché). Advirtió no poner NavigationContainer más de una vez y no mezclar npm install con npx expo install.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: package.json, package-lock.json — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que npx expo install elige versiones compatibles con mi versión de Expo y que conviene instalar solo lo que voy a usar ya.

### Entrada #11
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisión del archivo de tema
- Prompt:

````text
```javascript
export const colors = {
  fondo: '#FFFFFF',
  superficie: '#F4F5F7',
  primario: '#111111',
  primarioTexto: '#FFFFFF',
  texto: '#111111',
  textoSecundario: '#5F6368',
  borde: '#D0D5DD',
  error: '#C62828',
  deshabilitado: '#9AA0A6',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 12, lg: 16 };
export const typography = {
  titulo: { fontSize: 28, fontWeight: '700' },
  subtitulo: { fontSize: 16 },
  etiqueta: { fontSize: 14, fontWeight: '600' },
  cuerpo: { fontSize: 16 },
  error: { fontSize: 13 },
};
```

primero en them coloque esto
````

- Resumen de la respuesta: Dijo que el tema está centralizado y con pocos valores. Señaló que texto y primario comparten color, que no conviene agregar colores de estado del PDF todavía, que la mezcla de nombres en inglés y español debía unificarse y que había que decidir cómo importar el tema. Preguntó si el archivo se había hecho con ayuda de IA y adelantó el siguiente paso (el campo de texto reutilizable).
- Qué se usó / modificó / descartó: Escrito por mí; sin marca AI-assisted (completar qué ajusté tras la revisión)
- Archivos y commit: src/theme — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que nombrar los valores del tema por su función y no por cómo se ven permite cambiar un color en toda la app, y que conviene una sola convención de nombres.

### Entrada #12
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Aclarar qué cuenta como "asistido por IA"
- Prompt:

````text
tengo una pregunta pero asistido por ia es cuando me das codigo, o me sugieres, pq si me sugieres no es lo mismo a escribirme el codigo y hacerme todo
````

- Resumen de la respuesta: Explicó que la bitácora documenta todo uso de IA (explicaciones, sugerencias, revisiones), y que el campo "qué se usó / modificó / descartó" permite matizar cuánto aportó cada parte. El comentario AI-assisted va en el código que la IA mostró o que cambié por su sugerencia. Señaló que el PDF no define el límite exacto y sugirió preguntar a la profesora; si hay duda, marcar.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: Consulta con la profesora (completar si se hizo)
- Aprendizaje: Entendí que la bitácora documenta todo uso de IA, y que el comentario AI-assisted va en el código que la IA mostró o que cambié por su sugerencia. Si dudo, marco.

### Entrada #13
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para el idioma (español e inglés) y las validaciones del login
- Prompt:

````text
estoy haciendo la parte de idioma y validaciones y comienzo con componente
````

- Resumen de la respuesta: Propuso dos formas de manejar el idioma (hecho a mano con Context y hook, o con i18next) y dejó la decisión en mí. Recomendó que las validaciones devuelvan una clave y no un texto traducido, para que el mensaje cambie con el idioma. Indicó validar correo (trim, @ y dominio) y contraseña, con el largo mínimo en un solo lugar, y listó errores comunes y pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/i18n, src/utils/validations.js — commit: 
- Verificación: Pruebas con console.log de casos de correo y cambio de idioma (completar)
- Aprendizaje: Entendí que una validación debe devolver una clave y no un texto ya traducido, para que el mensaje cambie con el idioma. Y que una validación de correo demasiado estricta rechaza correos válidos.

### Entrada #14
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisión del componente TextField
- Prompt:

````text
ya hice esa y organice el primer componente 

```javascript
// AI-assisted: see docs/AI_LOG.md #N
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { t } from '../i18n';

export default function TextField({ label, error, isPassword = false, style, ...rest }) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.row, error ? styles.rowError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword && isHidden}
          autoCorrect={false}
          {...rest}
        />
        {isPassword && (
          <Pressable
            onPress={() => setIsHidden((hidden) => !hidden)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={isHidden ? t.common.showPassword : t.common.hidePassword}
          >
            <Ionicons
              name={isHidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  rowError: { borderColor: colors.error },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  error: { ...typography.error, color: colors.error, marginTop: spacing.xs },
});
```
````

- Resumen de la respuesta: Destacó que el componente es reutilizable, muestra el error debajo del campo y usa el tema. Señaló como problemas: nombres del tema que podían no coincidir con mi archivo, `t` importado directo que no se actualiza al cambiar el idioma, `...rest` después de los valores por defecto, estados faltantes (foco y deshabilitado), la etiqueta sin relación con el campo para lectores de pantalla y el salto de pantalla al aparecer el error. Pidió cambiar el `#N` del comentario.
- Qué se usó / modificó / descartó: Código hecho con ayuda de Claude en otro chat (ver la entrada de esa conversación); lo que cambié tras esta revisión: (completar)
- Archivos y commit: src/components/TextField.js — commit: 
- Verificación: Pantalla temporal con tres campos, error largo, ojito de contraseña y cambio de idioma (completar)
- Aprendizaje: Entendí que un componente reutilizable recibe props y que ...rest puede pisar lo que el componente quiere controlar. Y que revisar estados (foco, error, deshabilitado) y accesibilidad también es parte del diseño.

### Entrada #15
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Aclarar que el código mostrado fue asistido por IA y cómo registrarlo
- Prompt:

````text
recuerda que el codigo que te mande fue asistido por ia, ahora voy hacer un componente mas corto
````

- Resumen de la respuesta: Corrigió una sugerencia anterior: el comentario AI-assisted debe apuntar a la entrada de la herramienta que escribió el código, no a una entrada de esta conversación. Indicó crear una entrada propia para esa herramienta con el prompt completo, poner el número real en el comentario y dejar la revisión de esta conversación como entrada aparte. Preguntó si el archivo de tema también se hizo con IA.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el comentario AI-assisted debe apuntar a la entrada de la herramienta que realmente escribió ese código, y que cada uso de IA fuera de este chat necesita su propia entrada.

### Entrada #16
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Crear un Claude Doc con la respuesta anterior (código asistido por otra herramienta de IA)
- Prompt:

````text
Crea un Claude Doc a partir de tu última respuesta.
````

- Resumen de la respuesta: Creó un documento editable con el contenido de la respuesta de la entrada #15 y compartió el enlace.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: documento en claude.ai: https://claude.ai/artifact/KVeKgW7Tfxu7FWgFRxpWAu — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que puedo guardar una respuesta como documento para consultarla después, pero eso no reemplaza la entrada en la bitácora.

### Entrada #17
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Aclarar cuál archivo fue el asistido por IA
- Prompt:

````text
espera el asistido con ia fue este codigo el que te mande este para no haber confusiones

```javascript
// AI-assisted: see docs/AI_LOG.md #N
import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../theme';
import { t } from '../i18n';

export default function TextField({ label, error, isPassword = false, style, ...rest }) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.row, error ? styles.rowError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={isPassword && isHidden}
          autoCorrect={false}
          {...rest}
        />
        {isPassword && (
          <Pressable
            onPress={() => setIsHidden((hidden) => !hidden)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={isHidden ? t.common.showPassword : t.common.hidePassword}
          >
            <Ionicons
              name={isHidden ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  rowError: { borderColor: colors.error },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  error: { ...typography.error, color: colors.error, marginTop: spacing.xs },
});
```
````

- Resumen de la respuesta: Confirmó que el código asistido es TextField y que el archivo de tema queda sin marca. Aclaró que ese componente no lo escribió esta conversación, por lo que su entrada la escribo yo con la herramienta usada (otro chat de Claude), el prompt completo y qué usé, modifiqué o descarté. Preguntó con qué herramienta se hizo.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/components/TextField.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que debo precisar exactamente qué archivo fue asistido por IA y con qué herramienta, para no mezclar entradas.

### Entrada #18
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar mi tema y mi sistema de idioma, y registrar el uso de Claude en otro chat
- Prompt:

````text
lo que hice fue usar claude otro chat para organizar la sintaxis que no me daba , pero entonces desde ahora lo voy hacer contigo, y aca esta lo que me pedias En el tema puse cuatro grupos de valores y los nombré por lo que hacen, no por cómo se ven, para que si cambio un color cambie en toda la app. En colors tengo background para el fondo de las pantallas, surface para el fondo de los campos de texto, primary y onPrimary para el color principal de los botones y el color del texto que va encima, text y textSecondary para el texto normal y el de apoyo, border para los bordes de los campos, error para el rojo de los errores y disabled para los botones bloqueados. En spacing tengo xs 4, sm 8, md 12, lg 16, xl 24 y xxl 32, que son los espacios que se repiten, para no escribir números sueltos en las pantallas. En radius tengo sm 8, md 12 y lg 16 para las esquinas redondeadas. En typography tengo title, subtitle, label, body y error, y cada uno es un objeto de estilo con tamaño y grosor de letra que uso con spread. La idea fue tener pocos valores, solo los que voy a usar, y si hace falta uno nuevo lo agrego al tema y no dentro de una pantalla.
El objeto t se arma en tres pasos dentro del archivo de i18n. Primero hay un objeto llamado texts que guarda los textos de los dos idiomas, español e inglés, con las mismas claves. Las claves están en inglés, por ejemplo login.submit, y los valores son lo que ve el usuario, como Entrar o Log in. Segundo hay una constante language con el idioma activo, que por ahora es fija en español. Tercero exporto t, que es simplemente texts[language], es decir, el objeto del idioma elegido. En las pantallas lo uso como t.login.submit. Los textos están agrupados por pantalla, con welcome, login, register y home, y aparte hay un grupo errors con los mensajes de validación. Las funciones de validación devuelven directamente esos mensajes, por ejemplo t.errors.emailInvalid, así que no escriben ningún texto por su cuenta.
Una limitación que conozco es que t se calcula una sola vez cuando carga el archivo, así que si más adelante agrego un selector de idioma la app no se actualizaría sola. Cuando llegue esa etapa voy a cambiarlo con un Context de idioma que guarde la elección en AsyncStorage, que el PDF permite para el idioma, y un hook que devuelva t. Con la estructura actual ese cambio es pequeño, porque las pantallas ya usan t.algo y solo cambiaría de dónde sale t.
````

- Resumen de la respuesta: Dijo que los nombres del tema coinciden con los que usa TextField y que el i18n tiene claves iguales en los dos idiomas. Advirtió que el cambio futuro de idioma no será tan pequeño: las validaciones no pueden usar hooks y los errores guardados como texto no se actualizan al cambiar de idioma. Señaló que el campo Idioma del PDF obliga a hacer el selector antes de lo previsto y preguntó qué idioma usar la primera vez que se abre la app.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/theme, src/i18n — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que un t calculado una sola vez no se actualiza al cambiar de idioma y que las validaciones, al no ser componentes, no pueden usar hooks. Por eso conviene devolver claves.

### Entrada #19
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisión de LoginScreen
- Prompt:

````text
sera que puedes revisar este login screen es que no se si estra todo correcto 

```javascript
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../components/TextField';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validations';
import { colors, spacing, typography } from '../theme';
import { t } from '../i18n';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const handleEmailChange = (text) => {
    setEmail(text);
    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    signIn();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{t.login.title}</Text>

          <TextField
            label={t.login.email}
            placeholder={t.login.emailPlaceholder}
            value={email}
            onChangeText={handleEmailChange}
            onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(email) }))}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextField
            label={t.login.password}
            placeholder={t.login.passwordPlaceholder}
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={() => setErrors((prev) => ({ ...prev, password: validatePassword(password) }))}
            error={errors.password}
            isPassword
            autoCapitalize="none"
          />

          <Button
            title={isLoading ? t.login.submitting : t.login.submit}
            onPress={handleSubmit}
            disabled={isLoading}
          />

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>{t.login.noAccount} </Text>
            <Pressable onPress={() => navigation.navigate('Register')} hitSlop={8}>
              <Text style={styles.link}>{t.login.signUpLink}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  title: { ...typography.title, color: colors.text, marginBottom: spacing.xl },
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  linkText: { ...typography.body, color: colors.textSecondary },
  link: { ...typography.body, color: colors.text, fontWeight: '700' },
});
```
````

- Resumen de la respuesta: Destacó los errores bajo cada campo, el bloqueo del botón y la sesión como único motivo de navegación a Inicio. Señaló como bugs que isLoading nunca vuelve a false si falla el inicio de sesión, que no hay manejo de errores de signIn y que había que confirmar el nombre de la ruta 'Register'. Listó además el trim del correo, el comportamiento de KeyboardAvoidingView en Android, los errores guardados como texto y detalles de estilo, con siete pruebas para Expo Go.
- Qué se usó / modificó / descartó: Pantalla escrita por mí; los arreglos aplicados por esta revisión: (completar)
- Archivos y commit: src/screens/LoginScreen.js — commit: 
- Verificación: Pruebas 1 a 4 pasaron (ver entrada #24); 5 a 7 pendientes en ese momento
- Aprendizaje: Entendí que el estado de carga (isLoading) debe volver a false aunque falle el inicio de sesión (try/finally), y que los errores del login también deben mostrarse bajo un campo.

### Entrada #20
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Ordenar los arreglos de LoginScreen antes de correr la app
- Prompt:

````text
la hice yo, y quiero primero hacer esas y ya despues si runear pa ver si corre
````

- Resumen de la respuesta: Confirmó que la pantalla no lleva marca AI-assisted por ser mía y que la revisión queda en la bitácora; los cambios hechos por una sugerencia suya sí se marcan. Propuso un orden de seis arreglos (isLoading con try/finally, nombre de ruta, trim del correo, una sola función de cambio, peso de letra al tema, comentario sobre el setTimeout) y dejar otros tres para después. Recomendó commits pequeños para saber qué cambio rompe algo.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/screens/LoginScreen.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que conviene corregir en orden de importancia y hacer commits pequeños, para saber cuál cambio rompe algo.

### Entrada #21
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Deducir la causa de un error 500 al abrir la app
- Prompt:

````text
corri la app y me salio codigo 500
````

- Resumen de la respuesta: Explicó que un 500 suele significar que Metro no pudo construir la app y que el error real aparece en la terminal. Pidió la primera línea roja y el archivo que menciona, dio pistas según el tipo de mensaje (módulo no encontrado, error de sintaxis, paquete) y sugirió git status, git diff y limpiar caché.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que un error 500 al abrir la app suele venir de Metro y que el mensaje real está en la terminal: hay que leer la primera línea roja.

### Entrada #22
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Resolver el error causado por un archivo en la carpeta equivocada
- Prompt:

````text
el error era que login estaba en carpeta services y no en screens
````

- Resumen de la respuesta: Explicó que Metro busca los archivos por la ruta exacta de cada import. Recomendó mover LoginScreen a screens (idealmente con git mv), actualizar los imports que apuntaban a la ruta anterior, reiniciar con caché limpia y hacer un commit pequeño. Pidió retomar las pruebas de la entrada #19.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/screens/LoginScreen.js — commit: 
- Verificación: La app dejó de dar 500 y cargó la pantalla de login
- Aprendizaje: Entendí que Metro busca cada archivo por la ruta exacta del import, por eso un archivo en la carpeta equivocada rompe la app.

### Entrada #23
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Cerrar un segundo error de arranque y planear las pruebas
- Prompt:

````text
listo, tenia otro error, y era que no habia dado control s a un archivo, ya carga el login, todavia esta basico de estilos pero por el momento esta bien, ya que no se parece a uber
````

- Resumen de la respuesta: Sugirió activar el guardado automático del editor. Señaló que el PDF no pide que la app se parezca a Uber y que, con el tema centralizado, retocar estilos después es barato. Repitió las siete pruebas de la entrada #19 y planteó dos decisiones pendientes para el registro: pestañas arriba o abajo y dónde va la contraseña.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que muchos errores son simples (como no guardar un archivo) y que activar el guardado automático evita perder tiempo. Y que el PDF no exige un estilo parecido a Uber.

### Entrada #24
- Fecha: 2026-10-22 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar los resultados de las pruebas del login y planear las pantallas faltantes
- Prompt:

````text
1. Campos vacíos + Entrar: salen los dos errores. Funciona.
2. Correo mal escrito: el error sale al salir del campo. Funciona.
3. Al escribir después de un error, el error desaparece. Funciona.
4. Con el teclado abierto en la contraseña, el botón sigue alcanzable. Funciona.
5. No probado todavía: aún no existe la pantalla de Inicio. Lo pruebo cuando agregue Welcome, Register y Home.
6. No probado todavía: aún no existe la pantalla de Registro.
7. Pendiente de corregir: ahora, si `signIn` falla, el botón se queda bloqueado. Lo arreglo con un `try/finally` que haga `setIsLoading(false)`.
````

- Resumen de la respuesta: Confirmó que try/finally es la herramienta correcta para recuperar el botón, y advirtió que el error de signIn tiene que mostrarse bajo un campo. Para desbloquear las pruebas 5 y 6 propuso crear Inicio, Registro (con solo un título) y Bienvenida, con dos grupos de navegación y los nombres de ruta coincidiendo con navigate().
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/screens, src/navigation — commit: 
- Verificación: Pruebas 1 a 4 pasaron; 5 y 6 quedaron pendientes; 7 por corregir
- Aprendizaje: Entendí que try/finally recupera el botón pero el error igual hay que mostrarlo, y que las pantallas vacías sirven para probar el flujo de navegación antes de tener la lógica.

### Entrada #25
- Fecha: 2026-10-26
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Decidir si construir diseño y backend por separado o juntos, y preparar Firebase
- Prompt:

````text
listo que me recomiendas hacer, hacer el diseño de todo y despues hacer las funciones el backend podramos decir, o lo vaos construllendo en conjunto, pq quiero hacer hoy que el registro y loguin queden funcional, entonces queria crear la base de datos ya en fire base
````

- Resumen de la respuesta: Recomendó construir por flujos completos y recortar el alcance de hoy (cuenta con correo y contraseña, sesión y perfil pendiente de aprobación; fotos y pestañas completas después). Presentó la decisión entre el SDK de JavaScript de Firebase y @react-native-firebase, y recomendó guardar todas las llamadas a Firebase en src/services. Explicó Firestore, modo de prueba vs producción, reglas de seguridad (el conductor no debe poder aprobarse solo), variables de entorno y los pasos del día.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que conviene construir por flujos completos (pantalla, lógica y Firebase juntos) y que las llamadas a Firebase deben ir en src/services. Y que las reglas de Firestore deben impedir que un conductor se apruebe solo.

### Entrada #26
- Fecha: 2026-10-26
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Entender cómo se suben las imágenes del registro
- Prompt:

````text
hablame de las imagenes no entiendo, osea si se suben desde dispositvico , explicame esto porfa
````

- Resumen de la respuesta: Explicó el recorrido: elegir la foto con expo-image-picker, subirla a un servicio de imágenes, recibir una URL y guardar solo esa URL en Firestore. Listó errores comunes (guardar la ruta local, guardar la imagen en Firestore o AsyncStorage, permisos, fotos pesadas, secretos en la app) y las cinco fotos que exige el PDF. Comparó Cloudinary y Firebase Storage sin decidir por mí.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que una imagen no se guarda en Firestore: se sube a un servicio y en Firestore solo se guarda su URL, no la ruta local del celular.

### Entrada #27
- Fecha: 2026-10-26
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Definir mi criterio para el servicio de imágenes
- Prompt:

````text
entiendo , pienso que el servidor esta bien, si es gratis claro
````

- Resumen de la respuesta: Anotó mi condición de que el servicio sea gratis y aclaró que aún no hay servicio elegido. Indicó que los límites gratuitos cambian y que los verificará con información actual cuando llegue la etapa. Listó los criterios a comparar (si pide tarjeta, subida segura sin claves en la app, quién ve las fotos, facilidad en Expo Go) y propuso seguir con Firebase.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que "gratis" siempre trae límites que pueden cambiar y que debo comparar opciones (tarjeta, seguridad de las claves, privacidad de los documentos) antes de decidir.

### Entrada #28
- Fecha: 2026-10-26
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Registrar mi decisión sobre el SDK de Firebase y preparar la configuración
- Prompt:

````text
firebase, osea sdk, pq el otro nesecitamos un build propio
````

- Resumen de la respuesta: Anotó la decisión de usar el SDK de JavaScript de Firebase. Advirtió que esto no resuelve las notificaciones del PDF (FCM), que podrían exigir un development build más adelante. Describió qué terminar (proyecto en la consola, Authentication con correo y contraseña, Firestore, variables en .env con prefijo EXPO_PUBLIC_, archivo de inicialización en src/services con persistencia de sesión) y cómo comprobarlo.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: .env.example, src/services — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el SDK de JavaScript de Firebase funciona en Expo Go pero no cubre las notificaciones del PDF, y que los datos de configuración van en .env con el prefijo EXPO_PUBLIC_.

### Entrada #29
- Fecha: 2026-10-26
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Decidir qué desactivar al crear el proyecto en Firebase
- Prompt:

````text
para la creacion en fire base desactivo solo analtics pero dejo gemini y el otro o mejor no , desactivo todo eso
````

- Resumen de la respuesta: Recomendó desactivar Google Analytics y Gemini en Firebase, porque el PDF no los pide y se pueden activar después. Advirtió que usar Gemini en la consola cuenta como uso de IA y debería ir en la bitácora. Indicó que, si la consola muestra opciones distintas, se revisen sin activarlas a ciegas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: Proyecto creado en la consola, con Authentication y Firestore visibles (completar)
- Aprendizaje: Entendí que desactivar servicios que el proyecto no pide (Analytics, Gemini) evita configuración extra, y que usar un asistente de IA dentro de la consola también cuenta como uso de IA.

### Entrada #30
- Fecha: 2026-10-26
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar el estado del proyecto recién creado en la consola de Firebase
- Prompt (adjunta una captura de la consola de Firebase con el proyecto creado, Plan Spark):

````text
asi esta bien o faltra, pq yo recuerdo que la profe elijio como algo de prueba y web
````

- Resumen de la respuesta: Confirmó que el proyecto está en el plan gratuito Spark. Explicó que "web" es el tipo de app que se registra (correcto para el SDK de JavaScript) y que "prueba" probablemente se refiere al modo de prueba de Firestore. Indicó los pasos que faltan: registrar la app web sin Hosting, activar Authentication con correo y contraseña y crear Firestore (ubicación definitiva y modo de reglas: prueba o producción).
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: Authentication y Firestore activos en la consola (completar)
- Aprendizaje: Entendí que un proyecto de Firebase vacío todavía no sirve: faltan registrar la app web, activar Authentication y crear Firestore. Y que el modo de prueba deja la base abierta por tiempo limitado.