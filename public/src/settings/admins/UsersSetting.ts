import { FormAddUsersData } from "../../types/UsersSettingTypes/FormAddUsersData";
import { BaseSettings } from "../BaseSettings";
import { VerifyUsers } from '../../types/UsersSettingTypes/VerifyUsers';
import { listenerDeleteUser } from "../../..";


export class UsersSetting extends BaseSettings {
    constructor() {
        super();
    }

    async addUser(formDatas: FormAddUsersData) {
        const formData = new FormData(formDatas.form);
        const sendData = Object.fromEntries(formData);
        try {
            const response = await fetch(formDatas.host, {
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


    makeTableUsers(cnt: HTMLDivElement, responseUsers: VerifyUsers[]) {
        const table = document.createElement('table');
        table!.addEventListener('click', listenerDeleteUser);
        table.classList.add('table', 'table-sm', 'table-success', 'table-striped');
        table.setAttribute('id', 'table-admins');
        const thead = document.createElement('thead');
        thead.classList.add('table-dark');
        const tr = document.createElement('tr');

        const titleTable = ['№', 'Имя', 'email', 'ico', 'Удалить'];
        titleTable.forEach( (val) => {
            const th = document.createElement('th');
            th.scope="col";
            th.innerText = val;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        responseUsers.forEach((val, i, arr) => {
            const tr = document.createElement('tr');
            const values = Object.values(val);
            values.push(" ")
            const lenValues = values.length;
            values.forEach((el, index) => {
                
                const td = document.createElement('td');
                if (index === lenValues-1) {
                    
                    const delbtn = document.createElement('button');
                    delbtn.setAttribute('id', `delete-user-${arr[i].id}`);
                    delbtn.setAttribute('type', 'button');
                    delbtn.setAttribute('style', 'width: 100%;');
                    delbtn.classList.add('btn', 'btn-danger', 'btn-sm');
                    delbtn.textContent = '✘';
                    td.appendChild(delbtn);
                    tr.appendChild(td)
                }
                if (index === lenValues-2) {
                    const ico = document.createElement('img');
                    ico.setAttribute('src', el === '' ? 'images/icons/some-user.jpg' : el);
                    ico.setAttribute('style', 'width: 30px; height: 30px;')
                    td.appendChild(ico);
                    tr.appendChild(td);
                } 
                if (index < lenValues - 2) {
                    td.textContent = el;
                    tr.appendChild(td)
                }

            })
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        cnt.appendChild(table);
    }


    /**
     * Удалить пользователя
     * @param id строки бд для удаления
     * @returns новая таблица админов
     */
    async deleteUser(id: number) {
        
        try {
            const response = await fetch(`/deleteUser/${id}`, {
                method: "DELETE", 
                mode: "cors",  
                cache: "no-cache",  
                credentials: "include", 
                headers: { 
                    "Content-Type": "application/json",   
                },
                redirect: "follow", 
                referrerPolicy: "no-referrer",    
                }); 
                const resp = await response.json();    
                return resp;
        } catch (err) {
            console.log('------- *** --------', '\n', err, '\n', '------- *** --------');
        }  
    }




}