# Newid
A full stack web application for goal setting and task tracking. Use the application to create and manage tasks, habits, routines, and goals to take more control of your productivity!

**Link to project:** http://recruiters-love-seeing-live-demos.com/

![alt tag](http://placecorgi.com/1200/650)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, NodeJS, ExpressJS, MongoDB, PassportJS, EJS

The frontend of this application was made using EJS for templating, along with CSS and Javascript for client side functionality. This may be updated to React.

## Optimizations
This project has parts that build off of eachother. Tasks are the smallest building block of the project, being the core of habits, routines, and, by extension, goals. A habit is a single, repeating task. A goal is a set of tasks, habits and routines. This optimization comes from routines. A routine appears to be a set of recurring tasks, and this is how I programmed it my first run through. A routine got individual task information and made them repeat. This implementation ended up repeating quite a bit of code. In particular, I found myself repeating habit code over again for the recurring tasks. So, I modified my controllers for habits to have route independant habit modification functions. I then updated routines to take advantage of habits for repeating the tasks, rather than redoing it within routines. This also lowered the source of bugs to habits rather than both.

## Lessons Learned:
This project allowed me to compund on skills I already had.

I was allowed to practice MVC architecture again in this project. It is a great way of keeping code organized and separated. 

## Examples:
Coming Soon


Credits:
<a href="https://www.freepik.com/free-photo/beautiful-red-green-maple-leaf-tree_3707164.htm#&position=3&from_view=collections">Image by lifeforstock</a> on Freepik

<a href="https://www.freepik.com/free-photo/aesthetic-leaf-watercolor-background-orange-autumn-season_17597736.htm#&position=2&from_view=collections">Image by rawpixel.com</a> on Freepik

<a href="https://www.freepik.com/free-photo/autumn-flat-lay-background-white_3238942.htm#&position=1&from_view=collections">Image by valeria_aksakova</a> on Freepik

Photo by <a href="https://unsplash.com/@ikoveliko?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Veliko Karachiviev</a> on <a href="https://unsplash.com/s/photos/autumn-landscape?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  

Photo by <a href="https://unsplash.com/@aaronburden?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Aaron Burden</a> on <a href="https://unsplash.com/s/photos/autumn-landscape?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
