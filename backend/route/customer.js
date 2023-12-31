const express = require("express");
const models = require("../models/index");
const customer = models.customer;
const app = express();
app.use(express.json());

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const md5 = require("md5");

const auth = require("../auth/auth");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "BelajarNodeJSItuMenyengankan";
//app.use(auth);

// config storage image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./image/image-customer");
  },
  filename: (req, file, cb) => {
    cb(null, "img-" + Date.now() + path.extname(file.originalname));
  },
});
let upload = multer({ storage: storage });

app.get("/", auth, (req, res) => {
  customer
    .findAll()
    .then((customer) => {
      res.json(customer);
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.get("/:customer_id", auth, (req, res) => {
  customer
    .findOne({ where: { customer_id: req.params.customer_id } })
    .then((customer) => {
      res.json(customer);
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.json({
      message: "No uploaded file",
    });
  } else {
    let data = {
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      image: req.file.filename,
      username: req.body.username,
      password: md5(req.body.password),
    };
    customer
      .create(data)
      .then((result) => {
        res.json({
          message: "data has been inserted",
          data: result,
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  }
});

app.put("/", upload.single("image"), async (req, res) => {
  let param = { customer_id: req.body.customer_id };
  let data = {
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    username: req.body.username,
  };
  if (req.file) {
    // get data by id
    const row = await customer.findOne({ where: param });
    let oldFileName = row.image;

    // delete old file
    let dir = path.join(__dirname, "./image/image-customer", oldFileName);
    fs.unlink(dir, (err) => console.log(err));

    // set new filename
    data.image = req.file.filename;
  }

  if (req.body.password) {
    data.password = md5(req.body.password);
  }

  customer
    .update(data, { where: param })
    .then((result) => {
      res.json({
        message: "data has been updated",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.post("/auth", async (req, res) => {
  let params = {
    username: req.body.username,
    password: md5(req.body.password),
  };

  let result = await customer.findOne({ where: params });
  if (result) {
    let payload = JSON.stringify(result);
    // generate token
    let token = jwt.sign(payload, SECRET_KEY);
    res.json({
      logged: true,
      data: result,
      token: token,
    });
  } else {
    res.json({
      logged: false,
      message: "Invalid username or password",
    });
  }
});

app.delete("/:customer_id", auth, async (req, res) => {
  let param = { customer_id: req.params.customer_id };
  customer
    .destroy({ where: param })
    .then((result) => {
      res.json({
        message: "data has been deleted",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

module.exports = app;
