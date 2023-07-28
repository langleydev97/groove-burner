const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();
const uri = process.env.MONGODB_URI;
const api = express();
api.use(bodyParser.json({ limit: "60mb" }));
api.use(bodyParser.urlencoded({ limit: "60mb", extended: true }));

api.use(cors());
api.use(express.json());
const corsOptions = {
  origin: "http://localhost:3000",
};

api.use(cors(corsOptions));
const { seedDB } = require("./Utils/seed");
const {
  login,
  register,
  addSong,
  getSongs,
  deleteSong,
  getTotal,
  addCover,
  getCover,
  getTrackList,
} = require("./controller");

router.get("/getTotal/:email", getTotal);
router.get("/getCover/:email", getCover);
router.get("/getTrackList/:email", getTrackList);
router.get("/", (req, res) => {
  res.json({ message: "Groove Burner Server" });
});

router.post("/getSongs", getSongs);
router.post("/seed", seedDB);
router.post("/login", login);
router.post("/register", register);
router.post("/addSong", addSong);
router.post("/addCover/Title/:title/:email", addCover);

router.delete("/deleteSong/:songId/:email", deleteSong);
router.get("/test", (req, res) => {
  res.status(200).send("Success");
});

api.use("/", router);
api.use("/.netlify/functions/api", router);
const PORT = process.env.PORT || 54783;
console.log(process.env.PORT);

api.listen(PORT, () => console.log(`listening on ${PORT}`));
module.exports.handler = serverless(api);
