var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "armagedon"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
    
});

registerUser = function(user,password,con) {
    
    con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO Users (name, password,Score,Options) VALUES ('user', 'pass','0','right','left','down','jump')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("user register");
  });
});
    
}
logInUser = function (user,con){
if (err) throw err;
    con.connect(function(err)) {
                
                }
    var sql = "Select * from Users where name = '" + user + "'";
    con.query(sql,)
    
}
