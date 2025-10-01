# Documentación de Plataforma de Búsqueda de Videos de YouTube con Geolocalización

## Información del Proyecto
| Detalle | Valor |
| :--- | :--- |
| **Institución** | Tecnológico Nacional de México, Instituto Tecnológico de Oaxaca |
| **Materia** | Integración De Procesos De Desarrollo De Software |
| **Grupo** | 9SA |
| **Actividad** | Anteproyecto de software para plataforma de búsqueda de videos de YouTube con geolocalización |
| **Docente** | Espinosa Pérez Jacob |
| **Fecha** | 22 de septiembre de 2025 |

### Estudiantes
* Romero Flores Brian Michelle - 21160775
* Pacheco Solorzano Mauricio – 21160745
* Hernández Ruiz Kevin Eduardo – 21160665
* Sosa Perera Carlos Alberto – 21160801

---

## 💡 Introducción
Este documento presenta el proyecto para el desarrollo de una **API Web** de búsqueda y reproducción de videos de YouTube con filtros geográficos específicos para México, en el estado de Oaxaca, región de Valles Centrales.

El objetivo principal es ofrecer una solución que permita a desarrolladores y usuarios de Valles Centrales encontrar **contenido relevante y localizado** sobre su folclor. La API utilizará la geolocalización del usuario, el código del estado y la región para asegurar que los resultados de búsqueda se adapten a la ubicación específica, buscando videos con alta relevancia en un radio de **10 kilómetros**.

## ❌ 1. Planteamiento del Problema
Los usuarios de YouTube en los Valles Centrales, Oaxaca, tienen dificultad para encontrar contenido relevante sobre su localidad. Cuando un usuario busca contenido específico, el algoritmo de YouTube a menudo presenta resultados globales, populares o genéricos que no se ajustan a su ubicación. Esto obliga a los usuarios a navegar manualmente a través de miles de videos irrelevantes, una tarea que puede ser frustrante y consumir mucho tiempo.

Esta limitación afecta la experiencia del usuario promedio y crea una barrera considerable para el talento local y los pequeños negocios, cuyo contenido queda opacado por el volumen masivo de videos globales, impidiendo que su audiencia local los descubra y provocando que se pierdan importantes oportunidades de conexión social y crecimiento económico a nivel local. La incapacidad de filtrar el contenido por ubicación limita la difusión de información, las actividades culturales y las noticias locales.

## ✅ 2. Justificación

### 2.1 Análisis de Viabilidad

#### Viabilidad Técnica
Existe la API de YouTube Data, que es robusta y está bien documentada, y se puede integrar con una API de geolocalización (como Google Geolocation API) para crear el filtro de búsqueda por área específica, permitiendo mostrar videos que han sido geolocalizados en un área específica.

#### Viabilidad Operativa
La API no requerirá cambios significativos en el comportamiento de los usuarios finales, ya que los desarrolladores son quienes la implementarán como una herramienta para mejorar la experiencia de búsqueda que los usuarios ya conocen. Una vez en funcionamiento, requerirá un mantenimiento mínimo, principalmente para asegurar que la integración con la API de YouTube funcione correctamente.

### 2.2 Limitaciones del Proyecto
* **Dependencia de API de terceros**: El proyecto depende directamente de la API de Datos de YouTube, por lo que cualquier cambio en sus términos de servicio, cuotas o funcionalidades afectará directamente a la API que se desarrollará.
* **Limitación técnica**: La arquitectura del proyecto se limitará al **entorno Web**.
* **Funcionalidades excluidas**: La API se limitará estrictamente a la **búsqueda y reproducción de videos**. No se incluirán funcionalidades como la carga de videos, la gestión de comentarios, las suscripciones, la creación de listas de reproducción, o la visualización del historial de reproducciones.
* **Limitaciones de cuota**: El uso de la API estará restringido por la cuota de consultas diarias establecidas por Google, por lo que para un uso a gran escala, se requerirá un plan de pago.

---

## 🛠️ 3. Requerimientos

### 3.1 Requerimientos Funcionales (RF)

| ID | Requerimiento | Descripción | Prioridad |
| :--- | :--- | :--- | :--- |
| **RF1** | Búsqueda de videos por ubicación | Permitir buscar videos de YouTube filtrando por coordenadas de latitud y longitud, con un radio de búsqueda de **10 km**, para mostrar contenido relevante de los Valles Centrales, Oaxaca. | Alta |
| **RF2** | Filtro por país | Limitar los resultados de búsqueda a videos relevantes únicamente para el estado de Oaxaca en los Valles Centrales, utilizando el código del estado y la región. | Alta |
| **RF3** | Reproducción de video | Proporcionar los videos encontrados en un formato que permita su reproducción a través de una URL o un reproductor multimedia. | Alta |
| **RF4** | Manejo de parámetros | Aceptar y procesar parámetros de entrada como el término de búsqueda, la ubicación (coordenadas) y el radio de búsqueda de **10 km**. | Alta |

