const { validationResult } = require('express-validator');
const { Movie, Sequelize } = require('../database/models');
const { response } = require('express');


//Otra forma de llamar a los modelos
/* const Movies = db.Movie; */

const moviesController = {
    'list': (req, res) => {
        Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        Movie.findAll({
            where: {
                rating: {[Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        return res.render("moviesAdd"); 
    },
    create: function (req, res) {
        const errors = validationResult(req);
    
         if(errors.isEmpty()){
            const { title, awards, release_date, length, rating } = req.body;

            Movie.create({
                /* ...req.body */
                title, 
                awards, 
                release_date, 
                length, 
                rating 
            })
            .then((addedmovie) =>{
               return res.redirect("/movies")
            })
            .catch((error)=> console.log(error))
         }else{
            return res.render("moviesAdd", {errors: errors.mapped()})
         }
    },
    edit: function(req, res)  {
        const MOVIE_ID = req.params.id;

        Movie.findByPk(MOVIE_ID)
        .then((Movie) => {
            return res.render("moviesEdit", {Movie})
        })
        .catch(error => console.log(error));
    },
    update: function (req,res) {
        const movieId = req.params.id
        const errors = validationResult(req);

        if(errors.isEmpty()){
            const {
                title,
                awards,
                release_date,
                lenght,
                rating
                }= req.body
            Movie.update({
                title,
                awards,
                release_date,
                lenght,
                rating
            },{
                where: {
                    id: movieId,
                }
            })
            .then((response) => {
                if(response){
                   return res.redirect(`/movies/detail/${movieId}`)
                }else{
                    throw new Error()
                }
            })
            .catch(error=> {
                return console.log(error)
            })

        }else{
            Movie.findByPk(movieId)
            .then(Movie => {
            return res.render("moviesEdit",{Movie, errors:errors.mapped()})
        })
        .catch((error)=>console.log(error))
        }


    },
    delete: function (req, res) {
        const MOVIE_ID = req.params.id;

        Movie.findByPk(MOVIE_ID)
        .then(movieToDelete => res.render("moviesDelete",   { Movie:movieToDelete})
        )
        .catch(error => console.log(error));
    },
    destroy: function (req, res) {
        const MOVIE_ID = req.params.id;
        Movie.destroy({
            where:{
                id: MOVIE_ID
            }
        })
        .then(() =>{
            return res.redirect("/movies");

        })
        .catch(error => console.log(error))
    }

}

module.exports = moviesController;