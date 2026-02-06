# Wellness Gamification App (Full-Stack)

This is a full-stack wellness gamification application. Users can complete wellness challenges, earn points, level up, unlock planets and plants, and manage their virtual garden.

The project includes:
- Backend: Node.js, Express, MySQL
- Frontend: HTML, CSS, JavaScript (uses Bootstrap for UI components such as modals and popovers)

---

## Table of Contents

1. Environment Variables  
2. Database Setup  
3. Installing Dependencies  
4. Running the Backend  
5. Running the Frontend  
6. Game Logic Overview  
7. Frontend Features  
8. API Endpoints  
9. Error Handling and Validation  
10. Security  

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=your_password  
DB_NAME=wellness_app  
JWT_SECRET_KEY=your_jwt_secret  

- Environment variables are loaded using the `dotenv` package.
- The database connection in `src/services/db.js` reads these variables.
- `JWT_SECRET_KEY` is used to sign and verify JSON Web Tokens for authentication.

---

## Database Setup

The application uses a MySQL database to store all user, challenge, and game-related data.

Tables include:
- Users  
- Wellness Challenges  
- Challenge Completions  
- Levels  
- Badges  
- Planets  
- Plants  
- UserPlanets  
- UserPlants  
- UserBadges  

Create the database:

Run the provided database initialization scripts to create tables:
npm run init_tables
Ensure MySQL is running before starting the application.

Installing Dependencies
Backend
Navigate to the project root directory.

Install all dependencies:

npm install
Backend dependencies (from package.json) include:
- express
- mysql2
- dotenv
- bcrypt
- jsonwebtoken
- nodemon

## Running the Backend
Start the backend server in development mode:

npm run dev
Or start normally:

node index.js
The server will run at:

http://localhost:3000

## Running the Frontend
Frontend files are located in the public/ directory.

Pages can be opened directly in the browser or served statically by Express.

Ensure the backend server is running, as frontend JavaScript communicates with the backend using the Fetch API.

## Game Logic Overview
Users earn points by completing wellness challenges.

Points contribute to leveling up based on experience thresholds.

Higher levels unlock new planets and plants.

Plants must be purchased before they can be planted.

Badges are automatically awarded when specific conditions are met.

User progression is persisted in the database.

## Frontend Features
Display all planets and indicate which ones are unlocked.

Display plants within planets, including growth stage and planted date.

Plant new plants using Bootstrap modals.

Delete planted plants using confirmation popovers.

Automatic page refresh after plant-related actions.

UI interactions (modals and popovers) are powered by Bootstrap.

## API Endpoints
1. Users
POST /users/register – Register a new user

POST /users/login – Login using email/username and password

GET /users/:user_id – Retrieve a specific user profile

2. Challenges
GET /challenges – Retrieve all wellness challenges

POST /challenges/complete – Mark a challenge as completed

3. Leaderboard
GET /leaderboard – Retrieve users ordered by level

4. Planets and Plants
GET /planets – Retrieve all planets

GET /plants – Retrieve all plants

GET /users/:user_id/planets – Retrieve planets unlocked by the user

GET /users/:user_id/plants – Retrieve plants owned by the user

POST /users/:user_id/plants/:plant_id/buy – Purchase a plant

POST /users/:user_id/plants/:plant_id/plant – Plant a plant

DELETE /users/:user_id/plants/:plant_id – Remove a planted plant

5. Badges
GET /users/:user_id/badges – Retrieve badges earned by the user

6. Completions
GET /users/:user_id/completions – Retrieve completed challenges

## Error Handling and Validation
Input validation is performed at the controller level before database operations.

Middleware is used for:
- Authorization
- Ownership validation
- Resource existence checks

Meaningful HTTP status codes are returned:

400 Bad Request

403 Forbidden

404 Not Found

409 Conflict

500 Internal Server Error

## Security
Passwords are securely hashed using bcrypt.

Authentication is handled using JSON Web Tokens (JWT).

Sensitive configuration values are stored in .env.

User ownership is enforced on protected routes to prevent unauthorized access.