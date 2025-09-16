import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalTeardown() {
  const pidPath = path.resolve(
    __dirname,
    '../../intranet-scaffold/.playwright-dev.pid'
  );
  try {
    if (fs.existsSync(pidPath)) {
      const pid = Number(fs.readFileSync(pidPath, 'utf8'));
      if (pid) {
        try {
          process.kill(pid);
        } catch {
          // ignore
        }
      }
      fs.unlinkSync(pidPath);
    }
  } catch {
    // ignore
  }
}
