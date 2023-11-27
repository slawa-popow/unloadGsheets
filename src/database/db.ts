import { PassedRequestEncryptLogPass, ReturnToFrontDecryptLogins } from "../types/dbTypes/AddLogPass";
import { AddUserForm } from "../types/dbTypes/AddUserForm";
import { DbClient } from "../types/dbTypes/DbClient";
import { UserActivity } from "../types/dbTypes/UserActivity";
import { Gprofile } from "../types/gauth/Gprofile";
import dotenv from 'dotenv';
import { VerifyUsers } from "../types/gauth/VerifyUsers";
import CryptoJS from "crypto-js";
 
// 
dotenv.config();

 export class Db {

    private client: DbClient | null = null;

    constructor (client: DbClient) {
        this.client = client;
    }

    async isExistUser(user: Gprofile): Promise<boolean> {
        if (user && this.client) {
            const users: VerifyUsers[] = await this.client.existUsers();
            return users.some((u) => {
                return user.email === u.email  
            });
        }
        return false;  
    }

    async verifyUsers(): Promise<VerifyUsers[]> {
        return this.client ? await this.client.existUsers() : [];
    }

    async addUser(form: AddUserForm): Promise<VerifyUsers[]> {
        return this.client ? await this.client.addUser(form) : [];      
    }

    async deleteUser(id: string): Promise<VerifyUsers[]> {
        if (this.client) {
            await this.client.deleteUser(id);
        }
        return this.client ? await this.client.existUsers() : [];
    }

    async logUserActivity(logData: UserActivity): Promise<void> {
        if (this.client) {
            await this.client.logUserActivity(logData);
        }
    }

    async getLogUsers(): Promise<UserActivity[]> {
        return this.client ? await this.client.getLogUsers() : [];
    }

    async addLoginPassword(logPass: PassedRequestEncryptLogPass): Promise<boolean> {
        return this.client ? await this.client.addLoginPassword(logPass) : false;
    }

    async getLogins(): Promise<ReturnToFrontDecryptLogins[]> {
        if (this.client) {
            const codePhrase = process.env.PHRASE_KEY || 'a00dsDAef4-VAs57a68_def0D';
            const arrLogs = await this.client.getLogins();
            const logins: ReturnToFrontDecryptLogins[] = [];
            for (let lg of arrLogs) {
                const bytes  = CryptoJS.AES.decrypt(lg.login, codePhrase);
                const decryptLogin = bytes.toString(CryptoJS.enc.Utf8);
                const objDecryptLogin: ReturnToFrontDecryptLogins = {
                    id: lg.id,
                    login: decryptLogin,
                    status: lg.status
                }
                logins.push(objDecryptLogin)
            }
            return logins;
        }
        return [];
    }
    
}

