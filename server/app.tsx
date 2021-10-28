declare var __BASEPATH__: string;

import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetData } from "react-helmet";
import { StaticRouter } from "react-router-dom";
import express, { Request } from "express";
import fs from "fs";
import cors from "cors";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import path from "path";
import { Helmet } from "react-helmet";
import App from "../src";
import { merge } from "lodash";
import { StaticRouterContext } from "react-router";

export const toHTML = (helmet: HelmetData, content: string) => {
  const manifestContent = fs
    .readFileSync(path.join(__BASEPATH__, "dist/public/assets-manifest.json"))
    .toString();
  const manifest: { [key: string]: string } = JSON.parse(manifestContent);
  return `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            <link rel="stylesheet" href="${manifest["app.css"]}">
        </head>
        <body ${helmet.bodyAttributes.toString()}>
            <div id="root">${content}</div>
            <script src="${manifest["app.js"]}"></script>
        </body>
    </html>
`;
};

export function render(req: Request, context: StaticRouterContext = {}) {
  const content = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  return { content, context };
}

type ServerOptions = {};

const defaultServerOptions: ServerOptions = {};

export function buildApp(options?: Partial<ServerOptions>) {
  options = merge(defaultServerOptions, options);

  const accessLogStream = rfs.createStream("access.log", {
    interval: "1d", // rotate daily
    path: path.join(__BASEPATH__, "logs"),
  });

  const app = express();

  app.use(cors());

  /* istanbul ignore next */
  app.use(
    morgan("dev", {
      skip: function (req, res) {
        return res.statusCode < 400 || res.statusCode === 404;
      },
    })
  );

  /* istanbul ignore next */
  app.use(
    morgan("combined", {
      stream: accessLogStream,
    })
  );

  app.use(
    "/assets",
    express.static(path.resolve(__BASEPATH__, "dist", "public"))
  );

  app.use((req, res) => {
    const { content, context } = render(req);

    if (context.statusCode) {
      res.status(context.statusCode);
    }

    if (context.url) {
      res.redirect(301, context.url);
    } else {
      const helmet = Helmet.renderStatic();
      res.send(toHTML(helmet, content));
    }
  });

  return app;
}

export default buildApp;
