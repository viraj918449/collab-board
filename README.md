# 📅 CollabBoard

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)

CollabBoard is a decoupled, full-stack project management application designed to help teams organize tasks, track progress across Kanban columns, and collaborate seamlessly. It features a custom dual-theme UI (Dark/Light mode) with signature forest green (`#4F5D55`) accents and secure RESTful backend communication.

**Author:** Viraj Nadishan Vithanaarachchi

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