document.addEventListener("DOMContentLoaded", async () => {

    const boardId = localStorage.getItem("currentBoardId");

  try {
    const response = await fetch(`/api/tasks?boardId=${boardId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks.");
    }
    const tasksData = await response.json();

    tasksData.forEach((taskData) => {
      const { text, status } = taskData;

      const newTask = document.createElement("div");
      newTask.classList.add("tasks");
      newTask.textContent = text;
      newTask.draggable = true;

      newTask.addEventListener("dragstart", () => {
        newTask.classList.add("is-dragging");
      });

      newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
      });

      const laneId = `${status}-lane`;
      const lane = document.getElementById(laneId);
      if (lane) {
        lane.appendChild(newTask);
      }
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    alert("An error occurred while fetching tasks.");
  }

  const appendDeleteButton = (task) => {
    if (!task.querySelector(".delete-button")) {
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
            task.remove();
        });
        task.appendChild(deleteButton);
    }
};

document.querySelectorAll(".tasks").forEach((task) => {
    task.addEventListener("dragstart", () => {
        task.classList.add("is-dragging");
    });
    task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
    });

    appendDeleteButton(task);
});

  document.querySelectorAll(".swim-lane").forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
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

  const findClosestTask = (zone, mouseY) => {
    const tasks = Array.from(zone.querySelectorAll(".tasks:not(.is-dragging)"));
    return tasks.reduce(
      (closest, task) => {
        const { top } = task.getBoundingClientRect();
        const offset = mouseY - top;
        if (offset < 0 && offset > closest.offset) {
          return { task, offset };
        }
        return closest;
      },
      { task: null, offset: Number.NEGATIVE_INFINITY }
    ).task;
  };

  const addTaskForm = document.getElementById("add-task");
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskInput = document.getElementById("task-input");
    const taskText = taskInput.value.trim();

    if (taskText) {
      const newTask = document.createElement("div");
      newTask.classList.add("tasks");
      newTask.textContent = taskText;
      newTask.draggable = true;

      newTask.addEventListener("dragstart", () => {
        newTask.classList.add("is-dragging");
      });

      newTask.addEventListener("dragend", () => {
        newTask.classList.remove("is-dragging");
      });

      const todoLane = document.getElementById("todo-lane");
      todoLane.appendChild(newTask);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", () => {
        newTask.remove();
      });
      newTask.appendChild(deleteButton);

      taskInput.value = "";
    }
  });

  const saveButton = document.getElementById("save-board");
  saveButton.addEventListener("click", async () => {
    const tasks = Array.from(document.querySelectorAll(".tasks")).map((task) => {
      const text = Array.from(task.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .join(""); 
  
      const status = task.parentElement.id.split("-")[0]; 
      const boardId = localStorage.getItem("currentBoardId");
      return { text, status, boardId };
    });
  
    try {
      const response = await fetch("/api/save-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks),
      });
  
      if (response.ok) {
        alert("Tasks saved successfully!");
      } else {
        throw new Error("Failed to save tasks.");
      }
    } catch (error) {
      console.error("Error saving tasks:", error);
      alert("An error occurred while saving tasks.");
    }
  });
});
