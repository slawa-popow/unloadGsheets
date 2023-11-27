import { NextFunction, Request, Response } from "express";
import { Gprofile } from "../../types/gauth/Gprofile";
import { db } from "../..";

export async function isLoggin(request: Request, response: Response, next: NextFunction) {
    const user = request.user as Gprofile;
    
    const existUser = await db.isExistUser(user);
    if (user && user.verified && existUser) {
        await db.logUserActivity({
            user: `${user.displayName } ${user.email}`,
            date: new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"}),
            action: `Успешный вход `
        });
        return next();
    } else {
        await db.logUserActivity({
            user: `${user && user.name ? user.name : 'anonymous'} ${user && user.email ? user.email : ''}`, 
            date: new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"}),
            action: `Доступ запрещен ` 
        });
        return response.status(200).render('login', {
            layout: 'main', }); 
    }
}