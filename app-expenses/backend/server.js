const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

const filePath = __dirname + "/" + "data/data.json";

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

app.get("/expenses", function (req, res) {
  fs.readFile(filePath, "utf8", function (err, data) {
    res.send(data);
  });
});

app.delete("/expenses/:id", function (req, res) {
  fs.readFile(filePath, function (err, data) {
    const dataObj = JSON.parse(data);
    const { expenses } = dataObj;
    const filteredList = expenses.filter(
      (expense) => expense.id !== req.params.id
    );
    dataObj.expenses = filteredList;

    fs.writeFile(filePath, JSON.stringify(dataObj), function (err, result) {
      res.send(dataObj);
    });
  });
});

app.post("/expenses", function (req, res) {
  const item = req.body;

  fs.readFile(filePath, function (err, data) {
    const dataObj = JSON.parse(data);
    const expensesItems = dataObj.expenses;
    expensesItems.push(item);

    fs.writeFile(filePath, JSON.stringify(dataObj), function (err, result) {
      if (err) console.log("error", err);
      res.send(item);
    });
  });
});

app.put("/expenses/:id", function (req, res) {
  const item = req.body;

  fs.readFile(filePath, function (err, data) {
    const dataObj = JSON.parse(data);
    const { expenses } = dataObj;
    const filteredList = expenses.filter(
      (expense) => expense.id !== req.params.id
    );

    filteredList.push(item);

    dataObj.expenses = filteredList;

    fs.writeFile(filePath, JSON.stringify(dataObj), function (err, result) {
      if (err) console.log("error", err);
      res.send(dataObj);
    });
  });
});

// Create a server to listen at port 4300
let server = app.listen(4300, function () {
  let host = server.address().address;
  let port = server.address().port;
});
