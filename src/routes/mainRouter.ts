import { Router } from "express";
import { Request, Response } from 'express';
import { mainController } from "./MainController";
import passport from "passport";
import { isLoggin } from "./middlewares/isLoggin";
import { emaiVld, nameVld } from "./middlewares/validate";
import { encryptLogPass } from "./middlewares/encryptLogPass";


const mainRouter = Router(); 

mainRouter.get('/', isLoggin, mainController.getIndexPage); 
mainRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile']}));
mainRouter.get('/google/callback', passport.authenticate(
    'google', 
    { 
        failureRedirect: '/login',
    }), 
    function (_req: Request, res: Response) {
        return res.redirect('/')
});

mainRouter.post('/addUser', nameVld(), emaiVld(), mainController.addUser);
mainRouter.delete('/deleteUser/:delId', mainController.deleteUser);
mainRouter.get('/logout', mainController.logout);
mainRouter.post('/addLoginPassword', encryptLogPass, mainController.addLoginPassword);
export { mainRouter } 