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
    const name ='Yannick'
res.status(200).render('Home', {name} )
})

app.get('/apropos', (req, res)=> {
    res.status(200).render('Apropos')
    })

app.use((req, res)=> {
        res.status(404).render('PageIntrouvable')
        })


app.listen(3001)
console.log('connected to the server !');