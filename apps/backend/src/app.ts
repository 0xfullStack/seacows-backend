import { ExternalServices } from './services/index';
import { AppEnv } from "./env";
import Koa, { ParameterizedContext } from "koa";
import KoaRouter from "@koa/router";
import { koaSwagger } from "koa2-swagger-ui";
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "../build/routes";
import logger from "./utils/logger";
import SwaggerSpec from "../build/swagger.json";
import getPrisma, { PrismaConfig } from './services/prisma';
import { ZodError } from 'zod';

export type AppState = {};
export type AppContext = {
  env: AppEnv;
  external: ExternalServices;
  db: PrismaConfig;
}
export type Context = ParameterizedContext<AppState, AppContext>;

export function initApp(env: AppEnv) {
  const app = new Koa<AppState, AppContext>();
  const router = new KoaRouter();

  app.context.env = env;
  app.context.external = ExternalServices.apply(env.RESERVIOR_API_KEYS);

  // TODO: Production mode handling for write URL
  app.context.db = getPrisma(env.DATABASE_URL, env.DATABASE_URL);

  app.use(
    koaSwagger({
      routePrefix: "/docs", // host at /swagger instead of default /docs
      swaggerOptions: {
        spec: SwaggerSpec,
      },
    })
  );

  app.use(router.routes());
  RegisterRoutes(router);

  app.use(function notFoundHandler(ctx: Context) {
    ctx.status = 404;
    ctx.body = {
      message: "Not Found",
    };
  });

  app.on("error", (err: unknown, ctx: Context) => {
    if (err instanceof ValidateError) {
      logger.warn(`Caught Validation Error for ${ctx.path}:`, err.fields);

      ctx.status = 422;
      ctx.body = {
        message: "Validation Failed",
        details: err?.fields,
      };
    } else if (err instanceof ZodError) {
      logger.warn(`Caught Validation Error for ${ctx.path}:`, {
        issues: err.issues
      });

      ctx.status = 422;
      ctx.body = {
        message: "Validation Failed",
        details: err.toString(),
      };
    } else if (err instanceof Error) {
      logger.error(`Caught Internal Server Error for ${ctx.path}:`, err);
      ctx.status = 500;
      ctx.body = {
        message: "Internal Server Error",
      };
    }
  });

  return app;
}

// Use body parser to read sent json payloads
// app.use(
//   urlencoded({
//     extended: true,
//   })
// );
// app.use(json());

// app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
//   return res.send(
//     swaggerUi.generateHTML(await import("../build/swagger.json"))
//   );
// });
