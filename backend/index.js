const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const customer = require("./route/customer");
const product = require("./route/product");
const transaction = require("./route/transaction");
const admin = require("./route/admin");
app.use("/store/api/v1/customer", customer);
app.use("/store/api/v1/product", product);
app.use("/store/api/v1/transaction", transaction);
app.use("/store/api/v1/admin", admin);

app.use(express.static(__dirname));

app.listen(8000, () => {
  console.log("Server run on port 8000");
});
