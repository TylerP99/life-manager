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




// Basic Structure:

// <section>

//     <button class="open">Open</button>
//     <section class="overlay">

//         <form>
//             //Inputs and stuff
//         </form>

//     </section>

// </section>

// Idea: add event listeners to all buttons, use event.target to get parent element, then queryselect for the overlay and open it. All overlays should also have their own event listeners making sure they close if they are clicked

// This code relies heavily on my html structure. Html structure changes should result in some code changes as needed

const formOpenButtons = document.querySelectorAll(".open-button");

formOpenButtons.forEach(x => x.addEventListener("click", open_form));

function open_form(event) {
    const overlay = event.target.parentElement.querySelector(".overlay");
    overlay.classList.toggle("hidden");
    console.log("Open sesame");
}


const formOverlays = document.querySelectorAll(".overlay");

formOverlays.forEach(x => x.addEventListener("click", click_off_form));

function click_off_form(event) {
    if(!event.target.closest("form")) {
        console.log("click off close")
        event.target.classList.toggle("hidden");
    }
}

// So far so good, adding to all view pages for testing
// Amazing... pushing this to github then refactoring the rest of the code

// Really quick, lets add those close buttons to the forms
const formCloseButtons = document.querySelectorAll(".close-form-button");

formCloseButtons.forEach(x => x.addEventListener("click", close_form));

function close_form(event) {
    // event is a button whose parent is the form whose parent is the overlay
    //event.preventDefault();
    console.log("Button close close")
    console.log(event.target);
    event.target.parentElement.parentElement.classList.toggle("hidden");
}


/*=================================================*/
/*           Routines Page Controller              */
/*=================================================*/

// Add new task to new routine form
const newTaskFormContainer = document.querySelector("#new-task-form-container");
const addNewTaskButton = document.querySelector("#add-new-task-button");

addNewTaskButton.addEventListener("click", add_new_task_to_form);

function add_new_task_to_form(e) {
    e.preventDefault();
    console.log("Add")

    newTaskFormContainer.appendChild(make_new_task_form());
}

function delete_new_task_form(e) {
    e.preventDefault();

    e.target.parentElement.remove();
}

function make_new_task_form() {
    const container = document.createElement("section");
    container.classList.add("task-form");

    const header = document.createElement("h5");
    header.innerText = "Add New Task";
    container.appendChild(header);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "x";
    deleteButton.type = "button";
    deleteButton.addEventListener("click", delete_new_task_form);
    container.appendChild(deleteButton);

    const nameSection = document.createElement("section");
    const nameLabel = document.createElement("label");
    nameLabel.for = "name";
    nameLabel.innerText = "Name:";
    nameSection.appendChild(nameLabel);
    const nameInput = document.createElement("input");
    nameInput.id = "name";
    nameInput.name = "name";
    nameInput.type = "text";
    nameInput.maxLength = 50;
    nameInput.placeholder = "Enter task name here";
    nameInput.required = true;
    nameSection.appendChild(nameInput);
    container.appendChild(nameSection);

    const descriptionSection = document.createElement("section");
    const descriptionLabel = document.createElement("label");
    descriptionLabel.for = "description";
    descriptionLabel.innerText = "Description:";
    descriptionSection.appendChild(descriptionLabel);
    const descriptionInput = document.createElement("textarea");
    descriptionInput.id = "description";
    descriptionInput.name = "description";
    descriptionInput.type = "text";
    descriptionInput.maxLength = 250;
    descriptionInput.placeholder = "Enter task description here";
    descriptionSection.appendChild(descriptionInput);
    container.appendChild(descriptionSection);

    const startTimeSection = document.createElement("section");
    const startTimeLabel = document.createElement("label");
    startTimeLabel.for = "startTime";
    startTimeLabel.innerText = "Start Time:";
    startTimeSection.appendChild(startTimeLabel);
    const startTimeInput = document.createElement("input");
    startTimeInput.id = "startTime";
    startTimeInput.name = "startTime";
    startTimeInput.type = "time";
    startTimeInput.placeholder = "Enter task start time here";
    startTimeInput.required = true;
    startTimeSection.appendChild(startTimeInput);
    container.appendChild(startTimeSection);

    const endTimeSection = document.createElement("section");
    const endTimeLabel = document.createElement("label");
    endTimeLabel.for = "endTime";
    endTimeLabel.innerText = "End Time:";
    endTimeSection.appendChild(endTimeLabel);
    const endTimeInput = document.createElement("input");
    endTimeInput.id = "endTime";
    endTimeInput.name = "endTime";
    endTimeInput.type = "time";
    endTimeInput.placeholder = "Enter task end time here";
    endTimeInput.required = true;
    endTimeSection.appendChild(endTimeInput);
    container.appendChild(endTimeSection);

    return container;
}