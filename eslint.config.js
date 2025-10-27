module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript'
  ],
  ignorePatterns: [
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'coverage/**',
    'tests/**'
  ],
  rules: {
    // Add any custom rules here
  }
};
