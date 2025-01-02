//add completion stats
//add priority tasks
//add button to remove tasks
//drag tasks
//add colored icons
//add input validation
//add new year resolution page

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
  tasks.unshift(recoverData());
  /*   if (validateInput(taskName)) {
    console.log("valid");
  } */
  createListElement();
  removeNewTaskMenu();
});

function validateInput(name) {}

function recoverData() {
  let taskName = taskForm.elements.taskName.value.trim();
  let taskDate = taskForm.elements.taskDate.value.trim();
  console.log(taskName);
  console.log(taskDate);
  return [taskDate, taskName];
}

function createListElement() {
  let newTaskElement = document.createElement("li");
  newTaskElement.textContent = tasks[0][1];
  taskList.appendChild(newTaskElement);
}

function removeNewTaskMenu() {
  taskButtons.style.display = "flex";
  taskFormContainer.style.display = "none";
}

document.getElementById("clear-tasks").addEventListener("click", ()=>{
    taskList.innerHTML = "";
    deleteTasks();
})

function deleteTasks(){
    tasks = new Array();
}
