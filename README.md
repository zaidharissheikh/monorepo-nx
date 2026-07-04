# E-commerce Monorepo Project

Welcome to the E-commerce Monorepo! This is a personal test and learning project created to explore monorepo architecture and management tools like [Nx](https://nx.dev/).

## Overview

This project simulates an e-commerce platform with mock payment integration and real-time notifications. It is split into three main applications managed within a single workspace.

## Key Features

- **Monorepo Architecture**: Explores the benefits and workflows of a single repository hosting multiple applications, utilizing Nx for workspace management and task execution.
- **Mock Payment Integration**: Simulates the checkout and payment process.
- **Real-time Notifications**: Utilizes WebSockets (Socket.IO) to push real-time updates and notifications across the applications.

## Project Structure

The monorepo consists of the following three applications:

### 1. Frontend (Storefront)
The user-facing e-commerce application where customers can browse products, manage their cart, and simulate purchases.

### 2. Backend (API)
The central REST API server that handles business logic, database interactions, user authentication, and WebSocket connections.

### 3. Admin Dashboard
A dedicated application for store administrators to manage products, view orders, and monitor overall platform activity.

## Getting Started

*install dependencies via **nx install** then **nx serve api** and **nx serve storefront** or **nx serve admin** to start the apps in development.*

## Technologies Used

- **Workspace Management**: Nx
- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: React, TypeScript

---
*This is a personal learning project and is not intended for production use.*
