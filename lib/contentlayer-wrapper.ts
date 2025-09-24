/**
 * Wrapper centralizado para acceder a los datos generados por Contentlayer sin
 * provocar warnings de export map ni depender de su existencia en tiempo de build.
 *
 * Estrategia:
 *  - Lazy load con import dinámico usando un specifier oculto dentro de una constante.
 *  - Cache en memoria para evitar múltiples imports.
 *  - Respeta SKIP_CONTENTLAYER=1 devolviendo arrays vacíos.
 *  - Si la carga falla (no existe .contentlayer/generated), retorna arrays vacíos.
 */

type CLBlog = any; // Tipos laxos para no forzar dependencia dura
type CLServicio = any;
type CLProject = any;
type CLStream = any;

interface CLState {
    loaded: boolean;
    loading?: Promise<void> | null;
    blogs: CLBlog[];
    servicios: CLServicio[];
    projects: CLProject[];
    streams: CLStream[];
}

const state: CLState = {
    loaded: false,
    loading: null,
    blogs: [],
    servicios: [],
    projects: [],
    streams: [],
};

async function loadOnce(): Promise<void> {
    if (state.loaded) return;
    if (state.loading) {
        await state.loading; return;
    }
    state.loading = (async () => {
        if (process.env.SKIP_CONTENTLAYER === '1') {
            state.loaded = true; return;
        }
        try {
            // Especifier constante pero aislado aquí; alias webpack puede redirigir.
            // Ofuscamos el specifier para que webpack no intente validar export map estáticamente
            const SPEC = 'contentlayer/' + 'generated';
            const mod = await import(SPEC).catch(() => ({} as any));
            state.blogs = Array.isArray(mod.allBlogs) ? mod.allBlogs : [];
            state.servicios = Array.isArray(mod.allServicios) ? mod.allServicios : [];
            state.projects = Array.isArray(mod.allProjects) ? mod.allProjects : [];
            state.streams = Array.isArray(mod.allStreams) ? mod.allStreams : [];
        } catch (e) {
            // Silencioso: fallback ya son arrays vacíos
            if (process.env.DEBUG_CONTENTLAYER_WRAPPER) {
                console.warn('[contentlayer-wrapper] load error', e);
            }
        } finally {
            state.loaded = true;
        }
    })();
    await state.loading;
}

export async function getBlogs(): Promise<CLBlog[]> {
    await loadOnce();
    return state.blogs;
}
export async function getServicios(): Promise<CLServicio[]> {
    await loadOnce();
    return state.servicios;
}
export async function getProjects(): Promise<CLProject[]> {
    await loadOnce();
    return state.projects;
}
export async function getStreams(): Promise<CLStream[]> {
    await loadOnce();
    return state.streams;
}

export function __resetContentlayerWrapperForTests() {
    state.loaded = false;
    state.loading = null;
    state.blogs = [];
    state.servicios = [];
    state.projects = [];
    state.streams = [];
}
