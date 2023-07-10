
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
    const dataList = JSON.parse(data);
    const {expenses} = dataList;
    const filteredList = expenses.filter((expense) => expense.id !== req.params.id);
    dataList.expenses = filteredList;

    fs.writeFile(filePath, JSON.stringify(dataList), function (err, result) {
      res.send(dataList);
    });
  });
});


// app.put("/expenses/:id", function (req, res) {
//   const item = req.body;
//   console.warn(item)
//   debugger
//   fs.readFile(filePath, function (err, data) {
//     const dbData = JSON.parse(data);
//     const expenses = dbData.expenses;
//     const foundIndex = expenses.findIndex((expense) => expense.id == req.params.id);

//     if(foundIndex > -1) {
//       expenses[foundIndex] = item;
//     }
//     else {
//       expenses.push(item);
//     }
    
//     dbData.expenses = expenses;

//     fs.writeFile(filePath, JSON.stringify(dbData), function (err, result) {
//       if (err) console.log("error", err);

//       res.send(dbData);
//     });
//   });
// });


app.post("/expenses", function (req, res) {
  const newUser = req.body;

  fs.readFile(filePath, function (err, data) {
    const dataList = JSON.parse(data);

    const userList = dataList.expenses;
    userList.push(newUser);

    fs.writeFile(filePath, JSON.stringify(dataList), function (err, result) {
      if (err) console.log("error", err);

      res.send(newUser);
    });
  });
});


app.put("/expenses/:id", function (req, res) {
  const newUser = req.body;

  fs.readFile(filePath, function (err, data) {
    const dataList = JSON.parse(data);
    const expenses = dataList.expenses;
    const filteredList = expenses.filter((user) => user.id !== req.params.id);

    filteredList.push(newUser);

    dataList.expenses = filteredList;

    fs.writeFile(filePath, JSON.stringify(dataList), function (err, result) {
      if (err) console.log("error", err);

      res.send(dataList);
    });
  });
});


// Create a server to listen at port 4300
let server = app.listen(4300, function () {
  let host = server.address().address;
  let port = server.address().port;
});
