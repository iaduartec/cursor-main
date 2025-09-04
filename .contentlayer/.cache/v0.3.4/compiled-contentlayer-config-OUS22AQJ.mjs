// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
var Servicio = defineDocumentType(() => ({
  name: "Servicio",
  filePathPattern: `servicios/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    slug: { type: "string", required: true },
    image: { type: "string", required: false },
    areaServed: { type: "string", required: false },
    hasOfferCatalog: { type: "boolean", required: false },
    faq: { type: "list", of: { type: "string" }, required: false },
    schema: { type: "json", required: false }
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/servicios/${doc.slug}` }
  }
}));
var Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: `blog/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string", required: true },
    slug: { type: "string", required: true },
    category: { type: "string", required: false },
    image: { type: "string", required: false },
    schema: { type: "json", required: false }
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/blog/${doc.slug}` }
  }
}));
var Legal = defineDocumentType(() => ({
  name: "Legal",
  filePathPattern: `legal/*.mdx`,
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true }
  },
  computedFields: {
    url: { type: "string", resolve: (doc) => `/legal/${doc.slug}` }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Servicio, Blog, Legal]
});
export {
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-OUS22AQJ.mjs.map
