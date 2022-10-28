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
    if(!event.target.closest("form") && !event.target.closest(".overlay-child")) {
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

if(addNewTaskButton) addNewTaskButton.addEventListener("click", add_new_task_to_form);

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
    nameSection.classList.add("input-section");
    const nameLabel = document.createElement("label");
    nameLabel.for = "name";
    nameLabel.innerText = "Name:";
    nameSection.appendChild(nameLabel);
    const nameInput = document.createElement("input");
    nameInput.id = "name";
    nameInput.name = "habitName";
    nameInput.type = "text";
    nameInput.maxLength = 50;
    nameInput.placeholder = "Enter task name here";
    nameInput.required = true;
    nameSection.appendChild(nameInput);
    container.appendChild(nameSection);

    const descriptionSection = document.createElement("section");
    descriptionSection.classList.add("input-section");
    const descriptionLabel = document.createElement("label");
    descriptionLabel.for = "description";
    descriptionLabel.innerText = "Description:";
    descriptionSection.appendChild(descriptionLabel);
    const descriptionInput = document.createElement("textarea");
    descriptionInput.id = "description";
    descriptionInput.name = "habitDescription";
    descriptionInput.type = "text";
    descriptionInput.maxLength = 250;
    descriptionInput.placeholder = "Enter task description here";
    descriptionSection.appendChild(descriptionInput);
    container.appendChild(descriptionSection);

    const startTimeSection = document.createElement("section");
    startTimeSection.classList.add("input-section");
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
    endTimeSection.classList.add("input-section");
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


/*=================================================*/
/*             Goals Page Controller               */
/*=================================================*/

// Add to goal form selection
const selectors = document.querySelectorAll("#goal-form-selector");
if(selectors) selectors.forEach(x => x.addEventListener("change", change_add_to_goal_form));

function change_add_to_goal_form(e) {
    const selected = e.target.value;
    const parentForm = e.target.parentElement;
    console.log(parentForm);
    const taskForm = parentForm.querySelector("#task-form");
    const habitForm = parentForm.querySelector("#habit-form");
    const routineForm = parentForm.querySelector("#routine-form");
    console.log(taskForm);

    switch(selected) {
        case "task":
            taskForm.classList.remove("hidden");
            habitForm.classList.add("hidden");
            routineForm.classList.add("hidden");
            break;
        case "habit":
            taskForm.classList.add("hidden");
            habitForm.classList.remove("hidden");
            routineForm.classList.add("hidden");
            break;
        case "routine":
            taskForm.classList.add("hidden");
            habitForm.classList.add("hidden");
            routineForm.classList.remove("hidden");
            break;
    }
}


// Format input date
function format_date_for_date_input(date) {
    const inputDate = new Date(date);
    let year = String(inputDate.getFullYear());
    let month = String(inputDate.getMonth() + 1);
    let day = String(inputDate.getDate());

    while(year.length < 4) {
        year = "0" + year;
    }
    while(month.length < 2) {
        month = "0" + month;
    }
    while(day.length < 2) {
        day = "0" + day;
    }

    return `${year}-${month}-${day}`;
}


// Make the date do the thingy (Get timezone offset of input date)
const dateInputs = document.querySelectorAll("#date");

dateInputs.forEach(x => x.addEventListener("blur", getTZOffset));

function getTZOffset(event) {
    // Get input date from form
    let inputDate = event.target.value;

    // Split input date by delim
    inputDate = inputDate.split("-");

    // Create new date with input date at midnight
    const date = new Date(inputDate[0], inputDate[1]-1, inputDate[2], "00", "00");

    // Set value of hidden form field to date timezone offset
    event.target.parentElement.parentElement.querySelector("#offset").value = String(date.getTimezoneOffset());

    console.log(date.getTimezoneOffset());
}