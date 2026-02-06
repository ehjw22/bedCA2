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
The main routes include:

/jwt/verify – verifies if a JWT token is valid and returns user information if valid.

/login – logs in a user using email or username and password, returning a JWT on success.

/register – registers a new user, unlocks the first planets for new users, and generates a JWT token.

Sub-routes include:

/user – for user management.

/challenges – for challenges and completions.

/leaderboard – for leaderboard endpoints.

/planets – for planet management.

/plants – for plant management.

### The challenges routes allow users to:

POST /challenges – create a new wellness challenge.

GET /challenges – retrieve all challenges.

POST /challenges/similarChallenges – return challenges similar to a provided description.

DELETE /challenges/:challenge_id – remove a challenge after verifying it exists, also deleting related user completion records.

PUT /challenges/:challenge_id – update a challenge after verifying ownership.

GET /challenges/:challenge_id – retrieve information for a specific challenge.

### The completion routes allow users to:

POST /challenges/:challenge_id – create a completion record for a challenge, update user points, level, unlocked planets, and badges.

GET /challenges/:challenge_id/userCompletion – retrieve all user completion records for a specific challenge.

### The leaderboard routes allow users to:

GET /leaderboard/challenge – retrieve all users ranked by challenges completed.

GET /leaderboard/byExp – retrieve users ranked by experience.

GET /leaderboard/byPlantPlanted – retrieve users ranked by the number of plants they have planted.

### The planet route includes
GET /planets – retrieves all available planets.

### The plant route includes
GET /plants - retrieves all available plants.

### User routes allow:
POST /users – creates a new user account

GET /users – retrieves all users

GET /users/token – retrieves details of the currently logged-in user

PUT /users/token – updates user information after verifying identity

GET /users/token/badges – retrieves all badges earned by the user

GET /users/token/planets – retrieves all planets unlocked by the user

GET /users/token/plants/:planet_id – lists all plants owned by the user on a specific planet

GET /users/token/boughtPlants – shows all purchased plants

GET /users/token/completions – retrieves all challenges completed by the user

DELETE /users/token/plants/:user_plant_id – removes a plant owned by the user

POST /users/token/plants/:plant_id/plant – plants an owned plant on a specific planet

POST /users/token/plants/:plant_id/buy – allows the user to purchase a plant

GET /users/token/challenges – retrieves all challenges created by the user.

All protected routes use jwtMiddleware.verifyToken to validate tokens, and relevant controllers handle database queries, input validation, and error responses.

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