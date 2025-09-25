# Java 21 LTS Upgrade Documentation

## Overview
Successfully upgraded from Java 8 (Zulu OpenJDK 8.86.0.25) to Java 21 LTS (Microsoft OpenJDK 21.0.8) on Windows.

## Installation Details
- **Previous Version**: OpenJDK 1.8.0_452 (Zulu 8.86.0.25-CA-win64)
- **New Version**: OpenJDK 21.0.8 LTS (Microsoft-11933218)
- **Installation Path**: `C:\Program Files\Microsoft\jdk-21.0.8.9-hotspot`
- **Package Manager**: Chocolatey (`microsoft-openjdk-21`)

## Environment Configuration
- **JAVA_HOME**: Set to `C:\Program Files\Microsoft\jdk-21.0.8.9-hotspot`
- **PATH**: Updated to include `%JAVA_HOME%\bin` at the beginning
- **Scope**: Currently configured at user level

## Key Java 21 LTS Features Available
1. **Pattern Matching for switch** (Standard)
2. **Record Patterns** (Preview)
3. **String Templates** (Preview)
4. **Virtual Threads** (Standard)
5. **Structured Concurrency** (Preview)
6. **Vector API** (Incubator)

## Scripts Created
1. **`scripts/setup-java21.ps1`** - Environment variable setup script
   - Run without parameters: Sets user-level variables
   - Run with `-SystemWide`: Sets system-level variables (requires admin)

2. **`scripts/verify-java21.ps1`** - Comprehensive verification script
   - Checks installation integrity
   - Verifies environment variables
   - Tests Java 21 features
   - Provides troubleshooting information

## Verification Results
- ✅ Java Runtime: 21.0.8 LTS
- ✅ Java Compiler: 21.0.8
- ✅ JAVA_HOME: Properly configured
- ✅ PATH: Updated correctly
- ✅ Installation: Complete and functional
- ✅ Java 21 Features: Working correctly

## Usage Instructions

### For Current Session
```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.8.9-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
java -version
```

### For Permanent Setup (User Level)
```powershell
.\web\scripts\setup-java21.ps1
```

### For Permanent Setup (System-wide, requires admin)
```powershell
.\web\scripts\setup-java21.ps1 -SystemWide
```

### Verification
```powershell
.\web\scripts\verify-java21.ps1
```

## Migration Notes
- Old Java 8 installation remains at `C:\Program Files\Zulu\zulu-8\`
- Can be safely removed if no longer needed
- Some applications may need to be reconfigured to use Java 21
- IDE configurations should be updated to point to new JDK

## Troubleshooting
1. **Environment variables not persisting**: Restart terminal/IDE
2. **System-wide setup fails**: Run PowerShell as Administrator
3. **Applications still using Java 8**: Update application-specific JDK settings
4. **PATH issues**: Run verification script to check configuration

## Performance Benefits of Java 21 LTS
- Improved garbage collection (G1GC enhancements)
- Virtual threads for better concurrency
- Enhanced security features
- Better performance for modern applications
- Long-term support until 2031

## Next Steps
1. ✅ Restart terminal/IDE to pick up new environment variables
2. ⚠️ Run system-wide setup if needed: `.\web\scripts\setup-java21.ps1 -SystemWide`
3. ⚠️ Update IDE/build tool configurations to use Java 21
4. ⚠️ Test existing Java applications with new runtime
5. ⚠️ Consider removing old Java 8 installation if not needed

## Support Information
- **Java 21 LTS Support**: Until September 2031
- **Microsoft OpenJDK**: Free, open-source distribution
- **Documentation**: https://docs.microsoft.com/java/openjdk/
- **Release Notes**: https://github.com/microsoft/openjdk