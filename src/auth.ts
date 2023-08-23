import { Request } from "express";
import passport from "passport";
import GoogleStrategy, { VerifyCallback } from "passport-google-oauth2";
import dotenv from "dotenv";
import { prisma } from "../prisma/prisma-client";

const GoogleStrategyStrategy = GoogleStrategy.Strategy;

dotenv.config();

passport.use(
  new GoogleStrategyStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:8080/api/v1/auth/google/callback",
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      // provider         always set to `google`
      // id
      // name
      // displayName
      // birthday
      // relationship
      // isPerson
      // isPlusUser
      // placesLived
      // language
      // emails
      // gender
      // picture
      // coverPhoto
      done: VerifyCallback
    ) => {
      try {
        const user = await prisma.user.upsert({
          where: {
            googleId: profile.id,
          },
          update: {},
          create: {
            googleId: profile.id,
            email: profile.email,
          },
        });
        return done(null, profile);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: VerifyCallback) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: VerifyCallback) => {
  done(null, user);
});
