import { Router } from "express";

import { createShortURL } from "../controllers/index.js";

import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";

import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

import urlSchema from "../schemas/urlSchema.js";

const urlsRouter = Router();
urlsRouter.post('/urls/shorten', validateSchemaMiddleware(urlSchema), validateTokenMiddleware, createShortURL);

export default urlsRouter;