#!/usr/bin/env node

/**
 * Script de prueba para verificar el funcionamiento del sistema de login de intranet
 */

const TEST_TOKEN = process.env.INTRANET_DEBUG_TOKEN || 'test-token-123';

console.log('🧪 Probando sistema de login de intranet...\n');

// Simular una petición de login
async function testLogin() {
    try {
        console.log('1. Probando login con token válido...');

        const response = await fetch('http://localhost:3000/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: TEST_TOKEN
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Login exitoso:', data.message);

            // Verificar que se estableció la cookie
            const cookie = response.headers.get('set-cookie');
            if (cookie && cookie.includes('intranet_token')) {
                console.log('✅ Cookie de sesión establecida correctamente');
            } else {
                console.log('⚠️  Cookie de sesión no encontrada');
            }
        } else {
            console.log('❌ Login falló:', data.error);
        }

    } catch (error) {
        console.log('❌ Error en la petición:', error.message);
    }
}

// Simular acceso a ruta protegida
async function testProtectedRoute() {
    try {
        console.log('\n2. Probando acceso a ruta protegida sin autenticación...');

        const response = await fetch('http://localhost:3000/admin');
        const finalUrl = response.url;

        if (finalUrl.includes('/login')) {
            console.log('✅ Redirección automática al login funcionó');
        } else {
            console.log('❌ No se redirigió al login');
        }

    } catch (error) {
        console.log('❌ Error en la petición:', error.message);
    }
}

// Simular logout
async function testLogout() {
    try {
        console.log('\n3. Probando logout...');

        const response = await fetch('http://localhost:3000/api/auth', {
            method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Logout exitoso:', data.message);
        } else {
            console.log('❌ Logout falló:', data.error);
        }

    } catch (error) {
        console.log('❌ Error en la petición:', error.message);
    }
}

// Función principal
async function main() {
    console.log(`🔑 Usando token de prueba: ${TEST_TOKEN}\n`);

    await testLogin();
    await testProtectedRoute();
    await testLogout();

    console.log('\n🎉 Pruebas completadas!');
    console.log('\n💡 Para probar manualmente:');
    console.log('   1. Ve a http://localhost:3000/login');
    console.log('   2. Ingresa el token de intranet');
    console.log('   3. Deberías acceder al panel de admin');
    console.log('   4. El enlace "Cerrar Sesión" debería funcionar');
}

main().catch(console.error);