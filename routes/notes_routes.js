const express = require('express')
const router = express.Router()

const { body, validationResult } = require('express-validator');

router.get('/', (req, res)=>{
    res.status(300).redirect('home')
})

router.get('/home', (req, res)=> {
    const titlePage = 'Accueil'
    const name ='Yannick';
    const datas = [
        {id : 1, todo: "Send a letter", date: 'tomorrow'},
        {id : 2, todo: "Shopping", date: 'today'},
        {id : 3, todo: "Clean up house", date: 'after tomorrow'},
    ]
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
            res.status(500).render('../components/error.ejs', { erreur, titlePage });
        } else {
            connection.query('SELECT * FROM notes', [], (erreurQuery, resultat) => {
                if (erreurQuery) {
                    console.log(erreurQuery);
                    res.status(500).render('../components/error.ejs', { erreur: erreurQuery, titlePage });
                } else {
                    // Check if there are validation errors
                    const validationErrors = validationResult(req);
    
                    res.status(200).render('Home', {
                        resultat,
                        name,
                        datas,
                        titlePage,
                        errors: validationErrors.array(),  // Include validation errors here
                    });
                }
            });
        }
    });
    
    
})

router.get('/apropos', (req, res)=> {
    const titlePage = 'A propos'
    res.status(200).render('Apropos', {titlePage})
    })
//DELETE FROM `notes_bd`.`notes` WHERE (`id` = '6');

router. delete('/notes/:id', (req, res)=> {
    let id = req.params.id
    req.getConnection((error, connection)=>{
        if(error){
            console.log(error);
            res.status(500).render('../components/error.ejs', {error, titlePage})
            }
        else 
        connection.query('DELETE FROM notes WHERE id = ?', [id], (error, result) => {
            if (error){
                console.error(error);
                res.status(500).render('../components/error.ejs', {error, titlePage})
        }
      
            else 
                res.status(200).json({ endpoint: '/Home' });
        } )
    })
})
router.post('/notes',  
  body('titre').notEmpty().withMessage('Title cannot be empty').escape(),body('description').notEmpty().withMessage('Description cannot be empty').escape(),
  (req, res)=> {
    /*chaque fois que cette route est appelée on récupère l'id, mais attention cela dépend si on veut modifier ou créer un nouvelle note, 
    si c'est une nouvelle note il ne faut pas récupérer d'id car il faut qu'il soit null afin qu'il soit généré automatiquement 
    par SQL au moment de l'enregistrement d'une nouvelle note en BDD, donc ajouter une condition ternaire*/

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      const titlePage = 'Accueil'; 
      const name ='Yannick';
      return res.status(422).render('error', { erreur: errors.array(), name, titlePage });
    }
    
    let id = req.body.id === "" ? null : req.body.id
    var title = req.body.titre
    var description = req.body.description
    let requeteSQL = id === null ? `INSERT INTO notes (id, title, description) VALUES (?, ?, ?)` : `UPDATE notes SET title = ?, description = ? WHERE id = ?`
    let parameters = id === null ? [null, title, description] : [title, description, id]
   
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
            res.status(500).render('../components/error.ejs', {erreur, titlePage})
            }
        else 
        connection.query(requeteSQL, parameters, (erreur, resultat) => {
        if (erreur){
            console.log(erreur);
            res.status(500).render('../components/error.ejs', {erreur, titlePage})
            }
        else 
            res.status(300).redirect('Home')
        } )
    })
})

module.exports = router