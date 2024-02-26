let draggables = document.querySelectorAll(".task");
let droppables = documemt.querySelectorAll(".swimLane");

draggables.forEach((task) => {
    task.addEventListener("dragstart", () => {
        task.classList.add("isDragging");
    });
    task.addEventListener("dragend", () => {
        task.classList.remove("isDragging");
    });
});

droppables.forEach((task) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();

        let bottomTask = insertAboveTask(zone, e.clientY);
        let curTask = document.querySelector("isDragging");

        if(!bottomTask){
            zone.appendChild(curTask);
        } else
            zone.insertBefore(curTask, bottomTask);
    });
});

let insertAboverTask = (zone, mouseY) => {
    let els = zone.querySelectorAll(".task:not(.isDragging");

    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    els.forEach((task) =>{
        const { top } = task.getBoundingClientRect();

        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset){
            closestOffset = offsert;
            closestTask = task;
        }
    });

    return closestTask;
};