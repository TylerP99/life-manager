const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

function init_passport_local(passport) {
    passport.use(new LocalStrategy({usernameField: "email"},
        async function verifyCredentials(email, password, done) {
            try{
                // Get user from db
                const user = await User.findOne({email: email});
                console.log(user);

                if(!user) { // Email not found
                    return done(null, false, {msg: `That email (${email}) was not found.`});
                }

                // Guest account?
                // if (!user.password) {
                //     return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' })
                // }

                // Compare password with bcrypt
                const match = user.comparePassword(password);

                if(!match) { // Password incorrect\
                    return done(null, false, {msg: "That password was incorrect!"})
                }

                return done(null, user); // All checks passed, return user
            }
            catch(e) { // Errors
                console.error(e);
                return done(e);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}

module.exports = init_passport_local;