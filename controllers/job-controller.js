const Habit = require("../models/Habit");
const Task = require("../models/Task");
const TaskJob = require("../models/TaskJob");
const User = require("../models/User");

const {DateTime} = require("luxon");

// Need two types of scheduling
/* 1. Habit automatic task creation
    - Upon habit creation, scheduler gets called
    - Scheduler will require: Date to be created, habit id
    - Scheduler gets habit from db, constructs task, creates task, adds id to habit, increments date, saves a job in the db, calls scheduler with new info
*/

const schedule_task = ( jobDate, taskDate, habitID ) => {

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
    } // Otherwise, update it with current info
    else {
        TaskJob.findOneAndUpdate({habitID: habitID}, {jobDate: jobDate, taskDate: taskDate});
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

    // Schedule a job that creates a new task and schedules the next task creation. Runs on newDate
    const job = schedule.scheduleJob(jobDate, () => {
        await Task.create(task); // Create task in db

        // Increment Dates
        jobDate = DateTime.fromJSDate(jobDate, {zone: user.timezone});
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

        if(taskDate < habit.endDate) {
            schedule_task(jobDate, taskDate, habitID); // Schedule the next task
        }
    })

};

// Habit job initializer
// Jobs are saved in db with habit and creation date. 
// On initialization, get all docs from db, call creation function on all.
const init_task_creation_jobs = () => {
    // Get all creation jobs from database
    const creationJobs = await TaskJob.find();

    // Loop through each and call scheduler function
    for(let i = 0; i < creationJobs.length; ++i) {
        const now = new Date(Date.now());
        if(creationJobs[i].jobDate <= now) {
            creationJobs[i].jobDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 5, now.getSeconds(), now.getMilliseconds());
        }
        
        schedule_task(creationJobs[i].jobDate, creationJobs[i].taskDate, creationJobs[i],habitID);
    }
};

/* 2. Task automatic reminders

*/
const schedule_reminder = (task) => {
    let jobDate = DateTime.fromJSDate(task.date);
    jobDate = jobDate.minus({days: 1});

    const job = schedule.scheduleJob(jobDate, () => {
        ReminderController.send_reminder(task.id);
    });
};

const init_task_reminder_jobs = () => {
    const tasks = await Task.find();

    for(let i = 0; i < tasks.length; ++i) {
        const now = new Date(Date.now());
        if(!tasks.completed || tasks.date > now) {
            schedule_reminder(task[i]);
        }
    }
};

module.exports = {
    schedule_task,
    init_task_creation_jobs,
    schedule_reminder,
    init_task_reminder_jobs,
}