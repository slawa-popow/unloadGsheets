import { UsersSetting } from "./src/settings/admins/UsersSetting";
import { SkladSetting } from "./src/settings/mysklad/SkladSetting";
import { FormAddUsersData } from "./src/types/UsersSettingTypes/FormAddUsersData";


// ------------------------ пользователи ------------------------------------------------
const tableContainer = document.getElementById('table-users-content') as HTMLDivElement;
const table = document.getElementById('table-admins');
const formAddUser = document.getElementById('add-adimin-form') as HTMLFormElement;
const sendButtonAddUser = document.getElementById('add-user-button') as HTMLButtonElement;

// ----------------------------------------------------------------------------------------
// ----------------------- мойсклад -------------------------------------------------------
    // форма добавления логина/пароля
const formAddLogPass = document.getElementById('set-login-password') as HTMLFormElement; 
    // форма выбора логина
const formSelectLogPass = document.getElementById('select-login-sklad-form') as HTMLFormElement;

const addButtonLogPass = document.getElementById('add-login-password') as HTMLButtonElement;
const selectLoginList = document.getElementById('select_login') as HTMLSelectElement;
const selectLoginButton = document.getElementById('select-login-sklad-button') as HTMLButtonElement;


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
    const response = await skladSetting.addLogPass(formAddLogPass);
    console.log('resp add logpass: ', response);
});
