// src/config/passport.ts

import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from "passport-github2";
import { prisma } from "@ledgerX/db";
import dotenv from "dotenv";

dotenv.config();

interface OAuthUserProfile {
  id: string;
  displayName: string;
  emails?: { value: string }[];
}

// 🔐 Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile: GoogleProfile, done) => {
      try {
        let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

        if (!user) {
          // Fallback to email
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email from Google"));

          user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || "Google User",
                role: "USER",
                password: null,
                googleId: profile.id, // Save Google ID
              },
            });
          } else if (!user.googleId) {
            // Link Google ID to existing user
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: profile.id },
            });
          }
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// 🟣 GitHub Strategy
interface GitHubStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

interface GitHubVerifyCallback {
  (
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: (error: any, user?: any) => void
  ): Promise<void>;
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
    } as GitHubStrategyOptions,
    (async (
      _accessToken: string,
      _refreshToken: string,
      profile: GitHubProfile,
      done: (error: any, user?: any) => void
    ): Promise<void> => {
      try {
        let user = await prisma.user.findUnique({ where: { githubId: profile.id } });

        if (!user) {
          // Fallback to email
          const email: string | undefined = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email from GitHub"));

          user = await prisma.user.findUnique({ where: { email } });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || "GitHub User",
                role: "USER",
                password: null,
                githubId: profile.id, // Save GitHub ID
              },
            });
          } else if (!user.githubId) {
            // Link GitHub ID to existing user
            user = await prisma.user.update({
              where: { id: user.id },
              data: { githubId: profile.id },
            });
          }
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }) as GitHubVerifyCallback
  )
);

// Optional if using sessions (you can remove if using JWTs only)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
