# Movie Management System

A full-stack web application for managing movies with user authentication and role-based access control.

## Features

- **User Authentication**: Login system with role-based access control (EMPLOYEE, MANAGER, ADMIN)
- **Movie Management**: CRUD operations for movies
- **Filtering**: Filter movies by title, year, type, and category
- **Export**: Export movies in various formats (CSV, DOCX, JSON, XML)
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

### Frontend
- React 19
- React Router for navigation
- Material UI for components
- Axios for API calls
- React Cookie for cookie management

### Backend
- Spring Boot microservices
- RESTful API architecture
- JPA/Hibernate for database access

## Getting Started

### Prerequisites
- Node.js and npm
- Java 17 or higher
- Maven
- MySQL or another compatible database

### Running the Frontend

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`

### Running the Backend

1. Start the user microservice (port 8080)
2. Start the film microservice (port 8083)
3. Ensure the database is properly configured and accessible

## Usage

### Login
- Use the login page to authenticate with your username and password
- You will be redirected to the appropriate dashboard based on your role

### Employee Features
- View the dashboard with movie statistics
- View, add, edit, and delete movies
- Filter movies by various criteria
- Export movies in different formats

### Manager Features
- All employee features
- Additional reporting capabilities (to be implemented)

### Admin Features
- All manager features
- User management capabilities (to be implemented)

## Project Structure

```
src/
├── components/         # Reusable UI components
├── contexts/           # React contexts (auth)
├── pages/              # Page components
│   ├── employee/       # Employee-specific pages
│   └── movies/         # Movie management pages
├── services/           # API service functions
└── utils/              # Utility functions and constants
```

## API Endpoints

### User Microservice (Port 8080)
- POST `/api/users/auth` - Authenticate user
- GET `/api/users/{id}` - Get user by ID
- GET `/api/users/all` - Get all users
- POST `/api/users/create` - Create new user
- PUT `/api/users/{id}/update` - Update user
- DELETE `/api/users/{id}/delete` - Delete user
- POST `/api/users/setType` - Set user type

### Film Microservice (Port 8083)
- GET `/api/films/all` - Get all films
- GET `/api/films/{id}` - Get film by ID
- POST `/api/films/create` - Create new film
- PUT `/api/films/{id}/update` - Update film
- DELETE `/api/films/{id}/delete` - Delete film
- GET `/api/films/search/title/{title}` - Search films by title
- GET `/api/films/search/year/{year}` - Search films by year
- GET `/api/films/search` - Search films with filters
- GET `/api/films/export/csv` - Export films as CSV
- GET `/api/films/export/docx` - Export films as DOCX
- GET `/api/films/export/json` - Export films as JSON
- GET `/api/films/export/xml` - Export films as XML
- GET `/api/films/stats/byCategory` - Get film count by category
- GET `/api/films/stats/byYear` - Get film count by year
