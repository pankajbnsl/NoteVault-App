# NoteVault

**NoteVault** is a note-taking website built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The application allows users to register, log in, create, edit, and delete notes securely. It utilizes JSON Web Tokens (JWT) for authentication and Axios for connecting the frontend with the backend.

## Features

- **User Authentication**: Users can register and log in using a secure authentication system.
- **Create, Edit, and Delete Notes**: Users can create new notes, edit existing ones, and delete notes they no longer need.
- **Token-Based Authentication**: JSON Web Tokens (JWT) are used to authenticate users and protect routes.
- **Responsive UI**: The frontend is built with React.js to provide a smooth and responsive user experience.
- **Backend with Node.js and Express.js**: The backend handles user management, note operations, and authentication.
- **Data Storage**: MongoDB is used to store user data and notes efficiently.
- **API Communication**: Axios is used to facilitate communication between the frontend and backend.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **HTTP Client**: Axios

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/)

### Steps

1. Clone the repository:

   `git clone https://github.com/yourusername/notevault.git`

2. Navigate to the project directory:

   `cd notevault`

3. Install server dependencies:

   `cd backend`  
   `npm install`

4. Install client dependencies:

   `cd ../frontend`  
   `npm install`

5. Set up environment variables:

   In the `backend` directory, create a `.env` file and add the following environment variables:

   `MONGO_URI=your_mongo_database_uri`  
   `JWT_SECRET=your_jwt_secret_key`

6. Start the development server:

   - Backend:

     `cd backend`  
     `npm start`

   - Frontend:

     `cd ../frontend`  
     `npm start`

7. Open your browser and visit:

   `http://localhost:8000`

## API Endpoints

### User Authentication

- **POST** `/create-account`: Register a new user
- **POST** `/login`: Log in a user and receive a JWT

### Notes

- **GET** `/get-all-notes`: Get all notes for the authenticated user
- **POST** `/add-note`: Create a new note
- **PUT** `/edit-note/:noteId`: Edit an existing note
- **DELETE** `/delete-note/:noteId`: Delete a note

## Usage

1. **Register** for a new account or **log in** if you already have one.
2. Once logged in, you can create, view, edit, and delete notes from your dashboard.
3. Notes are securely stored, and only the authenticated user can access their own notes.

## Dependencies

- **Frontend**:
  - React.js
  - Axios
  - Bootstrap or your preferred styling framework
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - JSON Web Token (JWT)
