const courseForm = document.getElementById("course-form");
const courseList = document.getElementById("course-list");
const courseCount = document.getElementById("course-count");
const formMessage = document.getElementById("form-message");
const courseId = document.getElementById("course-id");
const courseName = document.getElementById("course-name");
const courseCode = document.getElementById("course-code");
const department = document.getElementById("department");
const formTitle = document.getElementById("form-title");
const cancelEdit = document.getElementById("cancel-edit");

// Get all courses from the server and show them on the page.
async function loadCourses() {
  const response = await fetch("/course");
  const courses = await response.json();

  courseList.innerHTML = "";
  courseCount.textContent = courses.length + " courses in catalog";

  if (courses.length === 0) {
    courseList.textContent = "No courses have been added yet.";
    return;
  }

  courses.forEach(function (course) {
    const item = document.createElement("div");
    item.className = "course-item";

    const details = document.createElement("div");
    details.textContent =
      course.courseName + " (" + course.courseCode + ") - " + course.department;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.type = "button";
    editButton.addEventListener("click", function () {
      editCourse(course);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.addEventListener("click", function () {
      deleteCourse(course.id);
    });

    item.appendChild(details);
    item.appendChild(editButton);
    item.appendChild(deleteButton);
    courseList.appendChild(item);
  });
}

// Put a course's details into the form so it can be changed.
function editCourse(course) {
  courseId.value = course.id;
  courseName.value = course.courseName;
  courseCode.value = course.courseCode;
  department.value = course.department;
  formTitle.textContent = "Edit course";
  cancelEdit.classList.remove("hidden");
}

// Add a new course or update the course currently being edited.
courseForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const course = {
    courseName: courseName.value,
    courseCode: courseCode.value,
    department: department.value,
  };

  let url = "/course";
  let method = "POST";

  if (courseId.value !== "") {
    url = "/course/" + courseId.value;
    method = "PUT";
  }

  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });

  if (response.ok) {
    courseForm.reset();
    courseId.value = "";
    formTitle.textContent = "Add a course";
    cancelEdit.classList.add("hidden");
    formMessage.textContent = "";
    loadCourses();
  } else {
    formMessage.textContent = "Could not save the course.";
  }
});

// Delete a course from the server.
async function deleteCourse(id) {
  const response = await fetch("/course/" + id, { method: "DELETE" });

  if (response.ok) {
    loadCourses();
  }
}

// Clear the form when the user cancels editing.
cancelEdit.addEventListener("click", function () {
  courseForm.reset();
  courseId.value = "";
  formTitle.textContent = "Add a course";
  cancelEdit.classList.add("hidden");
});

loadCourses();
