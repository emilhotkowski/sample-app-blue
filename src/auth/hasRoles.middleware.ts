import { NextFunction, Request, Response } from "express";
import { IUser, UserRole } from "../model/user.model";

export const hasRoles = (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => {
  const hasRole = roles.find(role => (req.user! as IUser).role === role)
  if (!hasRole) {
    return res.status(403).json({message:"Unauthorized"});
  }
  return next();
}