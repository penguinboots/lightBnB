DROP TABLE IF EXISTS property_reviews CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS rates CASCADE;
DROP TABLE IF EXISTS guest_reviews CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER references users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_photo_url TEXT NOT NULL,
  cover_photo_url TEXT NOT NULL,
  cost_per_night INTEGER NOT NULL,
  parking_spaces SMALLINT NOT NULL,
  number_of_bathrooms SMALLINT NOT NULL,
  number_of_bedrooms SMALLINT NOT NULL,
  country TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  post_code VARCHAR(6) NOT NULL,
  active BOOLEAN DEFAULT FALSE
);

CREATE TABLE rates (
  id SERIAL PRIMARY KEY,
  property_id INTEGER references properties(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cost_per_night INTEGER NOT NULL
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER references users(id),
  property_id INTEGER references properties(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

CREATE TABLE property_reviews (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER references users(id),
  property_id INTEGER references properties(id),
  reservation_id INTEGER references reservations(id),
  rating SMALLINT NOT NULL,
  message TEXT
);

CREATE TABLE guest_reviews (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER references users(id),
  guest_id INTEGER references users(id),
  reservation_id INTEGER references reservations(id),
  rating SMALLINT NOT NULL,
  message TEXT
);