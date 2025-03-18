## Welcome to Deskbird-Assessment-Server
This application requires .env file in root folder with following structure:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=database
JWT_SECRET=very-secret-key

By initial seeding Users table would be created automatically, with two users provided:

- Admin - login: admin; password: admin;
- User - login: user1; password: 123456;
