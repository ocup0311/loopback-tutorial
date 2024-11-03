module.exports = {
  extends: '@loopback/eslint-config',
  rules: {
    '@typescript-eslint/prefer-nullish-coalescing': 'off', // 應自己判斷使用 ?? 或 || 的情境，各有適用時機
  },
};
