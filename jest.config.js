module.exports = {
  preset: "jest-expo",
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|react-native|expo(nent)?|@expo(nent)?/.*|@unimodules/.*|unimodules|sentry-expo|native-base)"
  ]
};

