'use strict';
//--> all requires 
let express = require('express');
let cors = require('cors');
let app = express();
app.use(cors());
require('dotenv').config();
let pg = require('pg');
let superagent = require('superagent');

// all var 
let PORT = process.env.PORT || 3000;
// Application Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');//using file view &engin=>ejs

// ROUTES
app.get('/', (req, res) => {
    res.render('./pages/index');
});

app.get('/searches/new', (req, res) => {
    res.render('./pages/searches/new');
});

app.get('/searches', handleSearches);


//API
function Book(objbook) {
   
    if(objbook.volumeInfo.imageLinks ===undefined){this.img ='https://i.imgur.com/J5LVHEL.jpg'}else{this.img = objbook.volumeInfo.imageLinks.thumbnail;}
    this.title = objbook.volumeInfo.title;
    this.author = objbook.volumeInfo.authors;
    this.description = objbook.volumeInfo.description;
    

}


function handleSearches(request, response) {
    let titleAuthor = request.query.titleAuthor;


    let filter= request.body.search;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${titleAuthor}+in${filter}`;

    superagent.get(url).then(data => {
        let objectApi = data.body.items;
      
       let bookArr = objectApi.map(element => {
           
         

          return new Book(element);
         });
    
   
        response.render('./pages/searches/show', {bookObjects: bookArr});
          
          
       

    }).catch(error => {

        console.log('something went wrong ', error);
    });


}







// listen to app
app.listen(PORT, () => {
    console.log(` listing to port ${PORT}`);

});