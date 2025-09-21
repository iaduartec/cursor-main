const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const footerPath = path.join(__dirname, '..', '..', 'components', 'footer.tsx');
const source = fs.readFileSync(footerPath, 'utf8');

function assertIncludes(text, snippet, message) {
  assert.ok(
    text.includes(snippet),
    message || `Expected footer.tsx to include: ${snippet}`
  );
}

describe('Footer component source', () => {
  it('mentions the company', () => {
    assertIncludes(source, 'Duartec', 'Footer should mention the company name');
    assertIncludes(source, 'Instalaciones Informáticas', 'Footer should mention the business line');
  });

  it('lists main services', () => {
    const services = ['Informática', 'Videovigilancia', 'Sonido Profesional', 'Electricidad'];
    for (const service of services) {
      assertIncludes(source, service, `Footer should list the ${service} service`);
    }
  });

  it('shows contact information', () => {
    assertIncludes(source, '947 256 430', 'Footer should display the phone number');
    assertIncludes(source, 'info@duartec.es', 'Footer should display the email address');
  });

  it('contains legal links section', () => {
    const legalLinks = ['Aviso legal', 'Política de privacidad', 'Política de cookies', 'Condiciones de uso'];
    for (const link of legalLinks) {
      assertIncludes(source, link, `Footer should include legal link text: ${link}`);
    }
  });
});
