const express = require("express");
const { sequelize } = require("../models/index");
const models = require("../models/index");
const transaction = models.transaction;
const detail_transaction = models.detail_transaction;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const auth = require("../auth/auth");
app.use(auth);

app.get("/", async (req, res) => {
  let result = await transaction.findAll({
    include: [
      "customer",
      {
        model: models.detail_transaction,
        as: "detail_transaction",
        include: ["product"],
      },
    ],
  });
  res.json(result);
});

app.get("/:customer_id", async (req, res) => {
  let param = { customer_id: req.params.customer_id };
  let result = await transaction.findAll({
    where: param,
    include: [
      "customer",
      {
        model: models.detail_transaction,
        as: "detail_transaction",
        include: ["product"],
      },
    ],
  });
  res.json(result);
});

app.post("/", async (req, res) => {
  let current = new Date().toISOString().split("T")[0];
  let data = {
    customer_id: req.body.customer_id,
    waktu: current,
  };
  transaction
    .create(data)
    .then((result) => {
      let lastID = result.transaction_id;
      detail = req.body.detail_transaction;
      detail.forEach((element) => {
        element.transaction_id = lastID;
      });
      console.log(detail);
      detail_transaction
        .bulkCreate(detail)
        .then((result) => {
          res.json({
            message: "Data has been inserted",
          });
        })
        .catch((error) => {
          res.json({
            message: error.message,
          });
        });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.put("/", async (req, res) => {});

app.delete("/:transaction_id", async (req, res) => {
  let param = { transaction_id: req.params.transaction_id };
  try {
    await detail_transaction.destroy({ where: param });
    await transaction.destroy({ where: param });
    res.json({
      message: "data has been deleted",
    });
  } catch (error) {
    res.json({
      message: error,
    });
  }
});

module.exports = app;
