# SCRIPT DE PRUEBAS COMPLETAS - ADMIN SYSTEM

## 🧪 TEST SUITE 1: Autenticación

### Test 1.1: Acceso a login page
curl -I http://localhost:3000/admin
# Expected: 200 OK

### Test 1.2: Login con credenciales incorrectas
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "wrong_password"}'
# Expected: 401 Unauthorized

### Test 1.3: Login con credenciales correctas
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin2024secure"}' \
  -c cookies.txt
# Expected: 200 OK + Set-Cookie

### Test 1.4: Verificar token válido
curl -X GET http://localhost:3000/api/admin/auth/check \
  -b cookies.txt
# Expected: 200 OK

## 🧪 TEST SUITE 2: Protección de rutas

### Test 2.1: Acceso a ruta protegida sin token
curl -I http://localhost:3000/admin/posts
# Expected: 302 Redirect to /admin

### Test 2.2: Acceso a ruta protegida con token
curl -I http://localhost:3000/admin/posts \
  -b cookies.txt
# Expected: 200 OK

### Test 2.3: Acceso a API protegida sin token
curl -X GET http://localhost:3000/api/admin/stats
# Expected: 401 Unauthorized

### Test 2.4: Acceso a API protegida con token
curl -X GET http://localhost:3000/api/admin/stats \
  -b cookies.txt
# Expected: 200 OK + JSON stats

## 🧪 TEST SUITE 3: OpenAI Integration

### Test 3.1: Verificar endpoint SEO sin auth
curl -X POST http://localhost:3000/api/admin/openai/optimize-seo \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "content": "Test content"}'
# Expected: 401 Unauthorized

### Test 3.2: Optimización SEO con auth
curl -X POST http://localhost:3000/api/admin/openai/optimize-seo \
  -H "Content-Type: application/json" \
  -d '{"title": "Automatización Industrial Burgos", "content": "Duartec ofrece servicios completos de automatización industrial en Burgos y provincia. Nuestro equipo especializado desarrolla soluciones personalizadas para optimizar procesos productivos, implementando tecnología avanzada como sistemas SCADA, control PID y monitorización remota.", "type": "blog"}' \
  -b cookies.txt
# Expected: 200 OK + JSON optimizado

## 🧪 TEST SUITE 4: CRUD Operations

### Test 4.1: Crear post con datos optimizados
curl -X POST http://localhost:3000/api/admin/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Automatización Industrial en Burgos - Soluciones Avanzadas", "slug": "automatizacion-industrial-burgos", "content": "Contenido optimizado por IA", "excerpt": "Meta descripción SEO optimizada", "tags": ["automatización", "industrial", "burgos"], "published": true}' \
  -b cookies.txt
# Expected: 200 OK

### Test 4.2: Listar posts
curl -X GET http://localhost:3000/api/admin/posts \
  -b cookies.txt
# Expected: 200 OK + Array de posts

## 🧪 TEST SUITE 5: Logout y limpieza

### Test 5.1: Logout
curl -X POST http://localhost:3000/api/admin/auth/logout \
  -b cookies.txt \
  -c cookies.txt
# Expected: 200 OK + Cookie cleared

### Test 5.2: Verificar token después de logout
curl -X GET http://localhost:3000/api/admin/auth/check \
  -b cookies.txt
# Expected: 401 Unauthorized

## 🧪 TEST SUITE 6: Browser Testing

### Test 6.1: Flujo completo manual
1. Ve a: http://localhost:3000/admin
2. Login: admin2024secure
3. Dashboard: verificar estadísticas
4. Posts: /admin/posts (ver lista)
5. Nuevo post: /admin/posts/new
6. Optimizar con AI: escribir contenido → botón AI
7. Aplicar optimización: botón "Aplicar"
8. Guardar post: formulario submit
9. Verificar en lista: volver a /admin/posts
10. Logout: botón logout

### Test 6.2: Test de redirección
1. Sin login: http://localhost:3000/admin/posts → /admin
2. Con login: http://localhost:3000/admin/posts → acceso permitido
3. Token expirado: esperar 8h → redirección automática

## ✅ RESULTADOS ESPERADOS

- ✅ Login funcional con password correcto
- ❌ Login rechaza password incorrecto  
- ✅ Rutas protegidas requieren autenticación
- ✅ APIs requieren token válido
- ✅ OpenAI responde con optimización completa
- ✅ CRUD operations funcionan correctamente
- ✅ Logout limpia sesión correctamente
- ✅ Middleware redirige apropiadamente
- ✅ Interface responsive y funcional