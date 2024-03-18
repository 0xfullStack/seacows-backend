import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import express, { json, urlencoded, NextFunction, Request, Response, Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { ZodError } from "zod";

import { RegisterRoutes } from "openapi/routes";
import SwaggerSpec from "openapi/swagger.json";
import logger from "./utils/logger";

// https://docs.sentry.io/platforms/node/guides/express/
function initSentry(app: Express, sentryDSN?: string) {
  if (!sentryDSN) return;

  Sentry.init({
    dsn: sentryDSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
}

function initMiddlewares(app: Express) {
  app.use(json());
  app.use(
    urlencoded({
      extended: true,
    })
  );
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
  app.use(cors());
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(SwaggerSpec));
}

function initRouter(app: Express) {
  const router = express();
  app.use(router);
  RegisterRoutes(router);
}

function errorHandlers(app: Express, useSentry: boolean = false) {
  // The error handler must be before any other error middleware
  if (useSentry) app.use(Sentry.Handlers.errorHandler());

  app.use((req, res) => {
    res.status(404).json({ message: `Not found` });
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // res.status(500).json({ message: `Internal error: ${err.message}` });
    if (err instanceof ValidateError) {
      logger.warn(`Caught Validation Error for ${req.path}:`, err.fields);
      res.status(422).json({
        message: "Validation Failed",
        details: err?.fields,
      });
    } else if (err instanceof ZodError) {
      logger.warn(`Caught Validation Error for ${req.path}:`, {
        issues: err.issues,
      });
      res.status(422).json({
        message: "Validation Failed",
        details: err.toString(),
      });
    } else if (err instanceof Error) {
      logger.error(`Caught Internal Server Error for ${req.path}:`, err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });
}

export function initApp(sentryDSN?: string) {
  const app = express();

  // The sentry must be initialized before the middlewares on the app.
  initSentry(app, sentryDSN);
  initMiddlewares(app);
  initRouter(app);

  errorHandlers(app, !!sentryDSN);

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
//     swaggerUi.generateHTML(await import("tsoa/swagger.json"))
//   );
// });
