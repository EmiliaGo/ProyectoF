//dependencias, importando
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

//config para el uso de peticiones post
app.use(bodyParser.urlencoded({extended:false}));

//para darle estilo
app.use(express.static(__dirname + '/public'));

//plantillas dinamicas
app.set('view engine','ejs');

//conexion 
const db = mysql.createConnection({
    host: 'localhost',//server
    user: 'root',//usuario de bd
    password: '1234',//pass de bd
    database: 'node_crud',//nombre de la base de datos
    port: 3306//perto
});

db.connect(err=>{
    if(err){
        console.log(`Error en la conexion de base de datos${err}`);
    }else{
        console.log(`La base de datos funciona y esta conectada`);
    }
});

//inicamos el server
//const hostname= '192.168.3.115'
const port = 3008;
app.listen(port,()=>{
    console.log(`El servidor esta en http://192.168.82.89:${port}`); 
    //console.log(`El servidor esta en https://${hostname}:${port}`); 
});

//index
app.get('/',(req,res)=>{
    //consulta bd
    const query = 'SELECT id, name, email, telefono, direccion, edad, fecha_nacimiento, comida_fav FROM users';
    //trabajamos en la conexion
    db.query(query,(err,results)=>{
        if(err){
            console.error(`Error en el BD código ${err}`);
            res.send('Error en conexion a la DB');
        }else{
            res.render('index',{users:results});
        }
    });
});


// Ruta para mostrar el formulario de agregar usuario
app.get('/add', (req, res) => {
    res.render('add');
});

//Agregar usuarios
app.post('/add', (req, res) => {
    const { name, email, telefono, direccion, edad, fecha_nacimiento, comida_fav } = req.body;
    const query = 'INSERT INTO users (name, email, telefono, direccion, edad, fecha_nacimiento, comida_fav) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, telefono, direccion, edad, fecha_nacimiento, comida_fav], (err) => {
        if (err) {
            console.error("Error en agregar usuario", err);
            res.send("Error en agregar usuario");
        } else {
            res.redirect('/');
        }
    });
});



//Editar  usuario
app.get('/edit/:id',(req,res)=>{
    const {id}=req.params;
    //const { name, email, telefono, direccion, edad, fecha_nacimiento, comida_fav } = req.body;
    const query='SELECT * FROM users WHERE id = ?';
    db.query(query,[id],(err,results)=>{
        if(err){
            console.log("Error en buscar usuario", err);
            res.send("Error en buscar usuario");
        }else{
            res.render('edit',{user:results[0]});
        }
    });
});

app.post('/edit/:id', (req, res) => {
    const {id}=req.params;
    const {name, email, telefono, direccion, edad, fecha_nacimiento, comida_fav}=req.body;
    const query= 'UPDATE users SET name =?, email =?, telefono=?, direccion=?, edad=?, fecha_nacimiento=?, comida_fav=? WHERE id = ?';
    db.query(query, [name, email, telefono, direccion, edad, fecha_nacimiento, comida_fav, id], (err) => {
        if (err) {
            console.error("Error al actualizar usuario:", err);
            res.send("Error al actualizar usuario");
        } else {
            res.redirect('/');
        }
    });
});

//Eliminar usuario
app.get('/delete/:id',(req,res)=>{
    const {id}=req.params;
    const query='DELETE FROM users WHERE id = ?';
    db.query(query,[id],(err)=>{
        if(err){
            res.send("Error al eliminar", err);
        }else{
            res.redirect('/');
        }
    });
});
