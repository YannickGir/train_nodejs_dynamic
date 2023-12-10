const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.status(300).redirect('/home')
})

app.get('/home', (req, res)=> {
res.status(200).sendFile('./components/Home.html', {root: __dirname})
})

app.get('/apropos', (req, res)=> {
    res.status(200).sendFile('./components/Apropos.html', {root: __dirname})
    })

app.use((req, res)=> {
        res.status(404).sendFile('./components/PageInstrouvable.html', {root: __dirname})
        })


app.listen(3001)
console.log('connected to the server !');