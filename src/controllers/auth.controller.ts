import e, { Request, Response, Router } from "express";
import { UsersMapper } from "../mappers/users.mapper";
import { AuthenticatedRequest } from "../models/auth.model";
import { ERole, TokenDTO, UserDTO } from "../models/user.model";
import { AuthService } from "../services/auth.service";
import { LoggerService } from "../services/logger.service";
import { UsersService } from "../services/users.service";
import { isCredentialsDTO, isNewUserDTO } from "../utils/guards";
import { generateToken } from "../utils/auth";

export const authController = Router();

/**
 * POST /auth/register
 * Crée un compte et renvoie un token (l'utilisateur est directement connecté)
 */
authController.post("/register", (req: Request, res: Response) => {
  LoggerService.info("[POST] /auth/register");

  const body: unknown = req.body;
  if (!isNewUserDTO(body)) return res.sendStatus(400);

  const newUser = UsersMapper.fromNewDTO(body);
  const user = UsersService.create(newUser);
  if (!user) return res.sendStatus(409); // email déjà utilisé

  const token = AuthService.login(user.email, user.password);
  if (!token) return res.sendStatus(500);

  const tokenDTO: TokenDTO = { token: token };
  return res.status(201).json(tokenDTO);
});

/**
 * POST /auth/login
 * Vérifie les identifiants et renvoie un token
 *//*
authController.post("/login", (req: Request, res: Response) => {
  console.log(req.body);
  const body: unknown = req.body;
  
  if (!isCredentialsDTO(body)) return res.sendStatus(400);
  const { email, password } = body;
  const user = UsersService.getByEmail(email);
  console.log("User trouvé : ",user);
  console.log("Credentials : ", AuthService.isValidCredentials(email,password));

  if(!user) return res.sendStatus(401);
  /*if (user?.role !==ERole.ADMIN ||!user||!AuthService.isValidCredentials(email, password))
    return res.sendStatus(401);*/
/*
  if(!AuthService.isValidCredentials(email, password)) 
    return res.sendStatus(401);

  console.log("Role : ",user.role);

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  res.json({ token });
});*/
 
authController.post("/login", (req: Request, res: Response) => {
  console.log("Route login appele");
  console.log("BODY =", req.body);

  const body: unknown = req.body;

  if (!isCredentialsDTO(body)) {
    console.log("DTO invalide");
    return res.sendStatus(400);
  }

  const { email, password } = body;

  const user = UsersService.getByEmail(email);

  console.log("USER =", user);

  if (!user) {
    console.log("Utilisateur introuvable");
    return res.sendStatus(401);
  }

  console.log(
    "Credentials valides =",
    AuthService.isValidCredentials(email, password)
  );

  if (!AuthService.isValidCredentials(email, password)) {
    console.log("Mot de passe incorrect");
    return res.sendStatus(401);
  }

  console.log("Role =", user.role);

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return res.json({ token });
});
/**
 * GET /auth/me
 * Renvoie l'utilisateur correspondant au token
 */
authController.get(
  "/me",
  AuthService.authorize,
  (req: AuthenticatedRequest, res: Response) => {
    LoggerService.info("[GET] /auth/me");

    if (!req.user) return res.sendStatus(401);
    const authUser = req.user;
    if(!authUser) return res.sendStatus(401);

    const user = UsersService.getById(authUser.id);

    if(!user) return res.sendStatus(404);

    const userDTO: UserDTO = UsersMapper.toDTO(user);
    return res.status(200).json(userDTO);
  },
);
