import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { VerifiedCallback } from "passport-jwt";
import { getClientIp } from "request-ip";
import geoIp from "geoip-lite";
import { UserRepository } from "src/modules/user/repositories/user.repository";
import { JwtPayloadType } from "src/common/types/jwt.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private userRepository: UserRepository) {
    const configService = new ConfigService();

    super({
      jwtFromRequest: JwtStrategy.extractJwtFromAuthHeaderOrCookie,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
      passReqToCallback: true,
    });
  }

  static extractJwtFromAuthHeaderOrCookie(req: Request): string | null {
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return req.cookies?.access_token || null;
  }

  async validate(
    req: Request,
    payload: JwtPayloadType,
    done: VerifiedCallback
  ) {
    const { id } = payload;

    const user = await this.userRepository.getUserDetailsJwtAuth(id);
    if (!user) return done(new UnauthorizedException(), false);

    const ip = getClientIp(req);
    const geo = ip ? geoIp.lookup(ip) : null;

    const token =
      req.headers["authorization"]?.substring(7) || req.cookies?.access_token;

    console.log(`Authenticated user ID: ${id}`);
    console.log(`Token used: ${token}`);
    if (geo) {
      console.log(`Geo location: ${geo.city}, ${geo.country}`);
    }

    return done(null, user, payload.iat);
  }
}
