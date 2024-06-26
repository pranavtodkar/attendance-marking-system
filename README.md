# Attendance Marking System

This is a full-stack application for an attendance marking system built with Node.js, React, and PostgreSQL. It utilizes the ***face-api.js*** library for ***face recognition-based attendance marking***, making it a useful sample project for anyone looking to implement similar functionality.

Live at https://attendance-iitgoa.vercel.app

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (`v20.0.0` and above)
- npm (Node Package Manager)
- PostgreSQL (version 9.6 or later)

## Getting Started

Follow these steps to run the application locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/pranavtodkar/attendance-marking-system.git
   cd attendance-marking-system
   ```

2. **Install dependencies** Install dependencies for both backend and frontend:

    ```bash
    cd frontend
    npm install
    cd ../backend
    npm install
    ```
3. **Generate Google Auth CLIENT_ID (or ask the Repo Owner)** Follow steps from https://blog.logrocket.com/guide-adding-google-login-react-app to get your Google Auth running.
4. **Create a .env file** <br>
    In the ```backend``` folder, create a new .env file and add the following environment variables:

    ```bash
    SECRET_KEY="your_secret_key"
    POSTGRES_URL="your_postgres_host_url"
    ```

    In the ```frontend``` folder, create a new .env file and add the following environment variables:

    ```bash
    REACT_APP_BACKEND_URL = "your_backend_url"
    REACT_APP_GAUTH_CLIENT_ID = "your_google_console_auth_client_id"
    ```
    Replace **your_secret_key** with a secure secret key for JSON Web Token (JWT) signing, **your_postgres_host_url** with a PostgreSQL database host URL, **your_backend_url** with backend URL and **your_google_console_auth_client_id** with Client ID from Google cloud console.

5. **Create a PostgreSQL database** Create a new PostgreSQL database named attendance-marking

6. **Create tables** 
Use the SQL script ```database/Tables CREATE.sql``` to create the necessary tables

7. **Insert dummy data** To populate the database with some dummy data for start, use the SQL script ```database/Tables INSERT test data.sql```

8. **Start the backend server** In the backend folder, start the server:

    ```bash
    cd backend
    npm run dev
    ```
9. **Start the frontend development server** In a new terminal window, navigate to the frontend folder and start the development server:

    ```bash
    cd frontend
    npm start
    ```

The application should now be running at http://localhost:3000.

Congratulations! You have successfully set up and run the Attendance Marking System application locally.

