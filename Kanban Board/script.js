//Drag Function
let draggables = document.querySelectorAll(".tasks");
let droppables = document.querySelectorAll(".swim-lane");

// add event listener
draggables.forEach((task) => {
  task.addEventListener("dragstart", () => {
    task.classList.add("is-dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("is-dragging");
  });
});

droppables.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();

    let bottomTask = insertAboveTask(zone, e.clientY);
    let curTask = document.querySelector(".is-dragging");

    if (!bottomTask) {
      zone.appendChild(curTask);
    } else {
      zone.insertBefore(curTask, bottomTask);
    }
  });
});

/// inserting task
const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".task:not(.is-dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  // Find closest Task
  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();

    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};

// Add Element Function
const form = document.getElementById("add-task");
const input = document.getElementById("task-input");
const todoLane = document.getElementById("todo-lane");

// Add element on form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value;

  if (!value) return;

  // Create new Task
  const newTask = document.createElement("p");
  newTask.classList.add("tasks");
  newTask.setAttribute("draggable", "true");
  newTask.innerText = value;

  // add event listener
  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });

  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  todoLane.appendChild(newTask);

  input.value = "";
});
