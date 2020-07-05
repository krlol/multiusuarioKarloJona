'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : '192.168.1.64',
    user     : 'nodejs',
    password : 'nodejs',
    database : 'multiusuario'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;