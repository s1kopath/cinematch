import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { fetchPopularMovies, fetchUpcomingMovies, getPosterUrl } from "./tmdb";
import { addFavorite, removeFavorite, getUserFavorites, isFavorited } from "./favorites";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  movies: router({
    getPopular: publicProcedure
      .input(z.object({ page: z.number().int().positive().default(1) }))
      .query(async ({ input }) => {
        const data = await fetchPopularMovies(input.page);
        return {
          movies: data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterUrl: getPosterUrl(movie.poster_path),
            rating: movie.vote_average,
            overview: movie.overview,
            releaseDate: movie.release_date,
          })),
          totalPages: data.total_pages,
          currentPage: data.page,
        };
      }),

    getUpcoming: publicProcedure
      .input(z.object({ page: z.number().int().positive().default(1) }))
      .query(async ({ input }) => {
        const data = await fetchUpcomingMovies(input.page);
        return {
          movies: data.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            posterUrl: getPosterUrl(movie.poster_path),
            rating: movie.vote_average,
            overview: movie.overview,
            releaseDate: movie.release_date,
          })),
          totalPages: data.total_pages,
          currentPage: data.page,
        };
      }),
  }),

  favorites: router({
    add: protectedProcedure
      .input(
        z.object({
          movieId: z.number().int().positive(),
          movieTitle: z.string(),
          posterPath: z.string().nullable(),
          rating: z.number(),
          overview: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await addFavorite(
          ctx.user.id,
          input.movieId,
          input.movieTitle,
          input.posterPath,
          input.rating,
          input.overview
        );
        return { success: true };
      }),

    remove: protectedProcedure
      .input(z.object({ movieId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await removeFavorite(ctx.user.id, input.movieId);
        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const favs = await getUserFavorites(ctx.user.id);
      return favs.map((fav) => ({
        id: fav.id,
        movieId: fav.movieId,
        movieTitle: fav.movieTitle,
        posterUrl: fav.posterPath ? `https://image.tmdb.org/t/p/w500${fav.posterPath}` : null,
        rating: fav.rating,
        overview: fav.overview,
        addedAt: fav.addedAt,
      }));
    }),

    isFavorited: protectedProcedure
      .input(z.object({ movieId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const favorited = await isFavorited(ctx.user.id, input.movieId);
        return { favorited };
      }),
  }),
});

export type AppRouter = typeof appRouter;
