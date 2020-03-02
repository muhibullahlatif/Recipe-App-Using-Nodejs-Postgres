var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

const { Pool, Client } = require("pg");

// DB Connection String    
    const pool = new pg.Pool({
        user: "postgres_username",
        host: "localhost",
        database: "db_name",
        password: "db_password",
        port: "5432"
    });

// Assign Dust Engine to .dust files
app.engine('dust', cons.dust);

// Set default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Get All Recipe Data
app.get('/', function(req, res){
    try{
        pool.connect(function(err, client, done){
            if(err){
                return console.error('Error fetching client from pool', err);
            }
            client.query('SELECT * FROM recipes ORDER BY recipe_id', function(err, result){
                if(err){
                    return console.error('Error Running Query', err);
                }
                res.render('index', {recipes: result.rows});
                done();
            });
        });
    }
    catch(err){
        console.log(err);
    }
});

// Add New Recipe
app.post('/add', function(req, res){
    try{
        pool.connect(function(err, client, done){
            if(err){
                return console.error('Error fetching client from pool', err);
            }
            client.query("INSERT INTO recipes (recipe_name, recipe_ingredients, recipe_directions) VALUES ($1, $2, $3)",
            [req.body.recipe_name, req.body.recipe_ingredients, req.body.recipe_directions]
            );
            // console.log(req.body.recipe_name, req.body.recipe_ingredients, req.body.recipe_directions);
            done();
            res.redirect('/');
        });
    }
    catch(err){
        console.log(err);
    }
});

// Delete Recipe 
app.delete('/delete/:id', function(req, res){
    try{
        pool.connect(function(err, client, done){
            if(err){
                return console.error('Error fetching client from pool', err);
            }
            client.query('DELETE FROM recipes WHERE recipe_id = $1', [req.params.id]);
            done();
            res.sendStatus(200);
        });
    }
    catch(err){
        console.log(err);
    }
});

// Update Recipe
app.post('/edit', function(req, res){
    try{
        pool.connect(function(err, client, done){
            if(err){
                return console.error('Error fetching client from pool', err);
            }
            client.query("UPDATE recipes SET recipe_name = $1, recipe_ingredients = $2, recipe_directions = $3 WHERE recipe_id = $4 ", 
            [req.body.recipe_name_input, req.body.recipe_ingredients_input, req.body.recipe_directions_input, req.body.recipe_id_input]);
            done();
            res.redirect('/');
        });
    }
    catch(err){
        console.log(err);
    }
});

// Server 
app.listen(3000, function(){
    console.log('Server Started On Port 3000');
});
