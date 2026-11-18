const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const coursesFile = path.join(__dirname, "data", "courses.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "app")));

function getCourses() {
  const fileContents = fs.readFileSync(coursesFile, "utf8");
  return JSON.parse(fileContents);
}


function saveCourses(courses) {
  fs.writeFileSync(coursesFile, JSON.stringify(courses, null, 2));
}


app.get("/course", (req, res) => {
  const courses = getCourses();
  res.json(courses);
});


app.get("/course/:id", (req, res) => {
  const courses = getCourses();
  const course = courses.find((item) => item.id == req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  res.json(course);
});


app.post("/course", (req, res) => {
  const courses = getCourses();
  const newCourse = {
    id: Date.now(),
    courseName: req.body.courseName,
    courseCode: req.body.courseCode,
    department: req.body.department,
  };

  courses.push(newCourse);
  saveCourses(courses);
  res.status(201).json(newCourse);
});


app.put("/course/:id", (req, res) => {
  const courses = getCourses();
  const course = courses.find((item) => item.id == req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  course.courseName = req.body.courseName;
  course.courseCode = req.body.courseCode;
  course.department = req.body.department;

  saveCourses(courses);
  res.json(course);
});


app.delete("/course/:id", (req, res) => {
  let courses = getCourses();
  const oldLength = courses.length;
  courses = courses.filter((item) => item.id != req.params.id);

  if (courses.length === oldLength) {
    return res.status(404).json({ message: "Course not found" });
  }

  saveCourses(courses);
  res.json({ message: "Course deleted" });
});


const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
