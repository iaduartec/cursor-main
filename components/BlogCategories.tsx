<<<<<<< HEAD
=======
/**
Resumen generado automáticamente.

components/BlogCategories.tsx

2025-09-13T06:20:07.367Z

——————————————————————————————
Archivo .tsx: BlogCategories.tsx
Tamaño: 1246 caracteres, 39 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
>>>>>>> a825cc0035acea741d54a0676ee96e99ce5c9aa9
'use client';

interface BlogCategoriesProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function BlogCategories({ categories, activeCategory, onCategoryChange }: BlogCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-12">
      <button
        onClick={() => onCategoryChange('Todas')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          activeCategory === 'Todas'
            ? 'bg-accent text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
        }`}
      >
        Todas
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
