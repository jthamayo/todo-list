//add priority tasks
//add input validation
//testing
//pop warnings

let newTaskButton = document.getElementById("new-task");
let taskButtons = document.getElementById("task-buttons");
let taskFormContainer = document.querySelector(".create-task");
let taskForm = document.getElementById("task-form");
let taskList = document.getElementById("task-list");
let tasks = new Array();
document.getElementById("task-date").min = new Date().toLocaleDateString(
  "fr-ca"
);
const defaultText = "fill this field with a new name";

newTaskButton.addEventListener("click", () => {
  taskButtons.style.display = "none";
  taskFormContainer.style.display = "flex";
});

taskForm.addEventListener("submit", (e) => {
  const currentDate = new Date();
  e.preventDefault();
  if (e.submitter.value === "submitter") {
    let newTask = recoverInput();
    if (!validateInput(newTask[0])) {
      Swal.fire({
        heightAuto: false,
        icon: "error",
        background: "#fff8f8",
        confirmButtonColor: "#fc7ce2",
        title: "Invalid name",
        text: "Please enter a unique name for the task",
      });
      restetInput();
      return;
    }

    if (!validateDate(newTask[1])) {
      Swal.fire({
        heightAuto: false,
        icon: "error",
        background: "#fff8f8",
        confirmButtonColor: "#fc7ce2",
        title: "Invalid date",
        text: "Please enter a date",
      });
      return;
    }

    if (tasks.length < 1) {
      taskList.textContent = "";
      taskList.style.display = "block";
    }
    tasks.unshift(newTask);
    storeInLocalStorage();
    createListElement(0);
    removeNewTaskMenu();
    restetInput();
    updateCompletedTasks();
  } else {
    removeNewTaskMenu();
    restetInput();
  }
});

function validateInput(itemName) {
  if (!itemName || itemName === defaultText) {
    return false;
  }
  return !tasks.some((task) => {
    return task[0] === itemName;
  });
}

function validateDate(itemDate) {
  return !!itemDate;
}

function recoverInput() {
  let taskName = taskForm.elements.taskName.value.trim();
  let taskDate = taskForm.elements.taskDate.value.trim();
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
  container.addEventListener("click", handleEditEvent);
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
    updateCompletedTasks();
  };
}

function handleEditEvent(e) {
  const edit = e.currentTarget;
  const taskName = edit.parentNode.querySelector("p");
  taskName.parentNode.classList.toggle("editing");
  const oldName = taskName.textContent;
  taskName.setAttribute("contentEditable", "true");

  taskName.focus();
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(taskName);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);

  taskName.addEventListener("focusout", () => {
    let taskEdit = taskName.textContent.trim();
    taskName.parentNode.classList.remove("editing");
    taskName.setAttribute("contentEditable", "false");
    editTaskInArray(taskName, oldName, taskEdit);
    storeInLocalStorage();
  });
}

function editTaskInArray(taskItem, oldName, newName) {
  tasks = tasks.map((task) => {
    if (task[0] === oldName) {
      if (!validateInput(newName)) {
        alert("task name already exists");
        taskItem.textContent = oldName;
        return task;
      }
      task[0] = newName;
    }
    return task;
  });
}

function handleTrashEvent(e) {
  const trash = e.currentTarget;
  const task = trash.parentNode;
  task.parentNode.removeChild(task);
  const taskContent = task.textContent;
  deleteTaskItemFromTaskList(taskContent);
}

function deleteTaskItemFromTaskList(item) {
  const updatedTasks = tasks.filter((task) => {
    return task[0] !== item;
  });
  tasks = updatedTasks;
  storeInLocalStorage();
}

//-------------------------------------------

function removeNewTaskMenu() {
  taskButtons.style.display = "flex";
  taskFormContainer.style.display = "none";
}

document.getElementById("clear-tasks").addEventListener("click", () => {
  Swal.fire({
    heightAuto: false,
    title: "Are you sure?",
    text: "This action cannot be reversed",
    icon: "warning",
    showCancelButton: true,
    background: "#fff8f8",
    confirmButtonColor: "#879bed",
    iconColor: "#fc7c7c",
    cancelButtonColor: "#fc7c7c",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTasks();
      taskList.innerHTML = "You have no tasks so far";
      taskList.style.display = "flex";
      taskList.style.alignItems = "center";
      taskList.style.justifyContent = "center";
    }
  });
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


//--------------------------------progress-towards-completion

function updateCompletedTasks(){
  let completedTasks = document.querySelectorAll(".completed").length;
  let tasks = document.querySelectorAll("li").length;
  let percentage = Math.trunc(completedTasks/tasks * 100);
  document.getElementById("completed-progress").style.setProperty("--percentage-progress", `${percentage}%`);
  document.getElementById("center").textContent = `${percentage}%`;
}


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

//--------------------------------time

const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const now = new Date();
document.getElementById("date").textContent = `${day[now.getDay()]}
 ${now.getDate()}, ${month[now.getMonth()]}`;

function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;
  document.getElementById("clock").textContent = timeString;
}

updateTime();
setInterval(updateTime, 1000);

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
    taskList.style.display = "block";

    for (let i = tasks.length - 1; i >= 0; i--) {
      createListElement(i);
    }
  } else {
    taskList.textContent = "You have no tasks so far";
    taskList.style.display = "flex";
    taskList.style.alignItems = "center";
    taskList.style.justifyContent = "center";
  }
}

function deleteTasks() {
  tasks = new Array();
  localStorage.clear();
}

window.addEventListener("load", () => {
  displayRecoveredData();
});
