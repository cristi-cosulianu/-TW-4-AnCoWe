var mysql = require('mysql');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "armagedon",
  database: "twProj"
});

conn.connect();
//console.log(conn === undefined);
module.exports = {conn};
//con.connect(function(err) {
//  if (err) throw err;
//  console.log("Connected!");
//    
//});