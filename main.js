//add completion stats
//add priority tasks
//drag tasks
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
  taskFormContainer.style.display = "flex";
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

  newTaskElement.appendChild(addCheckIcon());
  newTaskElement.appendChild(text);
  newTaskElement.appendChild(addEditIcon());
  newTaskElement.appendChild(addDeleteIcon());
  newTaskElement.setAttribute("draggable", "true");
  taskList.appendChild(newTaskElement);
}

function addCheckIcon() {
  let container = document.createElement("div");
  container.classList.add("task-icon");
  container.classList.add("check-icon");
  container.addEventListener("click", createTaskCheckHandler());
  let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  let useElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "use"
  );
  useElement.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "assets/icons.svg#square-check-regular"
  );
  icon.appendChild(useElement);
  container.appendChild(icon);
  return container;
}

function addEditIcon() {
  let container = document.createElement("div");
  container.classList.add("edit-icon");
  container.classList.add("task-icon");
  let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  let useElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "use"
  );
  useElement.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "assets/icons.svg#pen-to-square-solid"
  );
  icon.appendChild(useElement);
  container.appendChild(icon);
  return container;
}

function addDeleteIcon() {
  let container = document.createElement("div");
  container.classList.add("task-icon");
  container.classList.add("trash-icon");
  container.addEventListener("click", handleTrashEvent);
  let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  let useElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "use"
  );
  useElement.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "assets/icons.svg#trash-solid"
  );
  icon.appendChild(useElement);
  container.appendChild(icon);
  return container;
}

//-------------------------event-handler

function createTaskCheckHandler() {
  let isChecked = true;
  return function (e) {
    const check = e.currentTarget;
    isChecked = !isChecked;
    check.parentNode.style.textDecorationColor = "var(--accent-color)";
    check.parentNode.style.textDecorationThickness = "3px";
    const iconType = isChecked ? "square-check-regular" : "square-check-solid";
    check
      .querySelector("use")
      .setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        `assets/icons.svg#${iconType}`
      );
      check.parentNode.classList.toggle("completed");
  };
}

function handleEditEvent(){

}

function handleTrashEvent(e){
  const trash = e.currentTarget;
}

//-------------------------------------------

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

//----------------------------------Drag-event
let draggedtask = null;

taskList.addEventListener("dragstart", (e) => {
  draggedItem = e.target;
  setTimeout(() => {
    e.target.style.display = "none";
  }, 100);
});

taskList.addEventListener("dragend", (e) => {
  setTimeout(() => {
    draggedItem = null;
    e.target.style.display = "";
  }, 100);
});

//--

taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(taskList, e.clientY);
  const currentElement = document.querySelector(".dragging");
  if (afterElement == null) {
    taskList.appendChild(draggedItem);
  } else {
    taskList.insertBefore(draggedItem, afterElement);
  }
});

const getDragAfterElement = (container, y) => {
  const draggableElements = [
    ...container.querySelectorAll("li:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return {
          offset: offset,
          element: child,
        };
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
};

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
