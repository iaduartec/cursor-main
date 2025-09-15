import { createTRPCRouter } from '~/server/api/trpc';

export const routeRouter = createTRPCRouter({
	// prefix: t.procedure.input(callable).query(async (args) => handler(args)),
});
