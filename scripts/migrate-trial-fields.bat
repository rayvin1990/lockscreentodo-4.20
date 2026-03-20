@echo off
echo Starting database migration...

echo Generating migration files...
cd packages/db
npx prisma migrate dev --name add_trial_and_pro_fields

echo Generating Prisma Client...
npx prisma generate

echo Checking migration status...
npx prisma migrate status

echo Migration complete!
pause
