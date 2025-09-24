// Carga centralizada de variables de entorno para evitar duplicación en múltiples módulos.
// Se ejecuta una sola vez gracias a la caché de módulos de Node.
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

if (!(globalThis as any).__ENV_LOADED_ONCE) {
    const envLocal = path.join(process.cwd(), '.env.local');
    const envFile = path.join(process.cwd(), '.env');
    try {
        if (fs.existsSync(envLocal)) {
            dotenv.config({ path: envLocal });
        } else if (fs.existsSync(envFile)) {
            dotenv.config({ path: envFile });
        }
    } catch (e) {
        if (process.env.DEBUG_ENV_LOAD) {
            console.warn('[load-env] error cargando .env', e);
        }
    }
    (globalThis as any).__ENV_LOADED_ONCE = true;
}
