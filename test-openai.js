// TEST RÁPIDO OPENAI - Script de prueba

import { createOpenAIClient, generateBedtimeStory, optimizeSEOContent } from './lib/openai-examples';

async function testOpenAI() {
  console.log('🧪 Testing OpenAI Integration...\n');

  try {
    // Test 1: Tu ejemplo de bedtime story (corregido)
    console.log('📖 Test 1: Bedtime Story');
    const story = await generateBedtimeStory();
    console.log('Story:', story);
    console.log('✅ Success!\n');

    // Test 2: Optimización SEO (nuestro sistema)
    console.log('🔍 Test 2: SEO Optimization');
    const optimized = await optimizeSEOContent(
      'Instalaciones Eléctricas',
      'Realizamos todo tipo de instalaciones eléctricas en Burgos'
    );
    console.log('SEO Result:', optimized);
    console.log('✅ Success!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      console.log('\n💡 Solución: Configura tu OPENAI_API_KEY en .env.local');
    }
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  testOpenAI();
}

export { testOpenAI };