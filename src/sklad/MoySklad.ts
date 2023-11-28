import axios from 'axios';
import { Db } from '../database/db';
import { TableLoginPassword } from '../types/dbTypes/AddLogPass';



export class MoySklad {
    db: Db | null = null;

    constructor (db: Db | null) { 
        this.db = db;
    }

    async getHeader(credential: string) {
        return {'User-Agent': 'Plitochka.by client', 'Accept': '*/*', 'Content-Type': "application/json",
        'Content-Encoding': 'gzip, deflate, br', 'Connection': 'keep-alive',
        'Authorization': `${credential}` }
    }

    async getCredentials(): Promise<string> {
        if (this.db) {
            const logpass: TableLoginPassword | null = await this.db.getLoginPasswordToConnect();
            if (logpass) {
                const login = logpass.login;
                const password = logpass.password;
                
                return `Basic ${Buffer.from(login + ':' + password).toString('base64')}`;
            }
        }
        return '';
    }

    async checkConnect(url: string = ''): Promise<{status: unknown, data: unknown}> {
        let status = null, data = null;
        try {
            const credential = await this.getCredentials();
            const header = await this.getHeader(credential);
            const res = await axios.get(
                url.trim() ? url : "https://api.moysklad.ru/api/remap/1.2/entity/product/metadata", 
                { headers: header},
                );           
            
            status = res.status;
            data = res.data;
            
        } catch (err) { console.log(`Error -> MoySklad->checkConnect() try/catch `); } 
        finally {
            return {status: status, data: data};
        }
    }

}