
import cors from 'cors';
import path  from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import { mainRouter } from './routes/mainRouter';
import { MysqlClient } from './database/MysqlClient';
import session from 'express-session';
import { Db } from './database/db';
import passport from 'passport';
import { Gprofile } from './types/gauth/Gprofile';
import { PassedRequestEncryptLogPass } from './types/dbTypes/AddLogPass';
import { MoySklad } from './sklad/MoySklad';

export const MODE_DEV = true;

declare module 'express-session' {
  interface SessionData {
    clientData ?: any;
    
  }
}

declare module "express-serve-static-core" {
  interface Request {
    encLogPass: PassedRequestEncryptLogPass;
  }
}

dotenv.config();

export const mysqlc = new MysqlClient();
export const db = new Db(mysqlc);
export const sklad = new MoySklad(db);
export const app = express();

const secret = process.env.SECRET || '123';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(cors({credentials: true}));

app.use(session({
  name: 'sos',
  secret: secret,
  store: mysqlc.sessionStore,
  saveUninitialized: false,
  resave: false,
  cookie: {maxAge: 1*24*60*60*1000, secure: false, httpOnly: true }
}));

const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: MODE_DEV ? '/google/callback' : "https://moysklad.kitopt24.site/google/callback",
    passReqToCallback: true,
  },
  async function( _request: Request, _accessToken: any, _refreshToken: any, profile: Gprofile, done: (err: any, arg1: any) => any) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    return done(null, user);
});

passport.deserializeUser(function(user: any, done) {
    return done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../public'))); 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars'); 
app.set('views', __dirname + '/../views');
 
// const expiryOffset = 1*24*60*60*1000; // +1 day

app.use('/', mainRouter);
 
const port = process.env.PORT;

app.listen(port, () => { 
  console.log(`\nRunning App at localhost:${port}\n`)   
});  