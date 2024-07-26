# PocketPal

API Readme

Welcome to the PocketPal
API documentation! 🚀 This API serves as the backend for a versatile and user-friendly financial platform, allowing you to create, manage, and interact with user accounts, PocketPals, and transactions seamlessly. Whether you're a developer integrating our API into your application or a curious user wanting to understand the technical aspects, this readme will guide you through the process.

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Setting Up Locally](#setting-up-locally)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [PocketPal](#PocketPal)
  - [Transaction](#transaction)
- [Responses](#responses)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [Contact Us](#contact-us)

## Introduction

The Wallet API is designed to support mobile lending apps by providing essential wallet functionality. Borrowers can use their wallets to receive loans and make repayments.

## Key Features

- **User Authentication**: Securely register and log in users with hashed passwords and JWT token authentication. 🔐
- **PocketPal Management**: Automatically create PocketPals for users upon registration with an initial balance, and manage PocketPal operations such as funding, withdrawals, and transfers. 💼
- **Transaction Management**: Record and retrieve transaction details, ensuring data integrity💸

## Getting Started

To start using the PocketPal
API, follow these steps:

1. **Sign Up**: Create an account on our platform to obtain API credentials.
2. **Authentication**: Acquire an API key to authenticate your requests.
3. **Explore Endpoints**: Review the available API endpoints and their functionalities.
4. **Make Requests**: Make HTTP requests to interact with the API and manage user accounts, PocketPals, and transactions.
5. **Handle Responses**: Process the API responses according to your application's requirements.

## Setting Up Locally

To set up the PocketPal
API locally on your machine, follow these steps:

### Prerequisites

- MySQL
- Node.js (LTS version)
- TypeScript
- npm

### Installation

1. **Clone the repository**:
   Clone the repo after forking and replace `yourusername` with your actual github username

   ```bash
   git clone https://github.com/yourusername/PocketPal
   -api.git
   cd PocketPal
   -api
   ```

2. **Install dependencies**:
   Using npm:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory by running the code below in your root directory.

   ```env
    cp .sample.env .env
   ```

4. **Generate Schema**:
   ```bash
   npm run schema.generate
   ```
5. **Run Migration**:

```bash
npm run db.migration.run
```

6. **Start the server**:

   ```bash
   npm start
   ```

   The API should now be running on `http://localhost:2322`. 🚀

## Authentication

To authenticate your requests, include your API key in the headers of your HTTP requests:

```http
GET /some-endpoint
Authorization: Bearer TOKEN
```

## Endpoints

You can test the the API live using on the swagger docs (https://wallet-system-api.onrender.com/api-docs)

### Auth

**Description**: The `Auth` endpoints handle user authentication and management. This includes registering new users and logging in existing users, with password hashing and JWT token generation.

- **Register User**

  - **Endpoint**: `/auth/register`
  - **Method**: `POST`
  - **Description**: Register a new user.
  - **Request Body**:
    ```json
    {
      "email": "kivof340229@vasomly.com",
      "password": "string",
      "first_name": "Seyi",
      "last_name": "Tml"
    }
    ```
  - **Response**:
    ```json
    {
      "statusCode": 200,
      "message": {
        "id": "408b9454-b46a-4bc3-9350-c248ad1bb62e",
        "email": "kivof340229@vasomly.com"
      }
    }
    ```

- **Login User**
  - **Endpoint**: `/auth/login`
  - **Method**: `POST`
  - **Description**: Log in an existing user.
  - **Request Body**:
    ```json
        {
      "email": "rajin19721@tiervio.com",
      "password": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "statusCode": 200,
      "access_token": "jwt_token"
    }
    ```

### PocketPal

**Description**: The `PocketPal` endpoints manage user PocketPals. This includes creating PocketPals upon user registration, updating PocketPal balances, and handling PocketPal-related transactions like funding, withdrawals, and transfers.

- **Get PocketPal**

  - **Endpoint**: `/PocketPal/:PocketPalId`
  - **Method**: `GET`
  - **Description**: Retrieve PocketPal details by PocketPal ID.
  - **Response**:
    ```json
    {
      "statusCode": 200,
      "message": "PocketPal retrieved successfully",
      "data": {
        "PocketPal_id": "1561536322",
        "user_id": 3,
        "balance": 0,
        "created_at": "2024-06-16T15:04:43.000Z"
      }
    }
    ```

- **TopUp PocketPal**

  - **Endpoint**: `/transfer/wallet-topup`
  - **Method**: `POST`
  - **Description**: topup a PocketPal.
  - **Request Body**:
    ```json
        {
        "amount": 100,
        "destinationWalletNumber": "2335356622"
      }
    ```
  - **Response**:
    ```json
        {
        "message": "Account Top up successsful",
        "transaction": {
          "id": "2f8d8192-ebb3-4c7a-a254-411e26af9433",
          "amount": 100,
          "type": "DEPOSIT",
          "sourceWalletId": null,
          "destinationWalletId": "dec68608-4dd9-4179-94f5-3a3af852d00d",
          "createdAt": "2024-07-25T10:23:31.177Z",
          "updatedAt": "2024-07-25T10:23:31.177Z"
        }
      }
    ```

- **Withdraw from PocketPal**

  - **Endpoint**: `/transfer/withdraw`
  - **Method**: `POST`
  - **Description**: Withdraw funds from a PocketPal.
  - **Request Body**:
    ```json
        {
      "amount": 50,
      "sourceWalletNumber": "2317791815"
    } 
    ```
  - **Response**:
    ```json
          {
        "id": "8007a215-6800-41b8-988b-8f2212299071",
        "amount": 50,
        "type": "WITHDRAWAL",
        "sourceWalletId": "dec68608-4dd9-4179-94f5-3a3af852d00d",
        "destinationWalletId": null,
        "createdAt": "2024-07-25T12:42:22.046Z",
        "updatedAt": "2024-07-25T12:42:22.046Z"
      }
    ```

- **Transfer Funds**
  - **Endpoint**: `/PocketPal/transfer`
  - **Method**: `POST`
  - **Description**: Transfer funds between PocketPals.
  - **Request Body**:
    ```json
          {
        "recipientWalletNumber": "2317791815",
        "amount": 120
      }
    ```
  - **Response**:
    ```json
          {
          "message": "Funds Transfer Successful",
          "transfer": {
            "id": "92f4375c-8646-4ec9-a4b4-34971f16e1d3",
            "amount": 120,
            "type": "TRANSFER",
            "sourceWalletId": "dec68608-4dd9-4179-94f5-3a3af852d00d",
            "destinationWalletId": "c8f8259b-13e9-4004-a956-e69ca92ecc2e",
            "createdAt": "2024-07-25T10:21:10.999Z",
            "updatedAt": "2024-07-25T10:21:10.999Z"
          }
        }
    ```

### Transaction

**Description**: The `Transaction` endpoints handle operations related to transactions. This includes creating transactions, retrieving individual transactions, and listing all transactions for a user's PocketPal. All transaction operations ensure data consistency and integrity.

- **Get Transaction by ID**

  - **Endpoint**: `/transactions/:transactionId`
  - **Method**: `GET`
  - **Description**: Retrieve a single transaction by its ID.
  - **Response**:
    ```json
    {
      "statusCode": 200,
      "message": "Transaction retrieved",
      "data": {
        "transaction_id": 8,
        "PocketPal_id": "6366247650",
        "type": "transfer",
        "amount": 300,
        "recipient_account_id": "4970159032",
        "created_at": "2024-06-17T16:08:20.000Z"
      }
    }
    ```

- **Get Transactions by PocketPal ID**
  - **Endpoint**: `/transactions/PocketPal/:PocketPalId`
  - **Method**: `GET`
  - **Description**: Retrieve all transactions for a specific PocketPal.
  - **Response**:
    ```json
    "statusCode": 200,
    "message": "Transactions retrieved",
    "data": [
        {
            "transaction_id": 9,
            "PocketPal_id": "6366247650",
            "type": "transfer",
            "amount": 200,
            "recipient_account_id": "4970159032",
            "created_at": "2024-06-17T16:09:55.000Z"
        },
        {
            "transaction_id": 10,
            "PocketPal_id": "6366247650",
            "type": "withdraw",
            "amount": 100,
            "recipient_account_id": "6366247650",
            "created_at": "2024-06-17T16:27:47.000Z"
        }
    ]
    ```

## Responses

The API responses are structured in JSON format. A typical successful response includes:

- **Status Code**: `200 OK`
- **Body**:

  ```json
  {
    "statusCode": 200,
    "message": "success",
    "data": {}
  }
  ```

A typical error response includes:

- **Status Code**: `4xx` or `5xx`
- **Body**:
  ```json
  {
    "statusCode": "error",
    "message": "Error message",
    "error": "Error type"
  }
  ```

## Error Handling

The API handles errors using standardized HTTP status codes and descriptive error messages. Common error responses include:

- **400 Bad Request**: Invalid request parameters.
- **401 Unauthorized**: Missing or invalid authentication token.
- **404 Not Found**: Resource not found.
- **500 Internal Server Error**: Unexpected server error.


## Contributing

We welcome contributions to the PocketPal
API! To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your fork.
5. Submit a pull request to the dev repository.

## Contact Us

For questions, support, or feedback, please contact us at [olatisun](https://github.com/Olatisunkanmi).

---

Thank you for using the PocketPal
API! We hope this documentation helps you integrate and interact with our platform effortlessly. 🚀
