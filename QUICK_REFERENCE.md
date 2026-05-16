# 📋 Quick Reference Card

## 🚀 Getting Started (5 minutes)

### Start Backend
```bash
cd backend
mvn spring-boot:run
# Opens: http://localhost:8080
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# Opens: http://localhost:5173
```

---

## 📁 Key Files

### Backend Classes (New)
| File | Purpose |
|------|---------|
| `Seat.java` | Seat entity with status |
| `Amenity.java` | Bus amenities |
| `Review.java` | User reviews & ratings |
| `LiveTracking.java` | GPS tracking |
| `PaymentTransaction.java` | Payment records |
| `SeatService.java` | Seat operations |
| `SearchService.java` | Advanced search |
| `SeatController.java` | Seat REST API |
| `SearchController.java` | Search REST API |

### Frontend Components (New)
| File | Purpose |
|------|---------|
| `SeatSelector.jsx` | Seat selection grid |
| `SearchFilters.jsx` | Filter & sort panel |
| `PassengerForm.jsx` | Passenger details |
| `SeatSelection.jsx` | Booking workflow |

### Documentation
| File | Content |
|------|---------|
| `README.md` | Project overview |
| `API_REFERENCE.md` | All endpoints |
| `OPTIMIZATION_GUIDE.md` | Features guide |
| `DEPLOYMENT_CHECKLIST.md` | Launch guide |

---

## 🔌 Key API Endpoints

### Seat Management
```
GET  /api/seats/available/{scheduleId}
POST /api/seats/{scheduleId}/book
```

### Search
```
POST /api/search
GET  /api/search?source=&destination=&date=
```

### Amenities
```
GET  /api/amenities
POST /api/amenities
```

### Reviews
```
GET  /api/reviews/bus/{busId}
POST /api/reviews
```

---

## 🎨 Component Props

### SeatSelector
```jsx
<SeatSelector 
  scheduleId={1} 
  onSeatsSelected={(seats) => {}} 
/>
```

### SearchFilters
```jsx
<SearchFilters 
  onFilterChange={(filters) => {}} 
  isLoading={false} 
/>
```

### PassengerForm
```jsx
<PassengerForm 
  selectedSeats={[]} 
  onSubmit={(passengers) => {}} 
/>
```

---

## 📊 Database Entities

### Seat
```java
- id, schedule_id, seat_number, seat_status
- row_number, column_number
- Statuses: AVAILABLE, BOOKED, RESERVED
```

### Amenity
```java
- id, amenity_name, description, icon_url
```

### Review
```java
- id, bus_id, user_id, rating (1-5), comment
```

### LiveTracking
```java
- id, schedule_id, latitude, longitude, speed, status
```

---

## 🔧 Configuration

### Backend (.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/travel_booking
spring.datasource.username=travel_user
spring.datasource.password=password123
spring.jpa.hibernate.ddl-auto=update
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api
```

---

## ⚡ Performance Tips

✅ Use DTOs for API responses
✅ Add database indexes
✅ Enable query caching
✅ Minimize re-renders in React
✅ Lazy load components
✅ Compress assets
✅ Use CDN for static files

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Seats not loading | Check SeatRepository query |
| Filters not working | Verify BusSearchFilterDTO |
| API 404 errors | Check endpoint URLs |
| CORS errors | Add frontend URL to CORS config |
| No data showing | Run DataInitializer |

---

## 📱 Routes

```
/ .......................... Home
/search ..................... Search & Filter
/seat-selection ............ Seat Selection
/payment ................... Payment
/bookings .................. Booking History
/login ..................... Login
/register .................. Registration
```

---

## 🔐 Security

```
✅ JWT Authentication
✅ CORS Configuration
✅ Input Validation
✅ SQL Injection Prevention
✅ HTTPS Ready
✅ Secure Headers
```

---

## 📞 Quick Help

**API not responding?**
→ Check if backend is running on port 8080

**Frontend not loading?**
→ Check if frontend is running on port 5173

**Database error?**
→ Verify MySQL/PostgreSQL is running

**Seats not showing?**
→ Run DataInitializer to populate seats

**Filters not working?**
→ Check browser console for errors

---

## 🎯 Testing Checklist

- [ ] Seat selection works
- [ ] Filters apply correctly
- [ ] Passenger form validates
- [ ] Booking completes
- [ ] Reviews display
- [ ] Mobile responsive
- [ ] API responses < 200ms
- [ ] No console errors

---

## 📚 Learn More

- **API Docs**: Open `API_REFERENCE.md`
- **Features**: Open `OPTIMIZATION_GUIDE.md`
- **Deployment**: Open `DEPLOYMENT_CHECKLIST.md`
- **Summary**: Open `IMPLEMENTATION_SUMMARY.md`

---

## 🚀 Deployment

**Quick Deploy**
```bash
# Backend
mvn clean package -Pprod
docker build -t travel-app .
docker run -d -p 8080:8080 travel-app

# Frontend
npm run build
# Deploy dist/ to web server
```

---

## 💡 Pro Tips

1. **Bookmark API endpoints** - Keep API_REFERENCE.md handy
2. **Use Postman** - Test APIs before frontend
3. **Check logs** - Both backend & browser console
4. **Use Git** - Commit changes frequently
5. **Read docs** - Everything is documented
6. **Test mobile** - Use dev tools device emulation
7. **Monitor performance** - Use dev tools Network tab

---

## 🎓 Next Steps

1. **Today**: Run application locally
2. **Tomorrow**: Test all features
3. **This Week**: Deploy to staging
4. **Next Week**: Production launch
5. **Next Month**: Add payment gateway

---

**Version**: 2.0.0 | **Status**: Production Ready ✅ | **Last Updated**: 2026-05-16
