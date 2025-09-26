import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Simple auth middleware function
async function checkAdminAuth(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      return false;
    }

    const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (Date.now() > tokenData.expires) {
      return false;
    }

    return tokenData.isAdmin && tokenData.userId === 'admin';
  } catch {
    return false;
  }
}

// Lazy load OpenAI to avoid build issues
let openai: any = null;

async function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    const { default: OpenAI } = await import('openai');
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content, type = 'blog' } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const openaiClient = await getOpenAI();
    
    if (!openaiClient) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `
Como experto en SEO y marketing de contenidos para Duartec (empresa de automatización e iluminación), optimiza el siguiente contenido:

TÍTULO ORIGINAL: ${title}
CONTENIDO ORIGINAL: ${content}
TIPO: ${type}

Proporciona una respuesta en JSON con:
1. optimizedTitle: Título optimizado para SEO (máximo 60 caracteres)
2. optimizedExcerpt: Meta descripción atractiva (máximo 160 caracteres)
3. optimizedTags: Array de 3-5 tags relevantes
4. optimizedContent: Contenido mejorado con:
   - Palabras clave relevantes para el sector
   - Estructura optimizada para SEO
   - Llamadas a la acción
   - Enlaces internos sugeridos
5. seoScore: Puntuación del 1-10 de la optimización SEO
6. recommendations: Array de recomendaciones adicionales

Enfócate en términos como: automatización industrial, domótica, iluminación LED, control de accesos, sistemas de seguridad, IoT, smart home.

Responde únicamente con JSON válido.`;

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    try {
      const optimizedContent = JSON.parse(response);
      return NextResponse.json(optimizedContent);
    } catch (parseError) {
      // If JSON parsing fails, return a structured response
      return NextResponse.json({
        optimizedTitle: title,
        optimizedExcerpt: content.substring(0, 160) + '...',
        optimizedTags: ['automatización', 'tecnología', 'duartec'],
        optimizedContent: content,
        seoScore: 5,
        recommendations: ['Contenido procesado pero formato no válido'],
        rawResponse: response
      });
    }

  } catch (error) {
    console.error('OpenAI optimization error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `OpenAI error: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}