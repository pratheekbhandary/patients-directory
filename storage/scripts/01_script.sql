
-- adding gender ALTER TYPE enum_type ADD VALUE 'new_value';
CREATE TYPE "gender" AS ENUM (
    'MALE',
    'FEMALE',
    'NOT_KNOWN',
    'NOT_APPLICABLE'
);

CREATE TABLE "patients" (
    "id" SERIAL PRIMARY KEY,
    "first_name" varchar NOT NULL,
    "last_name" varchar,
    "email" varchar NOT NULL,
    "dob" timestamp NOT NULL,
    "gender" gender NOT NULL DEFAULT 'NOT_KNOWN',
    "phone_no" varchar,
    "address" varchar,
    "city" varchar,
    "zipcode" varchar,
    "created_at" timestamp NOT NULL DEFAULT (NOW()),
    "updated_at" timestamp
);
