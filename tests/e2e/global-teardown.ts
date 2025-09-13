import fs from 'fs';
import path from 'path';

export default async function globalTeardown() {
  const pidPath = path.resolve(__dirname, '../../intranet-scaffold/.playwright-dev.pid');
  try {
    if (fs.existsSync(pidPath)) {
      const pid = Number(fs.readFileSync(pidPath, 'utf8'));
      if (pid) {
        try {
          process.kill(pid);
        } catch (e) {
          // ignore
        }
      }
      fs.unlinkSync(pidPath);
    }
  } catch (e) {
    // ignore
  }
}
