/*
EJEMPLOS DE USO OPENAI API - DIFERENTES VERSIONES

===== TU CÓDIGO ORIGINAL (Necesita Corrección) =====
❌ PROBLEMAS IDENTIFICADOS:

import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({  // ❌ 'responses.create' no existe
    model: "gpt-5",                              // ❌ 'gpt-5' no está disponible aún
    input: "Write a one-sentence bedtime story about a unicorn." // ❌ 'input' no es correcto
});

console.log(response.output_text);               // ❌ 'output_text' no es la propiedad correcta

===== VERSIÓN CORREGIDA DE TU CÓDIGO =====
✅ IMPLEMENTACIÓN CORRECTA:
*/

import OpenAI from "openai";

// Función para crear cliente con configuración correcta
export function createOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Función para el ejemplo de bedtime story (tu caso)
export async function generateBedtimeStory() {
  const client = createOpenAIClient();
  
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",           // ✅ Modelo disponible
    messages: [                     // ✅ Formato correcto
      { 
        role: "user", 
        content: "Write a one-sentence bedtime story about a unicorn." 
      }
    ],
    temperature: 0.7,
    max_tokens: 100
  });

  const story = response.choices[0]?.message?.content; // ✅ Propiedad correcta
  console.log(story);
  return story;
}

// Función para optimización SEO (nuestro sistema)
export async function optimizeSEOContent(title: string, content: string, type = 'blog') {
  const client = createOpenAIClient();
  
  const seoResponse = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Eres un experto en SEO para empresas de automatización e iluminación"
      },
      {
        role: "user", 
        content: `Optimiza este contenido:
          Título: ${title}
          Contenido: ${content}
          Tipo: ${type}
          
          Devuelve JSON con: optimizedTitle, optimizedExcerpt, optimizedTags, optimizedContent, seoScore`
      }
    ],
    temperature: 0.3,
    max_tokens: 1500
  });

  return JSON.parse(seoResponse.choices[0]?.message?.content || '{}');
}

/*
📊 MODELOS DISPONIBLES (Septiembre 2025)

✅ DISPONIBLES:
- gpt-4o: Más potente, más caro
- gpt-4o-mini: Balance perfecto precio/rendimiento (RECOMENDADO)  
- gpt-3.5-turbo: Más barato, menos potente

❌ NO DISPONIBLES AÚN:
- gpt-5: En desarrollo/rumores
- gpt-4.5: No existe

📊 RECOMENDACIONES:
- Para SEO: gpt-4o-mini (rápido y económico)
- Para contenido complejo: gpt-4o  
- Para volumen alto: gpt-3.5-turbo

🔧 CORRECCIONES A TU CÓDIGO:
1. responses.create() → chat.completions.create()
2. model: "gpt-5" → model: "gpt-4o-mini"
3. input: → messages: [{ role: "user", content: }]
4. output_text → choices[0]?.message?.content
*/