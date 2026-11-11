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

### Entrada #31
- Fecha: 2026-10-26 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Elegir el alias de la app web al registrarla en Firebase
- Prompt:

````text
que nombre de alias me recomiendas para colocar
````

- Resumen de la respuesta: Explicó que el alias es solo una etiqueta dentro de la consola y se puede cambiar. Recomendó un nombre claro y consistente con el repo (uberclone-driver-app) y recordó dejar Firebase Hosting desmarcado y no pegar los valores de configuración.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el alias de la app en Firebase es solo una etiqueta para reconocerla, que no aparece en el código y que no necesito Hosting.

### Entrada #32
- Fecha: 2026-10-26 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Decidir si usar un alias muy corto
- Prompt:

````text
o colocamos solo UberCL
````

- Resumen de la respuesta: Dijo que se puede usar porque es una etiqueta modificable, pero que un nombre tan corto puede confundirse si algún día se agrega otra app (por ejemplo la del pasajero). Dejó la decisión en mí.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que los nombres deben poder reconocerse meses después, y que esta decisión es menor y reversible.

### Entrada #33
- Fecha: 2026-10-26 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Confirmar el alias elegido y seguir con el registro de la app
- Prompt:

````text
entonces UberClDr
````

- Resumen de la respuesta: Aceptó el alias. Indicó registrar la app sin Hosting, copiar los valores de configuración directo a .env sin pegarlos en el chat y comprobar con git status que .env no aparece y que .env.example solo tiene nombres.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: Authentication y Firestore activados en la consola (completar)
- Aprendizaje: Entendí que los datos de configuración van en .env y que .env.example solo lleva los nombres, sin valores.

### Entrada #34
- Fecha: 2026-10-28 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Saber dónde copiar la configuración de Firebase
- Prompt (los valores reales están reemplazados por [OCULTO]):

````text
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "[OCULTO]",
  authDomain: "[OCULTO]",
  projectId: "[OCULTO]",
  storageBucket: "[OCULTO]",
  messagingSenderId: "[OCULTO]",
  appId: "[OCULTO]"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); esto lo copio en donde , debe ser en services no?
````

- Resumen de la respuesta: Avisó que pegué mi configuración (incluida la apiKey) y que, aunque no es una llave privada, no debe repetirse; lo que protege los datos son las reglas de Firestore. Explicó que va en un archivo de src/services, con los valores en .env con prefijo EXPO_PUBLIC_, la inicialización una sola vez, la persistencia de sesión y cómo comprobarlo sin imprimir la apiKey.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/config/firebase.js, .env, .env.example — commit: 
- Verificación: git status sin .env (completar)
- Aprendizaje: Entendí que no debo pegar claves en un chat ni en el código, y que la seguridad real de Firebase está en las reglas y la autenticación.

### Entrada #35
- Fecha: 2026-10-28 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Aclarar qué parte del código de Firebase va en .env
- Prompt:

````text
pero entonces en env copio todo lo del sdk
````

- Resumen de la respuesta: Explicó que a .env solo van los seis valores del firebaseConfig, uno por línea, sin comillas, sin espacios y sin coma, con el prefijo EXPO_PUBLIC_. Lo demás es código. En .env.example van las mismas líneas con nada después del igual. Advirtió reiniciar Expo con caché limpia al editar .env.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: .env, .env.example — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que .env guarda solo valores, que los nombres deben coincidir exactamente en .env, .env.example y el código, y que hay que reiniciar Expo después de cambiarlo.

### Entrada #36
- Fecha: 2026-10-28 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Subir la configuración de forma segura y resolver el cambio a Expo SDK 58
- Prompt:

````text
Listo coloque en env example sin las keys pero en env con las keys y voy a subir esto y voy a cambiar la versión pq en mi cel apareció 58
````

- Resumen de la respuesta: Insistió en comprobar con git status que .env no se sube. Explicó que el SDK 58 aparece porque Expo Go se actualizó y propuso tres caminos (subir el proyecto a 58, quedarse en 57 con una versión anterior de Expo Go, o un development build). Recomendó hacerlo en una rama aparte, leer la guía oficial de actualización y alinear las librerías.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: package.json, .env.example — commit: 
- Verificación: El proyecto arrancó con SDK 58 (completar)
- Aprendizaje: Entendí que Expo Go solo abre proyectos de su versión y que actualizar el SDK conviene hacerlo en una rama aparte con un commit propio.

### Entrada #37
- Fecha: 2026-10-28 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Pasar de "Firebase inicializado" a una autenticación real
- Prompt:

````text
Listo actualizamos, y corrí proyecto y en la terminar en log dice fire base mostrando que ya esta conectado
````

- Resumen de la respuesta: Aclaró que inicializar Firebase no prueba una conexión real y que se comprueba creando un usuario. Describió qué terminar: funciones de cuenta en src/services, traducción de errores a claves, useAuth con limpieza de la suscripción, estado de carga de sesión y persistencia. Dejó pendiente decidir cuándo se crea la cuenta.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/services, src/hooks/useAuth.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que ver un mensaje de conexión no basta: la prueba real es crear un usuario y verlo en Authentication.

### Entrada #38
- Fecha: 2026-10-28 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Empezar las pestañas 1 y 2 del registro
- Prompt:

````text
Listo ya hice el commit, de confección y actualización, ahora la profe dijo que toca hacer pestaña 1 y 2, que me recomiendas para iniciar
````

- Resumen de la respuesta: Recomendó empezar por las validaciones y por guardar los datos en un solo lugar (Context), calculando los errores desde los datos. Listó casos difíciles (nombre con tilde y ñ, límite de 18 años, placa en mayúsculas, capacidad según categoría), ambigüedades del PDF y cuidados (no guardar el borrador en AsyncStorage, usar datos inventados).
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que conviene probar primero las validaciones solas y que el formulario no debe guardarse en AsyncStorage porque tiene datos sensibles.

### Entrada #39
- Fecha: 2026-10-28 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para las listas de opciones y las validaciones
- Prompt:

````text
Acabo de crear options modificar, index y estoy en validations ya que son varias cosas
````

- Resumen de la respuesta: Recomendó que cada opción guarde un valor estable y que el texto visible salga del diccionario de idiomas, con una sola fuente por lista. Sugirió validaciones puras, una por campo, que reciban los dos campos cuando dependen entre sí, y probarlas con una tabla de casos. Preguntó si las validaciones devuelven clave o texto.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/utils/validations.js, src/utils (options) — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que lo que se guarda es el valor estable de una opción y que el texto que ve el usuario sale del diccionario.

### Entrada #40
- Fecha: 2026-10-28 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar mi decisión de que las validaciones devuelvan claves
- Prompt:

````text
Elegí que las validaciones devuelvan una clave (por ejemplo 'phoneInvalid') y que la pantalla la traduzca con t.errors[clave], en un solo lugar: el componente TextField. Así validations.js ya no depende de i18n y los mensajes pueden cambiar con el selector de idioma de la pestaña 1. Ya lo probé en Login y los mensajes se muestran en español.
````

- Resumen de la respuesta: Aprobó la decisión. Señaló que todavía no cambia con el idioma porque t se calcula una sola vez, qué pasa si una clave no existe, cómo llevar números como el límite de 50 caracteres sin duplicarlos, que todos los errores sean claves y el nombre de la prop.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/utils/validations.js, src/components/TextField.js — commit: 
- Verificación: Probado en Login, mensajes en español
- Aprendizaje: Entendí que una clave sin traducción deja un borde rojo sin mensaje, y que conviene comprobar que toda clave existe en los dos idiomas.

### Entrada #41
- Fecha: 2026-10-28 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Marcar el código asistido y subir el cambio
- Prompt:

````text
Listo ya coloque eso que me dijiste al final y lo subí al repo
````

- Resumen de la respuesta: Indicó que TextField ahora tiene dos orígenes de ayuda y que el comentario puede llevar los dos números, y recordó anotar el hash del commit en cada entrada. Repasó los puntos pendientes de la revisión anterior.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/components/TextField.js, src/utils/validations.js — commit: 
- Verificación: Subido al repositorio
- Aprendizaje: Entendí que el comentario AI-assisted puede llevar varios números cuando un archivo tuvo ayuda de más de una entrada.

### Entrada #42
- Fecha: 2026-10-29 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para el Context del registro
- Prompt:

````text
listo entonces sigo con esto Contexto del registro (este mensaje): guarda los datos y calcula los errores con tus validaciones.
````

- Resumen de la respuesta: Explicó que el Context guarda solo lo que escribe el usuario y todo lo demás (errores, pestaña completa) se calcula. Planteó decisiones (cómo saber qué campos se tocaron, forma del estado, normalizar la placa), errores comunes (value nuevo en cada render, números como texto, no reiniciar el Context, no guardar en AsyncStorage) y pruebas sin pantallas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/context/RegistrationContext.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí la "fuente única de verdad": guardo lo que escribe el usuario y calculo errores y validez a partir de eso.

