import { Request, Response, NextFunction } from "express";
import "./session";
import { client } from "./db";

export function isLoggedInAPI(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    next();
    return;
  }
  res.status(401);
  res.end("Please Login");
  // res.redirect("/login.html");
}

export async function getSessionAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session?.user) {
    let id = req.session?.user.id;
    let result = await client.query(`select role from "user" where id=($1)`, [
      id,
    ]);
    let role = result.rows[0].role;
    if (role == "admin") {
      next();
      return;
    }
  }
  res.status(401);
  // res.end("This API is for admin use only");
  res.redirect("/login.html");
}

export async function getSessionStaff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session?.user) {
    let id = req.session?.user.id;
    let result = await client.query(`select role from "user" where id=($1)`, [
      id,
    ]);
    let role = result.rows[0].role;
    if (role == "staff") {
      next();
      return;
    }
  }
  res.status(401);
  res.end("This API is for staff use only");
}