### 3.2 Requerimientos No Funcionales (RNF)

| ID | Requerimiento | Descripción | Prioridad |
| :--- | :--- | :--- | :--- |
| **RNF1** | Documentación clara | Contar con una documentación clara y comprensible para facilitar su integración por parte de los desarrolladores. | Alta |
| **RNF2** | Respuestas estándar | Devolver los resultados de búsqueda en un formato **JSON** estructurado y consistente. | Alta |
| **RNF3** | Escalabilidad | Estar diseñada para manejar un gran volumen de solicitudes sin comprometer su rendimiento. | Media |
| **RNF4** | Arquitectura Web | Estar orientada exclusivamente a plataformas web. | Alta |
| **RNF5** | Autenticación segura | Implementar medidas de seguridad para proteger las claves de la API de Google y garantizar que las peticiones sean seguras. | Alta |
| **RNF6** | Protección de datos | No almacenar información personal de los usuarios para cumplir con las normativas de privacidad. | Alta |

---

## ⚡ 4. Enfoque Metodológico
Se adoptará la metodología ágil **Scrum** para la gestión y desarrollo del proyecto. Esta metodología permitirá adaptarnos rápidamente a las necesidades cambiantes, mejorar la comunicación entre el equipo de desarrollo y entregar valor de manera continua y eficiente.

### 4.1. Historias de Usuario (Product Backlog)
| ID | Historia de Usuario | Usuario | Prioridad | Riesgo | Descripción | Criterios de Aceptación |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **001** | Búsqueda por ubicación | Cliente | Alto | Alto | Como usuario, quiero buscar videos de YouTube filtrando por ubicación para obtener contenido relevante cercano a mi ubicación actual. | Aceptar coordenadas. / Devolver videos dentro del radio de **10 km**. / Los resultados deben estar ordenados por relevancia y/o fecha de publicación. |
| **002** | Filtro de búsqueda | Cliente | Alto | Alto | Como usuario, quiero limitar los resultados de búsqueda a videos del estado de Oaxaca, específicamente de los Valles Centrales, para visualizar solo información cultural y relevante a mi región. | Aplicar filtro por región geográfica o código de estado. / Los videos mostrados deben estar geolocalizados en los Valles Centrales de Oaxaca. / La API debe permitir combinar este filtro con el término de búsqueda del usuario. |
| **003** | Reproducción de video | Cliente | Alto | Alto | Como usuario, quiero reproducir los videos encontrados mediante un enlace directo o un reproductor integrado para poder ver el contenido sin salir de la plataforma. | Cada video debe incluir una URL válida de reproducción. / El sistema debe ofrecer la opción de abrir el video en un reproductor integrado. / La experiencia de reproducción debe ser fluida (sin errores de carga). |
| **004** | Parámetros en la API | Desarrollador | Alto | Alto | Como desarrollador, quiero enviar parámetros como término de búsqueda, ubicación y radio de búsqueda para personalizar y controlar los resultados obtenidos. | La API debe aceptar al menos tres parámetros: término de búsqueda, latitud/longitud y radio. / El sistema debe validar los parámetros antes de procesar la consulta. / Si un parámetro es inválido o no se envía, la API debe devolver un mensaje de error claro. |
| **005** | Filtros adicionales | Cliente | Alto | Medio | Como usuario, quiero aplicar filtros adicionales (fecha de publicación, relevancia o número de vistas) para encontrar videos que se ajusten mejor a mis necesidades. | El sistema debe permitir seleccionar al menos un filtro antes de mostrar los resultados. / Cuando se aplique un filtro, los resultados deben actualizarse en tiempo real con los criterios seleccionados. / Si no existen videos que cumplan con el filtro, el sistema debe mostrar un mensaje de “No se encontraron videos con este criterio”. |
| **006** | Información del video | Cliente | Alto | Medio | Como usuario, quiero visualizar información básica del video (título, canal, número de vistas, fecha de publicación) junto con el resultado de búsqueda para decidir rápidamente cuál reproducir. | Cada resultado debe mostrar título, canal, vistas y fecha. / La información mostrada debe coincidir con la información oficial de YouTube. / En caso de que falte algún dato (ejemplo: vistas ocultas), el sistema debe manejarlo sin errores mostrando un indicador como “No disponible”. |
| **007** | Compartir video | Cliente | Medio | Bajo | Como usuario, quiero compartir los videos encontrados en redes sociales o por enlace directo, para mostrar a otros el contenido localizado. | Cada resultado debe incluir un botón de “Compartir”. / Al dar clic en “Compartir”, debe generarse un enlace directo al video de YouTube. / El sistema debe permitir copiar el enlace o enviarlo mediante opciones rápidas (ejemplo: WhatsApp, Facebook, correo electrónico). |
| **008** | Registro de usuario | Cliente | Alto | Alto | Como usuario, quiero registrarme en la plataforma usando mi correo electrónico y contraseña, para poder acceder de forma personalizada al buscador. | El sistema debe validar que el correo no esté ya registrado. / La contraseña debe cumplir con requisitos mínimos de seguridad (ej. 8 caracteres, mayúscula, número). / Si el registro es exitoso, debe redirigir al usuario a la pantalla principal. / Si hay error, debe mostrar un mensaje claro (ej. “Correo ya registrado”). |
| **009** | Inicio de sesión | Cliente | Alto | Alto | Como usuario, quiero iniciar sesión con mis credenciales registradas, para poder acceder a mis búsquedas recientes y configuraciones personalizadas. | El usuario debe ingresar correo y contraseña válidos. / Si las credenciales son correctas, debe mostrar la pantalla principal con su perfil cargado. / Si son incorrectas, debe mostrar el mensaje “Correo o contraseña inválidos”. |
| **010** | Recuperar contraseña | Cliente | Alto | Alto | Como usuario, quiero poder recuperar mi contraseña en caso de olvidarla, para no perder el acceso a la plataforma. | El usuario debe poder establecer una nueva contraseña y usarla en su próximo inicio de sesión. |
| **011** | Guardar favoritos | Cliente | Medio | Bajo | Como usuario, quiero que mis videos favoritos se guarden en mi perfil, para recuperarlos en cualquier dispositivo donde inicie sesión. | Al iniciar sesión en cualquier dispositivo, el sistema debe cargar favoritos del usuario. / Debe existir la opción de borrar un video de favoritos. |
| **012** | Inicio de sesión con Google | Cliente | Alto | Alto | Como usuario, quiero iniciar sesión con una cuenta de Google, para acceder más rápido sin necesidad de registro manual. | El sistema debe permitir autenticación mediante OAuth de Google. / Si es la primera vez que entra con Google, debe registrarlo automáticamente en la plataforma. / Si ya existe, debe redirigirlo a su perfil sin pasos adicionales. |

