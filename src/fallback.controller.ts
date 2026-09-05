import { Controller, All, Req, Res, Next } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Controller()
export class FallbackController {
  @All("*")
  handleInvalidRoutes(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction
  ) {
    const whitelist = ["/graphql", "images", "/uploads"];

    if (whitelist.some((path) => req.url.startsWith(path))) {
      return next();
    }

    // All other routes return 404
    return res.status(404).json({
      statusCode: 404,
      message: "Not Found",
      path: req.url,
    });
  }
}
