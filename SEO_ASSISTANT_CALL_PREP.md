# PREPARACIÓN LLAMADA ASISTENTE SEO
# ID: asst_YQqYJMd5etspfoI00fJ1NRLU

## DATOS DEL NEGOCIO (business)
```json
{
  "name": "Duartec",
  "address": "Burgos, España",
  "phone": "+34 XXX XXX XXX",
  "website": "https://duartec.es",
  "description": "Empresa especializada en automatización industrial, domótica, iluminación LED, control de accesos, sistemas de seguridad e IoT"
}
```

## SLUGS INTERNOS DISPONIBLES (internal_slugs_available)
```json
[
  "/servicios/electricidad",
  "/servicios/informatica", 
  "/servicios/sonido",
  "/servicios/videovigilancia",
  "/proyectos/sistema-videovigilancia-cctv",
  "/proyectos/seguridad-red-empresarial",
  "/proyectos/datacenter-racks-servidores",
  "/blog/instalaciones-electricas-industriales",
  "/blog/seguridad-red-empresarial",
  "/blog/sistemas-audio-profesional",
  "/contacto",
  "/quienes-somos"
]
```

## EJEMPLO DE CONTENIDO PARA OPTIMIZAR
```json
{
  "title": "Instalaciones Eléctricas Industriales",
  "content": "En Duartec realizamos instalaciones eléctricas industriales completas. Nuestro equipo cuenta con amplia experiencia en el sector eléctrico, ofreciendo soluciones personalizadas para empresas de Burgos y alrededores.\n\nNuestros servicios incluyen:\n- Instalaciones de baja tensión\n- Sistemas de automatización\n- Iluminación LED industrial\n- Mantenimiento eléctrico preventivo\n\nContamos con certificaciones oficiales y seguimos todas las normativas vigentes para garantizar la seguridad en cada proyecto.",
  "article_slug": "instalaciones-electricas-industriales",
  "locale": "es-ES"
}
```

## CONFIGURACIÓN PARA LA LLAMADA

### Endpoint OpenAI correcto:
```javascript
const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system", 
      content: `Eres un editor SEO técnico. [INSTRUCCIONES COMPLETAS DEL ASISTENTE]`
    },
    {
      role: "user",
      content: JSON.stringify({
        business: {
          name: "Duartec",
          address: "Burgos, España", 
          website: "https://duartec.es",
          description: "Empresa especializada en automatización industrial, domótica, iluminación LED"
        },
        internal_slugs_available: ["/servicios/electricidad", "/servicios/informatica", ...],
        article: {
          title: "Instalaciones Eléctricas Industriales",
          content: "En Duartec realizamos instalaciones eléctricas...",
          article_slug: "instalaciones-electricas-industriales",
          locale: "es-ES"
        }
      })
    }
  ],
  temperature: 0.3,
  max_tokens: 4000
});
```

## INTEGRACIÓN CON NUESTRO SISTEMA

Ahora necesito actualizar nuestro endpoint para usar las instrucciones del asistente SEO.