CREATE DATABASE "chattis"
    WITH
    OWNER = postgres
    ENCODING = 'UTF-8'
    CONNECTION LIMIT = -1;
-- by default this is to create the table in the CLI
-- \i in CLI makes u run a file (for CREATE DB)
-- remove \c chattis and run the rest in a gui!
\c chattis

CREATE TABLE "users"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY ,
    "user_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "user_role" VARCHAR(255) NOT NULL
);

CREATE TABLE "chats"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "subject" VARCHAR(255) NOT NULL,
    "created_by" uuid NOT NULL,
    CONSTRAINT "chat_created_by_foreign" FOREIGN KEY("created_by") REFERENCES "users"("id")
);

CREATE TABLE "chat_users"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "chat_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT FALSE,
    "invitation_accepted" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "chat_users_chat_id_foreign" FOREIGN KEY("chat_id") REFERENCES "chats"("id"),
    CONSTRAINT "chat_users_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id")
);

CREATE TABLE "messages"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "chat_id" uuid NOT NULL,
    "from_id" uuid NOT NULL,
    "message_timestamp" TIMESTAMP NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    CONSTRAINT "messages_chat_id_foreign" FOREIGN KEY("chat_id") REFERENCES "chats"("id"),
    CONSTRAINT "from_id_foreign" FOREIGN KEY (from_id) REFERENCES "users"("id")
);

CREATE TABLE "user_blockings"(
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "user_id" uuid NOT NULL,
    "blocked_user_id" uuid NOT NULL,
  CONSTRAINT "user_blockings_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id"),
  CONSTRAINT "user_blockings_blocked_user_id_foreign" FOREIGN KEY("blocked_user_id") REFERENCES "users"("id")
);
-- this is from connect-pg-simple npm module
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- Checks if user is admin or creator of the chat
-- If you create chat the trigger triggers the function that invites and accepts the user that created the chat directly
CREATE OR REPLACE FUNCTION f_insert_chat_creator()
RETURNS trigger AS $$
BEGIN
    INSERT INTO chat_users (chat_id, user_id, invitation_accepted)
    VALUES (new.id, new.created_by, true);
    return NEW;
END;
$$
language plpgsql;

CREATE TRIGGER t_create_chat 
    AFTER INSERT ON chats
    FOR EACH ROW
    EXECUTE PROCEDURE f_insert_chat_creator();

-- To become an admin, write the following SQL command:
-- update users set user_role = 'admin' where user_name = 'YOURUSERNAME';

-- lastmessage sent view
CREATE VIEW lastmessage AS SELECT chats.id AS chat_id, MAX(messages.message_timestamp) AS last_message_timestamp FROM chats, messages WHERE chats.id = messages.chat_id GROUP BY(chats.id);
