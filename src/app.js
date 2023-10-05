import express from 'express';
import Handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import productsRouter from './router/products.router.js';
import sessionRouter from './router/sessions.router.js';
import cartRouter from './router/carts.router.js';
import __dirname from './utils.js';
import viewsRouter from './router/views.router.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializeStrategies from './config/passport.config.js';
import multer from 'multer';


const app = express();

app.use(session({
    store:MongoStore.create({
        mongoUrl:"mongodb+srv://andressuarez:123@cluster0.cdu1txg.mongodb.net/redbull?retryWrites=true&w=majority",
        ttl:3600
    }),
    resave:false,
    saveUninitialized:false,
    secret:'fasanti'
}))

initializeStrategies();
app.use(passport.initialize());

const connection = mongoose.connect("mongodb+srv://andressuarez:123@cluster0.cdu1txg.mongodb.net/redbull?retryWrites=true&w=majority")

app.use(express.static(`${__dirname}/public`))
app.use(express.json());

//configuracion de handlebars
const hbs = Handlebars.create();
hbs.allowProtoPropertiesByDefault = true;

app.engine('handlebars',Handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

const PORT = process.env.PORT || 8080;

app.use('/',viewsRouter);
app.use('/api/sessions',sessionRouter);

app.listen(PORT,()=>console.log(`Listening on ${PORT}`));

//middlewars
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static((`${__dirname}/public`)));
app.use(cookieParser("Galleta"));

//routes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRouter);

