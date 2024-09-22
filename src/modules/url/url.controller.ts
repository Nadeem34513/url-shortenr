/* eslint-disable @typescript-eslint/no-empty-function */
import { Request, Response } from "express";
import { Controller, Get, Middleware, Post } from "@faatlab/express-decorator";
import * as UrlService from "./url.service";

@Controller("/")
export default class UrlController {
  constructor(private readonly urlService = UrlService) {}

  @Post("/shorten")
  async createShortURL(req: Request, res: Response) {
    const { url } = req.body;

    const data = await this.urlService.createShortURL(url);

    res.formatter.ok(data);
  }

  @Get("/:id")
  async redirection(req: Request, res: Response) {
    const id = req.params.id;
    const url = await this.urlService.redirect(id);

    res.redirect(url);
  }
}
