let newTaskButton = document.getElementById("new-task");
let taskFormContainer = document.querySelector(".create-task");
let taskForm = document.getElementById("task-form");
let tasks = new Array();

newTaskButton.addEventListener("click", () => {
  newTaskButton.style.display = "none";
  taskFormContainer.style.display = "block";
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  tasks.unshift(recoverData());
  /*   if (validateInput(taskName)) {
    console.log("valid");
  } */
  addListElement();
});

function validateInput(name) {}

function recoverData() {
  let taskName = taskForm.elements.taskName.value.trim();
  let taskDate = taskForm.elements.taskDate.value.trim();
  console.log(taskName);
  console.log(taskDate);
  return [taskDate, taskName];
}

function addListElement() {
  let taskList = document.getElementById("task-list");
  let newTaskElement = document.createElement("li");
  newTaskElement.textContent = tasks[0][1];
  taskList.appendChild(newTaskElement);
}