### 4.2. Plan de Trabajo (Sprints)
| Sprint | Actividades | Responsables | Fecha de Inicio | Fecha de Finalización | Duración (Días) | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sprint 1** | - Elaboración de requerimientos funcionales y no funcionales. / - Creación de historias de usuario. / - Diseño de diagramas UML, E-R y relacional. / - Diseño UX-UI. / - Inicio de la bitácora. | Mauricio, Kevin, Carlos, Brian. | 20/09/2025 | 30/09/2025 | 10 | En Proceso |
| **Sprint 2** | - Desarrollo del módulo de inicio de sesión. / - Creación de API para autenticación. / - Implementación de interfaz de inicio de sesión. / - Implementación del modelo de base de datos. | Mauricio, Kevin, Carlos, Brian. | 01/10/2025 | 16/10/2025 | 15 | En Proceso |
| **Sprint 3** | - Integración y consumo de la API de YouTube. / - Pruebas de reproducción de videos. | Mauricio, Kevin, Carlos, Brian. | 17/10/2025 | 30/10/2025 | 13 | En Proceso |
| **Sprint 4** | - Integración de la API de geolocalización. / - Implementación de filtros por código de país y estado. | Mauricio, Kevin, Carlos, Brian. | 31/10/2025 | 12/11/2025 | 12 | En Proceso |
| **Sprint 5** | - Creación de la API de búsqueda principal. / - Integración de todas las funcionalidades. / - Pruebas finales y documentación. | Mauricio, Kevin, Carlos, Brian. | 13/11/2025 | 05/12/2025 | 22 | En Proceso |

---

## 🎨 Diseño UI/UX
Puedes visualizar el diseño en el siguiente enlace:
[Diseños en Figma](https://www.figma.com/proto/PAJOEq0nK6mXi4uzOmQgAa/API_YOUTUBE?node-id=1-3149&t=w0FBCGQir9JpiJrU-1)
