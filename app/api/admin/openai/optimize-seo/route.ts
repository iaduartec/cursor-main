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

    // Datos del negocio y slugs internos disponibles
    const businessData = {
      name: "Duartec",
      address: "Burgos, España",
      website: "https://duartec.es",
      description: "Empresa especializada en automatización industrial, domótica, iluminación LED, control de accesos, sistemas de seguridad e IoT"
    };

    const internalSlugs = [
      "/servicios/electricidad",
      "/servicios/informatica", 
      "/servicios/sonido",
      "/servicios/videovigilancia",
      "/proyectos/sistema-videovigilancia-cctv",
      "/proyectos/seguridad-red-empresarial",
      "/proyectos/datacenter-racks-servidores",
      "/blog/instalaciones-electricas-industriales",
      "/blog/seguridad-red-empresarial",
      "/blog/sistemas-audio-profesional",
      "/contacto",
      "/quienes-somos"
    ];

    const seoSystemPrompt = `Eres un editor SEO técnico. Tu función es reescribir y optimizar el contenido únicamente con la información proporcionada por el usuario; no inventes hechos y, si falta algún dato relevante, indícalo en el campo \`verification_needed\`.

Tu objetivo es entregar una versión localmente optimizada para SEO (es-ES) del artículo, cumpliendo estos requisitos:

- Mejora la claridad, estructura, intención y cobertura de búsqueda.
- Corrige y optimiza title tag, meta description y H1.
- Añade sección de FAQ derivadas del contenido, orientadas a fragmentos destacados.
- Propón enlaces internos utilizando los slugs disponibles y externos solo si se proporcionan; si no, deja "url": null.
- Sugiere 2–4 imágenes, cada una con un alt y un caption descriptivo (sin inventar nombres de marcas/modelos).
- Devuelve un changelog de lo optimizado y un checklist técnico priorizado.
- No garantices rankings ni uses afirmaciones absolutas; señala toda aseveración no verificable como [No verificado].

Devuelve únicamente un JSON estructurado según este esquema completo con todas las secciones: summary, meta, toc, body_markdown, faqs, links, images, structured_data, tech_checklist, risks, verification_needed.`;

    const userContent = JSON.stringify({
      business: businessData,
      internal_slugs_available: internalSlugs,
      article: {
        title: title,
        content: content,
        article_slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        locale: "es-ES"
      }
    });

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: seoSystemPrompt },
        { role: "user", content: userContent }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    try {
      // Limpiar la respuesta de posibles códigos markdown
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      }
      
      const seoOptimized = JSON.parse(cleanResponse);
      
      // Convertir al formato que espera nuestra interfaz
      const compatibleResponse = {
        optimizedTitle: seoOptimized.meta?.title || title,
        optimizedExcerpt: seoOptimized.meta?.description || content.substring(0, 160) + '...',
        optimizedTags: seoOptimized.meta?.keywords?.split(', ').slice(0, 5) || ['automatización', 'tecnología', 'duartec'],
        optimizedContent: seoOptimized.body_markdown || content,
        seoScore: 8, // Basado en la optimización completa del asistente
        recommendations: seoOptimized.tech_checklist || [],
        // Datos adicionales del asistente SEO
        fullSeoData: seoOptimized,
        faqs: seoOptimized.faqs || [],
        internalLinks: seoOptimized.links?.internal || [],
        suggestedImages: seoOptimized.images || [],
        structuredData: seoOptimized.structured_data || null,
        risks: seoOptimized.risks || [],
        verificationNeeded: seoOptimized.verification_needed || []
      };

      return NextResponse.json(compatibleResponse);
    } catch (parseError) {
      // Si JSON parsing falla, devolver estructura compatible
      return NextResponse.json({
        optimizedTitle: title,
        optimizedExcerpt: content.substring(0, 160) + '...',
        optimizedTags: ['automatización', 'tecnología', 'duartec'],
        optimizedContent: content,
        seoScore: 5,
        recommendations: ['Error al procesar respuesta del asistente SEO'],
        rawResponse: response,
        error: 'JSON parsing failed'
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