const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { findUserByEmail, createUser } = require('../models/users');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3001/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    let user = findUserByEmail(email);

    if (!user) {
        user = createUser({
            email,
            googleId: profile.id,
            name: profile.displayName
        });
    }

    return done(null, user);
}));

module.exports = passport;
