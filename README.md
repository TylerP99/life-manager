# Newid
A full stack web application for goal setting and task tracking. Use the application to create and manage tasks, habits, routines, and goals to take more control of your productivity!

**Link to project:** https://newid.onrender.com
Currently hosting on Render, unless I find a better platform. Render is a bit slow right now for me.

![alt tag](http://placecorgi.com/1200/650)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, NodeJS, ExpressJS, MongoDB, PassportJS, EJS

The frontend of this application was made using EJS for templating, along with CSS and Javascript for client side functionality. This may be updated to React.

This application follows an MVC architecture. 

### Models
Models are created from Mongoose schemas. All schemas include the Mongoose timestamp option, including a createdAt field and a modifiedAt field. All documents also get a unique id from Mongoose. All schema definitions can be found in the "models" folder

User Model:
Powers user authentication system and document ownership.
- Username:
  - String
  - Unique
  - Required
- Email:
  - String
  - Unique
  - Required
- Password:
  - String
  - Hashed for security
  - Required
- Active:
  - Boolean
  - Defaults to false
  - Used later for email verification

Task Model:
The base item for all other app related models. A task is a single, simple thing a person can do. It is designed to occur on one specified date. 
- Name:
  - String
  - Required
- Description:
  - String
- Date:
  - JS Date Object
  - Required
- StartTime:
  - JS Date Object (Hour and minute)
- EndTime:
  - JS Date Object
- Completed:
  - Boolean
  - Defaults to false
- Owner:
  - Unique ID
  - Required
  - Ties task to specific user


### Controllers
The controllers used in this application fall into two categories: content serving or API/Database interactions. Most controller files include both. 

API Controllers:
The controllers that handle task, habit, routine, and goal management all follow a basic pattern that keeps each part of the process separate and more generic. This approach allows for the use of parts of each controller in the next highest controller (ie: Tasks used in habits, habits used in routines, all three used in goals). Actions typically follow this structure:
- A route controller picks up the request, and sends a response once all the data is processed by other controllers.
- A formatting function takes the request body and user information and formats it to follow model datatypes. This will return an object that can be turned into a document. This is called by the route function
- A verification function that takes in the formatted object. It will return an array of errors, if there are any, for display to the user. This is called by the operation function
- An operation function that does anything else needed with the given object and then stores in within the database. For tasks, it calls the verification function, then stores the provided task in the database. For something like habits, it creates all needed children tasks, stores them, saves their ids into the habit object, and stores that away in the database. This is called by the route function.



## Optimizations
This project has parts that build off of eachother. Tasks are the smallest building block of the project, being the core of habits, routines, and, by extension, goals. A habit is a single, repeating task. A goal is a set of tasks, habits and routines. This optimization comes from routines. A routine appears to be a set of recurring tasks, and this is how I programmed it my first run through. A routine got individual task information and made them repeat. This implementation ended up repeating quite a bit of code. In particular, I found myself repeating habit code over again for the recurring tasks. So, I modified my controllers for habits to have route independant habit modification functions. I then updated routines to take advantage of habits for repeating the tasks, rather than redoing it within routines. This also lowered the source of bugs to habits rather than both.

I also do my best to limit database calls and use optimal algorithms when I can.

## Lessons Learned:
This project allowed me to compound on skills I already had.

I was allowed to practice MVC architecture again in this project. It is a great way of keeping code organized and separated. 

## Examples:
Coming Soon


Credits:
<a href="https://www.freepik.com/free-photo/beautiful-red-green-maple-leaf-tree_3707164.htm#&position=3&from_view=collections">Image by lifeforstock</a> on Freepik

<a href="https://www.freepik.com/free-photo/aesthetic-leaf-watercolor-background-orange-autumn-season_17597736.htm#&position=2&from_view=collections">Image by rawpixel.com</a> on Freepik

<a href="https://www.freepik.com/free-photo/autumn-flat-lay-background-white_3238942.htm#&position=1&from_view=collections">Image by valeria_aksakova</a> on Freepik

Photo by <a href="https://unsplash.com/@ikoveliko?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Veliko Karachiviev</a> on <a href="https://unsplash.com/s/photos/autumn-landscape?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  

Photo by <a href="https://unsplash.com/@aaronburden?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Aaron Burden</a> on <a href="https://unsplash.com/s/photos/autumn-landscape?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
