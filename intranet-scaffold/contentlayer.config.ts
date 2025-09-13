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
