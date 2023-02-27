# LightBnB

LightBnB is a Lighthouse Labs project, the purpose of which is to design a database and use server-side JavaScript to display information from queries to web pages. It applies knowledge of complex SQL queries and database/ERD design to integrate the database with a Node backend.

## Features

Users may
* Browse existing listings
* Filter existing listings by city, cost, and star rating

Logged-in users may
* Create listings
* View their own listings
* View their own reservations

## Project Structure

```
LightBnB_WebApp
├── public
│   ├── index.html
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── index.js
│   │   ├── libraries
│   │   ├── network.js
│   │   └── views_manager.js
│   └── styles
├── sass
└── server
  ├── db
      ├── index.js
  ├── apiRoutes.js
  ├── database.js
  ├── server.js
  └── userRoutes.js
```

* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `sass` contains all of the sass files. 
* `server` contains all of the server side code.
  * `server.js` is the entry point to the application. This connects the routes to the database.
  * `apiRoutes.js` and `userRoutes.js` are responsible for any HTTP requests to `/users/something` or `/api/something`.
  * `db` contains database code.
    * `/db/database.js` is responsible for all queries to the database.
    * `/db/index.js` contains structure for all database interactions.

## Database Organization

![ERD diagram](https://github.com/penguinboots/lightBnB/blob/main/LightBnB_WebApp/docs/erd_diagram.jpg?raw=true)

## Running This Project

* Clone project locally
* Install dependencies
  * `npm install`
* Set up project database
    * `cd` to project root folder, enter `psql`
    * `CREATE DATABASE lightbnb`
    * `\c lightbnb`
    * `\i migrations/02_schemas.sql`
    * `\i seeds/01_seeds.sql`
    * `\i seeds/02_seeds.sql`
* Create `.env` file in `/LightBnB_Webapp` with relevant credential (see `.env.example`)
* Run project
  * `npm run local`

## Dependencies

  * **bcrypt**
  * **body-parser**
  * **cookie-session**
  * **express**
  * **nodemon**
  * **pg**