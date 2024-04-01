// Drag and Drop Functionality
document.querySelectorAll(".tasks").forEach(task => {
  task.addEventListener("dragstart", () => {
    task.classList.add("is-dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("is-dragging");
  });
});

document.querySelectorAll(".swim-lane").forEach(zone => {
  zone.addEventListener("dragover", e => {
    e.preventDefault();

    const curTask = document.querySelector(".is-dragging");
    if (!curTask) return;

    const mouseY = e.clientY;
    const bottomTask = findClosestTask(zone, mouseY);

    if (!bottomTask) {
      zone.appendChild(curTask);
    } else {
      zone.insertBefore(curTask, bottomTask);
    }
  });
});

// Function to find closest task to insert above
const findClosestTask = (zone, mouseY) => {
  const tasks = Array.from(zone.querySelectorAll(".tasks:not(.is-dragging)"));
  return tasks.reduce((closest, task) => {
    const { top } = task.getBoundingClientRect();
    const offset = mouseY - top;
    if (offset < 0 && offset > closest.offset) {
      return { task, offset };
    }
    return closest;
  }, { task: null, offset: Number.NEGATIVE_INFINITY }).task;
};

// Add Task Functionality
document.getElementById("add-task").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("task-input");
  const value = input.value.trim();

  if (!value) return;

  const newTask = document.createElement("p");
  newTask.classList.add("tasks");
  newTask.setAttribute("draggable", "true");
  newTask.textContent = value;

  newTask.addEventListener("dragstart", () => {
    newTask.classList.add("is-dragging");
  });
  newTask.addEventListener("dragend", () => {
    newTask.classList.remove("is-dragging");
  });

  document.getElementById("todo-tasks").appendChild(newTask);
  input.value = "";
});
