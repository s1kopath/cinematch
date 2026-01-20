export const ENV = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  tmdbApiKey: process.env.TMDB_API_KEY ?? "",
};
