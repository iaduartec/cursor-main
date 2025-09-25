#!/usr/bin/env node

/**
 * Script pa    <div class="company-info">
        <h2>1. Responsable del Tratamiento</h2>
        <p>Technet Soluciones Para Empresas S.L. (nombre comercial: Duartec Instalaciones Informáticas) es el responsable del tratamiento de los datos personales que se recaban a través de este sitio web.</p>
        <ul>
            <li><strong>Razón social:</strong> Technet Soluciones Para Empresas S.L.</li>
            <li><strong>Nombre comercial:</strong> Duartec Instalaciones Informáticas</li>
            <li><strong>CIF:</strong> B09551342</li>
            <li><strong>Domicilio:</strong> Avenida Valencia Del Cid, 3 - Bajo, 09002 Burgos (España)</li>
            <li><strong>Email:</strong> fjduarte@duartec.es</li>
            <li><strong>Teléfono:</strong> 947 256 430</li>
        </ul>
    </div> PDFs de las políticas legales
 * Versión simplificada para generar PDFs estáticos
 * 
 * @author Duartec Instalaciones Informáticas
 * @version 1.0.0
 * @date 2025-09-26
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'public');

// Contenido HTML para Política de Privacidad
const privacidadHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Política de Privacidad - Duartec Instalaciones Informáticas</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-info { background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        ul { margin: 10px 0; padding-left: 25px; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>POLÍTICA DE PRIVACIDAD</h1>
        <p><strong>Duartec Instalaciones Informáticas</strong></p>
        <p>Fecha de última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>

    <div class="company-info">
        <h2>1. Responsable del Tratamiento</h2>
        <p>Duartec Instalaciones Informáticas es el responsable del tratamiento de los datos personales que se recaban a través de este sitio web.</p>
        <ul>
            <li><strong>Denominación social:</strong> Duartec Instalaciones Informáticas</li>
            <li><strong>Domicilio:</strong> AVDA. Valencia del Cid, 3 - Bajo, 09001 Burgos (España)</li>
            <li><strong>Email:</strong> info@duartec.es</li>
            <li><strong>Teléfono:</strong> 947 256 430</li>
        </ul>
    </div>

    <h2>2. Finalidad del Tratamiento</h2>
    <p>Sus datos personales serán tratados para las siguientes finalidades:</p>
    <ul>
        <li>Gestionar las consultas y solicitudes de información que nos envíe</li>
        <li>Facilitar información sobre nuestros servicios y productos</li>
        <li>Enviar comunicaciones comerciales sobre nuestros servicios</li>
        <li>Gestionar la relación contractual en caso de contratación de servicios</li>
        <li>Cumplir con las obligaciones legales aplicables</li>
    </ul>

    <h2>3. Base Legal</h2>
    <p>El tratamiento de sus datos se basa en:</p>
    <ul>
        <li><strong>Consentimiento:</strong> Para el envío de comunicaciones comerciales</li>
        <li><strong>Interés legítimo:</strong> Para responder a consultas y gestionar la relación comercial</li>
        <li><strong>Cumplimiento de obligaciones legales:</strong> Para cumplir con la normativa aplicable</li>
        <li><strong>Ejecución de contrato:</strong> Para la prestación de servicios contratados</li>
    </ul>

    <h2>4. Derechos del Usuario</h2>
    <p>Puede ejercer los siguientes derechos:</p>
    <ul>
        <li><strong>Acceso:</strong> Conocer qué datos suyos tenemos y cómo los tratamos</li>
        <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
        <li><strong>Supresión:</strong> Eliminar sus datos cuando sea legalmente posible</li>
        <li><strong>Limitación:</strong> Restringir el tratamiento de sus datos</li>
        <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
        <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
    </ul>

    <h2>5. Contacto</h2>
    <p>Para cualquier consulta relacionada con esta política de privacidad:</p>
    <ul>
        <li><strong>Email:</strong> info@duartec.es</li>
        <li><strong>Teléfono:</strong> 947 256 430</li>
        <li><strong>Dirección:</strong> AVDA. Valencia del Cid, 3 - Bajo, 09001 Burgos (España)</li>
    </ul>
</body>
</html>
`;

// Contenido HTML para Política de Cookies  
const cookiesHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Política de Cookies - Duartec Instalaciones Informáticas</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .cookie-type { background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        ul { margin: 10px 0; padding-left: 25px; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>POLÍTICA DE COOKIES</h1>
        <p><strong>Duartec Instalaciones Informáticas</strong></p>
        <p>Fecha de última actualización: ${new Date().toLocaleDateString('es-ES')}</p>
    </div>

    <h2>1. ¿Qué son las cookies?</h2>
    <p>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Las cookies permiten que el sitio web recuerde sus acciones y preferencias durante un período de tiempo.</p>

    <div class="cookie-type">
        <h2>2. Tipos de cookies que utilizamos</h2>
        
        <h3>2.1 Cookies técnicas (necesarias)</h3>
        <p>Esenciales para el funcionamiento del sitio web:</p>
        <ul>
            <li><strong>next-auth.session-token:</strong> Gestión de sesión del usuario</li>
            <li><strong>next-auth.csrf-token:</strong> Protección CSRF</li>
        </ul>

        <h3>2.2 Cookies de rendimiento</h3>
        <p>Para medir y mejorar el rendimiento del sitio:</p>
        <ul>
            <li><strong>_ga:</strong> Google Analytics - Análisis de tráfico web</li>
            <li><strong>_gid:</strong> Google Analytics - Identificación de sesión</li>
        </ul>

        <h3>2.3 Cookies de funcionalidad</h3>
        <p>Para proporcionar funcionalidad mejorada:</p>
        <ul>
            <li><strong>theme-preference:</strong> Recordar preferencia de tema</li>
            <li><strong>language-preference:</strong> Recordar idioma preferido</li>
        </ul>
    </div>

    <h2>3. Gestión de cookies</h2>
    <p>Puede configurar su navegador para rechazar todas las cookies o para indicar cuándo se está enviando una cookie. Para más información sobre cómo gestionar las cookies, consulte la configuración de su navegador.</p>

    <h2>4. Contacto</h2>
    <p>Si tiene alguna pregunta sobre nuestra política de cookies:</p>
    <ul>
        <li><strong>Email:</strong> info@duartec.es</li>
        <li><strong>Teléfono:</strong> 947 256 430</li>
        <li><strong>Dirección:</strong> AVDA. Valencia del Cid, 3 - Bajo, 09001 Burgos (España)</li>
    </ul>
</body>
</html>
`;

console.log('🚀 Generando archivos HTML para PDFs legales...');

try {
    // Crear archivos HTML temporales
    writeFileSync(join(OUTPUT_DIR, 'privacidad-temp.html'), privacidadHTML);
    writeFileSync(join(OUTPUT_DIR, 'politicadecookies-temp.html'), cookiesHTML);
    
    console.log('✅ Archivos HTML generados en public/');
    console.log('📝 Para convertir a PDF, use:');
    console.log('   - Navegador: Abrir archivo → Imprimir → Guardar como PDF');
    console.log('   - O usar herramienta online como HTML to PDF converter');
    
} catch (error) {
    console.error('❌ Error generando archivos:', error.message);
    process.exit(1);
}