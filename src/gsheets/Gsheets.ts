import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet';
import dotenv from 'dotenv';
import { db } from '..';
import { GserviceCredential } from '../types/gauth/GserviceCredential';

dotenv.config();

export class Gsheets {
    private SCOPES = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
        ];
    private gkey = process.env.GKEY || '';

    async gdoc() {
        try {
            const creds: GserviceCredential[] = await db.getGoogleServiceAccountCredential();
            console.log(creds)
            const jwt = new JWT({
            email: creds[0].service_account_email,
            key: this.gkey,
            scopes: this.SCOPES,
            });
            const doc = new GoogleSpreadsheet(creds[0].id_gsheet, jwt);
            
            await doc.loadInfo();
            const sheet = doc.sheetsByTitle['testlist'];
            await sheet.addRow({ 
                "имя": 'SkX',
                family: 'Pok',
                
            });
        } catch (e) { console.log(e);return} 
        
          
    }
}

 