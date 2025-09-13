/**
Resumen generado automáticamente.

contentlayer.config.ts

2025-09-13T06:20:07.369Z

——————————————————————————————
Archivo .ts: contentlayer.config.ts
Tamaño: 2214 caracteres, 70 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import { defineDocumentType, makeSource } from 'contentlayer/source-files';

const Servicio = defineDocumentType(() => ({
  name: 'Servicio',
  filePathPattern: `servicios/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    image: { type: 'string', required: false },
    areaServed: { type: 'string', required: false },
    hasOfferCatalog: { type: 'boolean', required: false },
    faq: { type: 'list', of: { type: 'string' }, required: false },
    schema: { type: 'json', required: false },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc: any) => `/servicios/${doc.slug}` },
  },
}));

const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: `blog/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    description: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    category: { type: 'string', required: false },
    image: { type: 'string', required: false },
    schema: { type: 'json', required: false },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc: any) => `/blog/${doc.slug}` },
  },
}));

const Legal = defineDocumentType(() => ({
  name: 'Legal',
  filePathPattern: `legal/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    slug: { type: 'string', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc: any) => `/legal/${doc.slug}` },
  },
}));

const Proyecto = defineDocumentType(() => ({
  name: 'Proyecto',
  filePathPattern: `proyectos/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    description: { type: 'string', required: false },
    slug: { type: 'string', required: true },
    category: { type: 'string', required: false },
    image: { type: 'string', required: false },
  },
  computedFields: {
    url: { type: 'string', resolve: (doc: any) => `/proyectos/${doc.slug}` },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Servicio, Blog, Legal, Proyecto],
});
