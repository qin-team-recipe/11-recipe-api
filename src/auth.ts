import { Request } from "express";
import passport from "passport";
import googleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import { prisma } from "../prisma/prisma-client";

// TODO:
const GoogleStrategy = googleStrategy.Strategy;

dotenv.config();
