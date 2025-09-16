// Environment-specific config

module.exports = {
  development: {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    rateLimitMax: 100,
    corsOrigin: "*", // ✅ fixed typo
  },
  production: {
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    rateLimitMax: 50, // Stricter in production
    corsOrigin: process.env.CLIENT_URL || "*", // Restrict to your frontend later
  },
};
