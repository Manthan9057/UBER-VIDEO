# /user/register Endpoint Documentation

## Description
The `/user/register` endpoint allows clients to register a new user. It validates the provided data and, upon successful validation, creates a new user, returning a success message along with the user's details and an authentication token.

## HTTP Method
**POST**

## URL
`/user/register`

## Request Payload
The endpoint expects a JSON payload with the following structure:

```json
{
  "fullname": {
    "firstname": "John",       // Required, minimum 3 characters
    "lastname": "Doe"            // Optional, if provided should be at least 3 characters
  },
  "email": "john.doe@example.com",  // Required, must be a valid email address
  "password": "yourpassword"          // Required, minimum 6 characters
}
```

### Validation Requirements
- **email:** Must be a valid email address.
- **fullname.firstname:** Must be at least 3 characters long.
- **password:** Must be at least 6 characters long.

## Success Response
- **Status Code:** `201 Created`
- **Response Body:**

```json
{
  "message": "User registered successfully",
  "user": { /* user details */ },
  "token": "jwt_token_here"
}
```

### Example Success Response

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "60f8a0b5b7a2c92f886f8e1d",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Error Response
- **Status Code:** `400 Bad Request`
- **Response Body:**

```json
{
  "errors": [
    {
      "msg": "Validation error description",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

## /user/login Endpoint Documentation

### Description
The `/user/login` endpoint handles user authentication by verifying the provided email and password. If the credentials are valid, it returns an authentication token along with the user's details. If the credentials are invalid, an error message is returned.

### HTTP Method
**POST**

### URL
`/user/login`

### Request Payload
The endpoint expects a JSON payload with the following structure:

```json
{
  "email": "john.doe@example.com",  // Required, must be a valid email address
  "password": "yourpassword"          // Required, non-empty
}
```

### Success Response
- **Status Code:** `200 OK`
- **Response Body:**

```json
{
  "message": "Login successful",
  "user": { /* user details */ },
  "token": "jwt_token_here"
}
```

### Error Responses
- **Validation Error:** `400 Bad Request` with an array of error details.
- **Authentication Failure:** `401 Unauthorized` with response:

```json
{
  "message": "Invalid email or password"
}
```

## /users/profile Endpoint Documentation

### Description
The `/users/profile` endpoint retrieves the profile information of the authenticated user. The request requires a valid authentication token in the request header.

### HTTP Method
**GET**

### URL
`/users/profile`

### Request Headers
- **Authorization:** Bearer token

### Success Response
- **Status Code:** `200 OK`
- **Response Body:**

```json
{
  "user": {
    "_id": "60f8a0b5b7a2c92f886f8e1d",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Error Response
- **Status Code:** `401 Unauthorized` if token is missing or invalid.


## /user/logout Endpoint Documentation

### Description
The `/user/logout` endpoint invalidates the user's authentication token, effectively logging the user out of the system.

### HTTP Method
**POST**

### URL
`/user/logout`

### Request Headers
- **Authorization:** Bearer token

### Success Response
- **Status Code:** `200 OK`
- **Response Body:**

```json
{
  "message": "Logout successful"
}
```

### Error Response
- **Status Code:** `401 Unauthorized` if token is missing or invalid.
