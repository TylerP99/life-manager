// NAVIGATION
const navSection = document.querySelector(".nav-section");

const navButton = document.querySelector(".open-nav");

if(navButton) navButton.addEventListener("click", toggle_nav);

function toggle_nav(e) {
    e.preventDefault();

    navButton.classList.toggle("open");
    navSection.classList.toggle("nav-open");
}

// Create Task
const openCreateTaskButton = document.querySelector("#open-create-new-task");
const createTaskSection = document.querySelector("#create-task");

if(openCreateTaskButton) openCreateTaskButton.addEventListener("click", toggle_create_task_menu);

function toggle_create_task_menu(e) {
    createTaskSection.classList.toggle("hidden");
}

// Edit Task
const openEditTaskButton = document.querySelectorAll("#open-edit-task");

if(openEditTaskButton) openEditTaskButton.forEach( x => x.addEventListener("click", toggle_edit_task_menu));

function toggle_edit_task_menu(e) {
    const form = e.target.parentElement.parentElement.querySelector("#edit-task-form");
    form.classList.toggle("hidden");
}

// Close alerts
const closeButton = document.querySelectorAll(".close-button");
if(closeButton) closeButton.forEach(x => x.addEventListener("click", close_item));

function close_item(e) {
    e.target.parentElement.remove();
}