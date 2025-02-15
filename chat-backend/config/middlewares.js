module.exports = [
  {
    name: "strapi::cors",
    config: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  },
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
