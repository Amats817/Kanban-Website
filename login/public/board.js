document.addEventListener('DOMContentLoaded', () => {
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
    document.getElementById("add-task").addEventListener("submit", async e => {
        e.preventDefault();
        const input = document.getElementById("task-input");
        const value = input.value.trim();

        if (!value) return;

        try {
            const response = await fetch('/api/boards/boardId/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: value, status: 'TODO' }) // Set status to TODO by default
            });

            if (response.ok) {
                const newTaskData = await response.json();
                const newTask = document.createElement("p");
                newTask.classList.add("tasks");
                newTask.setAttribute("draggable", "true");
                newTask.textContent = newTaskData.task.title;
                newTask.setAttribute("data-task-id", newTaskData.task._id); // Store task ID as data attribute

                newTask.addEventListener("dragstart", () => {
                    newTask.classList.add("is-dragging");
                });
                newTask.addEventListener("dragend", () => {
                    newTask.classList.remove("is-dragging");
                });

                const todoLane = document.getElementById("todo-lane");
                todoLane.appendChild(newTask);
                input.value = "";
            } else {
                throw new Error('Failed to create task');
            }
        } catch (err) {
            console.error('Error creating task:', err);
            alert('An error occurred while creating the task');
        }
    });

    // Update Task Functionality (You can implement this as needed)

    // Delete Task Functionality
    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const deletedTaskData = await response.json();
                const deletedTask = document.querySelector(`[data-task-id="${deletedTaskData.task._id}"]`);
                if (deletedTask) {
                    deletedTask.remove();
                }
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (err) {
            console.error('Error deleting task:', err);
            alert('An error occurred while deleting the task');
        }
    };

    const deleteZone = document.getElementById("delete-zone");
    deleteZone.addEventListener("dragover", e => {
        e.preventDefault();
    });
    deleteZone.addEventListener("drop", e => {
        e.preventDefault();
        console.log("Task Dropped in Delete Zone");
        const task = document.querySelector(".is-dragging");
        if (task) {
            const taskId = task.getAttribute("data-task-id");
            if (taskId) {
                deleteTask(taskId);
            }
        }
    });
});