
/**
 * данные (таблица бд) сервисаккаунта для подключения к гуглтаблицам
 */
export interface GserviceCredential {
    id ?: string;
    service_account_email : string;
    private_key: string;
    id_gsheet: string;
}