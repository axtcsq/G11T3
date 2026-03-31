# WAD1 Project (G11 Team 3)

## About this Project
This pet adoption platform website is a dynamic and data-driven web application that leverages the core back-end
technologies taught in IS113: Node.js, Express.js, and MongoDB. This project requires us to design and
implement a functioning back-end using routes, connect to a database (MongoDB), and render user-facing pages
dynamically with authentication and security features. This project also utilises the Model View Controller (MVC) framework.

## Student Names
* Ryan Lim Rui Jun
* Ng Zi Ling Pearl
* Alexander Tan
* Goh Kay Herng
* Lim Yi Wei
* Irwin Sim

## Instructions
*To use our project, please follow these sets of instructions:*
### a. How to set up our application based on the submitted file(s)
* Ensure that the necessary dependencies have been installed onto your computer

    ```npm i```

### b. How to run our application
* If it has already been installed, please input this command into VS Code's terminal to get the application started & you should see our index.html being loaded

    ```nodemon server.js```

* We recommend using [Google Chrome](https://www.google.com/intl/en_sg/chrome/) browser as that is what we have tested & validated on

### c. Username/password details used (stored in MongoDB)
* Generic User:
    * Username: larry
    * Password: 456
* Admin
    * Username: sam
    * Password: 123

## Features Implemented
* CRUD
    * User records
    * Pet records
    * Adoption records
    * Favourites
    * Appointments
    * Reviews
* Security
    * Sessions
    * Route protection
    * Bcrypt password hashing
* Image upload