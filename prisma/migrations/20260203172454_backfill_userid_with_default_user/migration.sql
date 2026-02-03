-- Create a default user if it doesn't exist
INSERT INTO "User" ("email", "password", "createdAt", "username")
VALUES ('default@local', 'hashed_default_password', now(), 'default_user')
ON CONFLICT ("email") DO NOTHING;

-- Backfill BlogPost rows with the default user
UPDATE "BlogPost" 
SET "userId" = (SELECT id FROM "User" WHERE email = 'default@local' LIMIT 1)
WHERE "userId" IS NULL;

-- Backfill ImagePost rows with the default user
UPDATE "ImagePost" 
SET "userId" = (SELECT id FROM "User" WHERE email = 'default@local' LIMIT 1)
WHERE "userId" IS NULL;

-- Backfill Comment rows with the default user
UPDATE "Comment" 
SET "userId" = (SELECT id FROM "User" WHERE email = 'default@local' LIMIT 1)
WHERE "userId" IS NULL;