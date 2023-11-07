const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/user/add", (req, res) => {
  try {
    const existUsers = getUserData();
    const userData = { ...req.body, row_num: existUsers.length + 1 };
    if (
      userData.name == null ||
      userData.location == null ||
      userData.cgpa == null
    ) {
      return res.status(401).send({ error: true, msg: "User data missing" });
    }

    //append the user data
    existUsers.push(userData);

    //save the new user data
    saveUserData(existUsers);
    const users = getUserData();
    res.send({
      success: true,
      msg: "User data added successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/user/list", (req, res) => {
  try {
    const users = getUserData();
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

app.put("/user/update/:row_num", (req, res) => {
  try {
    const row_num = +req.params.row_num;

    const userData = req.body;

    const existUsers = getUserData();

    //check if the user exist or not
    const findExist = existUsers.find((user) => user.row_num === row_num);
    if (!findExist) {
      return res.status(409).send({ error: true, msg: "user not exist" });
    }

    const updateUser = existUsers.filter((user) => user.row_num !== row_num);

    updateUser.push(userData);

    saveUserData(updateUser);
    const users = getUserData();
    res.send({
      success: true,
      msg: "User data updated successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/user/delete/:row_num", (req, res) => {
  try {
    const row_num = +req.params.row_num;

    const existUsers = getUserData();

    const filterUser = existUsers.filter((user) => user.row_num !== row_num);

    if (existUsers.length === filterUser.length) {
      return res.status(400).send({ error: true, msg: "user does not exist" });
    }

    saveUserData(filterUser);
    const users = getUserData();
    res.send({
      success: true,
      msg: "User removed successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
  }
});

//read the user data from json file
const saveUserData = (data) => {
  try {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync("data.json", stringifyData);
  } catch (e) {
    console.log(error);
  }
};

//get the user data from json file
const getUserData = () => {
  try {
    const jsonData = fs.readFileSync("data.json");
    return JSON.parse(jsonData);
  } catch (e) {
    console.log(error);
  }
};

//configure the server port
app.listen(4000, () => {
  console.log("Server runs on port 4000");
});
