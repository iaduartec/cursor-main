# Guía de contribución

Gracias por contribuir a Duartec Web.

## Flujo de trabajo
- Rama desde `main`: `feature/<tema>` o `fix/<bug>`
- Commits claros (convencionales recomendados)
- Antes de PR: `pnpm lint && pnpm type-check && pnpm test`

## Estándares
- TypeScript estricto
- ESLint + Prettier (ejecutar en pre-commit si tienes hooks)
- Tests unitarios para lógica y utilidades
- E2E (Playwright) para rutas públicas clave

## PR checklist
- [ ] Descripción del cambio y alcance
- [ ] Screenshots si hay UI
- [ ] Sin dependencias nuevas o justificadas en la descripción
- [ ] Pasa CI (lint, types, build, tests)
