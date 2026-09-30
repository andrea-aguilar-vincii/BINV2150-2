import { NextFunction, Response } from "express";
import { AuthenticatedRequest, AuthRequest } from "../models/auth.model";
import { ERole, TokenPayload, User } from "../models/user.model";
import {
  generateFakeToken,
  generateToken,
  validateFakeToken,
  verifyToken,
} from "../utils/auth";
import { LoggerService } from "./logger.service";
import { UsersService } from "./users.service";
import jwt from "jsonwebtoken";

export class AuthService {
  /**
   * Vérifie les identifiants.
   * @returns un token si l'email et le mot de passe sont corrects, undefined sinon
   */
  static login(email: string, password: string): string | undefined {
    const user = UsersService.getByEmail(email);
    if (!user) return undefined;
    if (user.password !== password) return undefined;

    return generateToken({
      id: user.id,
      email: user.email,
      role: user.role});
  }

  /**
   * Middleware : vérifie le token du header Authorization et place l'utilisateur dans req.user.
   * Répond 401 si le token est absent ou invalide.
   */ /*
  static authorize(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    const token = req.get("Authorization");
    if (!token) {
      LoggerService.error("Missing Authorization header");
      return res.sendStatus(401);
    }

    let user: User | undefined = undefined;
    try {
      const email = validateFakeToken(token);
      user = UsersService.getByEmail(email);
    } catch (error) {
      LoggerService.error(error);
    }

    if (!user) {
      LoggerService.error("Invalid token");
      return res.sendStatus(401);
    }

    req.user = user; // disponible dans les middlewares et routes suivants
    return next();
  }*/

  /**
   * Middleware (à placer après authorize) : n'autorise que les administrateurs.
   * Répond 403 sinon.
   */
  /*static isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (req.user === undefined) return res.sendStatus(401);
    if (req.user.role !== ERole.ADMIN) return res.sendStatus(403);
    return next();
  }*/
  //EXO 3

  static authorize(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.get("Authorization");
    if (!token) return res.sendStatus(401);
    const payload = verifyToken(token);
    if (!payload) return res.sendStatus(401);
    req.user = payload; // disponible dans les middlewares et routes suivants
    next();
  }

  static isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user) return res.sendStatus(401);
    if (req.user.role !== "admin") return res.sendStatus(403);
    next();
  }

 

  static isValidCredentials(email:string, password:string):boolean{

    const user= UsersService.getByEmail(email);

    if(!user) return false;
    return user.password === password;
  }
}
