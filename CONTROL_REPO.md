# Sistema de Control de Repositorio

## 🎯 Flujo de Trabajo

Este repositorio está configurado para que yo tenga **control total** sobre el código local, y tú controles qué cambios se suben al remoto.

### 🔄 Actualización Automática

**Para actualizar tu repositorio local automáticamente:**

#### Opción 1: Script de PowerShell (Recomendado)

```powershell
.\Update-Repo.ps1
```

#### Opción 2: Comando directo

```bash
git update
```

#### Opción 3: Pasos manuales

```bash
git fetch origin
git rebase origin/main
```

### ✅ Confirmación de Cambios

**Solo tú decides cuándo subir cambios al remoto:**

```bash
git push
```

### 🤖 Autogeneración de Commits

**El sistema genera automáticamente mensajes de commit descriptivos:**

#### Commit automático completo

```bash
git autocommit
```

#### Solo generar mensaje (sin commit)

```bash
git genmsg
```

#### Usar script directamente

```powershell
# Ver mensaje generado sin hacer commit
.\Auto-Commit.ps1 -DryRun

# Hacer commit automático
.\Auto-Commit.ps1 -AutoCommit

# Commit con mensaje personalizado
.\Auto-Commit.ps1 -AutoCommit -CustomMessage "feat: nueva funcionalidad"
```

**Tipos de mensajes generados:**

- `feat:` - Nuevas funcionalidades o archivos de código
- `fix:` - Correcciones y actualizaciones
- `docs:` - Documentación y archivos de texto
- `style:` - Cambios de estilo (CSS, etc.)
- `config:` - Archivos de configuración
- `test:` - Archivos de pruebas
- `chore:` - Mantenimiento general

### 📋 Estados del Repositorio

- **🟢 Verde**: Todo sincronizado, listo para trabajar
- **🟡 Amarillo**: Cambios locales sin subir (esperando tu confirmación)
- **🔴 Rojo**: Conflictos o errores que requieren atención

### ⚠️ Reglas Importantes

1. **Nunca hagas push automático** - siempre confirma manualmente
2. **Si hay conflictos**, resuélvelos antes de continuar
3. **Guarda tu trabajo** antes de actualizar
4. **Si algo sale mal**, ejecuta `git status` para ver el estado

### 🛠️ Comandos Útiles

```bash
# Ver estado del repositorio
git status

# Ver cambios pendientes
git diff

# Ver historial reciente
git log --oneline -5

# Si hay problemas, resetear a estado remoto
git reset --hard origin/main
```

### 🤖 Mi Control

Yo me encargo de:

- ✅ Hacer cambios en el código local
- ✅ Mantener el código funcionando
- ✅ Resolver problemas técnicos
- ✅ Preparar actualizaciones

Tú controlas:

- ✅ Cuándo subir cambios al remoto
- ✅ Qué cambios aprobar
- ✅ El timing de los deployments

### 🚨 En Caso de Emergencia

Si algo sale mal:

1. Ejecuta `git status` para ver qué pasa
2. Si hay cambios importantes sin guardar, haz backup
3. Ejecuta `git reset --hard origin/main` para volver al estado remoto
4. Contacta conmigo para resolver cualquier problema
