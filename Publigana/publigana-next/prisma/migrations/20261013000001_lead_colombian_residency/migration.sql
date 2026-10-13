ALTER TABLE "leads"
ADD COLUMN "country_code" VARCHAR(2);

ALTER TABLE "leads"
ADD CONSTRAINT "leads_country_code_check"
CHECK ("country_code" IS NULL OR "country_code" = 'CO');
