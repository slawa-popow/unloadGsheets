import { PassedRequestEncryptLogPass, ReturnToFrontDecryptLogins, StatusSelectLogin, TableLoginPassword } from "../types/dbTypes/AddLogPass";
import { AddUserForm } from "../types/dbTypes/AddUserForm";
import { DbClient } from "../types/dbTypes/DbClient";
import { UserActivity } from "../types/dbTypes/UserActivity";
import { Gprofile } from "../types/gauth/Gprofile";
import dotenv from 'dotenv';
import { VerifyUsers } from "../types/gauth/VerifyUsers";
import { decryptLoginPassword } from "../routes/middlewares/encryptLogPass";
 
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

    async putLoginSklad(putid: string): Promise<boolean> {
        if (this.client) {
            await this.client.resetStatusLoginSklad();
            return await this.client.putLoginSklad(putid);
        }
        return false;
    }

    async deleteLoginSklad(delId: string):  Promise<boolean> {
        return this.client ? await this.client.deleteLoginSklad(delId) : false;
    }

    async getLogins(): Promise<ReturnToFrontDecryptLogins[]> {
        if (this.client) {
            const arrLogs = await this.client.getLogins();
            const logins: ReturnToFrontDecryptLogins[] = [];
            for (let lg of arrLogs) {
                const decryptLogin = await decryptLoginPassword(lg.login);
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

    async getLoginPasswordToConnect(): Promise<TableLoginPassword | null> {
        let auth: TableLoginPassword | null = null;
        if (this.client) {
            const logPass = await this.client.getLogins();
            if (logPass.length > 0) {
                for (let value of logPass) {
                    if (value.status === StatusSelectLogin.SELECT) {
                        auth = value;
                        break;
                    }
                }
                if (auth) {
                    const decryptLogin = await decryptLoginPassword(auth.login);
                    const decryptPassw = await decryptLoginPassword(auth.password);
                    auth.login = decryptLogin;
                    auth.password = decryptPassw;  
                }
            }
        }
        return auth;
    }
    
}

