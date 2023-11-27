import { BaseSettings } from "../BaseSettings";


export class SkladSetting extends BaseSettings {
    constructor() {
        super();
    }


    async addLogPass(form: HTMLFormElement) {
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
                const resp = await response.json();  
                     
                return resp;
        } catch (err) {
            console.log('------- *** --------', '\n', err, '\n', '------- *** --------');
        }  
    }

}