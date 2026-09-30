import { Request } from "express";
import { TokenPayload, User } from "./user.model";

/**
 * Requête Express enrichie par le middleware AuthService.authorize :
 * après ce middleware, req.user contient l'utilisateur authentifié.
 */
export interface AuthenticatedRequest extends Request {
  user?: User;
}

//EXO 3

// Request étendue avec l'utilisateur authentifié (payload du token)
export interface AuthRequest extends Request {
user?: TokenPayload;
}
