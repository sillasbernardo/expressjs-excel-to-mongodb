# Introduction

This is an API built in Nodejs using Express.js framework to fetch and analyse records from MongoDB.

I developed this solution while working for a company in 2023 to address several data management issues they were facing. Specifically, the system was designed find existing duplicated records and prevent it from happening, improve data validation during entry, and reduce errors due to mistyped information.

# Technologies

* Nodejs
* Expressjs
* Mongoose
* MongoDB Atlas

# Developer Documentation

## Installation

To use this API, you must have Nodejs and Git installed.

Clone this repo with

```sh
git clone git@github.com:sillasbernardo/expressjs-excel-to-mongodb.git
```

Enter folder

``` sh

cd expressjs-excel-to-mongodb 
```

Install packages and run server using npm

```sh
npm install && npm run dev
```

This API uses dotenv to load variables to be used by mongoose to connect to MongoDB Atlas. You need to create an account at MongoDB Atlas and setup a database to have the variables below. After that you need to create a file ".env" in the root folder and add the following variables:

MONGODB_USER

MONGODB_PASSWORD

MONGODB_HOST

Example:

```env
MONGODB_USER="username"

MONGODB_PASSWORD="password"

MONGODB_HOST="hostname"
```