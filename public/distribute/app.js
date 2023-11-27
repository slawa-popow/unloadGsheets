/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/index.ts":
/*!*************************!*\
  !*** ./public/index.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listenerDeleteUser = void 0;
const UsersSetting_1 = __webpack_require__(/*! ./src/settings/admins/UsersSetting */ "./public/src/settings/admins/UsersSetting.ts");
const SkladSetting_1 = __webpack_require__(/*! ./src/settings/mysklad/SkladSetting */ "./public/src/settings/mysklad/SkladSetting.ts");
// ------------------------ пользователи ------------------------------------------------
const tableContainer = document.getElementById('table-users-content');
const table = document.getElementById('table-admins');
const formAddUser = document.getElementById('add-adimin-form');
const sendButtonAddUser = document.getElementById('add-user-button');
// ----------------------------------------------------------------------------------------
// ----------------------- мойсклад -------------------------------------------------------
// форма добавления логина/пароля
const formAddLogPass = document.getElementById('set-login-password');
// форма выбора логина
const formSelectLogPass = document.getElementById('select-login-sklad-form');
const addButtonLogPass = document.getElementById('add-login-password');
const selectLoginList = document.getElementById('select_login');
const selectLoginButton = document.getElementById('select-login-sklad-button');
// -----------------------------------------------------------------------------------------
// ---------------- страницы вкладок настроек ----------------------------------------------
const usersSetting = new UsersSetting_1.UsersSetting();
const skladSetting = new SkladSetting_1.SkladSetting();
// -----------------------------------------------------------------------------------------
const formData = {
    form: formAddUser,
    button: sendButtonAddUser,
    container: tableContainer,
    host: '/addUser'
};
/**
 * добавить пользователя (кнопка формы)
 */
sendButtonAddUser.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const response = yield usersSetting.addUser(formData);
    if (!response.errorsMessages) {
        usersSetting.clearContainer(tableContainer);
        usersSetting.makeTableUsers(tableContainer, response);
    }
}));
/**
 * удалить пользователя из таблицы (красные кнопки)
 */
const listenerDeleteUser = (e) => __awaiter(void 0, void 0, void 0, function* () {
    const tableArea = e.target;
    if (tableArea instanceof HTMLButtonElement) {
        const delButton = tableArea;
        const delIdArray = delButton.id.split('-');
        const delId = +(delIdArray[delIdArray.length - 1]);
        const responseTableUsers = yield usersSetting.deleteUser(delId);
        usersSetting.clearContainer(tableContainer);
        usersSetting.makeTableUsers(tableContainer, responseTableUsers);
    }
});
exports.listenerDeleteUser = listenerDeleteUser;
table.addEventListener('click', exports.listenerDeleteUser);
/**
 * добавить логин/пароль к МойСклад
 */
addButtonLogPass.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const response = yield skladSetting.addLogPass(formAddLogPass);
    console.log('resp add logpass: ', response);
}));


/***/ }),

/***/ "./public/src/settings/BaseSettings.ts":
/*!*********************************************!*\
  !*** ./public/src/settings/BaseSettings.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseSettings = void 0;
const __1 = __webpack_require__(/*! ../.. */ "./public/index.ts");
class BaseSettings {
    fillContainer(cnt, obj) {
        if (cnt)
            cnt.appendChild(obj);
    }
    clearContainer(cnt) {
        if (cnt)
            for (let domElem of Array.from(cnt.children)) {
                if (domElem instanceof HTMLTableElement) {
                    domElem.removeEventListener('click', __1.listenerDeleteUser);
                }
                cnt.removeChild(domElem);
            }
    }
}
exports.BaseSettings = BaseSettings;


/***/ }),

/***/ "./public/src/settings/admins/UsersSetting.ts":
/*!****************************************************!*\
  !*** ./public/src/settings/admins/UsersSetting.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersSetting = void 0;
const BaseSettings_1 = __webpack_require__(/*! ../BaseSettings */ "./public/src/settings/BaseSettings.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./public/index.ts");
class UsersSetting extends BaseSettings_1.BaseSettings {
    constructor() {
        super();
    }
    addUser(formDatas) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData(formDatas.form);
            const sendData = Object.fromEntries(formData);
            try {
                const response = yield fetch(formDatas.host, {
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
                const resp = yield response.json();
                return resp;
            }
            catch (err) {
                console.log('------- *** --------', '\n', err, '\n', '------- *** --------');
            }
        });
    }
    makeTableUsers(cnt, responseUsers) {
        const table = document.createElement('table');
        table.addEventListener('click', __1.listenerDeleteUser);
        table.classList.add('table', 'table-sm', 'table-success', 'table-striped');
        table.setAttribute('id', 'table-admins');
        const thead = document.createElement('thead');
        thead.classList.add('table-dark');
        const tr = document.createElement('tr');
        const titleTable = ['№', 'Имя', 'email', 'ico', 'Удалить'];
        titleTable.forEach((val) => {
            const th = document.createElement('th');
            th.scope = "col";
            th.innerText = val;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        responseUsers.forEach((val, i, arr) => {
            const tr = document.createElement('tr');
            const values = Object.values(val);
            values.push(" ");
            const lenValues = values.length;
            values.forEach((el, index) => {
                const td = document.createElement('td');
                if (index === lenValues - 1) {
                    const delbtn = document.createElement('button');
                    delbtn.setAttribute('id', `delete-user-${arr[i].id}`);
                    delbtn.setAttribute('type', 'button');
                    delbtn.setAttribute('style', 'width: 100%;');
                    delbtn.classList.add('btn', 'btn-danger', 'btn-sm');
                    delbtn.textContent = '✘';
                    td.appendChild(delbtn);
                    tr.appendChild(td);
                }
                if (index === lenValues - 2) {
                    const ico = document.createElement('img');
                    ico.setAttribute('src', el === '' ? 'images/icons/some-user.jpg' : el);
                    ico.setAttribute('style', 'width: 30px; height: 30px;');
                    td.appendChild(ico);
                    tr.appendChild(td);
                }
                if (index < lenValues - 2) {
                    td.textContent = el;
                    tr.appendChild(td);
                }
            });
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
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`/deleteUser/${id}`, {
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
                const resp = yield response.json();
                return resp;
            }
            catch (err) {
                console.log('------- *** --------', '\n', err, '\n', '------- *** --------');
            }
        });
    }
}
exports.UsersSetting = UsersSetting;


/***/ }),

/***/ "./public/src/settings/mysklad/SkladSetting.ts":
/*!*****************************************************!*\
  !*** ./public/src/settings/mysklad/SkladSetting.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkladSetting = void 0;
const BaseSettings_1 = __webpack_require__(/*! ../BaseSettings */ "./public/src/settings/BaseSettings.ts");
class SkladSetting extends BaseSettings_1.BaseSettings {
    constructor() {
        super();
    }
    addLogPass(form) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData(form);
            const sendData = Object.fromEntries(formData);
            try {
                const response = yield fetch('/addLoginPassword', {
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
                const resp = yield response.json();
                return resp;
            }
            catch (err) {
                console.log('------- *** --------', '\n', err, '\n', '------- *** --------');
            }
        });
    }
}
exports.SkladSetting = SkladSetting;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./public/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=app.js.map