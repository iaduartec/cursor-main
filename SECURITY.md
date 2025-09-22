<!--
Resumen generado automáticamente.

SECURITY.md

2025-09-13T06:20:07.357Z

——————————————————————————————
Archivo .md: SECURITY.md
Tamaño: 619 caracteres, 22 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
-->
# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Mitigated Vulnerabilities

### esbuild Dev Server CORS Bypass (CVE-2024-47068)

- **Severity**: Moderate
- **Affected Package**: esbuild < 0.25.0
- **Mitigation Applied**: Force upgrade to esbuild@0.25.9 via pnpm overrides
- **Date Mitigated**: September 2025
- **Details**: The esbuild development server allowed any website to send requests to the dev server and read responses, potentially exposing sensitive information during development.

### Prototype Pollution in estree-util-value-to-estree

- **Severity**: Moderate
- **Affected Package**: estree-util-value-to-estree < 3.3.3
- **Mitigation Applied**: Force upgrade to estree-util-value-to-estree@3.4.0 via pnpm overrides
- **Date Mitigated**: September 2025
- **Details**: Malicious code could pollute the prototype of Object via the generated ESTree, potentially leading to security vulnerabilities.

**Note**: These mitigations use pnpm overrides as a temporary solution. The project continues to monitor upstream packages for official patches.

## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.
