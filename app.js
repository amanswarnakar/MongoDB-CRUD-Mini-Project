const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/Database";
const connectionParams = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose
  .connect(url, connectionParams)
  .then(() => console.log("Successfully connected to DB on port 27017."))
  .catch((err) => {
    if (err) console.log(err);
  });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const taskSchema = {
  description: String,
  completed: Boolean,
};

const Task = mongoose.model("Task", taskSchema);

app.get("/", (req, res) => {
  res.redirect("/tasks");
});

app
  .route("/tasks")
  .get((req, res) => {
    Task.find({})
      .then((foundTasks) => {
        console.log(foundTasks);
        res.send(foundTasks);
      })
      .catch((err) => console.log(err));
  })
  // Postman App is used for sending post, put, delete request
  .post((req, res) => {
    const task = new Task({
      description: req.body.description,
      completed: req.body.completed,
    });
    task
      .save()
      .then(() => {
        console.log("Task successfully added");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  })
  .put((req, res) => {
    Task.updateMany(
      {},
      {
        $set: { completed: true },
      }
    ).then(() => {
      Task.find({ completed: true })
        .then((foundTasks) => {
          console.log(foundTasks);
          res.redirect("/");
        })
        .catch((err) => console.log(err));
    });
  });

app.delete("/tasks/:taskID", (req, res) => {
  Task.findOneAndDelete({ _id: req.params.taskID })
    .then(() => console.log("Task deleted succesfully."))
    .catch((err) => console.log(err));
  Task.find({})
    .then((foundTasks) => {
      res.send(foundTasks);
    })
    .catch((err) => console.log(err));
});

app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
