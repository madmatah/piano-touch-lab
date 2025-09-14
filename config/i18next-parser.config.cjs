module.exports = {
  input: [
    '../src/**/*.{js,jsx,ts,tsx}',
    '!../src/**/*.test.{js,jsx,ts,tsx}',
    '!../src/**/*.spec.{js,jsx,ts,tsx}',
    '!../src/locales/**',
    '!../src/**/node_modules/**',
  ],
  output: 'src/locales/$LOCALE/$NAMESPACE.json',
  locales: ['en', 'fr'],
  defaultNamespace: 'translation',
  namespaceSeparator: false,
  keySeparator: false,
  defaultValue: function (locale, namespace, key, value) {
    if (locale === 'en') {
      return key;
    }
    return '';
  },
  sort: true,
  createOldCatalogs: false,
  failOnWarnings: false,
  verbose: true,
  lineEnding: '\n',
  keepRemoved: false,
  lexers: {
    js: ['JavascriptLexer'],
    jsx: ['JsxLexer'],
    ts: ['JavascriptLexer'],
    tsx: ['JsxLexer'],
    default: ['JavascriptLexer'],
  },
};
