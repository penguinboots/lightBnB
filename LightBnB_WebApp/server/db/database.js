const pool = require('./index');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(
      `SELECT * FROM users
      WHERE users.email = $1`,
      [email])
    .then((result) => {
      return result.rows[0] || null;
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(
      `SELECT * FROM users
      WHERE users.id = $1`,
      [id])
    .then((result) => {
      return result.rows[0] || null;
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query(
      `INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((error => {
      console.log(error);
    }));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(
      `SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
      FROM reservations
      JOIN properties on properties.id = property_id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY reservations.id, properties.id
      LIMIT $2
      `,
      [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      console.log(error.message);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  let queryParams = [];
  let queryString =
    `SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_reviews.property_id
    `;

  // determine and add appropriate conjunction to query
  const appendConjunction = () => {
    if (queryParams.length === 0) {
      queryString += 'WHERE';
    } else {
      queryString += 'AND';
    }
  };

  // check for and apply CITY filter
  if (options.city) {
    appendConjunction();
    queryParams.push(`%${options.city}%`);
    queryString += ` city iLIKE $${queryParams.length}\n`;
  }

  // check for and apply OWNER filter
  if (options.owner_id) {
    appendConjunction();
    queryParams.push(`${options.owner_id}`);
    queryString += ` properties.owner_id = $${queryParams.length}\n`;
  }

  // check for and apply MINIMUM PRICE filter
  if (options.minimum_price_per_night) {
    appendConjunction();
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += ` properties.cost_per_night >= $${queryParams.length}\n`;
  }

  // check for and apply MAXIMUM PRICE filter
  if (options.maximum_price_per_night) {
    appendConjunction();
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += ` properties.cost_per_night <= $${queryParams.length}\n`;
  }

  queryString += `GROUP BY properties.id\n`;

  // check for and apply MINIMUM RATING filter
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}\n`;
  }

  // apply result quantity limit, order by cost_per_night
  queryParams.push(limit);
  queryString +=
    `ORDER BY cost_per_night
    LIMIT $${queryParams.length}`;
  
  return pool
    .query(
      queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  return pool
    .query(`
  INSERT INTO properties
  (owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  street,
  city,
  province,
  post_code,
  country,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms)
  VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *`,
      [
        property.owner_id,
        property.title,
        property.description,
        property.thumbnail_photo_url,
        property.cover_photo_url,
        property.cost_per_night * 100,
        property.street,
        property.city,
        property.province,
        property.post_code,
        property.country,
        property.parking_spaces,
        property.number_of_bathrooms,
        property.number_of_bedrooms
      ])
    .then((result) => {
      return result.rows[0];
    });
};
exports.addProperty = addProperty;