### Entrada #43
- Fecha: 2026-10-29 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar mi decisión de llevar el control de "tocado" dentro del Context
- Prompt:

````text
Mi decisión es llevar el control de “tocado” dentro del contexto, por pestaña, y no en cada pantalla:
 

* Sobrevive al cambiar de pestaña, porque el contexto no se desmonta (si estuviera en cada pantalla se perdería).
* Permite el botón “Continuar”/”Enviar”: al pulsarlo con datos inválidos se marcan todos los campos como tocados y salen todos los errores.
* Las pantallas solo leen `visibleErrors` y no repiten esa lógica 15 veces.
````

- Resumen de la respuesta: Valoró que visibleErrors sea un valor calculado. Señaló el choque con el PDF (Enviar solo se habilita con todo válido), que las pestañas suelen quedarse montadas y por eso mi primera razón no es del todo exacta, la ambigüedad entre "tocado por campo" y "por pestaña", que la lista de campos sea la misma que la de validaciones y cuándo se reinicia.
- Qué se usó / modificó / descartó: Decisión mía, revisada por Claude (completar)
- Archivos y commit: src/context/RegistrationContext.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el motivo más fuerte del Context es que una pestaña que el usuario nunca abrió igual debe poder validarse.

### Entrada #44
- Fecha: 2026-10-29 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Avisar que estaba construyendo el Context
- Prompt:

````text
espera voy haciendo y ya te digo
````

- Resumen de la respuesta: Dijo que podía avanzar sin prisa y recordó pedir el Context con datos inventados y dos preguntas pendientes (si el botón se puede pulsar con datos inválidos y si "tocado" es por campo o por pestaña).
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que conviene avanzar por piezas pequeñas y consultar con el código a la vista.

### Entrada #45
- Fecha: 2026-10-29 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Presentar el avance de la pestaña 1
- Prompt:

````text
Trabajé en la primera sección del registro del conductor, correspondiente a Datos personales. Creé el `RegistrationContext` para almacenar y actualizar la información del formulario utilizando `useState`, `useCallback` y `useContext`, evitando que los datos se pierdan al navegar entre pantallas. También desarrollé `PersonalDataScreen.js`, donde agregué los campos de foto de perfil, nombre completo, documento de identidad, celular, fecha de nacimiento, género, correo electrónico e idioma, reutilizando las validaciones existentes para mostrar los errores debajo de cada campo. Además, configuré la navegación desde el login hacia el registro, integré `RegistrationProvider` en `App.js` y ajusté la compatibilidad de los estilos existentes. Por ahora, los datos se mantienen temporalmente en el contexto y la conexión del formulario con Firebase queda pendiente hasta completar las secciones de Vehículo y Documentos. El código está preparado para realizar las pruebas de funcionamiento.
````

- Resumen de la respuesta: Dijo que sin ver los archivos solo podía hacer preguntas: si el Context calcula los errores y los visibles, las decisiones pendientes, qué librerías se instalaron, qué pasa si se niega el permiso de la foto y si el idioma ya cambia la app. Pidió los archivos con datos inventados y propuso siete pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que una revisión necesita ver el código, y que antes de dar una pestaña por terminada debo probar casos límite como la edad exacta o el permiso negado.

### Entrada #46
- Fecha: 2026-10-29 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisión de RegistrationContext
- Prompt:

````text
```javascript
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

// AI-assisted: see docs/AI_LOG.md
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
 te paso el registrationContex , estoy terminado el otro es que es largo y no se si quedo bien espera ya te lo paso
```
````

- Resumen de la respuesta: Valoró la fuente única de verdad, que la validez salga de los errores reales y no de los visibles, y allFieldsTouched. Señaló como problemas el value que se recrea en cada render (useMemo), la falta de un hook useRegistration, que los nombres de campo deben coincidir entre validaciones y contexto, cuándo llamar a reset, la duplicación entre pestañas, la contraseña sin decidir, el idioma fijo, el formato de fecha y el número del comentario.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/context/RegistrationContext.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que un value que se crea de nuevo en cada render redibuja todas las pantallas y que el PDF pide useMemo y useCallback para esto.

### Entrada #47
- Fecha: 2026-10-29 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisión previa al commit de la pestaña 1
- Prompt:

````text
Implementé la primera sección del registro del conductor, correspondiente a Datos personales, en UberCloneDriver. Creé `RegistrationContext.js` para manejar y conservar la información mediante useState, useCallback y useContext. Desarrollé `PersonalDataScreen.js` con los ocho campos requeridos: foto de perfil, nombre completo, documento de identidad, celular, fecha de nacimiento, género, correo electrónico e idioma. Incorporé la selección de imágenes con expo-image-picker y fechas con DateTimePicker, reutilizando las validaciones y componentes existentes. También configuré la navegación desde LoginScreen, integré RegistrationProvider en App.js y corregí la compatibilidad de los estilos. Solucioné un error de compilación instalando las dependencias faltantes y corregí un comentario de IA que aparecía como texto en los mensajes de error. Realicé pruebas manuales en Expo Go y comprobé que funcionan la navegación, los campos obligatorios, las validaciones de nombre, documento, celular y edad, la selección de fotografía, género e idioma, la confirmación de datos válidos y la conservación de la información al regresar al login. Todas las pruebas realizadas fueron satisfactorias. Por ahora los datos se almacenan temporalmente en el contexto; la persistencia en Firebase se implementará cuando estén completas las tres secciones del registro. ahora voy hacer commit
````

- Resumen de la respuesta: Listó qué revisar antes del commit (git status, dependencias en package.json, comentarios AI-assisted con número real, mensaje de commit). Recordó pruebas que faltaban (límite de edad, ñ, permiso de foto, correo, cambio de idioma), una duda de privacidad sobre conservar datos al volver al login y las fotos solo locales. Introdujo la pestaña 2.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/screens/PersonalDataScreen.js, src/context/RegistrationContext.js, App.js, package.json — commit: 
- Verificación: Pruebas manuales en Expo Go, todas satisfactorias según lo informado
- Aprendizaje: Entendí que los datos personales no deben quedar en memoria sin una regla de cuándo se reinician.

### Entrada #48
- Fecha: 2026-10-29 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Deducir por qué la validación del correo aceptaba cualquier cosa después del punto
- Prompt:

````text
el unico error que encontre de lo que quieres confirmar es que el correo, la parte de com, hay error ya que deja un moton de cosas como el te cualquier cosa despues de el . deja
````

- Resumen de la respuesta: Guió con preguntas y pistas: si la expresión está anclada al final, qué permite después del último punto y si acepta espacios. Dio una tabla de casos para probar y advirtió no buscar la expresión perfecta, porque una demasiado estricta rechaza correos válidos.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/utils/validations.js — commit: 
- Verificación: Casos de la tabla probados con console.log (completar)
- Aprendizaje: Entendí que una expresión regular sin anclar el final puede aceptar cualquier cosa después de la parte que coincidió.

### Entrada #49
- Fecha: 2026-10-29 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Cerrar el error de validación del correo
- Prompt:

````text
ya lo correji si si, era erro mio no habia modifcado la seccion de validar email
````

- Resumen de la respuesta: Sugirió dejar una sola validación de correo que usen el login y el registro, correr los casos de la tabla (a@b, a@b., a@b.com xyz) y hacer commit antes de empezar la pestaña 2.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/utils/validations.js — commit: 
- Verificación: Casos de la tabla probados (completar)
- Aprendizaje: Entendí que tener dos copias de una misma validación hace que una corrección se quede en una sola.

### Entrada #50
- Fecha: 2026-10-30 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Comparar mi lista de campos del vehículo con el PDF
- Prompt:

````text
Esta sección permitirá que el conductor registre el vehículo con el que va a trabajar.
Propongo implementar estos campos:

1. Tipo de vehículo (carro o moto, según lo que permita el proyecto).
2. Marca.
3. Modelo.
4. Año.
5. Color.
6. Placa.
7. Capacidad de pasajeros, , esto es lo que pide el pdf o que?
````

- Resumen de la respuesta: Comparó la lista con el PDF: la categoría debe ser Económico, XL o Premium (no carro o moto) porque es la misma que usa calculateFare, y faltaba la foto del vehículo con la placa visible. Recomendó seguir el PDF y preguntar a la profesora si se quieren motos.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que la categoría es la que conecta con el cálculo de tarifa y la capacidad del XL, por eso no puede cambiarse por "carro o moto".

### Entrada #51
- Fecha: 2026-10-30 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para las pantallas de Bienvenida e Inicio
- Prompt:

