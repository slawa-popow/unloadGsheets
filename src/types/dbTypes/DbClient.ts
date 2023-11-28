import { VerifyUsers } from "../gauth/VerifyUsers";
import { PassedRequestEncryptLogPass, TableLoginPassword } from "./AddLogPass";
import { AddUserForm } from "./AddUserForm";
import { UserActivity } from "./UserActivity";


export interface DbClient {
    existUsers(): Promise<VerifyUsers[]>;
    addUser(form: AddUserForm): Promise<VerifyUsers[]>;
    deleteUser(id: string): Promise<void>;
    logUserActivity(logData: UserActivity): Promise<void>;
    getLogUsers(): Promise<UserActivity[]>; 
    addLoginPassword(logPass: PassedRequestEncryptLogPass): Promise<boolean>;
    getLogins(): Promise<TableLoginPassword[]>;
    putLoginSklad(putid: string): Promise<boolean>;
    resetStatusLoginSklad(): Promise<void>;
    deleteLoginSklad(delId: string):  Promise<boolean>;

}