const express = require('express')
const {status} = require("express/lib/response")
const app = express()
const mysql = require('mysql2')
const myConnection = require('express-myconnection')

//création d'un objet contenant les différents paramètres de connexion à la bdd mysql
const optionsbd = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'notes_bd'}

 //middleware pour connexion, va notamment ajouter à req la méthode getConnection()
 app.use(myConnection(mysql, optionsbd,'pool'))   

//implémentation du moteur d'affichage ejs
app.set("view engine", "ejs");
    //définition de l'endroit où se trouvent les views
app.set("views", "components");

app.get('/', (req, res)=>{
    res.status(300).redirect('home')
})

app.get('/home', (req, res)=> {
    const titlePage = 'Accueil'
    const name ='Yannick';
    const datas = [
        {id : 1, todo: "Send a letter", date: 'tomorrow'},
        {id : 2, todo: "Shopping", date: 'today'},
        {id : 3, todo: "Clean up house", date: 'after tomorrow'},
    ]
    req.getConnection((erreur, connection)=>{
        if(erreur)
        console.log(erreur);
        else 
        connection.query('SELECT * FROM notes', [], (erreur, resultat) => {
        if (erreur)
            console.log(erreur);
        else 
            res.status(200).render('Home', {resultat, name,datas,titlePage})
        } )
    })
    
})

app.get('/apropos', (req, res)=> {
    const titlePage = 'A propos'
    res.status(200).render('Apropos', {titlePage})
    })

app.use((req, res)=> {
        const titlePage = 'Error 404'
        res.status(404).render('PageIntrouvable', {titlePage})
        })


app.listen(3001)
console.log('connected to the server !');