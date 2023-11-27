import { Request, Response } from 'express';
import { Gprofile } from '../types/gauth/Gprofile';
import { db } from '..';
import { VerifyUsers } from '../types/gauth/VerifyUsers';
import { myValidationResult } from '../customErrors/customErrField';
import { AddUserForm } from '../types/dbTypes/AddUserForm';
import { PassedRequestEncryptLogPass } from '../types/dbTypes/AddLogPass';

class MainController {

    async getIndexPage(request: Request, response: Response) {
        const user = request.user as Gprofile;
        const existUsers: VerifyUsers[] = await db.verifyUsers();
        const photo = (user.photos[0].value === '') ? 'images/icons/some-user.jpg' : user.photos[0].value;
        const logUsers = await db.getLogUsers();
        const listLoginsMysklad = await db.getLogins();
        for (let p of existUsers) {
            p.avatar = p.avatar === '' ? 'images/icons/some-user.jpg' : p.avatar;
        }
        return response.status(200).render('index', {
            layout: 'setting', 
            userData: user, 
            photos:  photo,
            users: {
                admins: existUsers,
                activity: logUsers, 
            },
            mysklad: {
                logins: listLoginsMysklad,
            } 
        }); 
    }

    async addUser(request: Request, response: Response) {
        const user = request.user as Gprofile | null;
        const errors = myValidationResult(request);
        const form = request.body as AddUserForm;
        if (!errors.isEmpty()) {
            return response.status(400).json( { errorsMessages: errors.array({onlyFirstError: true}) } );
        }
        const newUsers: VerifyUsers[] = await db.addUser(form);
        const userName = user ? user.displayName : 'anonymous';
        const userEmail = user ? user.email : '';
        await db.logUserActivity({
            user: `${userName} ${userEmail}`,
            date: new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"}),
            action: `${userName} ${userEmail} добавил пользователя ${form.name} ${form.email}`
        });
        response.status(200).json(newUsers)
    }

    async deleteUser(request: Request, response: Response) {
        // { delId: '43' }
        const id = request.params as { delId: string };
        const user = request.user as Gprofile | null;
        
        if (id) {
            const newUsers: VerifyUsers[] = await db.deleteUser(id.delId); 
            const userName = user ? user.displayName : 'anonymous';
            const userEmail = user ? user.email : '';
            await db.logUserActivity({
                user: `${userName} ${userEmail}`,
                date: new Date().toLocaleString("ru-RU", {timeZone: "Europe/Moscow"}),
                action: `${userName} ${userEmail} удалил пользователя id=${id.delId}`
            });
            return response.status(200).json(newUsers);
        }
        return response.status(400).json({ errorsMessages: ['Ошибка удаления']});
    }

    async logout(request: Request, response: Response) {
        request.logout(() => {
            request.user = undefined;
            return response.redirect('/');
        });
    }

    async addLoginPassword(request: Request, response: Response) {
        const logPass: PassedRequestEncryptLogPass = request.encLogPass;  
        const isOk = await db.addLoginPassword(logPass);
        if (isOk) {
            const logins = await db.getLogins();
            return response.status(200).json(logins);
        }
        return response.status(400).json({ errorsMessages: ['Ошибка добавления логин/пароль']})
    }

}


export const mainController = new MainController();