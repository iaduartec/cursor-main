const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const headerPath = path.join(__dirname, '..', '..', 'components', 'header.tsx');
const source = fs.readFileSync(headerPath, 'utf8');

function assertIncludes(text, snippet, message) {
  assert.ok(
    text.includes(snippet),
    message || `Expected header.tsx to include: ${snippet}`
  );
}

describe('Header component source', () => {
  it('contains company branding', () => {
    assertIncludes(source, 'Duartec', 'Header should mention the company name');
    assertIncludes(source, 'Instalaciones Informáticas', 'Header should mention the business line');
  });

  it('contains navigation links', () => {
    const expectedLinks = ['Inicio', 'Servicios', 'Proyectos', 'Streaming 24h', 'Blog', 'Quiénes somos', 'Contacto'];
    for (const link of expectedLinks) {
      assertIncludes(source, link, `Header should contain navigation link text: ${link}`);
    }
  });

  it('contains contact information', () => {
    assertIncludes(source, '947 256 430', 'Header should display the phone number');
    assertIncludes(source, 'info@duartec.es', 'Header should display the email address');
  });
});
