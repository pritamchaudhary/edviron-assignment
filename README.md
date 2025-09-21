# School Payment and Transaction Dashboard

This is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to handle school fee payments. It features a secure backend API for managing transactions and a responsive frontend dashboard for viewing payment history. The project integrates with a payment gateway to create payment links and updates transaction statuses via webhooks or manual checks.

## Live Demo

- **Frontend Deployed URL:** https://edviron-p9iz.onrender.com/
- **Backend Deployed URL:** https://edviron-backend-fnqf.onrender.com/

---

## Features

- **User Authentication:** Secure user registration and login with JWT (JSON Web Tokens).
- **Payment Gateway Integration:** Creates payment links by communicating with an external payment API.
- **Transaction Dashboard:** Displays a complete history of all transactions.
- **Real-time Status Updates:** A "Check Status" button manually fetches the latest transaction status from the payment gateway and updates the database.
- **Webhook Ready:** Includes a webhook endpoint to automatically receive status updates from the payment gateway in a production environment.
- **Advanced Filtering & Sorting:** The dashboard allows users to filter transactions by status and sort by columns like amount and date.
- **Pagination:** Handles large datasets efficiently with backend-powered pagination.
- **Search Functionality:** Users can search for specific transactions by their Order ID.

---

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (with Mongoose), JWT, Axios
- **Frontend:** React (with Vite), React Router, Axios, Tailwind CSS, `react-hot-toast`

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (or yarn)
- MongoDB Atlas account (for the database)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pritamchaudhary/edviron-assignment.git
    cd <your-repo-folder>/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` root directory and add the following environment variables:
    ```env
    # Server Configuration
    PORT=5000

    # MongoDB Connection
    MONGO_URI=your_mongodb_atlas_connection_string

    # JWT Configuration
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRES_IN=1d

    # Payment Gateway Credentials
    PG_KEY=edvtest01
    API_KEY=your_full_api_key
    SCHOOL_ID=65b0e6293e9f76a9694d84b4
    CALLBACK_URL=http://localhost:5173/payment-success
    ```

4.  **Seed the database with school data:**
    This step is required to show the institute's name. Run this command once.
    ```bash
    npm run seed
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The backend will be running on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Verify the API endpoint:**
    Make sure the `baseURL` in `frontend/src/api/axiosInstance.js` points to your backend server. For local development, it should be:
    ```javascript
    baseURL: 'http://localhost:5000/api',
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173`.

---

## API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user and get a JWT.

### Payments
- `POST /api/payments/create-payment`: (Protected) Creates a new payment link.
- `GET /api/payments/status/:collectId`: (Protected) Manually checks and updates a transaction's status.
- `POST /api/payments/webhook`: (Public) Receives status updates from the payment gateway.

### Transactions
- `GET /api/transactions`: (Protected) Fetches all transactions with filtering, sorting, and pagination.
- `GET /api/transactions/school/:schoolId`: (Protected) Fetches transactions for a specific school.
