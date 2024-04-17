# Northcoders News API

You can access the hosted version of this project via this link :
https://glawall-nc-backend-project.onrender.com

This project is a backend project for Northcoders where we are building an application similar to Reddit where you can interact with a provided data set to carry out a number of different actions. These include , getting all comments, users, articles and topics, posting comments, increasing votes on comments, accessing all the articles, or just one article, you can also access articles by a query to a topic.

To clone this repo please copy this link: https://github.com/Glawall/backend-project

Go on to your terminal and the area in which you wish to clone this and insert:

git clone https://github.com/Glawall/backend-project

Enter this folder and open in VS code with code .

To create the environment variables, please create two files in the root of this repo:
env.test
env.development

I will provide Database names on request.

You will need to install a number of dependencies if you wish to seed and test any of the interactions:

Please add into your terminal:

npm install
npm install express
npm install dotenv
npm install supertest -D
npm install db

To seed the database please first run:

npm run setup-dbs
npm run seed

This will add the local test data that you can interact with.

You can run any tests from endpoints.js via npm run test.

The minimum versions needed to run this application are:

Node: v21.6.2
Postgres: 16.2



