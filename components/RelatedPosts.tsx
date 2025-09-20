import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';

interface BlogPost {
  title: string;
  slug: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  excerpt: string;
}

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
  maxPosts?: number;
}

export default function RelatedPosts({ currentPost, allPosts, maxPosts = 3 }: RelatedPostsProps) {
  // Filtrar posts relacionados (misma categoría o categorías similares)
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .sort((a, b) => {
      // Priorizar posts de la misma categoría
      if (a.category === currentPost.category && b.category !== currentPost.category) { return -1; }
      if (b.category === currentPost.category && a.category !== currentPost.category) { return 1; }
      return 0;
    })
    .slice(0, maxPosts);

  if (relatedPosts.length === 0) { return null; }

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold mb-8 text-primary dark:text-white">
        Artículos relacionados
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <article key={post.slug} className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-slate-700">
            {/* Imagen */}
            <div className="relative h-32 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Contenido */}
            <div className="p-4">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{new Date(post.date).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
              
              <h4 className="font-semibold mb-2 text-primary dark:text-white line-clamp-2">
                {post.title}
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {post.excerpt}
              </p>
              
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-accent hover:text-accent-700 text-sm font-medium transition-colors"
              >
                Leer más
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
