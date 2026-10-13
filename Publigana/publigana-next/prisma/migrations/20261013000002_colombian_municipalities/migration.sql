ALTER TABLE "usuario"
ADD COLUMN "municipality_code" VARCHAR(5);

ALTER TABLE "usuario"
ADD CONSTRAINT "usuario_municipality_code_check"
CHECK (
  "municipality_code" IS NULL OR (
    "country_code" IS NOT NULL AND
    "country_code" = 'CO' AND
    "municipality_code" ~ '^[0-9]{5}$'
  )
);

ALTER TABLE "leads"
ADD COLUMN "municipality_code" VARCHAR(5);

ALTER TABLE "leads"
ADD CONSTRAINT "leads_municipality_code_check"
CHECK (
  "municipality_code" IS NULL OR (
    "country_code" IS NOT NULL AND
    "country_code" = 'CO' AND
    "municipality_code" ~ '^[0-9]{5}$'
  )
);
