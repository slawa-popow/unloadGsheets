/**
 * из фронта
 */
export interface AddLogPass {
    sklad_login: string; 
    sklad_password: string;
}

/**
 * зашифрованное (middleware: encryptLogPass) в request
 */
export interface PassedRequestEncryptLogPass {
    encLogin: string;
    encPassw: string;
}

/**
 * статус выбранного логина
 */
export enum StatusSelectLogin {
    SELECT = 'SELECT',
    OFF = 'OFF'
}

/**
 * таблица бд шифр. логина пароля
 */
export interface TableLoginPassword {
    id : number;
    login: string;
    password: string;
    status: StatusSelectLogin;
}

/**
 * дешифрованные логины из бд на страницу (в список select)
 */
export type ReturnToFrontDecryptLogins = {
    id: number;
    login: string;
    status: string;
}