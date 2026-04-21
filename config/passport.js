const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findByGoogleId(profile.id);
        if (user) return done(null, user);

        const email = profile.emails[0].value;
        user = await User.findByEmail(email);

        if (user) {
          await User.update(user.id, { google_id: profile.id });
          user.google_id = profile.id;
          return done(null, user);
        }

        const newUserId = await User.create({
          name: profile.displayName,
          email: email,
          google_id: profile.id,
          roleId: 1
        });

        user = await User.findById(newUserId);
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
} else {
  console.log('⚠️ Google OAuth credentials missing, strategy not initialized.');
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'emails']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findByFacebookId(profile.id);
        if (user) return done(null, user);

        const email = profile.emails ? profile.emails[0].value : null;
        if (email) {
          user = await User.findByEmail(email);
          if (user) {
            await User.update(user.id, { facebook_id: profile.id });
            user.facebook_id = profile.id;
            return done(null, user);
          }
        }

        const newUserId = await User.create({
          name: profile.displayName,
          email: email || `${profile.id}@facebook.worker`,
          facebook_id: profile.id,
          roleId: 1
        });

        user = await User.findById(newUserId);
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
} else {
  console.log('⚠️ Facebook OAuth credentials missing, strategy not initialized.');
}

// Required but we use JWT, so these won't be used much in a stateless API
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
