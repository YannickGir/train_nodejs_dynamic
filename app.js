const express = require('express')
const {status} = require("express/lib/response")
const app = express()

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
res.status(200).render('Home', {name,datas,titlePage} )
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