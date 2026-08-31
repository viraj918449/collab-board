# 📅 CollabBoard

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)

CollabBoard is a decoupled, full-stack project management application designed to help teams organize tasks, track progress across Kanban columns, and collaborate seamlessly. It features a custom dual-theme UI (Dark/Light mode) with signature forest green (`#4F5D55`) accents and secure RESTful backend communication.


---

## 📑 Table of Contents
1. [Features](#-features)
2. [Architecture Diagram](#️-architecture-diagram)
3. [Tech Stack](#-tech-stack)
4. [Folder Structure](#-folder-structure)
5. [Setup & Run Guidelines](#️-setup--run-guidelines)
6. [Environment Variables](#-environment-variables)
7. [API Reference](#-api-reference)
8. [Known Limitations & Future Scope](#️-known-limitations--future-scope)
9. [How To Run](#️-known-limitations--future-scope)
---

## ✨ Features
* **Secure Authentication:** User registration and login utilizing encrypted JSON Web Tokens (JWT) stored securely in local storage.
* **Kanban Task Management:** Full CRUD (Create, Read, Update, Delete) capabilities for tasks, organized into "To Do," "In Progress," and "Done" columns.
* **Dual-Theme UI:** A custom-built, responsive interface supporting both Light and Dark modes.
* **Team Assignment:** UI capabilities to invite team members and assign specific users to tasks based on their roles.
* **REST API:** A fully documented, stateless Express backend integrated with MongoDB.

---

## 🏗️ Architecture Diagram

CollabBoard utilizes a decoupled Client-Server architecture. The React frontend operates independently and communicates with the Node.js backend exclusively via a REST API using JSON payloads and JWT for secure authorization.

```text
+-------------------+       HTTP / REST       +-----------------------+
|                   |   (JSON + JWT Token)    |                       |
|   React Client    | <=====================> |  Node.js / Express    |
|   (Frontend)      |    GET, POST, PUT,      |  REST API (Backend)   |
|                   |    DELETE               |                       |
+--------+----------+                         +-----------+-----------+
         |                                                |
         | Local Storage                                  | Mongoose
         | (JWT & Theme)                                  | (ODM)
         v                                                v
+-------------------+                         +-----------------------+
|                   |                         |                       |
| Browser Storage   |                         |  MongoDB Database     |
|                   |                         |  (Users & Tasks)      |
+-------------------+                         +-----------------------+


# How to Run CollabBoard

CollabBoard is a decoupled full-stack app: a **Node.js/Express backend** (MongoDB + Socket.io) and a **React (Vite) frontend**. You run them as two separate processes.

> Note: the project's own `README.md` table of contents promises a "Setup & Run Guidelines" section, but the file is cut off before that section actually appears. The steps below were reconstructed from the backend's `package.json`, `.env`, and the frontend's `package.json`.

---

## Prerequisites

- **Node.js** (v18+ recommended) and **npm** installed
- A reachable **MongoDB** instance — either running locally, or a MongoDB Atlas connection string

---

## 1. Start the backend

```bash
cd collab-board-backend
npm install
```

The backend already ships with a `.env` file containing:

```
PORT=...
JWT_SECRET=...
MONGO_URI=...
```

Confirm `MONGO_URI` points to a MongoDB instance you can actually reach before starting the server. Then run:

```bash
npm run dev     # uses nodemon, auto-restarts on file changes
# or
npm start       # plain node run
```

This boots `server.js`, which starts the Express app, connects to MongoDB, and starts the Socket.io realtime layer (`realtime.js`). Per `API_CONTRACT.md`, the backend's base URL is expected to be:

```
http://localhost:5000
```

## 2. Start the frontend

In a **second terminal**:

```bash
cd collab-board
npm install
npm run dev
```

Vite will start a dev server and print a local URL (typically `http://localhost:5173`).

## 3. Open the app

Visit the printed URL in your browser. Keep the backend running in the other terminal — the frontend calls it over REST (`/api/auth`, `/api/tasks`, etc.) and connects via Socket.io for realtime updates.

---

## API Reference (from `API_CONTRACT.md`)

**Base URL:** `http://localhost:5000`

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Authenticate and receive a JWT |

### Tasks (`/api/tasks`) — requires `Authorization: Bearer <token>`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## Troubleshooting

- **Frontend can't reach the API:** make sure the backend is running on the `PORT` set in its `.env`, and that it matches the base URL the frontend expects (`http://localhost:5000` per the API contract).
- **Backend fails to start / crashes on boot:** check that `MONGO_URI` in `.env` is correct and that the MongoDB instance is actually running/reachable.
- **404s on task routes:** confirm you're sending a valid JWT (`Authorization: Bearer <token>`) obtained from `/api/auth/login`.
