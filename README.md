# Wellness Gamification App (Full-Stack)

This is a full-stack wellness gamification application. Users can complete wellness challenges, earn points, level up, unlock planets and plants, and manage their garden.

The project includes:
- Backend: Node.js, Express, MySQL
- Frontend: HTML, CSS, JS (uses Bootstrap for UI and popovers/modals)

---

## Table of Contents

1. Environment Variables
2. Database Setup
3. Installing Dependencies
4. Running the Backend
5. Running the Frontend
6. Endpoints
7. Game Logic Overview
8. Frontend Features
9. Error Handling and Validation

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=your_password  
DB_NAME=your_database_name  
JWT_SECRET_KEY=your_jwt_secret  
JWT_EXPIRES_IN=15m  

- `db.js` in `src/services` uses `dotenv` to load these variables.  
- `JWT_SECRET_KEY` is used to sign tokens for user authentication.  

---

## Database Setup

The database tables are created using an SQL initialization script:

- Users  
- Wellness Challenges  
- Challenge Completions  
- Levels  
- Badges  
- Planets  
- Plants  
- UserPlanets  
- UserPlants  
- UserBadge  
- UserBoughtPlants  

---

## Installing Dependencies

### Backend

1. Install the dependencies:

npm install

Dependencies used:

express, nodemon, mysql2, dotenv, bcrypt, jsonwebtoken

2. Initialize the database tables:

npm run init_tables

3. Start the server:

npm run dev

### Frontend

- The frontend uses HTML, CSS, JS, with Bootstrap for UI components.  
- Simply open `index.html` (or the planet page) in your browser, or serve via a static server.  
- Ensure the backend is running, since the frontend fetches data from the API.  

---

## Game Logic Overview

- Users earn points by completing wellness challenges.  
- Points contribute to leveling up based on experience thresholds.  
- Higher levels unlock new planets and plants.  
- Plants must be purchased before planting.  
- Badges are awarded automatically when specific conditions are met.  

---

## Frontend Features

- Display all planets, showing which ones the user has unlocked.  
- Display plants inside a planet, showing growth stage and planted date.  
- Users can plant new plants using a modal.  
- Users can delete planted plants with a confirmation popover.  
- Popovers and modals are powered by Bootstrap.  
- Pages automatically refresh after planting or deleting plants.  

---

## Endpoints

### Users

- POST /users – Create a new user.  
- GET /users – Retrieve all users with user_id, username, and points.  
- GET /users/{user_id} – Retrieve details of a specific user.  
- PUT /users/{user_id} – Update user details (password, email).  
- POST /users/login – Login via username/email + password.  

### Challenges

- POST /challenges – Create a new wellness challenge.  
- GET /challenges – Retrieve all challenges.  
- DELETE /challenges/{challenge_id} – Delete challenge + completions.  
- PUT /challenges/{challenge_id} – Update challenge (only creator).  
- POST /challenges/{creator_id} – Create completion record for a user.  
- GET /challenges/{challenge_id} – Retrieve users who attempted the challenge.  

### Leaderboard

- GET /leaderboard – Users ordered by level descending.  

### Planets and Plants

- GET /planets – Retrieve all planets.  
- GET /plants – Retrieve all plants.  
- GET /users/{user_id}/planets – Retrieve planets the user unlocked.  
- GET /users/{user_id}/plants – Retrieve plants the user has purchased.  
- POST /users/{user_id}/plants/{plant_id}/plant – Plant a plant on a planet.  
- DELETE /users/{user_id}/plants/{plant_id} – Delete a planted plant.  
- POST /users/{user_id}/plants/{plant_id}/buy – Purchase a plant.  

### Badges

- GET /users/{user_id}/badges – Retrieve all badges earned by the user.  

### Completions

- GET /users/{user_id}/completions – Retrieve all challenges completed by the user.  

---

## Error Handling and Validation

- Inputs are validated at the controller level before database operations.  
- Returns meaningful HTTP status codes: 400, 403, 404, 409, 500.  
- Middleware is used for repeated checks: existence, ownership, authorization.  
- Database errors are handled safely to prevent crashes.  