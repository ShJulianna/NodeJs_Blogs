import { NextFunction, Request, Response } from 'express';
import {HttpStatus} from "../../core/types/types";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';

export const superAdminGuardMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const auth = req.headers['authorization'] as string; // 'Basic xxxx' Получаем заголовок Authorization из запроса.

    if (!auth) {
        res.sendStatus(HttpStatus.Unauthorized); //Если его нет, сразу возвращаем ошибку 401 Unauthorized.
        return;
    }

    const [authType, token] = auth.split(' '); //Затем разбиваем строку по пробелу, получая тип авторизации (Basic) и сам токен - username:password

    if (authType !== 'Basic') {
        res.sendStatus(HttpStatus.Unauthorized);
        return;
    }

    const credentials = Buffer.from(token, 'base64').toString('utf-8'); // dbcadkcnasdk Расшифровываем токен из base64 в обычную строку .

    const [username, password] = credentials.split(':'); //admin:qwerty и разделяем её на логин и пароль

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) { //вторизация не прошла, возвращаем ошибку 401 Unauthorized
        res.sendStatus(HttpStatus.Unauthorized);
        return;
    }

    next(); // Успешная авторизация, продолжаем
};