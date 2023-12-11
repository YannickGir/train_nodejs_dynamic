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
 
 //extraction des données du formulaire par ce middleware fourni par Express pour analyser les données provenant de formulaires HTML qui sont envoyées par des requêtes POST et ce en utilisant le module querystring permettant l'accès aux données via req.body.
 app.use(express.urlencoded({extended:false}));

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
//DELETE FROM `notes_bd`.`notes` WHERE (`id` = '6');

app. delete('/notes/:id', (req, res)=> {
    let id = req.params.id
    req.getConnection((error, connection)=>{
        if(error)
        console.log(error);
        else 
        connection.query('DELETE FROM notes WHERE id = ?', [id], (error, result) => {
            if (error){
                console.error(error);
                return res.status(500).json({ error: 'Internal Server Error' });
        }
      
            else 
                res.status(200).json({ endpoint: '/Home' });
        } )
    })
})
app.post('/notes', (req, res)=> {
    /*chaque fois que cette route est appelée on récupère l'id, mais attention cela dépend si on veut modifier ou créer un nouvelle note, 
    si c'est une nouvelle note il ne faut pas récupérer d'id car il faut qu'il soit null afin qu'il soit généré automatiquement 
    par SQL au moment de l'enregistrement d'une nouvelle note en BDD, donc ajouter une condition ternaire*/
    let id = req.body.id === "" ? null : req.body.id
    var title = req.body.titre
    var description = req.body.description
    let requeteSQL = id === null ? `INSERT INTO notes (id, title, description) VALUES (?, ?, ?)` : `UPDATE notes SET title = ?, description = ? WHERE id = ?`
    let parameters = id === null ? [null, title, description] : [title, description, id]
   
    req.getConnection((erreur, connection)=>{
        if(erreur)
        console.log(erreur);
        else 
        connection.query(requeteSQL, parameters, (erreur, resultat) => {
        if (erreur)
            console.log(erreur);
        else 
            res.status(300).redirect('Home')
        } )
    })
})


app.use((req, res)=> {
        const titlePage = 'Error 404'
        res.status(404).render('PageIntrouvable', {titlePage})
        })


app.listen(3001)
console.log('connected to the server !');