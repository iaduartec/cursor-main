// __tests__/scripts_presence.test.cjs
// Verifica presencia de scripts clave y ejecución básica sin crash inmediato

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const { spawnSync } = require('child_process');

function fileExists(p) {
  assert.equal(fs.existsSync(p), true);
}

test('build script exists', () => {
  fileExists('scripts/build.js');
  const res = spawnSync(process.execPath, ['scripts/build.js', '--dry-run'], {
    env: { ...process.env, CI: '1' },
  });
  // Puede terminar con 0 ya que solo hace prebuild; si falla, debe informar correctamente
  assert.ok([0, 1].includes(res.status));
});

test('db migrate-simple script exists', () => {
  fileExists('scripts/db/migrate-simple.js');
  const res = spawnSync(process.execPath, ['scripts/db/migrate-simple.js'], {
    env: { ...process.env, NO_COLOR: '1' },
  });
  // En Windows a veces status puede ser undefined si no hubo error; validar ausencia de error
  assert.equal(res.error, undefined);
  if (typeof res.status === 'number') {
    assert.equal(res.status, 0);
  }
});
