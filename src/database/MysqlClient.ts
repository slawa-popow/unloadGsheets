import mysql, { ResultSetHeader } from 'mysql2/promise';
import { Pool } from "mysql2/promise";
 
import dotenv from 'dotenv';
import session from 'express-session';
import { DbClient } from '../types/dbTypes/DbClient';
import { VerifyUsers } from '../types/gauth/VerifyUsers';
import { AddUserForm } from '../types/dbTypes/AddUserForm';
import { UserActivity } from '../types/dbTypes/UserActivity';
import { PassedRequestEncryptLogPass, StatusSelectLogin, TableLoginPassword } from '../types/dbTypes/AddLogPass';
// import { MODE_DEV } from '..';
const MySQLStore = require('express-mysql-session')(session);

dotenv.config();

export enum Table {
    VerifyUsers = 'verify_users',
    logUserActivity = 'user_activity',
    LoginPassword = 'log_passw',
};

export class MysqlClient implements DbClient{

    private HOST: string = process.env.PROD_HOST || '';
    private USER: string = process.env.PROD_USER || '';
    private DATABASE: string = process.env.PROD_DATABASE || '';
    private PASSWORD: string = process.env.PROD_PASSWORD || '' ;

    // private HOST: string = process.env.HOST || '';
    // private USER: string = process.env.USER || '';
    // private DATABASE: string = process.env.DATABASE || '';
    // private PASSWORD: string = process.env.PASSWORD || '' ;

    private pool: Pool | null = null;

    public sessionStore: any = null;

    constructor() { 
        this.setPool();      
    }

    setPool(): void {
       
        const pool: Pool = mysql.createPool({ 
            connectionLimit: 20, 
            host: this.HOST,
            user: this.USER,
            password: this.PASSWORD,
            database: this.DATABASE,
            waitForConnections: true,
            rowsAsArray: false,
        }); 
        this.pool = pool;
        this.sessionStore = new MySQLStore({
            createDatabaseTable: true,
            clearExpired: true,
            checkExpirationInterval: 8000000,
            expiration: 8000000,
        }, this.pool);
    }


    async existUsers(): Promise<VerifyUsers[]> {
        const connection = await this.pool!.getConnection();
        try {
            if (connection) {
                const [_users, _] = await connection.query(`SELECT * FROM ${Table.VerifyUsers};`);  
                const users = _users as VerifyUsers[];
                return users; 
            }

        } catch (e) { console.log('Error in MySqlAgent->existUsers()->catch', e) } 
        finally {
            connection.release();
        }
        return [];
    
    }

    async addUser(form: AddUserForm): Promise<VerifyUsers[]> {
        const connection = await this.pool!.getConnection();
        const valuesUser = [form.name, form.email, ''];
        try {
            if (connection) {
                await connection.query(`INSERT INTO ${Table.VerifyUsers}(name, email, avatar) VALUES(?, ?, ?);`, valuesUser);  
                await connection.commit();
                return await this.existUsers();
            }

        } catch (e) { console.log('Error in MySqlAgent->addUser()->catch', e) } 
        finally {
            connection.release();
        }
        return [];

    }


    async deleteUser(id: string): Promise<void> {
        const connection = await this.pool!.getConnection();
        try {
            if (connection) {
                const [_del, _] = await connection.query(`DELETE FROM ${Table.VerifyUsers} WHERE id=${id};`); 
                await connection.commit();
            }

        } catch (e) { console.log('Error in MySqlAgent->deleteUser()->catch', e) } 
        finally {
            connection.release();
        }
        return;
    }

    async logUserActivity(logData: UserActivity): Promise<void> {
        const connection = await this.pool!.getConnection();
        const logValuesUser = [logData.date, logData.user, logData.action];
        try {
            if (connection) {
                await connection.query(`INSERT INTO ${Table.logUserActivity}(date, user, action) VALUES(?, ?, ?);`, logValuesUser);  
                await connection.commit();
                return;
            }

        } catch (e) { console.log('Error in MySqlAgent->logUserActivity()->catch', e) } 
        finally {
            connection.release();
        }
        return;
    }


    async getLogUsers(): Promise<UserActivity[]> {
        const connection = await this.pool!.getConnection();
        try {
            if (connection) {
                const [_users, _] = await connection.query(`SELECT * FROM ${Table.logUserActivity};`);  
                const users = _users as UserActivity[];
                return users; 
            }

        } catch (e) { console.log('Error in MySqlAgent->getLogUsers()->catch', e) } 
        finally {
            connection.release();
        }
        return [];
    }


    async getLogins(): Promise<TableLoginPassword[]> {
        const connection = await this.pool!.getConnection();
        try {
            if (connection) {
                const [_lp, __] = await connection.query(`SELECT * FROM ${Table.LoginPassword};`);
                const lp = _lp as TableLoginPassword[];
                return lp;
            }

        } catch (e) { console.log('Error in MySqlAgent->getLogins()->catch', e) } 
        finally {
            connection.release();
        }
        return [];
    }


    async addLoginPassword(logPass: PassedRequestEncryptLogPass): Promise<boolean> {
        const connection = await this.pool!.getConnection();
        const logpassArr = [logPass.encLogin, logPass.encPassw, StatusSelectLogin.OFF];
        try {
            if (connection) {                
                const [_res, _] = await connection.query(`INSERT INTO ${Table.LoginPassword}(login, password, status) VALUES(?, ?, ?);`, logpassArr);
                const res = _res as ResultSetHeader;
                await connection.commit();
                if(res && res.affectedRows >= 1)
                    return true;
                return false;
            }

        } catch (e) { console.log('Error in MySqlAgent->addLoginPassword()->catch', e) } 
        finally {
            connection.release();
        }
        return false;
    }







    //--------- sample method --------------------------------------
    // async setTestData(data: Array<string>): Promise<any> { 
    //     const connection = await this.pool!.getConnection();

    //     try {
    //         if (connection) {
    //             const res = connection.query(`INSERT INTO ${Table.Clients}(name, age) VALUES(?, ?);`, data);  
    //             return res;
    //         }

    //     } catch (e) { console.log('Error in MySqlAgent->setTestData()->catch', e) } 
    //     finally {
    //         connection.release();
    //     }
    //     return [];
    // } 

    
}

