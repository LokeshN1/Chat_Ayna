# Chat-Ayna

Chat-Ayna is a real-time chat application built with React, Vite, and Strapi. It supports user authentication, multiple chat sessions, and real-time messaging using Socket.io. All data, including chat sessions and authentication, is stored in local storage.

## Project Overview

### Main Focus

- **Local Storage**: All data, including chat sessions and authentication, is stored in local storage.
- **Backend Setup**: The backend server is set up using Strapi, an open-source headless CMS, to provide a robust backend infrastructure.
- **WebSockets**: The application uses WebSocket communication to facilitate instant messaging between the user and the server. When a client sends a message to the server, the server sends back the same message to the client.
- **Responsiveness**: The web application is designed to be responsive and can adapt to different screen sizes, including desktop, tablet, and mobile devices.

### What is Chat-Ayna?

Chat-Ayna is a real-time chat web application that facilitates instant messaging between the user and the server. The application is built using React+Vite for the frontend and Strapi for the backend. It supports user authentication, multiple chat sessions, and real-time messaging using WebSocket communication. The application is designed to be responsive and can run smoothly on various screen sizes and devices. All data, including chat sessions and authentication, is stored in local storage.

### Solution Components

1. **Backend Setup**: The backend server is set up using Strapi to provide a robust backend infrastructure for the application.
2. **User Authentication**: A basic user authentication system is implemented. Users can sign up, log in, and log out of the application.
3. **WebSocket API**: A WebSocket API is developed to echo client messages. When a client sends a message to the server, the server sends back the same message to the client.
4. **Interface**: An intuitive chat interface is designed where users can send and receive messages. Users can also switch between sessions.
5. **Local Database Storage**: Local database storage is implemented to store chat sessions and other data, including user authentication data and chat session history.
6. **Responsive Design**: The web application is designed to be responsive and can adapt to different screen sizes, including desktop, tablet, and mobile devices. The user interface is visually appealing and functional across various devices.
## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Project Structure](#project-structure)


## Features

- User registration and login
- Real-time messaging with Socket.io
- Multiple chat sessions
- Responsive design with Tailwind CSS
- Local storage for chat sessions and authentication

## Prerequisites

- Node.js (>=18.0.0 <=22.x.x)
- npm (>=6.0.0)
- Vercel account (for deployment)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/chat-ayna.git
   cd chat-ayna
   ```

2. Install dependencies for the backend:

   ```sh
   cd chat-backend
   npm install
   ```

3. Install dependencies for the frontend:

   ```sh
   cd ../chat-frontend
   npm install
   ```

## Configuration

1. Backend Configuration:

   - Copy the `.env.example` file to `.env` and update the environment variables:

     ```sh
     cp chat-backend/.env.example chat-backend/.env
     ```

   - Update the `FRONTEND_URL` in the `.env` file to match your frontend URL.

2. Frontend Configuration:

   - Copy the `.env.example` file to `.env` and update the environment variables:

     ```sh
     cp chat-frontend/.env.example chat-frontend/.env
     ```

   - Update the `VITE_BACKEND_URL` in the `.env` file to match your backend URL.

## Running the Application

1. Start the backend server:

   ```sh
   cd chat-backend
   npm run develop
   ```

2. Start the frontend development server:

   ```sh
   cd ../chat-frontend
   npm run dev
   ```


## Deployment

### Deploying the Backend

1. Deploy the backend to your preferred hosting provider (e.g., Heroku, DigitalOcean, etc.). I used Render for backend deployment.
I used Render for backend deployment.

2. Ensure that the environment variables are correctly set on the hosting provider.

### Deploying the Frontend

1. Deploy the frontend to Vercel:

   - Create a new project on Vercel and link it to your GitHub repository.
   - Ensure that the build command is `vite build` and the output directory is `dist`.

2. Add a `vercel.json` file to the root of the `chat-frontend` directory with the following content:

   ```json
   {
     "routes": [
       {
         "handle": "filesystem"
       },
       {
         "src": "/.*",
         "dest": "/index.html",
         "status": 200
       }
     ]
   }
   ```

3. Deploy the project on Vercel.

## Project Structure

```
chat-ayna/
  ├── chat-backend/          # Strapi backend
  │   ├── config/            # Configuration files
  │   ├── src/               # Source files
  │   ├── public/            # Public assets
  │   ├── .env.example       # Example environment variables
  │   ├── package.json       # Backend dependencies and scripts
  │   └── ...
  ├── chat-frontend/         # React frontend
  │   ├── src/               # Source files
  │   ├── public/            # Public assets
  │   ├── .env.example       # Example environment variables
  │   ├── package.json       # Frontend dependencies and scripts
  │   ├── vite.config.js     # Vite configuration
  │   └── vercel.json        # Vercel configuration
  ├── README.md              # Project documentation
  └── ...
```