````text
esta bien voy a crear welcome screen, y despues home screen
````

- Resumen de la respuesta: Describió qué debe tener Bienvenida (dos botones, nombres de ruta coincidentes, textos del diccionario) y una Inicio pequeña sin mapa: estado de la cuenta simulado, interruptor bloqueado si está pendiente y un botón temporal de cerrar sesión. Dio cinco pruebas del flujo.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/screens/WelcomeScreen.js, src/screens/HomeScreen.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que la navegación debe cambiar sola según la sesión y que el estado "pendiente" debe ser un valor y no un texto escrito en la pantalla.

### Entrada #52
- Fecha: 2026-10-30 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Resolver que el registro no pide contraseña
- Prompt:

````text
espera, tengo la bienvenida si le da registra va  a registrarse si va iniciar sesion inicia sesion, y tambien boton de registrarse, pero no hay campo de contraseña para entrar todavia entonces no puedo entrar
````

- Resumen de la respuesta: Reconoció que el PDF pide correo en el registro pero nunca contraseña. Indicó que el login falso temporal permite seguir construyendo y presentó tres opciones para la contraseña (A en la pestaña 1, B en un paso previo, C al final antes de enviar) ligadas a cuándo se crea la cuenta, con cuidados: confirmación, misma regla, solo en memoria.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que dónde se pide la contraseña depende de cuándo se crea la cuenta, y que la contraseña nunca se guarda en Firestore ni en AsyncStorage.

### Entrada #53
- Fecha: 2026-10-30 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisión de WelcomeScreen antes del commit
- Prompt:

````text
voy hacer commit de lo que tenemos en este momento , pero antes te paso para que veas como esta o si tengo que mejorar algp 

```javascript
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View>
          <Text style={styles.logo}>UBER</Text>
          <Text style={styles.logoSubtitle}>DRIVER</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.title}>
            Conduce cuando quieras.
            {'\n'}
            Gana a tu manera.
          </Text>

          <Text style={styles.description}>
            Únete a nuestra comunidad de conductores y comienza
            a generar ingresos con tu vehículo.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>
              Registrarme como conductor
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>
              Iniciar sesión
            </Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          Tu camino comienza aquí.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 35,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoSubtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 5,
    marginTop: 2,
  },
  hero: {
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 39,
    fontWeight: '800',
    lineHeight: 46,
    letterSpacing: -1,
  },
  description: {
    color: '#BDBDBD',
    fontSize: 16,
    lineHeight: 25,
    marginTop: 22,
  },
  actions: {
    gap: 14,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#333333',
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    color: '#777777',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 28,
  },
});


```
````

- Resumen de la respuesta: Confirmó que el flujo es correcto y que se quitaron los botones de redes sociales y la barra "¿A dónde vamos?". Señaló como problemas los textos escritos dentro de la pantalla (no del diccionario), los colores y medidas fuera del tema, la barra de estado al navegar, pantallas pequeñas o letra grande, el nombre de marca, el salto de línea forzado y la accesibilidad.
- Qué se usó / modificó / descartó: Pantalla escrita por mí; cambios aplicados tras la revisión: (completar)
- Archivos y commit: src/screens/WelcomeScreen.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que los textos deben salir del diccionario y los colores del tema para que la app cambie de idioma y de estilo en un solo lugar.

### Entrada #54
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Decidir el siguiente paso
- Prompt:

````text
listo ahora con que seguimos
````

- Resumen de la respuesta: Recomendó hacer la pantalla de Inicio pequeña para cerrar las pruebas pendientes de entradas anteriores (entrar con datos válidos, "atrás" de Android y cerrar sesión). Listó lo que debe tener y los pendientes abiertos: contraseña del registro, pestaña de Vehículo, pestañas arriba o abajo, servicio de imágenes y reglas de Firestore.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que conviene cerrar primero las pruebas que quedaron pendientes antes de abrir frentes nuevos.

### Entrada #55
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Planear cómo ampliar la pantalla de Inicio
- Prompt:

````text
si, primero voy hacer eso, en este momento tengo algo pequeño con solo titulo y ya, como para tener flujo, entonces ya empiezo con eso
````

- Resumen de la respuesta: Propuso un orden de cuatro pasos con un commit por paso: dónde vive el estado simulado de la cuenta, mostrarlo con textos del diccionario, el interruptor bloqueado si está pendiente (y qué muestra mientras carga) y el botón temporal de cerrar sesión.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/screens/HomeScreen.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que si el estado simulado vive en un solo lugar, cuando llegue Firebase solo cambia ese valor y no la pantalla.

### Entrada #56
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para darle a la app un estilo parecido a Uber
- Prompt:

````text
bueno, ya entramos al inicio, ya que login no valida por el momento, aparece pendiente de aprobacion y el boton esta bloqueado, entonces bien, ahora estilos, como hago para que tenga ese estilo caracteristico de uber
````

- Resumen de la respuesta: Aclaró que el PDF no pide parecerse a Uber y que conviene poner un límite de tiempo. Explicó qué caracteriza ese estilo (casi monocromático, mucho contraste, tipografía grande, botones grandes, panel inferior) sin copiar marca, y dio pasos: elegir una dirección, cambiar primero el tema, volver componentes lo repetido, estados y revisar pantalla por pantalla. Preguntó si la app sería clara u oscura.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: Inicio funciona con estado pendiente y botón bloqueado, según lo informado
- Aprendizaje: Entendí que el estilo se cambia primero en el tema para que toda la app se actualice, y que no debo copiar el logo ni la marca de Uber.

### Entrada #57
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Pasar la app a tema oscuro
- Prompt:

````text
pues me gustaria tener la app oscura
````

- Resumen de la respuesta: Explicó cómo pensar la paleta oscura (negro puro solo en el fondo, grises para capas, rojo de error revisado, botón principal invertido). Listó lo que se olvida: tema de navegación, barra de estado, teclado, selector de fecha, íconos, fondo de la pantalla de inicio. Dejó la decisión entre siempre oscura o seguir al sistema y dio pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/theme, src/screens — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que, como el tema usa nombres por función, cambiar los valores en un solo archivo actualiza toda la app.

### Entrada #58
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Preparar el commit y empezar los estilos
- Prompt:

````text
voy hacer commit, de lo que se hizo, y ahora cambio el estilos
````

- Resumen de la respuesta: Dio una lista antes del commit (git status sin .env, números reales en los comentarios AI-assisted, hash en la bitácora) y recomendó un commit aparte para el tema oscuro y uno por pantalla. Sugirió buscar colores escritos a mano en el código.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que conviene separar los commits de funcionalidad y de estilo para saber qué cambio rompe algo.

### Entrada #59
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Ordenar el trabajo de estilos
- Prompt:

````text
estoy haciendo ahora lo estilos, ya habia hecho el commit que te dije de inicio
````

- Resumen de la respuesta: Propuso el orden de estilos: primero el tema (probando cambiar un color), luego Bienvenida, luego las demás pantallas y al final los detalles que se olvidan. Dio dos comprobaciones (buscar colores a mano y revisar el contraste del rojo) y recordó los pendientes abiertos.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/theme — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el tema se arregla antes que las pantallas y que cada color fuera del tema es una tarea pendiente.

### Entrada #60
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar antes de subir el commit de estilos
- Prompt:

````text
listo si eso fue lo que hice, habia partes que solo era modificarles cosas pequeñas voy subir el commit
````

