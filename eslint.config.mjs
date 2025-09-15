/**
Resumen generado automáticamente.

eslint.config.mjs

2025-09-13T06:20:07.371Z

——————————————————————————————
Archivo .mjs: eslint.config.mjs
Tamaño: 5162 caracteres, 185 líneas
Resumen básico generado automáticamente sin análisis de IA.
Contenido detectado basado en extensión y estructura básica.
*/
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import url from 'node:url';

// Enable loading of legacy shareable configs/plugins via FlatCompat
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Global ignore patterns
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.contentlayer/**',
      '.venv/**',
      'out/**',
      'build/**',
      'dist/**',
      'public/**',
      '.git/**',
      '.lintstagedrc.js',
      '__tests__/**',
      '*.config.js',
      'jest.config.js',
      'jest.setup.js',
      'tailwind.config.js',
      'tmp_home.tsx',
    ],
  },

  // Base JS recommendations
  js.configs.recommended,

  // React + TS + A11y rules via legacy shareable configs (ESLint v9 compatible)
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ),

  // Project rules (ported from .eslintrc.json)
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        module: 'writable',
        process: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-param-reassign': 'error',
      'no-return-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-labels': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      radix: 'error',
      yoda: 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unsafe': ['error', { checkAliases: true }],
      'react/self-closing-comp': 'error',
      'react/sort-comp': 'error',
      'react/sort-prop-types': 'off',
      'react/style-prop-object': 'error',
      'react/void-dom-elements-no-children': 'error',
    },
  },

  // Node-oriented JS files (config and scripts)
  {
    files: [
      // scripts in various extensions and the intranet scaffold folder
      'scripts/**/*.{js,cjs,mjs,ts}',
      'intranet-scaffold/**/*.{js,cjs,mjs,ts}',
      'next.config.*',
      'tailwind.config.js',
      'jest.config.js',
      'jest.setup.js',
      'next.config.analyze.js',
      'fix_blog_frontmatter_merge.js',
      'fix_blog_slugs.js',
      'fix_blog_frontmatter.js',
      'fix_blog_slugs_extended.js',
      'content/blog/fix_blog_frontmatter_merge.js',
      'content/blog/fix_blog_slugs.js',
    ],
    languageOptions: {
      sourceType: 'script',
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
      'no-console': 'off',
      curly: ['error', 'all'],
      'prefer-destructuring': 'off',
      'no-empty': 'off',
    },
  },

  // Special app error pages: relax strict a11y
  {
    files: ['app/error.tsx', 'app/global-error.tsx', 'app/not-found.tsx'],
    rules: {
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/html-has-lang': 'off',
    },
  },

  // Contentlayer config allows 'any' for convenience
  {
    files: ['contentlayer.config.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Declaration files can use triple-slash references
  {
    files: ['*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // Observability bootstrap can use console
  {
    files: ['instrumentation.ts'],
    rules: {
      'no-console': 'off',
    },
  },
];
