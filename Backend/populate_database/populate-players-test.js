/*
Populate Players Test

Date Last Modified: 5/10/2022

This program is a test srcipt to begin populating the MySQL database
with data from the SportsData.io API

*/

 
//    DEPENDENCIES

const mysql = require('mysql');





//    MAIN

const conn = mysql.createConnection({
  host: '50.87.222.126',
  database: 'bubingaw_footballdata',
  user: 'bubingaw_jcrantfo',
  password: 'gIalloR0ssi1*',
  port: '3306'
});

conn.connect((err) => {
  if (err) {console.log('Error: Failed to connect to DB: ' + err);}
    else {console.log('Connection to DB Successful');}
});

conn.end();
