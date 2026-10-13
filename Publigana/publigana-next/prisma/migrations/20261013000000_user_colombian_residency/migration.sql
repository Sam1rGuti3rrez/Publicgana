ALTER TABLE "usuario"
ADD COLUMN "country_code" VARCHAR(2);

ALTER TABLE "usuario"
ADD CONSTRAINT "usuario_country_code_check"
CHECK ("country_code" IS NULL OR "country_code" = 'CO');
