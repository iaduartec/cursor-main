/**
Resumen generado automáticamente.

intranet-scaffold/contentlayer.config.ts

2025-09-13T06:20:07.375Z

——————————————————————————————
Archivo .ts: contentlayer.config.ts
Tamaño: 565 caracteres, 21 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { defineDocumentType, makeSource } from 'contentlayer/source-files';

const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: `blog/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    description: { type: 'string', required: false },
    slug: { type: 'string', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc: any) => `/blog/${doc.slug}` },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog],
});
