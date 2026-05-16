package com.travel.backend.controller;

import com.travel.backend.entity.Booking;
import com.travel.backend.entity.User;
import com.travel.backend.repository.BookingRepository;
import com.travel.backend.repository.BusRepository;
import com.travel.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final BusRepository busRepository;

    public AdminController(
            UserRepository userRepository,
            BookingRepository bookingRepository,
            BusRepository busRepository
    ) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.busRepository = busRepository;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        List<User> users = userRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();
        LocalDateTime activeWindow = LocalDateTime.now().minusMinutes(30);

        long activeUsers = users.stream()
                .filter(user -> user.getLastLoginAt() != null && user.getLastLoginAt().isAfter(activeWindow))
                .count();
        long adminUsers = users.stream()
                .filter(user -> "ADMIN".equalsIgnoreCase(user.getRole()))
                .count();
        double revenue = bookings.stream()
                .mapToDouble(booking -> booking.getTotalAmount() != null ? booking.getTotalAmount() : 0.0)
                .sum();
        long ticketsBooked = bookings.stream()
                .mapToLong(booking -> countSeats(booking.getSeatNumbers()))
                .sum();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("registeredUsers", users.size());
        summary.put("activeUsers", activeUsers);
        summary.put("adminUsers", adminUsers);
        summary.put("customerUsers", Math.max(0, users.size() - adminUsers));
        summary.put("totalBookings", bookings.size());
        summary.put("ticketsBooked", ticketsBooked);
        summary.put("totalRevenue", revenue);
        summary.put("activeBuses", busRepository.count());
        summary.put("recentUsers", getRecentUsers(users));
        summary.put("recentBookings", bookings.stream()
                .sorted(Comparator.comparing(Booking::getBookingTime, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .toList());

        return summary;
    }

    private List<Map<String, Object>> getRecentUsers(List<User> users) {
        return users.stream()
                .sorted(Comparator.comparing(User::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .map(user -> {
                    Map<String, Object> userMap = new LinkedHashMap<>();
                    userMap.put("fullName", user.getFullName());
                    userMap.put("email", user.getEmail());
                    userMap.put("role", user.getRole());
                    userMap.put("createdAt", user.getCreatedAt());
                    userMap.put("lastLoginAt", user.getLastLoginAt());
                    return userMap;
                })
                .toList();
    }

    private long countSeats(String seatNumbers) {
        if (seatNumbers == null || seatNumbers.isBlank()) {
            return 0;
        }

        return List.of(seatNumbers.split(",")).stream()
                .filter(seat -> !seat.isBlank())
                .count();
    }
}
