import { DecryptLogins } from "../../types/skladSettingTypes/DecryptLogins";
import { BaseSettings } from "../BaseSettings";


export class SkladSetting extends BaseSettings {
    constructor() {
        super();
    }


    async addLogPass(form: HTMLFormElement): Promise<DecryptLogins[]> {
        const formData = new FormData(form);
        const sendData = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/addLoginPassword', {
                method: "POST", 
                mode: "cors",  
                cache: "no-cache",  
                credentials: "include", 
                headers: { 
                    "Content-Type": "application/json",   
                },
                redirect: "follow", 
                referrerPolicy: "no-referrer", 
                body: JSON.stringify(sendData),   
                });
                const resp = await response.json() as DecryptLogins[];  
                     
                return resp;
        } catch (err) {
            console.log('------- *** --------', '\n', err, '\n', '------- *** --------');
        } 
        return []; 
    }


    rebuildSelectList(selectLoginList: HTMLSelectElement, decryptLogins: DecryptLogins[]) {
        this.clearContainer(selectLoginList);
        const reverseList: HTMLOptionElement[] = [];
        for (let val of decryptLogins) {
            if (val.login !== '') {
                const option = document.createElement('option') as HTMLOptionElement;
                option.setAttribute('value', '' + val.id);
                option.textContent = val.login;
                reverseList.unshift(option);
            }
        }
        reverseList.forEach( opt => {
            selectLoginList.appendChild(opt);
        });
    }


    async selectLoginSklad(sendData: {[k: string]: FormDataEntryValue}): Promise<{status: boolean}> {
        try {
            const response = await fetch(`/selectLogin/${sendData.select_login}`, {
                method: "PUT", 
                mode: "cors",  
                cache: "no-cache",  
                credentials: "include", 
                headers: { 
                    "Content-Type": "application/json",   
                },
                redirect: "follow", 
                referrerPolicy: "no-referrer", 
                body: JSON.stringify(sendData),   
                });
                const resp = await response.json() as {status: boolean};  
                return resp;

        } catch (err) {
            console.log('------- *** --------', '\n', err, '\n', '------- *** --------');
        } 
        return {status: false}; 
    }

    async deleteLoginSklad(sendData: {[k: string]: FormDataEntryValue}): Promise<DecryptLogins[]> {
        try {
            const response = await fetch(`/deleteLogin/${sendData.select_login}`, {
                method: "DELETE", 
                mode: "cors",  
                cache: "no-cache",  
                credentials: "include", 
                headers: { 
                    "Content-Type": "application/json",   
                },
                redirect: "follow", 
                referrerPolicy: "no-referrer", 
                body: JSON.stringify(sendData),   
                });
                const resp = await response.json() as DecryptLogins[];  
                return resp;

        } catch (err) {
            console.log('------- *** --------', '\n', err, '\n', '------- *** --------');
        } 
        return []; 
    }


    async checkConnectSklad(url: string): Promise<{status: unknown, data: unknown}> {
        try {
            const response = await fetch('/checkConnectSklad', {
                method: "POST", 
                mode: "cors",  
                cache: "no-cache",  
                credentials: "include", 
                headers: { 
                    "Content-Type": "application/json",   
                },
                redirect: "follow", 
                referrerPolicy: "no-referrer", 
                body: JSON.stringify({checkUrl: url}),   
                });
                const resp = await response.json();  
                return resp;
        } catch (err) {
            console.log('------- *** --------', '\n', err, '\n', '------- *** --------');
        }
        return {status: "error", data: "error"} 
    }

}