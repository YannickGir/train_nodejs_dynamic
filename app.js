const express = require('express')
const {status} = require("express/lib/response")
const app = express()
const mysql = require('mysql2')
const myConnection = require('express-myconnection')
require('dotenv').config();
const notes_routes = require('./routes/notes_routes')


//création d'un objet contenant les différents paramètres de connexion à la bdd mysql
const optionsbd = {
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    port: 3306,
    database: 'notes_bdd'}

 //middleware pour connexion, va notamment ajouter à req la méthode getConnection()
 app.use(myConnection(mysql, optionsbd,'pool'))  
 
 //extraction des données du formulaire par ce middleware fourni par Express pour analyser les données provenant de formulaires HTML qui sont envoyées par des requêtes POST et ce en utilisant le module querystring permettant l'accès aux données via req.body.
 app.use(express.urlencoded({extended:false}));

//implémentation du moteur d'affichage ejs
app.set("view engine", "ejs");
    //définition de l'endroit où se trouvent les views
app.set("views", "components");

//définition des routes 
app.use(notes_routes);

app.use((req, res)=> {
        const titlePage = 'Error 404'
        res.status(404).render('PageIntrouvable', {titlePage})
        })


app.listen(3001)
console.log('connected to the server !');