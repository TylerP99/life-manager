const Habit = require("../models/Habit");
const Task = require("../models/Task");
const TaskJob = require("../models/TaskJob");
const User = require("../models/User");

const {DateTime} = require("luxon");

const schedule = require("node-schedule");

const EmailController = require("./email-controller");

// Need two types of scheduling
/* 1. Habit automatic task creation
    - Upon habit creation, scheduler gets called
    - Scheduler will require: Date to be created, habit id
    - Scheduler gets habit from db, constructs task, creates task, adds id to habit, increments date, saves a job in the db, calls scheduler with new info
*/
const schedule_task = async ( jobDate, taskDate, habitID ) => {

    console.log("Habit task scheduler function start")

    // Need to do a check. If the jobDate is prior to right now, need to adjust the job to a minute from now so it runs
    const now = new Date(Date.now());
    if(jobDate < now) {
        jobDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, now.getSeconds(), 0);
    }

    // Get the habit job assicated with this habit, if there is one
    const habitJob = await TaskJob.findOne({habitID: habitID});

    // Get habit from db
    const habit = await Habit.findById(habitID);

    // Get user for tz info
    const user = await User.findById(habit.owner);

    // If there is no habit job yet, make one
    if(!habitJob) {
        TaskJob.create({
            jobDate: jobDate,
            taskDate: taskDate,
            habitID: habitID,
            owner: habit.owner,
        })
    }

    // Format task object for creation
    const task = {
        name: habit.name,
        description: (habit.description) ? habit.description : null,
        date: taskDate,
        startTime: (habit.startTime) ? habit.startTime : null,
        endTime: (habit.endTime) ? habit.endTime : null,
        owner: habit.owner
    };

    if(task.startTime) {
        task.startTime = new Date(task.date.getFullYear(), task.date.getMonth(), task.date.getDate(), task.startTime.getHours(), task.startTime.getMinutes());
    }
    if(task.endTime) {
        task.endTime = new Date(task.date.getFullYear(), task.date.getMonth(), task.date.getDate(), task.endTime.getHours(), task.endTime.getMinutes());
    }

    // Schedule a job that creates a new task and schedules the next task creation. Runs on newDate
    console.log("Scheduling task creation for habit ", habit._id, "on ", jobDate)
    const job = schedule.scheduleJob(habit._id.toString(), jobDate, async () => {
        const newTask = await Task.create(task); // Create task in db

        await TaskJob.findOneAndDelete({habitID: habitID});

        await Habit.findByIdAndUpdate(habitID, {$push: { children: newTask._id }});

        console.log("Job date pre increment: ", jobDate);

        // Increment Dates
        jobDate = DateTime.fromObject(
            { 
                year: jobDate.getFullYear(), 
                month: jobDate.getMonth() + 1, // I think luxon doens't do the funny 0 indexed dates that js dates do
                day: jobDate.getDate(),
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            }, {zone: user.timezone}
        );
        
        taskDate = DateTime.fromJSDate(taskDate, {zone: user.timezone});
        switch(habit.howOften.timeUnit) {
            case "minute":
                jobDate = jobDate.plus({ minutes: 1*habit.howOften.step});
                taskDate = taskDate.plus({ minutes: 1*habit.howOften.step});
                break;
            case "hour":
                jobDate = jobDate.plus({ hours: 1*habit.howOften.step });
                taskDate = taskDate.plus({ hours: 1*habit.howOften.step });
                break;
            case "day":
                jobDate = jobDate.plus({days: 1*habit.howOften.step});
                taskDate = taskDate.plus({days: 1*habit.howOften.step});
                break;
            case "week":
                jobDate = jobDate.plus({ weeks: 1*habit.howOften.step });
                taskDate = taskDate.plus({ weeks: 1*habit.howOften.step });
                break;
            case "month":
                jobDate = jobDate.plus({ months: 1*habit.howOften.step });
                taskDate = taskDate.plus({ months: 1*habit.howOften.step });
                break;
            case "year":
                jobDate = jobDate.plus({ years: 1*habit.howOften.step });
                taskDate = taskDate.plus({ years: 1*habit.howOften.step });
                break;
            default:
                console.log("Incorrect step option");
                break;
        }

        // Convert to js date to call next scheduler
        jobDate = jobDate.toJSDate();
        taskDate = taskDate.toJSDate();

        console.log("Job date post increment: ", jobDate);

        if(taskDate < habit.endDate) {
            console.log("Scheduling next habit task...");
            schedule_task(jobDate, taskDate, habitID); // Schedule the next task
        }
    })
    console.log("Habit task schedule function end")
};

const delete_task_scheduler = async (habit) => {
    schedule.cancelJob(habit._id.toString());
}

// Habit job initializer
// Jobs are saved in db with habit and creation date. 
// On initialization, get all docs from db, call creation function on all.
const init_task_creation_jobs = async () => {
    // Get all creation jobs from database
    const creationJobs = await TaskJob.find();

    // Loop through each and call scheduler function
    for(let i = 0; i < creationJobs.length; ++i) {
        const now = new Date(Date.now());
        if(creationJobs[i].jobDate <= now) {
            creationJobs[i].jobDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, now.getSeconds(), now.getMilliseconds());
        }
        
        schedule_task(creationJobs[i].jobDate, creationJobs[i].taskDate, creationJobs[i].habitID);
    }
};

/* 2. Task automatic reminders

*/
const schedule_reminder = async (task) => {
    console.log("Task reminder schedule function start")
    console.log(schedule)
    let jobDate = new Date(
        task.date.getFullYear(),
        task.date.getMonth(),
        task.date.getDate(),
        (task.startTime) ? task.startTime.getHours() : 0,
        (task.startTime) ? task.startTime.getMinutes() : 0,
        0,
        0
    );
    jobDate = DateTime.fromJSDate(jobDate);
    jobDate = jobDate.minus({days: 1});
    jobDate = jobDate.toJSDate();

    const now = new Date(Date.now());
    if(jobDate < now) {
        jobDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds() + 5, 0);
    }

    console.log("Job scheduled for: ", jobDate)
    const job = schedule.scheduleJob(task._id.toString(), jobDate, () => {
        console.log("Job fired for task: ", task._id);
        EmailController.send_reminder(task.id);
    });
};

const update_reminder = async (task) => {
    console.log("Task reminder update function start")
    console.log(task);
    // Delete old reminder
    schedule.cancelJob(task._id.toString());

    console.log("Task reminder update function end")

    // Set new reminder
    await schedule_reminder(task);
};

const init_task_reminder_jobs = async () => {
    let tasks = await Task.find();
    // Consider adding a new reminder collection containing task id
    tasks = tasks.filter( x => !x.completed && x.reminder); // Filter out completed tasks and tasks that dont want a reminder

    for(let i = 0; i < tasks.length; ++i) {
        const now = new Date(Date.now());
        if(!tasks.completed || tasks.date > now) {
            await schedule_reminder(tasks[i]);
        }
    }
};

module.exports = {
    schedule,
    schedule_task,
    delete_task_scheduler,
    init_task_creation_jobs,
    schedule_reminder,
    update_reminder,
    init_task_reminder_jobs,
}