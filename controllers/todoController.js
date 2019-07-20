//mongodb+srv://bob:bob*@cluster0-widtd.mongodb.net/test?retryWrites=true&w=majority

var bodyParser = require('body-parser');
var mongoose  = require('mongoose');

// connect to DB
//mongoose.connect('mongodb+srv://<username>:<pwd>@cluster0-widtd.mongodb.net/<DBName>?retryWrites=true&w=majority', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://bob:bob@cluster0-widtd.mongodb.net/nodetodolist?retryWrites=true&w=majority', { useNewUrlParser: true });

// create schema - this is like a blueprint for the data
// ie , what the db is expecting the data to look like
var todoSchema = new mongoose.Schema({
item: String
})

// this is a model type to hold the data
var Todos = mongoose.model('Todos', todoSchema);
// var itemOne = Todos({item:'Buy flowers'}).save(function(err){
//     if(err)throw err;    
//     console.log('SAVED');
// });
// var data = [
//     {item:'get milk'},
//     {item:'Walk Dog'},
//     {item:'Do some code'}
// ];

var urlencodedParser = bodyParser.urlencoded({extended:false});

module.exports = function(app){

    app.get('/todo', function(req, res){
        // gets all the data from the mongodb table
        Todos.find({}, function(err , data){
            if(err) throw err;
            res.render('todo', {todos: data});
        });    
    });

    app.post('/todo', urlencodedParser, function(req, res){
        // get data from the view and add it to mongodb
        var newTodo = Todos(req.body).save(function(err, data){
            if(err) throw err;
            res.json(data);
        }) ;
    });

    app.delete('/todo/:item', function(req, res){
        // delete the requested item from mongodb
        // also removing the hyphens in the text, with spaces
        Todos.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
            if(err) throw err;
            res.json(data);
        });
    });
    
};

