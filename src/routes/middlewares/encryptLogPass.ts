import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import { AddLogPass, PassedRequestEncryptLogPass, ReturnToFrontDecryptLogins } from "../../types/dbTypes/AddLogPass";
import CryptoJS from "crypto-js";
import { db } from "../..";

dotenv.config();

const EMERGENCY_KEY = 'a00dsDAef4-VAs57a68_def0D';

/**
 * зашифровать пароль логин
 */
export async function encryptLoginPassword(logPass: AddLogPass): Promise<PassedRequestEncryptLogPass> {
    const codePhrase = process.env.PHRASE_KEY || EMERGENCY_KEY;
    const encLogin = CryptoJS.AES.encrypt(logPass.sklad_login, codePhrase).toString();
    const encPass = CryptoJS.AES.encrypt(logPass.sklad_password, codePhrase).toString();
    return {
        encLogin: encLogin,
        encPassw: encPass
    };
}

/**
 * Расшифровать данные (логин, пароль)
 * @param encodedData зашифрованная строка из бд
 * @returns расшифрованная строка
 */
export async function decryptLoginPassword(encodedData: string): Promise<string> {
    const codePhrase = process.env.PHRASE_KEY || EMERGENCY_KEY;
    const bytes  = CryptoJS.AES.decrypt(encodedData, codePhrase);
    const decryptLogin = bytes.toString(CryptoJS.enc.Utf8);
    return decryptLogin;
}



export async function encryptLogPass(request: Request, response: Response, next: NextFunction) {
    const logPass = request.body as AddLogPass;
    if (logPass.sklad_login.trim() !== '' && logPass.sklad_password.trim() !== '' ) {
        request.encLogPass = await encryptLoginPassword(logPass);
        return next();
    }
    const logins = await db.getLogins();
    return response.status(200).json(logins);
}