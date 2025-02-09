import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // Specify files to include
    files: ['**/*.{js,mjs,cjs,jsx}'],
    // Common folders to ignore
    ignores: [
      // Build and generated files
      '**/build/**',
      '**/Archive/**',
      '**/node_modules/**',
      '**/__pycache__/**',
      '**/dist/**',
      
      // Python files (since this is a mixed Python/JS project)
      '**/*.py',
      
      // Generated/cached files
      '**/*.pyc',
      
      // Public assets
      'public/*',
      
      // Screenshots
      '**/screenshots/**',
      
      // Config files
      '.sequelizerc'
    ]
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module'
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      // Error prevention
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',

      // Code style
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'never'],

      // React specific
      'react/prop-types': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unused-prop-types': 'error',

      // Best practices
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always']
    }
  }
];