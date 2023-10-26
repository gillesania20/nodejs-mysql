import 'dotenv/config';
import express from 'express';
import mysql from 'mysql';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3500;
const app = express();
const connection = mysql.createConnection({
    host: process.env.CONNECTION_HOST,
    user: process.env.CONNECTION_USER,
    password: process.env.CONNECTION_PASSWORD,
    //database: process.env.CONNECTION_DATABASE
});
app.get('/create-db', (req, res) => {
    let sql = `CREATE DATABASE ${process.env.CONNECTION_DATABASE}`;
    let sql2 = `USE ${process.env.CONNECTION_DATABASE}`;
    connection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).send('Failed to create the database');
        }else{
            connection.query(sql2, (err2, result2) => {
                if(err2){
                    res.status(400).send('Cannot use the database');
                }else{
                    res.status(200).send('Databse created then used');
                }
            });
        }
    });
});
app.get('/use-db', (req, res) => {
    let sql = `USE ${process.env.CONNECTION_DATABASE}`;
    connection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).send('Failed to use database');
        }else{
            res.status(200).send('Successfully used the database');
        }
    });
});
app.get('/create-posts-table', (req, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))';
    connection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            res.status(400).send('Failed to create the posts table');
        }else{
            res.status(201).send('Posts table created');
        }
    });
});
app.get('/add-post', (req, res) => {
    let post = { title: 'Post One', body: 'Post one body' };
    let sql = 'INSERT INTO posts SET ?';
    let query = connection.query(sql, post, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send('Failed to add post');
        }else{
            res.status(201).send('Post added');
        }
    });
});
app.get('/get-posts', (req, res) => {
    let sql = 'SELECT * FROM posts';
    let query = connection.query(sql, (err, results) => {
        if(err){
            console.log(err);
            res.status(400).send('Failed to get posts');
        }else{
            console.log(results);
            res.status(200).send('Posts found');
        }
    });
});
app.get('/posts/:id', (req, res) => {
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    let query = connection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send('Failed to get post');
        }else{
            console.log(result);
            res.status(200).send('Post found');
        }
    });
});
app.get('/update-post/:id', (req, res) => {
    let newTitle = 'Updated Title';
    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
    let query = connection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.send('Failed to update post');
        }else{
            res.send('Post updated');
        }
    });
});
app.get('/delete-post/:id', (req, res) => {
    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
    let query = connection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send('Failed to delete post');
        }else{
            res.status(200).send('Post deleted');
        }
    });
});
app.listen(PORT, ()=>{
    connection.connect((err) => {
        if(err){
            console.log('Cannot connect to DB');
        }else{
            console.log(`Listening to port: ${PORT}`);
        }
    });
});