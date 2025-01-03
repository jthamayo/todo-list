//add completion stats
//add priority tasks
//add button to remove tasks
//drag tasks
//add colored icons
//add input validation
//add new year resolution page
//testing
//add progress bar till due date
//pop warnings

let newTaskButton = document.getElementById("new-task");
let taskButtons = document.getElementById("task-buttons");
let taskFormContainer = document.querySelector(".create-task");
let taskForm = document.getElementById("task-form");
let taskList = document.getElementById("task-list");
let tasks = new Array();

newTaskButton.addEventListener("click", () => {
  taskButtons.style.display = "none";
  taskFormContainer.style.display = "block";
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //validaciones
  if (tasks.length < 1) {
    taskList.textContent = "";
  }
  tasks.unshift(recoverInput());
  storeInLocalStorage();
  createListElement(0);
  removeNewTaskMenu();
  restetInput();
});

function validateInput(name) {}

function recoverInput() {
  let taskName = taskForm.elements.taskName.value.trim();
  let taskDate = taskForm.elements.taskDate.value.trim();
  console.log(taskName);
  console.log(taskDate);
  return [taskName, taskDate];
}

function restetInput() {
  function removeValueFromInput() {
    taskForm.elements.taskName.value = "fill this field with a new name";
    taskForm.elements.taskDate.value = "";
  }
  removeValueFromInput();
  document.getElementById("task-name").style.animation =
    "text-highlight 2.5s infinite ease-in-out";
}

function createListElement(num) {
  let newTaskElement = document.createElement("li");
  let text = document.createElement("p");
  text.textContent = tasks[num][0];
  newTaskElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';
  newTaskElement.appendChild(text);
  taskList.appendChild(newTaskElement);
}

function removeNewTaskMenu() {
  taskButtons.style.display = "flex";
  taskFormContainer.style.display = "none";
}

document.getElementById("clear-tasks").addEventListener("click", () => {
  taskList.innerHTML = "You have no tasks so far";
  deleteTasks();
});

const nameInput = document.getElementById("task-name");
nameInput.addEventListener("input", () => {
  const taskName = taskForm.elements.taskName.value.trim();
  const isInvalidName =
    taskName === "" || taskName === "fill this field with a new name";

  nameInput.style.animation = isInvalidName
    ? "text-highlight 2.5s infinite ease-in-out"
    : "none";
});

//----------------------------------Local-Storage

function storeInLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function recoverLocalStorageData() {
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data);
  }
  return !!data;
}

function displayRecoveredData() {
  if (recoverLocalStorageData()) {
    taskList.textContent = "";
    for (let i = tasks.length - 1; i >= 0; i--) {
      createListElement(i);
    }
  } else {
    taskList.textContent = "You have no tasks so far";
  }
}

function deleteTasks() {
  tasks = new Array();
  localStorage.clear();
}

window.addEventListener("load", () => {
  displayRecoveredData();
});
