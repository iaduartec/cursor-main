# Checklist para eliminar el team "Equipo duartec" en Vercel

IMPORTANTE: eliminar un team es irreversible. Sigue estos pasos con una cuenta Owner y comprueba todo antes de confirmar.

1) Preparación
- Accede a https://vercel.com y selecciona el equipo "Equipo duartec".
- Asegúrate de que la cuenta con la que trabajas es Owner del team.
- Comunica a colaboradores la ventana de mantenimiento.

2) Crear backups y ramas de seguridad
- Asegura que el código crítico esté en sus repositorios remotos (GitHub/GitLab).
- Exporta o anota configuraciones importantes (Environment Variables, Domains, Integrations).
- Crea una rama de respaldo si vas a tocar historial (localmente):

```powershell
git checkout main
git branch backup-before-team-delete
```

3) Transferir o eliminar Projects
- Para cada proyecto del team:
  - Project → Settings → General → Transfer
  - O: Project → Settings → Danger Zone → Delete Project (si quieres eliminarlo).
- Si transfieres, introduce el username o team destino y confirma.

4) Dominios
- Team Settings → Domains: para cada dominio:
  - Transferir a otra cuenta (si aplica) o eliminar la entrada.
  - Si hay DNS configurado, anota entradas para reconfigurar en destino.

5) Integraciones y tokens
- Team Settings → Integrations: revoca o desinstala integraciones (GitHub, Slack, Cloudflare, etc.).
- Team Settings → Tokens: revoca todos los tokens personales o de integración.
- Si usas CI (GitHub Actions), actualiza los secrets para apuntar a la nueva cuenta/team.

6) Billing
- Team Settings → Billing: cancelar subscripciones y quitar métodos de pago si aplican.
- Descarga invoices si necesitas registros contables.

7) Revisión final
- Comprueba que no quedan proyectos importantes en el team.
- Confirma que dominios han sido transferidos o cancelados.
- Asegúrate de haber revocado tokens e integraciones.

8) Eliminar team
- Team Settings → General → Danger Zone → Delete Team
- Sigue las confirmaciones (Vercel pedirá que escribas el nombre del team o confirmes).

9) Post-eliminación
- Verifica que los proyectos transferidos funcionan en la nueva cuenta.
- Reconfigura DNS/domains si los transferiste.
- Re-emitir tokens si necesitas automatizaciones en la nueva cuenta/team.

10) Recuperación (si algo sale mal)
- Si eliminaste por error y necesitas restaurar: contacta al soporte de Vercel inmediatamente (https://vercel.com/support).
- Ten a mano backups de repositorios y snapshot de configuraciones para recrear proyectos.

---

Notas técnicas / CLI útiles
- Listar equipos con la CLI (requiere vercel CLI instalada y token con permisos):

```powershell
vercel teams ls
vercel projects ls --team <team-id>
```

- No todos los flujos (transferir proyectos) están disponibles o son cómodos desde la CLI; el UI es preferible para transferencias.

---

Si quieres, puedo:
- Generar un script paso a paso para transferir proyectos específicos (añade el nombre del proyecto y el destino),
- O bien, guiarte en cada pantalla del Dashboard mientras lo haces.
