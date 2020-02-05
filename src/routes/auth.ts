import mongoose from 'mongoose';
import { Router } from "express";
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../models/user';
import UserType from '../models/user-type';

export default class AuthFactory {
  constructor(private passport: PassportStatic) {
    this.configurePassport(this.passport);
  }

  getRouter(): Router {
    var router = Router();

    const passport = this.passport;

    router.post('/signup', (req, res, next) => {
      const err = User.Util.validate({ local: req.body });
      if (err) {
        return res.status(400).json(err);
      }

      const method = passport.authenticate('local-signup', { session: false }, (error, user) => {
        if (error) {
          return res.status(error.status ?? 500).send(error.message ?? "Something went wrong");
        }

        if (!user) {
          return res.status(500).send('Ehh');
        }

        res.json(user);
      });

      method(req, res, next);
    });

    router.post('/login', passport.authenticate('local-login', { session: false }), (req, res, next) => {
      var user = req.user as UserType;
      user.local.password = "null";

      res.cookie('token', user.local.token, { maxAge: 900000, httpOnly: true });
      res.json(user);
    });

    return router;
  }

  private configurePassport(passport: PassportStatic) {
    passport.use('local-signup', new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
          passReqToCallback: true
        }, 
        (req, email, password, done) => {
          if (!User.Util.validateEmail(email)) {
            const badRequest = { status: 400, message: "invalid email" }
            return done(badRequest, false)
          }

          const newUser = new User.Model();
          newUser.local.name = req.body.name;
          newUser.local.email = email;
          newUser.local.password = User.Util.generateHash(password);
          newUser.local.token = User.Util.generateJWT(email, newUser._id);

          newUser.save()
            .then((savedUser) => {
              done(null, savedUser)
            })
            .catch((error) => {
              return done({ status: 409, message: error });
            });
        }
      )
    );

    passport.use('local-login', new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password'
        },
        (email, password, done) => {
          User.Model.findOne(
            { 
              'local.email': email 
            }, 
            (err: mongoose.Error | undefined, user) => {
              if (err) { return done(err); }
              if (!user) { return done(null, false); }
              if (!User.Util.verifyPassword(user, password)) { return done(null, false); }

              user.save()
                .then((_) => {
                  done(null, user);
                })
                .catch((error) => {
                  return done(error, user);
                });
            }
          );
        }
      )
    );
  }
}
