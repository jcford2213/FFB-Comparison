# FFB-Comparison

This web application is a fantasy football trade calculator and fantasy resource. 


## Terminal

Most useful terminal commands

NPM (Node Package Manager): used to manage javascript packages
  - to use in terminal, commands are prefixed with "npm" 

NPM INSTALL DEPENDENCY: npm install dependency
  -example command: npm install mysql
  -this will install the mysql package and save it in the
    /node_modules folder.

RUN MAIN APP: npm start
  -command: npm start
  -runs the main javascript file which is specified in package.json as "main"
    -example: "main": "app.js"
  -The working directory in terminal must be the app's top level folder

RUN MAIN EXPRESS APP WITH NODEMON: npx nodemon
  -command: npx nodemon
  -use instead of "npm start"
  -uses the nodemon package to automatically restart the express server when a file is saved

RUN NODE.JS FILE: node fileName.js
  -example command: node index.js
  -make sure your directory is set to the direct parent of the node file to be run

CHANGE DIRECTORY: cd /folderName
  -example command: cd /controllers/calculatorControlls
  -This command changes the working directory to the selected folder
  -There are more ways to manipulate the current working directory with the "cd" command


## Server

Language: Node.js
Framework: Express.js
Source Program: app.js

TO OPEN WEBPAGE IN BROWSER
  -Run app.js
    -Terminal command from working directory /FFB-Comparison: npx nodemon
  -Open your browser
  -In address field type url: localhost:3000


## Database

RDBMS: MySql
Location: Bluehost
Host: 50.87.222.126
Database: bubingaw_footballdata
Port: 3306
In order to creat connection to database use Host, Database, Port, User, Password.
I will provide your username and password.
To view the database you must login to my Bluehost account and navigate to myPhpAdmin
