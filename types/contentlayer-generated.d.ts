declare module 'contentlayer/generated' {
  // Minimal ambient types for Contentlayer generated output used in scripts.
  // Export the common collections and basic types as 'any' to satisfy TS checks.
  export const allPosts: any[];
  export const allBlogs: any[];
  export const allProyectos: any[];
  export const allServicios: any[];
  export const allStreams: any[];
  export const allDocs: any[];

  export type Post = any;
  export type Blog = any;
  export type Proyecto = any;
  export type Servicio = any;
  export type Stream = any;

  export function canonicalSlugFor(doc: any): string;

  const _default: any;
  export default _default;
}