- Resumen de la respuesta: Listó revisiones previas al commit (git status, comentarios AI-assisted con #57 en lo aplicado por esa guía, mensaje claro y hash en la bitácora) y pruebas del flujo completo en Expo Go: pantallas oscuras y coherentes, sin destellos blancos, errores legibles, selector de fecha y de foto visibles.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/theme y varias pantallas — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que cambiar colores es fácil de romper sin darse cuenta y que hay que probar todo el flujo después.

### Entrada #61
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para la pestaña de Vehículo
- Prompt:

````text
listo esto te iba decir ahora con cual seguimos jaja,a ver primero pestaña de vehiculo y despues ya miramos credenciales y fire base
````

- Resumen de la respuesta: Listó los siete campos del PDF y qué reutilizar del Context ya hecho. Explicó la categoría (no carro o moto), la placa con trim y mayúsculas, la capacidad que depende de la categoría, el año calculado con el año actual y la foto local. Dejó las decisiones que el PDF no define (colores, capacidad de Económico y Premium, año mínimo) y nueve pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/screens/VehicleDataScreen.js, src/utils/validations.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que reglas como la capacidad del XL dependen de otro campo y que la validación debe recibir ambos.

### Entrada #62
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para el componente Dropdown
- Prompt:

````text
listo primero estoy haciendo un componente dropdown
````

- Resumen de la respuesta: Describió qué debe tener (misma apariencia que TextField, abrir y cerrar la lista, placeholder), props, valor estable frente al texto traducido, quién guarda la selección, errores comunes (mostrar el valor interno, tocar fuera, botón atrás de Android, lista larga, accesibilidad) y siete pruebas. Sugirió reemplazar los selectores de género e idioma por este componente.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/components/Dropdown.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el componente no guarda la selección: la guarda el Context, como con TextField.

### Entrada #63
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para armar VehicleDataScreen
- Prompt:

````text
ahora voy con vehiculoDataScreen
````

- Resumen de la respuesta: Recomendó leer todo del Context con el hook, marcar tocado igual que en la pestaña 1, usar teclados adecuados por campo, reutilizar el selector de foto y la solución de teclado del Login. Planteó la decisión del botón Continuar frente al indicador de incompleta y siete pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/screens/VehicleDataScreen.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que copiar una pantalla exige revisar cada nombre de campo y de clave de error, porque un error ahí no avisa.

### Entrada #64
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar la función para elegir la foto del vehículo
- Prompt:

````text
```javascript
const selectVehiclePhoto = async () => {
    try {
      setPhotoLoading(true);

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permiso necesario',
          'Necesitamos permiso para seleccionar la foto del vehículo.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        updateVehicle('vehiclePhoto', result.assets[0].uri);
        touchVehicle('vehiclePhoto');
      }
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar la fotografía.');
    } finally {
      setPhotoLoading(false);
    }
  };

```

es asi ?
````

- Resumen de la respuesta: Valoró el try/catch/finally, la revisión del permiso y el manejo de cancelar. Señaló que allowsEditing con aspect puede recortar la placa, que los mensajes van en Alert y en español fijo (el PDF pide error bajo el campo), solo hay galería, que hay que revisar en la documentación si hoy hace falta pedir permiso, y que la función seguramente está repetida en la pestaña 1.
- Qué se usó / modificó / descartó: Función escrita por mí; cambios por la revisión: (completar)
- Archivos y commit: src/screens/VehicleDataScreen.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que un finally garantiza que el estado de carga se recupere y que la ruta de la foto guardada es local, solo de ese celular.

### Entrada #65
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Saber si Firebase sirve para guardar las imágenes y a qué costo
- Prompt:

````text
yo, por eso te pregunto si esta bien, y sobre el servidor eso despues, pero vamos a utilzasr fire base, hay opcion de fire base para guardar
````

- Resumen de la respuesta: Con búsqueda en la documentación oficial, explicó que Cloud Storage for Firebase existe pero exige plan Blaze (de pago por uso y con cuenta de facturación) desde febrero de 2026, lo que choca con querer algo gratis. Avisó que el mismo plan afecta al backend de pagos (Cloud Functions) y propuso comparar Storage con Cloudinary u otro cuando llegue la etapa.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: Revisión de documentación oficial por Claude
- Aprendizaje: Entendí que "tener la opción" en Firebase no significa que sea gratis y que el plan Blaze puede tocar también el backend de pagos.

### Entrada #66
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Aclarar qué opciones gratuitas propone el PDF
- Prompt:

````text
no entiendo, entonces va tocar pagar? que recomienda el pdf que sea gratis
````

- Resumen de la respuesta: Aclaró que no es obligatorio pagar. Lo gratis hoy: Firebase Spark (Authentication y Firestore), notificaciones y mapa. Para imágenes el PDF recomienda Cloudinary; para el backend de pagos, Node/Express o Cloud Functions, con credenciales de prueba. Dejó pendiente verificar límites cuando llegue cada etapa.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el PDF ya trae una salida gratuita para las imágenes (Cloudinary) y que los pagos son solo de prueba.

### Entrada #67
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Decidir cómo validar la marca del vehículo
- Prompt:

````text
listo ya dio, pero tengo una preegunta, osea cuando escribimos la marca del vehiculo, peudo escribir cualquier marca? pues es lo que puedo hacer ahorita, es que pienso que una validacion de todas las marcas que existen es muy dificil
````

- Resumen de la respuesta: Dijo que según el PDF marca y modelo son texto libre de máximo 30 caracteres, y que la revisión humana está en el estado pendiente de aprobación. Recomendó validar no vacío, máximo 30 después de recortar y caracteres permitidos suaves (letras con tilde, números, espacios y guion), con casos de prueba como Mercedes-Benz y F-150. Una lista de marcas sería un extra.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/utils/validations.js — commit: 
- Verificación: Pantalla de Vehículo funcionando, según lo informado
- Aprendizaje: Entendí que una validación demasiado estricta rechaza datos legítimos y que el PDF ya prevé una revisión humana.

### Entrada #68
- Fecha: 2026-10-31 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar mi plan de cinco puntos contra el PDF
- Prompt:

````text
listo vamos hacer correjir detalles 1. Terminar validaciones
Siguiente

* Corregir caracteres permitidos en marca y modelo.
* Probar límites de 30 y 31 caracteres.
* Revisar placa, año y capacidad XL.
2. Completar navegación del registro
* Datos personales → vehículo.
* Vehículo → confirmación del registro.
* Poder regresar sin perder información.
3. Crear pantalla de confirmación
* Resumen de datos personales.
* Resumen del vehículo.
* Confirmación de envío.
4. Mejorar experiencia
* Mensajes de error claros.
* Indicador de progreso del registro.
* Botones para continuar y regresar.
5. Preparar integración
* Organizar datos para Firebase.
* Definir cómo se almacenarán las fotografías.
* Preparar estados: pendiente, aprobado y rechazado.
````

- Resumen de la respuesta: Valoró el orden y señaló cuatro cosas: falta la pestaña 3 en el flujo (aunque la profesora pidió solo dos), la contraseña sigue sin decidir, los botones se alejan del PDF (Enviar solo con todo válido) y "rechazado" no existe para la cuenta del conductor en el PDF. Propuso un orden: validaciones, decisiones, navegación y experiencia, confirmación e integración.
- Qué se usó / modificó / descartó: Plan escrito por mí (completar si algún apartado se descartó)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que lo que añado fuera del PDF (indicador de progreso, confirmación, "rechazado") es extra mío y debe decidirse con cuidado.

### Entrada #69
- Fecha: 2026-11-02 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Saber si la pestaña 3 hace falta para el miércoles
- Prompt:

````text
espera, es que pa el miercoles nesecitamos solo 2 pestañas funcionales completamente con fire base no es nesecario la 3 o si? la profe dijo pestaña 1 y 2
````

- Resumen de la respuesta: Dijo que para esa entrega la pestaña 3 no entra según lo dicho por la profesora, aunque el PDF la exige para el proyecto final. Sugirió confirmar con ella si incluye crear la cuenta, subir fotos y cómo enviar con solo dos pestañas. Priorizó cuenta, datos en Firestore, reglas, fotos según lo que pida y un envío temporal, y dejó como extras el indicador, la confirmación elaborada y "rechazado".
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que lo que cuenta para cada entrega es lo que pide la profesora, y que conviene preguntarle lo que no queda claro.

### Entrada #70
- Fecha: 2026-11-02 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar mis decisiones para la entrega del miércoles
- Prompt:

````text
1. Contraseña: opción B. Crear la contraseña después de completar los datos personales y del vehículo, antes de enviar el registro.
2. Creación de cuenta: al enviar el registro completo. La cuenta queda inicialmente en estado pending sin habilitar viajes hasta su aprobación.
3. Pestañas: abajo, usando React Navigation Bottom Tabs. Es una ubicación familiar para una aplicación tipo Uber.
4. Fotos: usar Firebase Storage para almacenar las fotografías, si ella lo solicita. No invertir tiempo todavía en otro servicio.
5. Envío temporal: agregar un botón claramente identificado como «Enviar registro temporal» que guarde los datos de las pestañas 1 y 2 y deje el estado en pending
Orden de prioridad: envío temporal → contraseña y creación de cuenta → pestañas → fotografías.
````

- Resumen de la respuesta: Aclaró que lo descrito (contraseña al final) es la opción C de la tabla anterior. Señaló un problema de orden: guardar datos sin cuenta obliga a dejar Firestore abierto, así que propuso cuenta, datos con reglas, envío temporal, pestañas y fotos. Avisó de dos riesgos (fallo a medias y plan Blaze de Storage) y dio piezas y pruebas.
- Qué se usó / modificó / descartó: Decisiones mías; ajuste de orden por la revisión (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que primero va la cuenta y las reglas, y que si falla la creación a medias el usuario debe poder reintentar sin crear otra cuenta.

### Entrada #71
- Fecha: 2026-11-02 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para la cuenta con Firebase Authentication
- Prompt:

````text
si ya tengo el fire base conectado
````

- Resumen de la respuesta: Pidió confirmar que Authentication con correo y contraseña está habilitado y describió qué terminar: funciones de cuenta en src/services, traducción de errores a claves, useAuth con limpieza de suscripción, estado de carga de sesión, persistencia y reemplazo del login falso. Dio nueve pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/services, src/hooks/useAuth.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que la sesión se escucha con una suscripción que debe cancelarse al salir, y que no se imprime nunca la contraseña.

### Entrada #72
- Fecha: 2026-11-02 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Aclarar qué significa "subir credenciales" a la base de datos
- Prompt:

````text
en este momento ando corrijiendo para ya comenzar a subir credenciales a la base de datos
````

- Resumen de la respuesta: Aclaró que correo y contraseña no van a Firestore, los maneja Authentication, mientras que los datos del registro sí van en un documento con estado pending. Pidió escribir las reglas de Firestore antes de subir datos, usar datos inventados y no guardar nunca la contraseña.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que la contraseña nunca se guarda en la base de datos y que las reglas se escriben antes de subir datos.

### Entrada #73
- Fecha: 2026-11-02 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar el primer registro guardado en Authentication y Firestore
- Prompt (adjunta dos capturas: el documento en Firestore y el usuario en Authentication):

````text
ya lo logramos, hicimos un avance
````

- Resumen de la respuesta: Celebró el flujo completo (cuenta y documento con el uid como identificador y estado pending). Señaló que capacity se guardó como texto, que fullName tenía un espacio al final, que hay que escribir reglas de Firestore, que photosPending es un dato calculable y que el uid está repetido. Avisó de usar datos inventados y de que el aviso de Authentication se refiere a enlace por correo, que no se usa.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/services, src/screens/registration — commit: 
- Verificación: Cuenta en Authentication y documento en driverRegistrations con status pending
- Aprendizaje: Entendí que los números deben guardarse como números, que hay que recortar espacios antes de guardar y que no debo compartir capturas con datos reales.

### Entrada #74
- Fecha: 2026-11-02 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisión de RegistrationSuccessScreen
- Prompt:

````text
nesecito que revises si esta bien nesecito tu ayuda 

```javascript
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';

export default function RegistrationSuccessScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✓</Text>

      <Text style={styles.title}>¡Registro enviado!</Text>

      <Text style={styles.description}>
        Tus datos fueron guardados correctamente. Tu cuenta está pendiente
        de revisión y aprobación.
      </Text>

      <Text style={styles.status}>Pendiente de aprobación</Text>

      <Button
        title="Volver al inicio"
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  icon: {
    fontSize: 64,
    color: '#16A34A',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  status: {
    fontWeight: '700',
    color: '#D97706',
    marginBottom: spacing.xl,
  },
});

```
````

- Resumen de la respuesta: Señaló que title y description no tienen color y quedarían negros sobre el tema oscuro, que la pantalla puede chocar con la navegación por sesión (al crearse la cuenta Firebase inicia sesión) y que el botón dice "Volver al inicio" pero lleva a Bienvenida. Además, textos y colores fuera del diccionario y del tema, y que el estado debe ser un valor compartido.
- Qué se usó / modificó / descartó: Pantalla escrita por mí; cambios por la revisión: (completar)
- Archivos y commit: src/screens/registration/RegistrationSuccessScreen.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que un estilo de tipografía sin color no se ve en un fondo oscuro y que la navegación basada en sesión decide qué pantalla existe en cada momento.

### Entrada #75
- Fecha: 2026-11-02 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisión de SubmitRegistrationScreen
- Prompt:

````text
espera y este ?

```javascript
import { useState, useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '../../config/firebase';
import { RegistrationContext } from '../../context/RegistrationContext';
import Button from '../../components/Button';
import { colors, spacing, typography } from '../../theme';

export default function SubmitRegistrationScreen({ route, navigation }) {
  const { password } = route.params;
  const { personalData, vehicleData } = useContext(RegistrationContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const email = personalData.email.trim().toLowerCase();

      let user = auth.currentUser;

      if (user && user.email?.toLowerCase() !== email) {
        throw new Error('AUTH_USER_MISMATCH');
      }

      if (!user) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        user = credential.user;
      }

      const uid = user.uid;

      const registration = {
        uid,
        personalData: {
          ...personalData,
          email,
          birthDate: personalData.birthDate
            ? personalData.birthDate.toISOString()
            : null,
          photo: null,
        },
        vehicleData: {
          ...vehicleData,
          vehiclePhoto: null,
        },
        status: 'pending',
        photosPending: true,
        createdAt: serverTimestamp(),
      };

      await setDoc(
        doc(db, 'driverRegistrations', uid),
        registration,
        { merge: true }
      );

      navigation.replace('RegistrationSuccess');
    } catch (error) {
      console.error('Error al enviar registro:', error);

      let message = 'No se pudo completar el registro. Inténtalo nuevamente.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'Este correo ya tiene una cuenta. Inicia sesión con ella.';
      } else if (error.code === 'auth/weak-password') {
        message = 'La contraseña no cumple los requisitos de seguridad.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'El correo electrónico no es válido.';
      } else if (error.code === 'permission-denied') {
        message = 'Firebase no permite guardar los datos. Revisa las reglas de Firestore.';
      } else if (error.message === 'AUTH_USER_MISMATCH') {
        message = 'Hay otra cuenta activa. Cierra esa sesión antes de registrar este correo.';
      }

      Alert.alert('Error en el registro', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enviar registro</Text>

      <Text style={styles.description}>
        Al continuar, crearemos tu cuenta y enviaremos tus datos para revisión.
        Tu registro quedará pendiente de aprobación.
      </Text>

      <Button
        title={isSubmitting ? 'Enviando...' : 'Crear cuenta y enviar registro'}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
});

```
````

- Resumen de la respuesta: Valoró el manejo del fallo a medias (si la cuenta ya existe no crea otra), el finally y el uid como identificador. Señaló como problemas la contraseña que viaja por route.params, que la pantalla puede desaparecer a mitad del envío por el cambio de sesión, que no se valida lo que se envía, datos sin normalizar (números, espacios, fecha), merge con status, Alert con textos fijos y sin casos de red.
- Qué se usó / modificó / descartó: Pantalla escrita por mí; esta pantalla fue luego modificada con ayuda de otra IA (ver entradas #83 y #84); cambios por la revisión: (completar)
- Archivos y commit: src/screens/registration/SubmitRegistrationScreen.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que los datos secretos no deben viajar por los parámetros de navegación y que hay que validar lo que se envía, no solo mostrarlo.

### Entrada #76
- Fecha: 2026-11-02 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Repasar qué debe tener cada pestaña según el PDF
- Prompt:

````text
pregunta como tal las 2 pestañas que deben tener
````

- Resumen de la respuesta: Listó en dos tablas los campos y validaciones de Datos personales y de Vehículo según el PDF, las reglas comunes (ningún campo vacío, errores bajo el campo, Enviar solo con todo válido) y lo que el PDF no define (opciones de género y color, si 18 años justos cuentan, capacidad de Económico y Premium, año mínimo).
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que repasar campo por campo con la tabla del PDF, con un valor válido y uno inválido, es la mejor forma de cerrar una pestaña.

### Entrada #77
- Fecha: 2026-11-03 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Entender los problemas de estilo del tema oscuro y cómo registrar el uso de otra IA
- Prompt (primer mensaje, con cuatro capturas de Android: Datos del vehículo, Enviar registro, Enviando y Registro completado):

````text
listo ya funciona otro avanza la navegación esta bien pero los estilos, mira el botón no aparece la letra en towrka en una screen debe ir letra arriba ayuda
````

- Prompt (segundo mensaje):

````text
como ayer, no pudiste responder por el limite de mensajes, entonces me apoye para resolver los estilos en otra  ia, solo pa eso, entonces tube asistencia en button.js, en dropdown y ensumbit registration
````

- Prompt (tercer mensaje):

````text
Continuar
````

- Resumen de la respuesta: Explicó que cada uso de otra herramienta de IA es una entrada propia (fecha, herramienta, prompt completo, resumen, qué se usó, modificó o descartó, archivos y commit) y que Button.js, el Dropdown y SubmitRegistrationScreen deben llevar el comentario AI-assisted con el número de esa entrada. Explicó las dos causas de las capturas: textos sin color (negros sobre fondo oscuro) y botón blanco sin letras (el color del texto del botón no cambió cuando el botón pasó a ser claro). Recordó los pendientes de #75.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/components/Button.js, Dropdown y SubmitRegistrationScreen — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que un texto sin color explícito se ve negro sobre fondo oscuro, y que cuando cambia el color del botón también debe cambiar el color de su texto.

### Entrada #78
- Fecha: 2026-11-03 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para conectar Cloudinary porque Firebase Storage no funcionó
- Prompt:

````text
espera es que ando conectando el claudinary, para fotos el storage alfinal no funcionó
````

- Resumen de la respuesta: Con búsqueda en documentación, indicó que el plan gratuito de Cloudinary no pide tarjeta y tiene límites suaves, y que la subida sin firma permite que cualquiera que conozca el preset suba archivos, por lo que es sensible y la clave secreta nunca va en la app. Describió qué terminar (preset sin firma, valores en .env, función de subida, guardar la URL), decisiones (cuándo subir, privacidad de licencia y SOAT), errores comunes y pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/config, src/services (Cloudinary) — commit: 
- Verificación: Revisión de documentación oficial por Claude
- Aprendizaje: Entendí que se sube la foto, se recibe una URL y se guarda solo esa URL en Firestore, y que el nombre del preset es un dato sensible.

### Entrada #79
- Fecha: 2026-11-03 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar la configuración de Cloudinary
- Prompt (los valores reales están reemplazados por [OCULTO]):

````text
ya cree cuenta y acabjo de crear en config esto export const CLOUDINARY_CLOUD_NAME = '[OCULTO]';
export const CLOUDINARY_UPLOAD_PRESET = '[OCULTO]';

export const CLOUDINARY_UPLOAD_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
````

- Resumen de la respuesta: Avisó que pegué el nombre de la nube y del preset y que el preset es sensible (reemplazarlo en la bitácora y rotarlo si hay dudas). Valoró que los valores estén en un solo archivo y la URL derivada. Señaló que los valores deben ir en .env y no en el código, que el preset debe ser sin firma y que conviene restringirlo (carpeta, formatos).
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/config (Cloudinary), .env, .env.example — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que los nombres de nube y preset van en .env con prefijo EXPO_PUBLIC_, y que la API key y el secret no se necesitan en la app.

### Entrada #80
- Fecha: 2026-11-03 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Cómo probar tras cambiar varios archivos a la vez
- Prompt:

````text
es que ando configurando esto todo raro nunca habia trabajado con esto, acabo de modifciar  3 archivo en services, en config y el de submit voy a runear a ver si funciona
````

- Resumen de la respuesta: Resumió la idea (subir la foto, recibir una URL y guardarla en Firestore). Recomendó git diff, reiniciar con caché limpia al tocar .env y verificar en orden: la app arranca, se crea la cuenta, las fotos aparecen en Cloudinary y en Firestore hay URL. Dio pistas según el tipo de error de subida y pidió cambiar y probar de a una pieza.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/services, src/config, SubmitRegistrationScreen — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que si cambio varios archivos a la vez no sé cuál causó un error, y que conviene hacer commits pequeños.

### Entrada #81
- Fecha: 2026-11-03 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Deducir la causa de un error 500 de Metro (módulo no encontrado)
- Prompt (adjunta dos capturas del error en el celular; omito las rutas y datos locales):

````text
Este error de que sería no encuentro solución
````

- Resumen de la respuesta: Explicó que los códigos de colores se ignoran y que lo importante es "Unable to resolve module" y el campo originModulePath, que dice qué archivo contiene el import que falla. Guió con pistas para comparar qué debería tener ese archivo con lo que importa, revisar con git diff y, si el archivo de configuración de Firebase quedó con código de otra pantalla, recuperarlo desde Git.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/config/firebase.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que en un error de Metro debo leer originModulePath para saber qué archivo falla y que Git permite recuperar un archivo que se dañó.

### Entrada #82
- Fecha: 2026-11-03 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Saber qué entrada de la bitácora va en el comentario del RegistrationProvider
- Prompt:

````text
```javascript
/ AI-assisted: see docs/AI_LOG.md
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
 ese assitencia con ia que entrada es
```
````

- Resumen de la respuesta: Avisó que el comentario tenía una sola barra y por eso era un error de sintaxis (deben ser dos). Explicó que, para este archivo, el número depende de qué guía se siguió: #42 (guía del Context), #43 (revisión del control de "tocado") y #46 solo si se aplicaron cambios por esa revisión. Preguntó si alguna parte vino de otra herramienta de IA y recordó el error pendiente de config/firebase.
- Qué se usó / modificó / descartó: Comentario del archivo corregido a `// AI-assisted: see docs/AI_LOG.md #42, #43` (completar el resto)
- Archivos y commit: src/context/RegistrationContext.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que un comentario necesita dos barras y que el número debe apuntar a la entrada de la ayuda que realmente influyó en ese código.

### Entrada #83
- Fecha: (completar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: (completar: nombre de la herramienta de IA)
- Objetivo: Corregir problemas de estilo del tema oscuro (texto que no se veía, botón sin letras); la herramienta entregó código
- Prompt: (completar: copiar aquí el prompt completo tal como lo escribí en esa herramienta, sin llaves ni datos reales)
- Resumen de la respuesta: Primer uso, la noche anterior, porque Claude no pudo responder por el límite de mensajes. La herramienta entregó código para arreglar estilos. (completar con 2 o 3 líneas de lo que respondió)
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: Button.js, Dropdown y/o SubmitRegistrationScreen (completar cuáles salieron de este uso) — commit: 
- Verificación: Probado en el celular con Expo Go (completar)
- Aprendizaje: (completar)

### Entrada #84
- Fecha: (completar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: (completar: nombre de la herramienta de IA)
- Objetivo: Corregir problemas de estilo del tema oscuro; la herramienta entregó código
- Prompt: (completar: copiar aquí el prompt completo tal como lo escribí en esa herramienta, sin llaves ni datos reales)
- Resumen de la respuesta: Segundo uso, la misma noche. La herramienta entregó código para arreglar estilos. (completar con 2 o 3 líneas de lo que respondió)
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: Button.js, Dropdown y/o SubmitRegistrationScreen (completar cuáles salieron de este uso) — commit: 
- Verificación: Probado en el celular con Expo Go (completar)
- Aprendizaje: (completar)

> 
### Entrada #85
- Fecha: (completar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para la pestaña 3 del registro (Documentos y pagos)
- Prompt:

````text
bueno ahora vamos hacer pestaña 3, que tiene que tener esta éstaña
````

- Resumen de la respuesta: Listó los cinco bloques de la pestaña 3 según el PDF (licencia con número, foto y vencimiento; SOAT; revisión técnico-mecánica si aplica; correo de Mercado Pago; términos con la comisión visible) y la regla de no guardar números de tarjeta ni de cuenta. Señaló lo que el PDF deja abierto (regla de "si aplica", "posterior a hoy", formato de la licencia, texto de los términos, pasarela sin decidir) y dio decisiones, errores comunes y pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/screens/DocumentsScreen.js, src/context/RegistrationContext.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que la pestaña 3 tiene cinco bloques, que la comisión visible debe salir de pricing.js y que nunca se guardan números de tarjeta ni de cuenta.

### Entrada #86
- Fecha: 2026-11-07 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Saber qué validaciones lleva cada campo de la pestaña 3
- Prompt:

````text
espera dime que validaciones,tendria lo que pide el doc , osea la licencia soat y que mas? osea que validaciones como tal
````

- Resumen de la respuesta: Dio una tabla con las validaciones campo por campo (número y foto de la licencia, vencimientos posteriores a hoy, revisión técnico-mecánica solo si aplica, correo de Mercado Pago, términos). Aclaró que las fechas se comparan sin la hora, que la revisión depende del año del vehículo y que no se guardan datos de tarjeta o cuenta. Sugirió claves de error y casos de prueba.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/utils/validations.js, src/i18n — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que las fechas de vencimiento se comparan sin la hora y que la revisión técnico-mecánica depende de otro campo, igual que la capacidad depende de la categoría.

### Entrada #87
- Fecha: 2026-11-07 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Decidir si el año del vehículo puede ser el año siguiente (2027)
- Prompt:

````text
listo pregunta, el año del carro no deberia dejar 2027 verdad, pq ese que carros despues de junio salen con 2027 o no
````

- Resumen de la respuesta: Explicó que el PDF dice "no mayor al año actual", por lo que un 2027 se rechazaría. Comparó seguir el PDF con permitir un año más, recomendó seguir el PDF o preguntar a la profesora, y avisó que, si se permite, el "+1" debe estar en un solo lugar con un comentario y que el año actual se calcula, no se escribe fijo.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/utils/validations.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que desviarme del PDF debe ser una decisión consciente y documentada, y que el año actual se calcula al validar.

### Entrada #88
- Fecha: 2026-11-07 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisión de la función validateYear
- Prompt:

````text
export const validateYear = (value) => {
  if (isEmpty(value)) return 'required';

  const year = String(value).trim();
  const currentYear = new Date().getFullYear();

  if (!YEAR_REGEX.test(year)) {
    return 'yearInvalid';
  }

  if (Number(year) > currentYear + 1) {
    return 'yearFuture';
  }

  return '';
}; listo quedo asi
````

- Resumen de la respuesta: Valoró que calcula el año actual, devuelve claves y recorta espacios. Señaló que el "+ 1" está escrito dentro de la función (debe ir en configuración con un comentario), que dependía de cómo estuvieran isEmpty y YEAR_REGEX, que no hay límite inferior, que el texto de yearFuture debe coincidir con la regla y que el año debe guardarse como número. Dio una tabla de pruebas.
- Qué se usó / modificó / descartó: Función escrita por mí; decisión del "+1" mía (completar el resto)
- Archivos y commit: src/utils/validations.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que los valores como el "+1" deben tener un nombre y vivir en un solo lugar, y que debo revisar qué hacen las funciones de las que depende una validación.

### Entrada #89
- Fecha: 2026-11-07 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Orientación para agregar la fecha de matrícula y calcular si hace falta revisión técnico-mecánica
- Prompt:

````text
voy a implementar un dato ams que es fecha de matricula, para calulcar si neseecita tecnico mecanica
````

- Resumen de la respuesta: Aclaró que es un campo extra mío (el PDF habla del año del vehículo). Con búsqueda web indicó que la primera revisión de particulares es desde el quinto año contado desde la matrícula y que motos y servicio público van a los dos años, con excepciones por fecha, y que debía confirmarlo en una fuente oficial. Dio qué terminar, decisiones (en qué pestaña va, si es obligatoria, preguntar a la profesora), detalles (comparar fechas completas, no futura, campos condicionales) y pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/context/RegistrationContext.js, src/utils/validations.js, src/config — commit: 
- Verificación: Fuentes web consultadas por Claude; confirmar en fuente oficial (completar)
- Aprendizaje: Entendí que la matrícula es el dato que usa la ley para la revisión, que se compara con fechas completas y que el número de años va en la configuración.

### Entrada #90
- Fecha: 2026-11-08 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Confirmar los 5 años de la revisión y saber qué se coloca para el pago con Mercado Pago
- Prompt:

````text
listo,pregunta entonces pa confirmar, son 5 años si son nuevos, y otra pregunta en el pago que toca colocar, osea vamos a utilizar mercado pago pero exactamente que se coloca
````

- Resumen de la respuesta: Confirmó los 5 años para carros particulares con los matices de las fuentes y pidió verificar en una fuente oficial. Explicó que en el registro solo se coloca el correo de la cuenta de Mercado Pago (validando el formato) y que más adelante el cobro necesita cuentas de prueba, un access token solo en el backend y un backend (Express o Cloud Functions, aún sin decidir). Anotó que la pasarela elegida es Mercado Pago.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que en el registro solo se guarda un correo de pagos y que las llaves secretas de la pasarela nunca van en la app.

### Entrada #91
- Fecha: 2026-11-08 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Aclarar la validación de la placa y las validaciones del correo de Mercado Pago
- Prompt:

````text
bueno, queria tener una validacioncon la placa, pero no pude hacerla y no me voy a complicar, entonces tengo la funcionalidad, pero ahora nesecito que esos datos se suban a fire store cuando tenga te  digo, y una pregunta el correo d emercado pago cuales son sus validaciones
````

- Resumen de la respuesta: Dijo que el PDF solo pide el formato ABC123 con mayúsculas antes de validar y que otras ideas (placa repetida, que se vea en la foto) no son exigidas. Explicó que el correo de Mercado Pago solo lleva validación de formato, reutilizando la función del correo, y dejó una lista de decisiones para cuando los datos se suban a Firestore.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/utils/validations.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que no hace falta complicar una validación más allá de lo que pide el PDF, y que antes de subir datos conviene decidir cómo se normalizan.

### Entrada #92
- Fecha: 2026-11-08 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar mi decisión de reutilizar la función del correo para el correo de pagos
- Prompt:

````text
lo que hice fue escribir la funcion y retornar la funcion de email que teniamos antes, ya que esas validaciones estan melas
````

- Resumen de la respuesta: Valoró reutilizar la función existente (una sola regla para los dos correos). Señaló revisar el mensaje de error genérico y recortar espacios y pasar a minúsculas al guardar. Dio pruebas rápidas.
- Qué se usó / modificó / descartó: Función escrita por mí
- Archivos y commit: src/utils/validations.js — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que reutilizar una función evita que una corrección se quede en un solo lugar.

### Entrada #93
- Fecha: 2026-11-08 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Decidir las validaciones de la capacidad de pasajeros por categoría
- Prompt:

````text
ayuda que validaciones tiene la capacidad del carro porfa, osea si es premium cuantos maximo y minimo puede colocar
````

- Resumen de la respuesta: Explicó que el PDF solo fija mínimo 6 para XL y que los límites de Económico y Premium los decido yo. Propuso validar un número entero positivo, ejemplos de límites por categoría guardados en la configuración, qué hacer sin categoría y si la capacidad incluye al conductor, con claves de error y pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/utils/validations.js, src/config — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que los límites por categoría van en la configuración y que los errores se recalculan solos cuando cambia la categoría.

### Entrada #94
- Fecha: 2026-11-08 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Saber cuál es el paso siguiente después de terminar el registro del conductor
- Prompt:

````text
listo ya quedo el registro de conductor, ahora cual seria el paso a seguir
````

- Resumen de la respuesta: Dio una lista para cerrar el registro (tres pestañas, datos normalizados en Firestore, fotos en Cloudinary, reglas, contraseña, pruebas de fallo). Recomendó seguir con el login real y el estado real de la cuenta, y señaló que faltaba confirmar pricing.js y calculateFare. Anticipó las decisiones que se acercan: ubicación, mapas y rutas, notificaciones y backend de pagos.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que antes de dar una etapa por terminada conviene repasar datos, reglas y casos de fallo, y que calculateFare es necesaria para la solicitud y el cobro.

### Entrada #95
- Fecha: 2026-11-08 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar mi tabla de funcionalidades del login y planear persistencia de sesión y estado en tiempo real
- Prompt:

````text
Funcionalidad	Estado
Login con Firebase Authentication	Implementado
Validaciones de correo y contraseña	Implementadas
Mensajes de error traducidos	Implementados
Estado de carga al iniciar sesión	Implementado
Consultar el estado real en Firestore	Implementado
Bloquear login si está pending	Implementado
Permitir login si está approved	Implementado
Bloquear disponibilidad si no está aprobado	Implementado
Persistencia de la sesión al reiniciar la app	Pendiente
Escuchar cambios de aprobación en tiempo real	Pendiente toca hacer es esto antes del mapa Mi recomendación es terminar estas dos funcionalidades antes de comenzar el mapa:

1. Persistencia de sesión: para que un conductor aprobado no tenga que iniciar sesión cada vez que abre la aplicación.
2. Estado en tiempo real: para detectar cambios de aprobación y bloquear inmediatamente la disponibilidad cuando corresponda.
````

- Resumen de la respuesta: Señaló una contradicción: bloquear el login con estado pending se aleja del PDF (el conductor debe poder entrar y ver su estado, solo no puede ponerse Disponible) y le quita sentido al tiempo real. Dio guía para la persistencia de sesión (carga mientras se restaura, releer el estado, no guardar datos sensibles) y para el estado en tiempo real (suscripción con limpieza, apagar la disponibilidad si el estado cambia), con errores comunes y pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/hooks/useAuth.js, src/services — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el estado de la cuenta debe escucharse con una suscripción que se cancela al cerrar sesión, y que el bloqueo debe impedir ponerse Disponible, no entrar a la app.

### Entrada #96
- Fecha: 2026-11-08 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Saber cómo implementar la ubicación del conductor
- Prompt (primer mensaje):

````text
tengo una pregunta , como seria la implementacion de la ubicacion que se nesecita
````

- Prompt (segundo mensaje):

````text
Continuar
````

- Resumen de la respuesta: Con consulta de la documentación de Expo, explicó que el PDF solo necesita ubicación con la app abierta mientras se está Disponible (hook useDriverLocation, limpieza, guardado cada pocos segundos). Comparó expo-location (incluida en Expo Go) con la librería del PDF y dejó la decisión en mí. Dio qué terminar (permiso, lectura inicial, seguimiento, hook, guardado limitado y solo si está aprobado), decisiones de diseño, errores comunes y pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/hooks/useDriverLocation.js — commit: 
- Verificación: Documentación de Expo consultada por Claude (completar)
- Aprendizaje: Entendí que el seguimiento en primer plano basta para este PDF y que hay que cancelarlo al apagar Disponible, al salir de la pantalla y al cerrar sesión.

### Entrada #97
- Fecha: 2026-11-09 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Decidir el siguiente paso después de la ubicación
- Prompt:

````text
si ya he hecho eso, y lo mas importante se guarda en fire store ahora con que me recomiendas seguir
````

- Resumen de la respuesta: Recomendó seguir con las solicitudes entrantes antes que el mapa. Pidió revisar el cupo de escrituras de Firestore y confirmar calculateFare. Describió qué terminar (viajes de prueba, hook useTripRequests, pantalla con temporizador de 15 segundos, aceptar y rechazar con useCallback, reglas), decisiones, errores comunes y pruebas.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que las solicitudes dependen de un temporizador que debe limpiarse y que la tarifa debe salir solo de calculateFare.

### Entrada #98
- Fecha: 2026-11-09 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar qué atender al cambiar el tema de oscuro a azul y blanco
- Prompt:

````text
listo es que estaba cambiando estilos a un azul blanco
````

- Resumen de la respuesta: Dio una lista de lo que suele fallar al pasar a un tema claro (texto del botón sobre el azul, contraste, barra de estado, tema de navegación, teclado, selector de fecha, colores escritos a mano y estados) y pruebas. Recordó ponerle límite de tiempo al estilo y preguntó otra vez por calculateFare.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: src/theme y varias pantallas — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que lo que queda fuera del tema (barra de estado, navegación, teclado) es lo que más se rompe al cambiar de colores.

### Entrada #99
- Fecha: 2026-11-09 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Revisar mi documento de viaje de prueba contra el modelo de datos del PDF
- Prompt:

````text
passengerName
stringCarlos Pérez
origin
stringParque de Bello
destination
stringParque de Berrío, Medellín
category
stringeconomy
status
stringpending
driverId
nullnull
createdAt
timestampFecha y hora actual para la simulacion de pasajero estoy pasando estos datos
````

- Resumen de la respuesta: Señaló que el estado de un viaje nuevo es requested (no pending), que origin y destination deben ser objetos con latitud, longitud y dirección, y que faltaban distanceKm, durationMin, paymentMethod, passengerId y commissionRate. Comparó los diseños de driverId (asignada o abierta) y sugirió usar 8,5 km y 22 minutos para probar calculateFare.
- Qué se usó / modificó / descartó: Documento de prueba creado por mí; cambios por la revisión: (completar)
- Archivos y commit: colección trips en Firestore — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que el estado de un viaje y el de una cuenta son cosas distintas y que el modelo de datos debe seguir la forma del PDF.

### Entrada #100
- Fecha: 2026-11-09 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Entender de dónde vienen las solicitudes de viaje
- Prompt:

````text
Tengo una pregunta espera no entiendo lo de enviar solicitudes esas solicitudes de donde vienen
````

- Resumen de la respuesta: Explicó que en una app real el pasajero crea un documento y el conductor lo escucha, y que como el proyecto solo tiene la app del conductor, el pasajero se simula creando el documento en la colección trips. Dio el flujo paso a paso y tres formas de simularlo (a mano en la consola, botón de prueba, mini-app aparte).
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que la base de datos funciona como un tablón compartido entre la app del pasajero y la del conductor, y que aquí yo hago de pasajero.

### Entrada #101
- Fecha: 2026-11-10 (verificar)
- Integrante: Fabian Alexander Chirivi
- Herramienta: Claude (claude.ai)
- Objetivo: Qué hacer mientras la profesora entrega la API de solicitudes
- Prompt (primer mensaje):

````text
La profe dijo que nos pasaba una api para eso, osea que toca esperar pa eso
````

- Prompt (segundo mensaje):

````text
Continuar
````

- Resumen de la respuesta: Dijo que no se debe armar nada que dependa de la API hasta saber cómo funciona y dio seis preguntas para la profesora (cómo llega la solicitud, qué datos trae, cómo vuelve el estado, llaves, límites y fechas). Propuso avanzar con calculateFare, la tarjeta de solicitud con datos locales, ganancias, historial y perfil, y poner un punto único de entrada para los datos del viaje.
- Qué se usó / modificó / descartó: (completar)
- Archivos y commit: ninguno en esta entrada — commit: 
- Verificación: (completar)
- Aprendizaje: Entendí que conviene aislar el origen de los datos del viaje en un solo lugar, para cambiarlo cuando llegue la API sin tocar las pantallas.
### Entrada #102

- **Fecha:** 2026-11-10
- **Integrante:** Fabian Alexander Chirivi
- **Herramienta:** ChatGPT (OpenAI)
- **Objetivo:** Identificar las funcionalidades de UberCloneDriver que se pueden desarrollar mientras la profesora entrega la API de solicitudes de viajes.
- **Prompt:**

```text
bueno, comencemoz, resulta que la profe dijo que la api que va mandar las solicitudes la da ella, pero todavia no, asi que adelantemos lo que no depende de esa api que podria ser?
```

- **Resumen de la respuesta:** La IA recomendó continuar con funcionalidades independientes de la API: cálculo de tarifas y ganancias, visualización de rutas, pantalla de viaje en curso e historial. También aconsejó posponer la integración de solicitudes hasta conocer el funcionamiento de la API proporcionada por la profesora.
- **Qué se usó / modificó / descartó:** Se decidió comenzar por el cálculo de tarifas. Se dejó pendiente la integración de solicitudes y los cambios en las reglas de Firestore.
- **Archivos y commit:** Ninguno. No se realizaron modificaciones de código durante esta interacción.
- **Verificación:** No aplica; fue una actividad de planificación.
- **Aprendizaje:** Comprendí que puedo continuar desarrollando funcionalidades independientes mientras espero una API externa, evitando implementar servicios que posteriormente tendría que reemplazar.

---

### Entrada #103

- **Fecha:** 2026-11-10
- **Integrante:** Fabian Alexander Chirivi
- **Herramienta:** ChatGPT (OpenAI)
- **Objetivo:** Evaluar si la ubicación y el mapa de UberCloneDriver deberían mostrarse como fondo de la pantalla principal.
- **Prompt:**

```text
listo iniciemos con calculatefare pero antes de eso te pregunto, ya que tenemos esa ubicacion pero en uber o driver esa ubicacion esta como de fondo atras no importa? o que dices tu
```

- **Resumen de la respuesta:** La IA explicó las diferencias entre mantener el mapa dentro de una tarjeta y utilizarlo como fondo de la pantalla principal, similar a las aplicaciones de conductores. Recomendó usar el mapa como fondo con controles flotantes de disponibilidad y tarjetas para las solicitudes, pero aplazar el cambio visual hasta terminar el cálculo de tarifas.
- **Qué se usó / modificó / descartó:** Se tomó como referencia el diseño de mapa de fondo para una futura actualización de HomeScreen. Se decidió conservar temporalmente la implementación actual para no afectar el GPS ni las funcionalidades existentes.
- **Archivos y commit:** Ninguno. `src/screens/HomeScreen.js` quedó sin modificaciones durante esta interacción.
- **Verificación:** No se realizaron pruebas porque únicamente se evaluó una propuesta visual.
- **Aprendizaje:** Comprendí que la ubicación del conductor puede mostrarse en un mapa de fondo sin necesidad de cambiar la lógica del GPS, y que es conveniente separar los cambios de interfaz de los cambios funcionales.

---

### Entrada #104

- **Fecha:** 2026-11-10
- **Integrante:** Fabian Alexander Chirivi
- **Herramienta:** ChatGPT (OpenAI)
- **Objetivo:** Implementar una función independiente para calcular las tarifas de los viajes, la comisión de la plataforma y las ganancias del conductor.
- **Prompt:**

```text
listo hagamos el calculatefare
```

- **Resumen de la respuesta:** La IA revisó la rama `developer` del repositorio para comprobar si existía una implementación de `calculateFare`. Al no encontrarla, proporcionó el código de una función que recibe distancia, duración, tarifa base, precio por kilómetro, precio por minuto, comisión y tarifa mínima. La función valida los valores, calcula el precio total, aplica la comisión y devuelve la ganancia del conductor en pesos enteros.
- **Qué se usó / modificó / descartó:** Se proporcionó el código para crear `calculateFare.js`. Las tarifas se dejaron como parámetros configurables porque todavía no se habían confirmado los valores oficiales del PDF. Se propuso una prueba con 8,5 km, 22 minutos y una comisión del 20 %, utilizando valores ilustrativos para obtener una tarifa de $19.200 y una ganancia de $15.360. No se modificaron HomeScreen, Firebase ni el GPS.
- **Archivos y commit:** `src/utils/calculateFare.js` — creación propuesta. Commit pendiente de confirmar.
- **Verificación:** La prueba matemática fue planteada, pero no se confirmó su ejecución en el proyecto.
- **Aprendizaje:** Comprendí cómo separar el cálculo de tarifas de la interfaz y de la API de solicitudes. También aprendí a calcular la comisión de la plataforma y la ganancia neta del conductor, y la importancia de utilizar las tarifas oficiales del proyecto.

