import { Request, Response, NextFunction } from "express";

export function requireLogin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) return res.redirect("/login");
    next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role !== "ADMIN") return res.status(403).send("Forbidden");
    next();
}

export function redirectIfLogged(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) return res.redirect("/");
    next();
}
