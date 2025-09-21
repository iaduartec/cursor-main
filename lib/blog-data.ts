export interface BlogPost {
  title: string;
  description: string;
  slug: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    title: 'Cómo elegir el sistema de videovigilancia ideal para tu negocio',
    description: 'Guía completa para definir el alcance y criterios técnicos para elegir un sistema de CCTV en una empresa. Incluye análisis de necesidades, cumplimiento legal, selección de cámaras y mantenimiento.',
    slug: 'videovigilancia-sistema-ideal',
    category: 'Seguridad',
    image: '/images/proyectos/CCTV.jpeg',
    date: '2024-12-31',
    readTime: '8 min',
    excerpt: 'La elección de un sistema de videovigilancia para tu empresa es una decisión estratégica que requiere un análisis detallado de necesidades, riesgos y requisitos técnicos...',
    content: `
# Cómo elegir el sistema de videovigilancia ideal para tu negocio

La elección de un sistema de videovigilancia para tu empresa es una decisión estratégica que requiere un análisis detallado de necesidades, riesgos y requisitos técnicos. En este artículo te guiamos a través de los criterios fundamentales para tomar la decisión correcta.

## 1. Definir necesidades y riesgos

### Zonas a cubrir
Antes de nada, identifica las áreas críticas de tu negocio:
- **Accesos principales y secundarios**: Control de entrada y salida
- **Perímetros**: Protección del exterior del edificio
- **Almacenes**: Control de inventario y seguridad
- **Zonas de público**: Áreas de atención al cliente
- **Centros de procesamiento de datos (CPD)**: Protección de infraestructura crítica

### Objetivos del sistema
Define claramente qué quieres lograr:
- **Disuasión**: Prevenir incidentes mediante la presencia visible de cámaras
- **Investigación**: Recopilar evidencia en caso de incidentes
- **Control de procesos**: Supervisar operaciones y flujos de trabajo
- **Conteo de personas**: Análisis de afluencia y ocupación
- **Control de colas**: Gestión de esperas en puntos de servicio

### Niveles de detalle requeridos
- **Reconocimiento de rostros**: Para identificación de personas
- **Lectura de matrículas**: Para control de vehículos
- **Visión general**: Para monitorización de áreas amplias

### Condiciones de iluminación
Evalúa las condiciones reales:
- **Día/noche**: Cambios en la iluminación natural
- **Contraluces**: Problemas con ventanas o luces externas
- **Faros de vehículos**: Interferencias en accesos vehiculares

## 2. Cumplimiento legal y privacidad (España)

### RGPD + LOPDGDD 3/2018
El cumplimiento legal es fundamental:

- **Principio de proporcionalidad**: Las medidas deben ser proporcionales al riesgo
- **Finalidad específica**: Define claramente el propósito del sistema
- **Carteles informativos**: Deben ser visibles y claros
- **Registro de actividad**: Mantén un registro del tratamiento de datos

### Periodo de conservación
- Ajusta la retención a la finalidad del sistema
- No conserves grabaciones más tiempo del necesario
- Documenta las políticas de retención

### Control de accesos
- **Acceso restringido**: Solo personal autorizado
- **Auditorías**: Registra quién accede y cuándo
- **Acuerdos de encargo**: Si hay terceros mantenedores

## 3. Selección de cámaras

### Formato y ubicación
- **Bullet/Domo**: Para interiores y exteriores, discretas y versátiles
- **PTZ**: Para seguimiento activo y cobertura de áreas amplias
- **Ojo de pez/Multisensor**: Para grandes áreas con menos puntos de instalación
- **Térmicas**: Para perímetros complejos y detección nocturna

### Resolución y óptica
- **4-8 MP**: Equilibrio entre detalle y coste
- **Focal y ángulo**: Calcula PPM (Pixels Per Meter) o PPF (Pixels Per Foot)
- **Zoom óptico**: Para áreas que requieren detalle variable

### Rendimiento nocturno
- **IR integrado**: Iluminación infrarroja para visión nocturna
- **Sensibilidad a baja luz**: Para entornos con poca iluminación
- **WDR real**: Para manejar contraluces y sombras

### Robustez
- **Grados IP/IK**: Protección contra agua y polvo
- **Temperatura de operación**: Para entornos extremos
- **Anti-vandálico**: Protección física contra daños
- **Alimentación PoE**: Simplifica la instalación

## 4. Grabación y red

### Arquitectura del sistema
- **NVRs redundantes**: Para mayor fiabilidad
- **VMS en servidor**: Para sistemas complejos
- **Grabación edge**: Como respaldo en la propia cámara

### Almacenamiento
Calcula según:
- Número de cámaras
- FPS (frames por segundo)
- Códec (H.265/H.264)
- Bitrate
- Días de retención
- Considera RAID y NAS para mayor seguridad

### Red y seguridad
- **VLAN dedicada**: Aísla el tráfico de videovigilancia
- **PoE con margen ≥25%**: Para futuras expansiones
- **Switches gestionables**: Para control y monitorización
- **QoS**: Prioriza el tráfico de video
- **Cifrado**: Protege los flujos de datos
- **Credenciales únicas**: Evita accesos no autorizados
- **Actualizaciones**: Mantén el firmware actualizado

## 5. Analítica y valor añadido

### Funciones avanzadas
- **Detección de intrusión**: Alerta cuando alguien cruza una línea virtual
- **Detección de merodeo**: Identifica comportamientos sospechosos
- **LPR/ANPR**: Lectura automática de matrículas
- **Conteo de personas**: Análisis de afluencia
- **Mapas de calor**: Visualización de patrones de movimiento

### Integraciones
- **Control de accesos**: Sincronización con sistemas de entrada
- **Alarma perimetral**: Integración con sensores de movimiento
- **Audio IP**: Para disuasión y comunicación

## 6. Mantenimiento

### Revisiones periódicas
- **Trimestral**: Enfoque y limpieza de ópticas
- **Verificación de grabación**: Comprueba que todo funcione correctamente
- **Salud de discos**: Monitorea SMART y estado de almacenamiento
- **Pruebas de exportación**: Verifica la funcionalidad de backup
- **Copias externas**: Mantén respaldos seguros
- **Parches de firmware**: Actualiza regularmente

### Alimentación ininterrumpida
- **SAI dimensionado**: Para cámaras, NVR y red
- **Tiempo de autonomía**: Calcula según tus necesidades

## 7. Criterios para comparar ofertas

### Calidad y rendimiento
- **Calidad de imagen**: Prueba en escenas reales
- **Garantía y soporte**: Verifica la cobertura
- **Escalabilidad**: El VMS debe crecer con tu negocio

### Costes totales
- **Licencias**: Incluye costes de software
- **Almacenamiento**: Calcula expansiones futuras
- **Mantenimiento**: Considera contratos anuales
- **Cumplimiento**: Verifica que cumpla RGPD/LOPDGDD

## Recomendación final

La elección de un sistema de videovigilancia debe basarse en un análisis exhaustivo de tus necesidades específicas. No te dejes llevar solo por el precio: considera el coste total de propiedad, la escalabilidad y el cumplimiento legal.

Recuerda que un sistema bien diseñado no solo protege tu negocio, sino que también puede aportar valor añadido a través de la analítica y la integración con otros sistemas de seguridad.

¿Necesitas ayuda para evaluar las opciones disponibles? Nuestro equipo de expertos puede asesorarte en la selección del sistema más adecuado para tu empresa.
    `
  },
  {
    title: 'Ventajas de la iluminación LED en instalaciones comerciales',
    description: 'Descripción de beneficios técnicos, económicos y ambientales de migrar a LED y cómo especificar correctamente las instalaciones de iluminación comercial.',
    slug: 'iluminacion-led-comercial',
    category: 'Electricidad',
    image: '/images/proyectos/electricidad.jpeg',
    date: '2024-12-31',
    readTime: '7 min',
    excerpt: 'La migración a tecnología LED en instalaciones comerciales representa una de las inversiones más rentables que puede realizar una empresa...',
    content: `
# Ventajas de la iluminación LED en instalaciones comerciales

La migración a tecnología LED en instalaciones comerciales representa una de las inversiones más rentables que puede realizar una empresa. En este artículo analizamos los beneficios técnicos, económicos y ambientales, además de proporcionar pautas para una correcta especificación.

## 1. Eficiencia y coste operativo

### Mayor eficiencia energética
La tecnología LED ofrece una eficiencia lumínica significativamente superior:
- **Lúmenes por vatio (lm/W)**: Los LED modernos alcanzan 150-200 lm/W, frente a los 15-20 lm/W de las lámparas incandescentes
- **Reducción del consumo**: Disminuciones del 60-80% en la factura eléctrica
- **Menor carga térmica**: Reducción del calor generado en espacios climatizados

### Vida útil extendida
- **L70/B50**: Los LED mantienen el 70% de su flujo lumínico después de 50.000 horas de uso
- **Menos sustituciones**: Reducción drástica de costes de mantenimiento
- **Fiabilidad**: Menor probabilidad de fallos súbitos

### Retorno de inversión
- **Periodo de amortización**: Típicamente entre 2-4 años
- **Ahorro acumulado**: Significativo a largo plazo
- **Valor de la propiedad**: Incremento del valor del inmueble

## 2. Calidad de luz y confort

### Temperatura de color (CCT)
- **3000-4000 K**: Ideal para retail y oficinas
- **Ajuste dinámico**: Adaptación según la hora del día
- **Consistencia**: Uniformidad en toda la instalación

### Índice de reproducción cromática (CRI)
- **≥80**: Para aplicaciones generales
- **≥90**: Para retail, arte y aplicaciones críticas
- **Mejor percepción**: Los colores se ven más naturales

### Control del deslumbramiento
- **UGR (Unified Glare Rating)**: Control en oficinas y espacios de trabajo
- **Difusores**: Para reducir molestias visuales
- **Posicionamiento**: Optimización de la ubicación de las luminarias

### Control del parpadeo
- **Drivers de calidad**: Bajo flicker para aplicaciones de video
- **Salud visual**: Reducción de fatiga ocular
- **Compatibilidad**: Funcionamiento con cámaras y equipos electrónicos

## 3. Control y gestión inteligente

### Sistemas de regulación
- **DALI**: Protocolo estándar para control digital
- **1-10V**: Control analógico simple y eficaz
- **PWM**: Modulación por ancho de pulso para dimming

### Sensores y automatización
- **Presencia**: Encendido automático según ocupación
- **Luz natural**: Ajuste automático según la iluminación exterior
- **Escenas horarias**: Programación según el uso del espacio

### Integración BMS
- **Sistemas de gestión**: Control centralizado de edificios
- **Monitorización**: Seguimiento del consumo en tiempo real
- **Mantenimiento predictivo**: Alertas automáticas de fallos

## 4. Seguridad, normativa y fiabilidad

### Cumplimiento normativo
- **REBT**: Reglamento Electrotécnico de Baja Tensión
- **Instrucciones técnicas**: Aplicación de normativas específicas
- **Certificaciones**: Marcado CE y otras homologaciones

### Protección ambiental
- **Grados IP/IK**: Protección contra agua, polvo e impactos
- **Temperatura**: Funcionamiento en rangos amplios
- **Vibraciones**: Resistencia a entornos industriales

### Fotometría y distribución
- **Curvas IES/LDT**: Archivos de distribución lumínica
- **Simulación**: Análisis previo del rendimiento
- **Optimización**: Mejor aprovechamiento de la luz

### Compatibilidad electromagnética
- **Factor de potencia**: ≥0.9 para eficiencia energética
- **Armónicos**: Cumplimiento de límites establecidos
- **Interferencias**: No afecta a otros equipos

## 5. Sostenibilidad y responsabilidad ambiental

### Reducción de huella de carbono
- **Menor consumo**: Reducción directa de emisiones
- **Energía renovable**: Compatibilidad con fuentes limpias
- **Certificaciones**: LEED, BREEAM y otros estándares

### Gestión de residuos
- **RAEE**: Reciclaje de aparatos eléctricos y electrónicos
- **Vida útil extendida**: Menor generación de residuos
- **Materiales**: Uso de componentes reciclables

### Eficiencia de recursos
- **Menos mantenimiento**: Reducción de desplazamientos
- **Durabilidad**: Mayor vida útil de los equipos
- **Escalabilidad**: Fácil expansión de la instalación

## 6. Metodología de migración

### Auditoría lumínica inicial
- **Mediciones**: Niveles de iluminancia actuales
- **Análisis**: Identificación de deficiencias
- **Documentación**: Estado actual de la instalación

### Propuesta técnica
- **Niveles objetivo**: Según normativas y usos
- **Simulación**: Análisis del rendimiento esperado
- **Pilotos**: Pruebas en zonas críticas

### Plan de implementación
- **Fases**: Sustitución gradual por áreas
- **Minimización de interrupciones**: Planificación del trabajo
- **Verificación**: Mediciones post-instalación

## 7. Consideraciones técnicas específicas

### Selección de luminarias
- **Tipo de LED**: COB, SMD, chip-on-board
- **Ópticas**: Reflectores, lentes y difusores
- **Disipación térmica**: Gestión eficiente del calor

### Drivers y alimentación
- **Corriente constante**: Para LED de potencia
- **Protecciones**: Sobretensión, cortocircuito, temperatura
- **Eficiencia**: Drivers de alta eficiencia (>90%)

### Control de temperatura
- **Disipadores**: Materiales y diseño óptimo
- **Ventilación**: En entornos cerrados
- **Monitorización**: Sensores de temperatura integrados

## 8. Casos de éxito y aplicaciones

### Retail y comercio
- **Exposición de productos**: Mejor presentación visual
- **Áreas de paso**: Iluminación uniforme y atractiva
- **Escaparates**: Destacar productos con luz direccional

### Oficinas y espacios de trabajo
- **Puestos de trabajo**: Cumplimiento de normativas
- **Salas de reuniones**: Ambiente profesional y confortable
- **Zonas comunes**: Iluminación funcional y acogedora

### Almacenes e industrias
- **Alta eficiencia**: Máximo aprovechamiento de la luz
- **Durabilidad**: Resistencia a entornos exigentes
- **Mantenimiento**: Reducción de intervenciones

## Conclusión

La migración a iluminación LED en instalaciones comerciales no es solo una mejora tecnológica, sino una inversión estratégica que aporta beneficios tangibles en múltiples ámbitos:

- **Económicos**: Reducción significativa de costes operativos
- **Técnicos**: Mayor calidad de luz y control avanzado
- **Ambientales**: Reducción de la huella de carbono
- **Operativos**: Menor mantenimiento y mayor fiabilidad

La clave del éxito está en una correcta especificación técnica, una implementación profesional y un mantenimiento preventivo adecuado. El resultado es una instalación que no solo ilumina, sino que contribuye al éxito del negocio.

¿Estás considerando migrar tu instalación a LED? Nuestro equipo de expertos puede asesorarte en la planificación, diseño e implementación de tu proyecto de iluminación comercial.
    `
  },
  // Añadiré más artículos aquí...
];

// Función para obtener un post por slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Función para obtener todos los posts
export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

// Función para obtener posts por categoría
export function getPostsByCategory(category: string): BlogPost[] {
  if (category === 'Todas') { return blogPosts; }
  return blogPosts.filter(post => post.category === category);
}

// Función para obtener categorías únicas
export function getUniqueCategories(): string[] {
  const categories = blogPosts.map(post => post.category);
  return categories.filter((category, index) => categories.indexOf(category) === index);
}
