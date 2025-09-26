import React from 'react';

interface SEOData {
  optimizedTitle: string;
  optimizedExcerpt: string;
  optimizedTags: string[];
  optimizedContent: string;
  seoScore: number;
  recommendations: string[];
  faqs?: Array<{ q: string; a: string }>;
  internalLinks?: Array<{ slug: string; anchor: string }>;
  suggestedImages?: Array<{ suggested_filename: string; alt: string; caption: string }>;
  risks?: string[];
  verificationNeeded?: string[];
}

interface SEOResultsProps {
  seoData: SEOData;
  onApply: (data: SEOData) => void;
}

export default function SEOResults({ seoData, onApply }: SEOResultsProps) {
  const handleApplyOptimization = () => {
    onApply(seoData);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-green-900">Optimización SEO Completada</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Score: {seoData.seoScore}/10
          </span>
        </div>
        <button
          onClick={handleApplyOptimization}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Aplicar Optimización
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimizaciones principales */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">✅ Título optimizado:</h4>
            <p className="text-sm text-gray-700 bg-white p-2 rounded border">{seoData.optimizedTitle}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">📝 Meta descripción:</h4>
            <p className="text-sm text-gray-700 bg-white p-2 rounded border">{seoData.optimizedExcerpt}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">🏷️ Tags sugeridos:</h4>
            <div className="flex flex-wrap gap-1">
              {seoData.optimizedTags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">🎯 Recomendaciones prioritarias:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {seoData.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAQs generadas */}
      {seoData.faqs && seoData.faqs.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">❓ FAQs generadas para fragmentos destacados:</h4>
          <div className="space-y-3">
            {seoData.faqs.slice(0, 3).map((faq, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <p className="text-sm font-medium text-gray-900">{faq.q}</p>
                <p className="text-sm text-gray-700 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enlaces internos sugeridos */}
      {seoData.internalLinks && seoData.internalLinks.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">🔗 Enlaces internos sugeridos:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {seoData.internalLinks.map((link, index) => (
              <div key={index} className="bg-white p-2 rounded border text-sm">
                <span className="text-blue-600 font-medium">{link.anchor}</span>
                <span className="text-gray-500 text-xs block">{link.slug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Imágenes sugeridas */}
      {seoData.suggestedImages && seoData.suggestedImages.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">🖼️ Imágenes sugeridas:</h4>
          <div className="space-y-2">
            {seoData.suggestedImages.map((img, index) => (
              <div key={index} className="bg-white p-3 rounded border">
                <p className="text-sm font-medium text-gray-900">{img.caption}</p>
                <p className="text-xs text-gray-600 mt-1">Alt: {img.alt}</p>
                <p className="text-xs text-gray-500">Archivo: {img.suggested_filename}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Riesgos y verificaciones */}
      {(seoData.risks?.length || seoData.verificationNeeded?.length) && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {seoData.risks && seoData.risks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-900 mb-2">⚠️ Riesgos identificados:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {seoData.risks.map((risk, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {seoData.verificationNeeded && seoData.verificationNeeded.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-yellow-900 mb-2">🔍 Verificación necesaria:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {seoData.verificationNeeded.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}