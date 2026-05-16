package com.travel.backend.config;

import com.travel.backend.entity.*;
import com.travel.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
        public CommandLineRunner initializeData(
            AmenityRepository amenityRepository,
            BusRepository busRepository,
            RouteRepository routeRepository,
            ScheduleRepository scheduleRepository,
            SeatRepository seatRepository,
            UserRepository userRepository,
            CityRepository cityRepository,
            BusServiceRepository busServiceRepository,
            LiveTrackingRepository liveTrackingRepository,
            BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                User admin = new User();
                admin.setFullName("TravelGo Admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("admin1234"));
                admin.setRole("ADMIN");
                admin.setCreatedAt(LocalDateTime.now());
                userRepository.save(admin);
            }

            // Initialize Amenities
            if (amenityRepository.count() == 0) {
                amenityRepository.saveAll(Arrays.asList(
                    new Amenity("WiFi", "High-speed internet connectivity", "📶"),
                    new Amenity("AC", "Air-conditioned comfort", "❄️"),
                    new Amenity("Charging Points", "USB and power outlets", "🔌"),
                    new Amenity("Bedroll", "Comfortable bedding", "🛏️"),
                    new Amenity("Power Socket", "230V power socket", "⚡"),
                    new Amenity("Blanket", "Warm blanket provided", "🛌"),
                    new Amenity("Water Bottle", "Complimentary water", "💧"),
                    new Amenity("Headrest", "Ergonomic headrest", "🪑")
                ));
            }

            // Initialize Routes if empty
            if (routeRepository.count() == 0) {
                routeRepository.saveAll(Arrays.asList(
                    createRoute("Hyderabad", "Bangalore", 570.0, "8h 45m"),
                    createRoute("Hyderabad", "Chennai", 630.0, "10h 30m"),
                    createRoute("Mumbai", "Pune", 150.0, "3h 15m"),
                    createRoute("Delhi", "Jaipur", 280.0, "5h 15m"),
                    createRoute("Delhi", "Mumbai", 1200.0, "18h 30m")
                ));
            }

            // Initialize Buses if empty
            if (busRepository.count() == 0) {
                // create bus services (operators)
                if (busServiceRepository.count() == 0) {
                    BusService bs1 = new BusService("AbhiBus");
                    BusService bs2 = new BusService("Orange Tours");
                    BusService bs3 = new BusService("Kaveri Travels");
                    BusService bs4 = new BusService("VRL");
                    busServiceRepository.saveAll(Arrays.asList(bs1, bs2, bs3, bs4));
                }

                java.util.List<BusService> services = busServiceRepository.findAll();

                BusService s1 = services.size() > 0 ? services.get(0) : null;
                BusService s2 = services.size() > 1 ? services.get(1) : null;
                BusService s3 = services.size() > 2 ? services.get(2) : null;
                BusService s4 = services.size() > 3 ? services.get(3) : null;

                Bus b1 = createBus("AbhiBus Swiftline", "TS-09-AB-2048", 36, "AC SLEEPER");
                b1.setBusService(s1);
                b1.setIsAc(true);

                Bus b2 = createBus("Orange Tours Platinum", "AP-16-OT-7766", 36, "AC SLEEPER");
                b2.setBusService(s2);
                b2.setIsAc(true);

                Bus b3 = createBus("Kaveri Travels Smart", "KA-05-KT-1188", 36, "AC SLEEPER");
                b3.setBusService(s3);
                b3.setIsAc(true);

                Bus b4 = createBus("VRL Value Express", "MH-12-VL-5102", 45, "NON-AC");
                b4.setBusService(s4);
                b4.setIsAc(false);

                busRepository.saveAll(Arrays.asList(b1, b2, b3, b4));
            }

            // Initialize Cities if empty
            if (cityRepository.count() == 0) {
                cityRepository.saveAll(Arrays.asList(
                        new City("Hyderabad"),
                        new City("Bangalore"),
                        new City("Chennai"),
                        new City("Mumbai"),
                        new City("Pune"),
                        new City("Delhi"),
                        new City("Jaipur")
                ));
            }

            // Initialize Schedules and Seats
            if (scheduleRepository.count() == 0) {
                java.util.List<Bus> buses = busRepository.findAll();
                java.util.List<Route> routes = routeRepository.findAll();

                Route hyderabadToBangalore = findRoute(routes, "Hyderabad", "Bangalore");
                Route mumbaiToPune = findRoute(routes, "Mumbai", "Pune");

                if (hyderabadToBangalore != null && buses.size() >= 3) {
                    createScheduleWithSeats(scheduleRepository, seatRepository, buses.get(0), hyderabadToBangalore, 22, 6, 899.0);
                    createScheduleWithSeats(scheduleRepository, seatRepository, buses.get(1), hyderabadToBangalore, 21, 5, 1049.0);
                    createScheduleWithSeats(scheduleRepository, seatRepository, buses.get(2), hyderabadToBangalore, 19, 4, 749.0);
                }

                if (mumbaiToPune != null && buses.size() >= 4) {
                    createScheduleWithSeats(scheduleRepository, seatRepository, buses.get(3), mumbaiToPune, 23, 2, 399.0);
                }
            }

            // Initialize sample live tracking points if none exist
            if (liveTrackingRepository.count() == 0) {
                java.util.List<Schedule> schedulesAll = scheduleRepository.findAll();

                // Route waypoints: Hyderabad->Bangalore, Mumbai->Pune
                double[][][] routeWaypoints = new double[][][] {
                    // Hyderabad to Bangalore (3 schedules use this route)
                    {
                        {17.385044, 78.486671},  // Hyderabad
                        {17.0, 78.2},            // Near Hyderabad
                        {16.5, 78.0},            // Kurnool area
                        {15.8, 77.8},            // Anantapur area
                        {15.3, 77.6},            // Bellary area
                        {14.5, 77.7},            // Davangere area
                        {13.8, 77.6},            // Tumkur area
                        {12.971599, 77.594563}   // Bangalore
                    },
                    // Mumbai to Pune
                    {
                        {19.075983, 72.877655},  // Mumbai
                        {18.95, 73.05},          // Navi Mumbai
                        {18.85, 73.15},          // Panvel area
                        {18.75, 73.25},          // Lonavala area
                        {18.65, 73.45},          // Khandala area
                        {18.55, 73.65},          // Near Pune
                        {18.52, 73.85}           // Pune
                    }
                };

                for (Schedule sch : schedulesAll) {
                    // Pick route waypoints based on the schedule's route
                    double[][] waypoints;
                    String src = sch.getRoute() != null ? sch.getRoute().getSourceCity() : "";
                    if ("Mumbai".equalsIgnoreCase(src)) {
                        waypoints = routeWaypoints[1];
                    } else {
                        waypoints = routeWaypoints[0];
                    }

                    // Simulate bus at a random progress along the route
                    int progressIndex = (int) (Math.random() * (waypoints.length - 1));
                    // Create multiple historical tracking points up to the current position
                    for (int i = 0; i <= progressIndex; i++) {
                        LiveTracking lt = new LiveTracking();
                        lt.setSchedule(sch);
                        double lat = waypoints[i][0] + (Math.random() - 0.5) * 0.01;
                        double lon = waypoints[i][1] + (Math.random() - 0.5) * 0.01;
                        lt.setLatitude(lat);
                        lt.setLongitude(lon);
                        lt.setSpeed(40.0 + Math.random() * 40.0);
                        lt.setStatus(i == progressIndex ? "IN_TRANSIT" : "IN_TRANSIT");
                        lt.setUpdatedAt(LocalDateTime.now().minusMinutes((long)(progressIndex - i) * 30));
                        liveTrackingRepository.save(lt);
                    }
                }
            }
        };
    }

    private Route createRoute(String sourceCity, String destinationCity, Double distanceKm, String estimatedDuration) {
        Route route = new Route();
        route.setSourceCity(sourceCity);
        route.setDestinationCity(destinationCity);
        route.setDistanceKm(distanceKm);
        route.setEstimatedDuration(estimatedDuration);
        return route;
    }

    private Bus createBus(String busName, String busNumber, Integer totalSeats, String busType) {
        Bus bus = new Bus();
        bus.setBusName(busName);
        bus.setBusNumber(busNumber);
        bus.setTotalSeats(totalSeats);
        bus.setBusType(busType);
        bus.setCreatedAt(LocalDateTime.now());
        return bus;
    }

    private Route findRoute(java.util.List<Route> routes, String sourceCity, String destinationCity) {
        return routes.stream()
                .filter(route -> sourceCity.equalsIgnoreCase(route.getSourceCity())
                        && destinationCity.equalsIgnoreCase(route.getDestinationCity()))
                .findFirst()
                .orElse(null);
    }

    private void createScheduleWithSeats(
            ScheduleRepository scheduleRepository,
            SeatRepository seatRepository,
            Bus bus,
            Route route,
            int departureHour,
            int arrivalHour,
            Double fare
    ) {
        Schedule schedule = new Schedule();
        schedule.setBus(bus);
        schedule.setRoute(route);
        schedule.setDepartureTime(LocalDateTime.now().plusDays(1).withHour(departureHour).withMinute(0));
        schedule.setArrivalTime(LocalDateTime.now().plusDays(2).withHour(arrivalHour).withMinute(0));
        schedule.setFare(fare);
        Schedule savedSchedule = scheduleRepository.save(schedule);

        for (int seatNumber = 1; seatNumber <= bus.getTotalSeats(); seatNumber++) {
            Seat seat = new Seat();
            seat.setSchedule(savedSchedule);
            seat.setSeatNumber("S" + seatNumber);
            seat.setSeatStatus("AVAILABLE");
            seat.setRowNumber((seatNumber - 1) / 4 + 1);
            seat.setColumnNumber((seatNumber - 1) % 4 + 1);
            seatRepository.save(seat);
        }
    }
}
