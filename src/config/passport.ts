import passport from "passport";
import User, { UserModel } from "./../models/User";
import { LAZADA_APP_SECRET } from "./../util/secrets";
import { LAZADA_APP_KEY } from "./../util/secrets";
import passportLocal from "passport-local";
import _ from "lodash";
// @ts-ignore
import passportCustom from "passport-custom";
// @ts-ignore
import LazadaAPI from "lazada-open-platform-sdk";

import { Request, Response, NextFunction } from "express";

const LocalStrategy = passportLocal.Strategy;
const CustomStrategy = passportCustom.Strategy;

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        user.comparePassword(password, (err: Error, isMatch: boolean) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: "Invalid email or password." });
        });
    });
  }));


passport.use("lazada", new CustomStrategy(function (req: Request, done: any) {
    // validate token param
    if (!req.query.code) {
        return done(undefined, false);
    }

    const aLazadaAPI = new LazadaAPI(LAZADA_APP_KEY, LAZADA_APP_SECRET, "VIETNAM");
    aLazadaAPI
    .generateAccessToken({ code: req.query.code })
    .then((response: any) => {
        if (response.code != "0") return done(response);

        if (response.access_token) {
            return done(undefined, response);
        }

        return done(undefined, false);
    });
}));

export let isLazadaAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("lazada", async (err: Error, user: any) => {
        // Error xảy ra do gặp sự cố gọi request hoặc server ms/mindmap có vấn đề
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        // Không có data user => verify false
        if (!user) {
            return res.status(401).json({
                message: "Auth fail."
            });
        }

        // req.logIn(user, (err) => {
        //     if (err) {
        //         console.log(err.message);
        //     }
        // });

        await User.updateOne({email: req.user.email}, {"shop.0.auth": user});
        req.user.shop[0].auth = user;
        return next();
    })(req, res, next);
};

/**
 * Login Required middleware.
 */
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

  /**
   * Authorization Required middleware.
   */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];

    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    } else {
        res.redirect(`/auth/${provider}`);
    }
};
