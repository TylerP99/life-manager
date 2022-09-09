module.exports = {
    forwardIfAuthenticated: (req,res,next) => {
        if(req.isAuthenticated()) { // User is logged in, redirect to homepage/dashboard
            return res.redirect("/dashboard");
        }
        return next();
    },
    ensureAuthenticated: (req,res,next) => {
        if(!req.isAuthenticated()) { // No user logged in, redirect to signin
            return res.redirect("/users/signin");
        }
        return next();
    }
}