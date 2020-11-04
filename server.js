'use strict';
// ****************THIS IS THE NEW FILE*************** \\

//--> all requires 

let express = require('express');
let cors = require('cors');
let app = express();
app.use(cors());
require('dotenv').config();
let pg = require('pg');
let superagent = require('superagent');

// all var 

let PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
let client = new pg.Client(DATABASE_URL);


// Application Middleware using at is //
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

app.use('/public', express.static('public'));// show css.... sufaring :( 
app.set('view engine', 'ejs');//using file view &engin=>ejs

function Book(objbook) {

    if (objbook.volumeInfo.imageLinks === undefined) { //image not found ..
        this.image_url = 'https://i.imgur.com/J5LVHEL.jpg'
    } else {//if found +check securiity
        if (!(/https:\/\//.test(objbook.volumeInfo.imageLinks.thumbnail))) {
            this.image_url = 'https' + objbook.volumeInfo.imageLinks.thumbnail.slice(4);
        } else {
            this.image_url = objbook.volumeInfo.imageLinks.thumbnail;
        }
    }
    this.title = objbook.volumeInfo.title;
    this.author = objbook.volumeInfo.authors;
    this.description = objbook.volumeInfo.description ? objbook.volumeInfo.description : "no description";
    this.isbn = objbook.industryIdentifiers;
}


//routs
app.get('/', handleIndex);




app.use('/public', express.static('public'));// show css.... sufaring :( 
app.set('view engine', 'ejs');//using file view &engin=>ejs


// ROUTES
app.get('/', handleIndex);

app.get('/searches/new', (req, res) => {
    res.render('./pages/searches/new');
});

app.post('/searches', handleSearches);

// app.post('/books', handlesave);
app.post('/book', addbook);
app.post('/book/:id',getbook);

app.post('/books',handlesave);

app.post('/book/:id', handleBook);


function Book(objbook) {

    if (objbook.volumeInfo.imageLinks === undefined) { //image not found ..
        this.img = 'https://i.imgur.com/J5LVHEL.jpg'
    } else {//if found +check securiity
        if (!(/https:\/\//.test(objbook.volumeInfo.imageLinks.thumbnail))) {
            console.log(objbook.volumeInfo.imageLinks.thumbnail);
            this.img = 'https' + objbook.volumeInfo.imageLinks.thumbnail.slice(4);
            console.log('after', this.img);
        } else {
            this.img = objbook.volumeInfo.imageLinks.thumbnail;
        }
    }
    this.title = objbook.volumeInfo.title;
    this.author = objbook.volumeInfo.authors;
    this.description = objbook.volumeInfo.description ? objbook.volumeInfo.description : "placeholder";
    this.isbn=objbook.industryIdentifiers;
}







function handleIndex(req, res) {

    let selectst = `SELECT * FROM book;`;
    return client.query(selectst).then(data => {
        let dataFROMsql = data.rows;
        let dataCount = data.rowCount;
        if(dataCount === 0){
            // res.render('pages/searches/new')
        }else{
            res.render('pages/index',{book:data.rows});
        }
=======
    let selectst = `SELECT title, author, isbn, image_url,description FROM book;`;
    client.query(selectst).then(data => {
        let dataFROMsql = data.rows;
        console.log(dataFROMsql);
        console.log('count ....................');
        let dataCount = data.rowCount;
        console.log(dataCount);
        let arr = dataFROMsql.map(element => {
            console.log('i am inside elements ...  ', element);
            return element;
        });
        res.render('./pages/index', { dataROW: arr, rowCounts: dataCount });

    }).catch(err => {
        console.log(err);
    });
}


//API 

function handleSearches(request, response) {
    let titleAuthor = request.body.titleAuthor;
    let filter = request.body.search;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${titleAuthor}+in${filter}`;

    
    superagent.get(url).then(data => {
        let objectApi = data.body.items;

    console.log(url);
    superagent.get(url).then(data => {
        let objectApi = data.body.items;


        let bookArr = objectApi.map(element => {
            return new Book(element);
        });
        response.render('./pages/searches/show', { bookObjects: bookArr });

    }).catch(error => {
        console.log('something went wrong ', error);
    });
}


function addbook(req,res){
    let {author,title,isbn,image_url,description}=req.body;
    // console.log(req.body);
    let insertsql = 'insert into book (author, title, isbn, image_url, descriptions) values ($1, $2, $3, $4, $5) RETURNING id;';
    let values = [author,title, isbn, image_url, description];
    client.query(insertsql, values).then(data=>{
        // console.log(data.rows[0].id);
     res.redirect(`/book/${data.rows[0].id}`);
    })
}
function getbook(req,res){
    let sql = 'select * FROM book WHERE id=$1;';
    let value = [req.params.id];
// console.log(value);
    client.query(sql,value)
    .then(result => {
        console.log(result)
     res.render('pages/books/show',{book:result.rows[0]});
    }).catch(err => {
        console.log(err);
    });
}

function handlesave(req,res){
    

}










function handleBook(req, res) { //renser single book to viwe-pages-books-detail.ejs
    let sql = 'SELECT * FROM tasks WHERE id=$1;'
    let bookid = [req.params.id];
    return client.query(sql, bookid)
        .then(data => {
            return res.render('pages/books/detail', { book: data.rows[0] });
        })
        .catch(err => handleError(err, res));
}


client.connect().then((data) => {
    app.listen(PORT, () => {
        console.log(` listing to port ${PORT}`);

    });
}).catch(err => {
    console.log(err);
});