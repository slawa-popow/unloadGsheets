import { listenerDeleteUser } from "../..";

export class BaseSettings {

    fillContainer(cnt: HTMLElement, obj: HTMLElement) {
        if (cnt) 
            cnt.appendChild(obj);
    }

    clearContainer(cnt: HTMLElement): void {
        if (cnt)
            for (let domElem of Array.from(cnt.children)) {
                if (domElem instanceof HTMLTableElement) {
                    domElem.removeEventListener('click', listenerDeleteUser);
                }
                cnt.removeChild(domElem);
            }
    }
}