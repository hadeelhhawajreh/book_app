DROP TABLE IF EXISTS book;
CREATE TABLE book(
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    image_url VARCHAR(255),
    descriptions TEXT
);
INSERT INTO book (author,title, isbn, image_url,descriptions)
 VALUES (
  'Agatha Christie',
  'Miracles of Christmas',
  'ISBN_13 087788563X',
  'http://books.google.com/books/content?id=5WlKPQAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
   'Stories by Pearl Buck, Agatha Christie, Elizabeth Goudge, Sarah Orne Jewett, and others will help you see the magic and miracles of Christmas. Reading these stories alone or with friends and family will dramatically enrich your holiday.');
INSERT INTO book (title, author, isbn, image_url,descriptions) 
VALUES (
 'Agatha Christie',
 'الخصم السري',
 'ISBN_10 9668020944',
 'http://books.google.com/books/content?id=ghEiyQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
  'تومي وتوبنس شابان ، في حالة حب ... وكسرت الشقة. يزعجهم الإثارة ، يقررون الشروع في مخطط أعمال جريء على استعداد لفعل أي شيء ، والذهاب إلى أي مكان.');