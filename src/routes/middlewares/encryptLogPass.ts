import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import { AddLogPass } from "../../types/dbTypes/AddLogPass";
import CryptoJS from "crypto-js";

dotenv.config();

export async function encryptLogPass(request: Request, _response: Response, next: NextFunction) {
    const logPass = request.body as AddLogPass;
    const codePhrase = process.env.PHRASE_KEY || 'a00dsDAef4-VAs57a68_def0D';
    const encLogin = CryptoJS.AES.encrypt(logPass.sklad_login, codePhrase).toString();
    const encPass = CryptoJS.AES.encrypt(logPass.sklad_password, codePhrase).toString();
    request.encLogPass = {
        encLogin: encLogin,
        encPassw: encPass
    };

    return next();
}