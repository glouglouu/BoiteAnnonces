"use strict";
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User');
// Sérialisation de l'utilisateur
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// Désérialisation de l'utilisateur
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
});
// Stratégie Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/users/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = await User.create({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                password: 'oauth_google', // Marqueur pour utilisateur OAuth
            });
        }
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
// Stratégie GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/users/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.username + '@github.com' });
        if (!user) {
            user = await User.create({
                firstName: profile.username,
                lastName: 'GitHub',
                email: profile.username + '@github.com',
                password: 'oauth_github',
            });
        }
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
// Stratégie Twitter
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: '/api/users/auth/twitter/callback',
    includeEmail: true,
}, async (token, tokenSecret, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = await User.create({
                firstName: profile.displayName,
                lastName: 'Twitter',
                email: profile.emails[0].value,
                password: 'oauth_twitter',
            });
        }
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
