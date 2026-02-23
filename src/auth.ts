
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import Credentials from "next-auth/providers/credentials";
import { users } from "@/db/schema"; // Import accounts too if needed later
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    session: { strategy: "jwt" }, // Use JWT for credentials provider
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsed = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);
                if (!parsed.success) return null;

                const { email, password } = parsed.data;
                const user = await db.query.users.findFirst({ where: eq(users.email, email) });

                if (!user) {
                    // For now, auto-create user on login for demo simplicity?
                    // Or require manual signup flow.
                    // Let's implement signup properly or auto-create.
                    // Auto-signup for demo
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const [newUser] = await db.insert(users).values({
                        email,
                        password: hashedPassword,
                        name: email.split("@")[0],
                    }).returning();
                    return newUser;
                }

                if (!user.password) return null; // OAuth user trying to use password?

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (passwordsMatch) return user;

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = (token.id as string) || (token.sub as string);
            }
            return session;
        },
    },
    // Extended User type to include password hash if we store it (schema needs it)
    // wait, schema `users` table doesn't have password field in the default Auth.js schema I copied!
    // I need to add password to the schema or use a separate credentials table.
    // For simplicity, let's add `password` to the `users` table definition in schema.ts FIRST.

    // STOP: I need to update schema.ts first to include password.
});
