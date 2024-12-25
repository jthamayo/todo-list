let newTask = document.getElementById("new-task");
let addTaskForm= document.querySelector(".create-task");

newTask.addEventListener("click", ()=>{
    newTask.style.display = "none";
    addTaskForm.style.display = "block";
});