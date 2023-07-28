require("dotenv").config();
const { SECRET, MONGODB_CONNECTION } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("./Utils/cloudinary");
const mongoose = require("mongoose");

const User = require("./Schemas/users");
const GrooveList = require("./Schemas/grooveList");
const GrooveListInfo = require("./Schemas/grooveListInfo");
mongoose.connect(MONGODB_CONNECTION);

const getCover = (req, res) => {
  const { email } = req.params;
  GrooveListInfo.findOne({ userEmail: email })
    .then((info) => {
      res.status(200).send(info);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

const getTrackList = (req, res) => {
  const { email } = req.params;
  GrooveList.find({ email: email })
    .then((songs) => {
      res.status(200).send(songs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

const addCover = async (req, res) => {
  const { title, email } = req.params;
  console.log(title, email);

  const addDetails = (url) => {
    const info = new GrooveListInfo({
      title: title,
      img: url,
      userEmail: email,
    });

    info
      .save()
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "An error occurred" });
      });
  };

  try {
    const uploaderResponse = await cloudinary.uploader.upload(req.body.data, {
      folder: "newFolder",
    });
    const imgUrl = uploaderResponse.url;
    addDetails(imgUrl);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getTotal = (req, res) => {
  const { email } = req.params;
  GrooveList.aggregate([
    { $match: { email: email } },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ])
    .then((result) => {
      const total = result.length > 0 ? result[0].total : 0;
      res.status(200).send({ total });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

const deleteSong = (req, res) => {
  const { songId, email } = req.params;

  GrooveList.findByIdAndDelete(songId)
    .then(() => {
      GrooveList.find({ email: email })
        .then((songs) => {
          res.status(200).send(songs);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "An error occurred" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

const getSongs = (req, res) => {
  const { email } = req.body;
  GrooveList.find({ email: email })
    .then((songs) => {
      res.status(200).send(songs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

const addSong = (req, res) => {
  const { clicked, email } = req.body;

  const song = new GrooveList({
    song: clicked,
    price: 2.25,
    email: email,
  });

  song
    .save()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

const login = (req, res) => {
  const { username, email, password } = req.body;

  const payload = { username, email };

  const token = jwt.sign(payload, SECRET);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  User.findOne({ email: email, password: hash })
    .then((user) => {
      if (!user) {
        return res.status(401).send("User not found");
      }

      res.json({ token, email });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "An error occurred" });
    });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const payload = { username, email };

    const token = jwt.sign(payload, SECRET);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = new User({
      userName: username,
      email: email,
      password: hash,
    });

    user
      .save()
      .then(() => {
        res.json({ token, email, username });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "An error occurred" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  login,
  register,
  addSong,
  getSongs,
  deleteSong,
  getTotal,
  addCover,
  getCover,
  getTrackList,
};
