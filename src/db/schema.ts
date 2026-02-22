
import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    boolean,
    uuid
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(), // Ensure email is unique
    password: text("password"), // Added for credentials provider
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount["type"]>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
);

export const profiles = pgTable("profile", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    handle: text("handle").notNull().unique(),
    bio: text("bio"),
    location: text("location"),
    avatarUrl: text("avatarUrl"),
    verified: boolean("verified").default(false),
    sectionVisibility: text("sectionVisibility"), // JSON string or handle as jsonb if using neon serverless driver which supports it
});

export const links = pgTable("link", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    profileId: text("profileId")
        .notNull()
        .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    href: text("href").notNull(),
    icon: text("icon"),
    visible: boolean("visible").default(true),
    order: integer("order").default(0),
});

export const usersRelations = relations(users, ({ one }) => ({
    profile: one(profiles, {
        fields: [users.id],
        references: [profiles.userId],
    }),
    accounts: one(accounts, {
        fields: [users.id],
        references: [accounts.userId],
    }),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
    user: one(users, {
        fields: [profiles.userId],
        references: [users.id],
    }),
    links: many(links),
    socials: many(socials),
}));

export const linksRelations = relations(links, ({ one }) => ({
    profile: one(profiles, {
        fields: [links.profileId],
        references: [profiles.id],
    }),
}));

export const socials = pgTable("social", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    profileId: text("profileId")
        .notNull()
        .references(() => profiles.id, { onDelete: "cascade" }),
    platform: text("platform").notNull(),
    href: text("href").notNull(),
    label: text("label"),
    visible: boolean("visible").default(true),
    order: integer("order").default(0),
});

export const socialsRelations = relations(socials, ({ one }) => ({
    profile: one(profiles, {
        fields: [socials.profileId],
        references: [profiles.id],
    }),
}));
