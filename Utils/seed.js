require("dotenv").config();
const mongoose = require("mongoose");

const seedDB = async (req, res) => {
  const { MONGODB_CONNECTION } = process.env;

  try {
    await mongoose.connect(MONGODB_CONNECTION);
    res.status(200).send("connected");
    // res.status(200).send("connected");
  } catch (error) {
    console.error("Connection error:", error);
  }
};
// sequelize
//     .query(
//       `
//       DROP TABLE IF EXISTS  groovelistInfo;
//       DROP TABLE IF EXISTS groovelist;
//       DROP TABLE IF EXISTS users;
//       CREATE TABLE users(
//         user_id SERIAL PRIMARY KEY,
//         user_name VARCHAR(400) NOT NULL,
//         email VARCHAR(400) UNIQUE, -- Make email a unique column
//         password VARCHAR(400) NOT NULL
//     );
//     CREATE TABLE groovelist (
//       groovelist_id SERIAL PRIMARY KEY,
//       groovelist_song VARCHAR(400),
//       price DECIMAL,
//       user_email VARCHAR(400),
//       FOREIGN KEY (user_email) REFERENCES users(email)
//   );
//   CREATE TABLE groovelistInfo(
//     groovelistInfo_id SERIAL PRIMARY KEY,
//     groovelist_title VARCHAR(400),
//     groovelist_img VARCHAR(400),
//     user_email VARCHAR(400)
//   );
//     `
//     )
//     .then(() => {
//       console.log(`Database was seeded!`);
//       res.sendStatus(200);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

module.exports = {
  seedDB,
};
