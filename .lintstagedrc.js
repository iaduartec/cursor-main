module.exports = {
  // Formatear archivos de código
  '*.{js,jsx,ts,tsx}': [
    'prettier --write',
    'eslint --fix',
  ],
  
  // Formatear archivos de configuración y otros
  '*.{json,md,mdx,yml,yaml,css,scss}': [
    'prettier --write',
  ],
  
  // Verificar tipos de TypeScript
  '*.{ts,tsx}': [
    () => 'tsc --noEmit',
  ],
};
