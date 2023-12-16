import { UsersSetting } from "./src/settings/admins/UsersSetting";
import { SkladSetting } from "./src/settings/mysklad/SkladSetting";
import { FormAddUsersData } from "./src/types/UsersSettingTypes/FormAddUsersData";


/**
 * -------------------------------
 */

const statusOperation = document.getElementById('select-loginsklad-status-operation') as HTMLParagraphElement;
statusOperation.textContent = '';

export const getStatusOperation = <T extends HTMLElement>(p: T, text: string, flag: boolean) => {
    if (flag) {
        p.classList.remove('status-operation-error');
        p.classList.add('status-operation-success');
        p.textContent = 'ok! ' + text;
    } else {
        p.classList.remove('status-operation-success');
        p.classList.add('status-operation-error');
        p.textContent = 'Ошибка! ';
    }
};

// ------------------------ пользователи ------------------------------------------------
const tableContainer = document.getElementById('table-users-content') as HTMLDivElement;
const table = document.getElementById('table-admins');
const formAddUser = document.getElementById('add-adimin-form') as HTMLFormElement;
const sendButtonAddUser = document.getElementById('add-user-button') as HTMLButtonElement;
const activityTextArea = document.getElementById('users-activity') as HTMLTextAreaElement;
activityTextArea.scrollTop = activityTextArea.scrollHeight;
// ----------------------------------------------------------------------------------------
// ----------------------- мойсклад -------------------------------------------------------
    // форма добавления логина/пароля
const formAddLogPass = document.getElementById('set-login-password') as HTMLFormElement; 
    // форма выбора логина
const formSelectLogPass = document.getElementById('select-login-sklad-form') as HTMLFormElement;

const addButtonLogPass = document.getElementById('add-login-password') as HTMLButtonElement;
const selectLoginList = document.getElementById('select_login') as HTMLSelectElement;
const selectLoginButton = document.getElementById('select-login-sklad-button') as HTMLButtonElement;
const deleteLoginButton = document.getElementById('delete-login-sklad-button') as HTMLButtonElement;
const checkLoginButton = document.getElementById('check-login-sklad-button') as HTMLButtonElement;
const url = document.getElementById('check_connect_sklad') as HTMLInputElement;

url.value = 'https://api.moysklad.ru/api/remap/1.2/entity/product/metadata';
// -----------------------------------------------------------------------------------------
// ---------------- страницы вкладок настроек ----------------------------------------------
const usersSetting = new UsersSetting();
const skladSetting = new SkladSetting();


// -----------------------------------------------------------------------------------------

const formData: FormAddUsersData = {
    form: formAddUser,
    button: sendButtonAddUser,
    container: tableContainer,
    host: '/addUser'
}


/**
 * добавить пользователя (кнопка формы)
 */
sendButtonAddUser!.addEventListener('click', async (e: Event) => {
    e.preventDefault();
    const response = await usersSetting.addUser(formData);
    
    if (!response.errorsMessages) {
        usersSetting.clearContainer(tableContainer);
        usersSetting.makeTableUsers(tableContainer, response);
    }
});

/**
 * удалить пользователя из таблицы (красные кнопки)
 */
export const listenerDeleteUser = async(e: Event) => {
    const tableArea = e.target;
    if (tableArea instanceof HTMLButtonElement) {
        const delButton = tableArea as HTMLButtonElement;
        const delIdArray = delButton.id.split('-');
        const delId = +(delIdArray[delIdArray.length - 1]);
        const responseTableUsers = await usersSetting.deleteUser(delId);
        usersSetting.clearContainer(tableContainer);
        usersSetting.makeTableUsers(tableContainer, responseTableUsers);
    }
}
table!.addEventListener('click', listenerDeleteUser);


/**
 * добавить логин/пароль к МойСклад
 */
addButtonLogPass.addEventListener('click', async (e: Event) => {
    e.preventDefault();
    const decryptLogins = await skladSetting.addLogPass(formAddLogPass);
    skladSetting.rebuildSelectList(selectLoginList, decryptLogins);
});


/**
 * выбор рабочего логина
 */
selectLoginButton.addEventListener('click', async (e: Event) => {
    e.preventDefault();
    statusOperation.textContent = '';
    const formData = new FormData(formSelectLogPass);
    const sendData = Object.fromEntries(formData);
    const resp = await skladSetting.selectLoginSklad(sendData);
    getStatusOperation<HTMLParagraphElement>(statusOperation, '', (resp.status));
    
});

/**
 * удалить логин/пароль 
 */
deleteLoginButton.addEventListener('click', async (e: Event) => {
    e.preventDefault();
    statusOperation.textContent = '';
    const formData = new FormData(formSelectLogPass);
    const sendData = Object.fromEntries(formData);
    const resp = await skladSetting.deleteLoginSklad(sendData);
    skladSetting.rebuildSelectList(selectLoginList, resp);
    getStatusOperation<HTMLParagraphElement>(statusOperation, 'удалено', (resp.length > 0));
    
});


/**
 * проверка подключения к Мойсклад
 */
checkLoginButton.addEventListener('click', async (e: Event) => {
    e.preventDefault();
    const spiner = document.getElementById('load-data-from-sklad') as HTMLDivElement;
    
    const textarea = document.getElementById('result_connect_sklad') as HTMLTextAreaElement;
    textarea.value = '';
    spiner.classList.add('spinner-border', 'text-success', 'spinner-border-sm');
    const resultConnect = await skladSetting.checkConnectSklad(url.value);
    let status = (resultConnect.status && 
        ((+resultConnect.status >= 200) && (+resultConnect.status < 300)) ? `статус: ${resultConnect.status} УСПЕШНО\n\n` : 
        `статус: ${resultConnect.status}  ОШИБКА\n\n`);
    
    textarea.value = status += JSON.stringify(resultConnect.data);
    spiner.classList.remove('spinner-border', 'text-success', 'spinner-border-sm');
});
