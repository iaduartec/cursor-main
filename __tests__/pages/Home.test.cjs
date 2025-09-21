const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const homePath = path.join(__dirname, '..', '..', 'app', 'page.tsx');
const source = fs.readFileSync(homePath, 'utf8');

function assertIncludes(text, snippet, message) {
  assert.ok(
    text.includes(snippet),
    message || `Expected page.tsx to include: ${snippet}`
  );
}

describe('Home page source', () => {
  it('contains the hero messaging', () => {
    assertIncludes(
      source,
      'Soluciones integrales en informática, videovigilancia, sonido y electricidad',
      'Home hero should describe the core services'
    );
    assertIncludes(source, 'Solicita información', 'Home page should offer a call to action');
  });

  it('lists the main services', () => {
    const services = ['Informática', 'Videovigilancia', 'Sonido Profesional', 'Electricidad'];
    for (const service of services) {
      assertIncludes(source, service, `Home page should mention the ${service} service`);
    }
  });

  it('references the service area', () => {
    assertIncludes(source, 'Burgos', 'Home page should mention Burgos');
    assertIncludes(source, 'Castilla y León', 'Home page should mention Castilla y León');
  });
});
