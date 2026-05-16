# 📖 API Reference Guide

## Base URL
```
http://localhost:8080/api
```

---

## 🚌 Buses

### Get All Buses
```http
GET /buses
```
**Response:**
```json
[
  {
    "id": 1,
    "busName": "Abhi Bus",
    "busNumber": "MH-02-AB-1234",
    "totalSeats": 45,
    "busType": "AC",
    "createdAt": "2026-05-16T12:25:37"
  }
]
```

### Get Bus by ID
```http
GET /buses/{id}
```

### Create Bus
```http
POST /buses
Content-Type: application/json

{
  "busName": "Red Bus",
  "busNumber": "DL-01-RB-5678",
  "totalSeats": 50,
  "busType": "SLEEPER"
}
```

### Update Bus
```http
PUT /buses/{id}
Content-Type: application/json

{
  "busName": "Red Bus Premium",
  "busType": "AC"
}
```

### Delete Bus
```http
DELETE /buses/{id}
```

---

## 🎫 Schedules

### Get All Schedules
```http
GET /schedules
```

### Create Schedule
```http
POST /schedules
Content-Type: application/json

{
  "busId": 1,
  "routeId": 1,
  "departureTime": "2026-05-16T22:00:00",
  "arrivalTime": "2026-05-17T08:00:00",
  "fare": 1500.0
}
```

---

## 🛋️ Seats

### Get Available Seats
```http
GET /seats/available/{scheduleId}
```
**Response:**
```json
[
  {
    "id": 1,
    "seatNumber": "A1",
    "seatStatus": "AVAILABLE",
    "rowNumber": 1,
    "columnNumber": 1,
    "price": 100.0
  }
]
```

### Get All Seats for Schedule
```http
GET /seats/{scheduleId}
```

### Book Seats
```http
POST /seats/{scheduleId}/book
Content-Type: application/json

["A1", "A2", "A3"]
```

### Reserve Single Seat
```http
POST /seats/{scheduleId}/reserve?seatNumber=A1
```

### Release Seats
```http
POST /seats/{scheduleId}/release
Content-Type: application/json

["A1", "A2"]
```

---

## 🔍 Search

### Search with Filters
```http
POST /search
Content-Type: application/json

{
  "sourceCity": "Delhi",
  "destinationCity": "Mumbai",
  "departureDate": "2026-05-20",
  "busTypes": ["AC", "SLEEPER"],
  "minPrice": 1000,
  "maxPrice": 2000,
  "sortBy": "PRICE",
  "pageNumber": 1,
  "pageSize": 20
}
```

### Quick Search
```http
GET /search?source=Delhi&destination=Mumbai&date=2026-05-20
```

**Response:**
```json
[
  {
    "scheduleId": 1,
    "busId": 1,
    "busName": "Abhi Bus",
    "busType": "AC",
    "fare": 1500.0,
    "availableSeats": 20,
    "totalSeats": 45,
    "departureTime": "2026-05-20T22:00:00",
    "arrivalTime": "2026-05-21T08:00:00",
    "sourceCity": "Delhi",
    "destinationCity": "Mumbai",
    "rating": 4.5,
    "reviewCount": 128
  }
]
```

---

## 📝 Bookings

### Get All Bookings
```http
GET /bookings
```

### Get Booking by ID
```http
GET /bookings/{id}
```

### Create Booking
```http
POST /bookings
Content-Type: application/json

{
  "scheduleId": 1,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "seatNumbers": "A1,A2,A3",
  "totalAmount": 4500.0
}
```

**Response:**
```json
{
  "id": 1,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "seatNumbers": "A1,A2,A3",
  "totalAmount": 4500.0,
  "bookingStatus": "CONFIRMED",
  "bookingTime": "2026-05-16T12:30:00",
  "schedule": { ... }
}
```

### Update Booking
```http
PUT /bookings/{id}
Content-Type: application/json

{
  "bookingStatus": "CANCELLED"
}
```

### Delete Booking
```http
DELETE /bookings/{id}
```

---

## ⭐ Reviews

### Create Review
```http
POST /reviews?busId=1&userId=1&rating=5&comment=Excellent service!
```

### Get Reviews for Bus
```http
GET /reviews/bus/{busId}
```

**Response:**
```json
[
  {
    "id": 1,
    "userName": "John Doe",
    "rating": 5,
    "comment": "Excellent service!",
    "createdAt": "2026-05-16"
  }
]
```

### Get Average Rating
```http
GET /reviews/bus/{busId}/rating
```
**Response:** `4.5`

### Get Review Count
```http
GET /reviews/bus/{busId}/count
```
**Response:** `128`

---

## 🏨 Amenities

### Get All Amenities
```http
GET /amenities
```

**Response:**
```json
[
  {
    "id": 1,
    "amenityName": "WiFi",
    "description": "High-speed internet",
    "iconUrl": "📶"
  }
]
```

### Create Amenity
```http
POST /amenities
Content-Type: application/json

{
  "amenityName": "WiFi",
  "description": "High-speed internet connectivity",
  "iconUrl": "📶"
}
```

### Get Amenity by ID
```http
GET /amenities/{id}
```

### Update Amenity
```http
PUT /amenities/{id}
Content-Type: application/json

{
  "amenityName": "WiFi Premium",
  "description": "Ultra-fast internet"
}
```

### Delete Amenity
```http
DELETE /amenities/{id}
```

---

## 🗺️ Live Tracking

### Update Bus Location
```http
POST /tracking/{scheduleId}?latitude=28.7041&longitude=77.1025&speed=60&status=IN_TRANSIT
```

**Response:**
```json
{
  "id": 1,
  "schedule": { ... },
  "latitude": 28.7041,
  "longitude": 77.1025,
  "speed": 60.0,
  "status": "IN_TRANSIT",
  "updatedAt": "2026-05-16T12:35:00"
}
```

### Get Latest Tracking
```http
GET /tracking/{scheduleId}
```

---

## 👤 Users

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

---

## 🔐 Authentication

### Using Bearer Token
```http
GET /bookings
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Seat numbers cannot be empty"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication token is missing or invalid"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Bus with ID 999 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful delete |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## 🔄 Rate Limiting

- **Rate Limit**: 1000 requests per hour
- **Rate Limit Header**: `X-RateLimit-Remaining`

---

## 📝 Pagination

Query parameters for paginated endpoints:
```
?pageNumber=1&pageSize=20
```

---

## 🧪 Testing with cURL

### Get All Buses
```bash
curl -X GET http://localhost:8080/api/buses
```

### Create Booking
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "scheduleId": 1,
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "seatNumbers": "A1,A2",
    "totalAmount": 3000.0
  }'
```

### Search Buses
```bash
curl -X GET "http://localhost:8080/api/search?source=Delhi&destination=Mumbai&date=2026-05-20"
```

---

## 📚 Additional Resources

- **Swagger UI**: http://localhost:8080/swagger-ui.html (after adding Springfox)
- **Postman Collection**: Import from `/docs/postman-collection.json`
- **API Documentation**: `/docs/api-reference.html`

---

**Last Updated**: 2026-05-16
**API Version**: 1.0.0
**Status**: Production Ready ✅
