package com.incubyte.cardealership.config;

import com.incubyte.cardealership.entity.User;
import com.incubyte.cardealership.entity.UserRole;
import com.incubyte.cardealership.entity.Vehicle;
import com.incubyte.cardealership.repository.UserRepository;
import com.incubyte.cardealership.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          VehicleRepository vehicleRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedVehicles();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("Dealership Admin")
                    .email("admin@dealership.com")
                    .password(passwordEncoder.encode("AdminPassword123!"))
                    .role(UserRole.ROLE_ADMIN)
                    .build();

            User user = User.builder()
                    .name("Normal User")
                    .email("user@dealership.com")
                    .password(passwordEncoder.encode("UserPassword123!"))
                    .role(UserRole.ROLE_USER)
                    .build();

            userRepository.saveAll(List.of(admin, user));
            System.out.println("DatabaseSeeder: Successfully seeded admin and normal users.");
        }
    }

    private void seedVehicles() {
        if (vehicleRepository.count() == 0) {
            List<Vehicle> vehicles = List.of(
                    Vehicle.builder().make("Toyota").model("Camry").category("Sedan").price(new BigDecimal("28500.00")).quantity(15).build(),
                    Vehicle.builder().make("Tesla").model("Model Y").category("Electric").price(new BigDecimal("47990.00")).quantity(8).build(),
                    Vehicle.builder().make("Ford").model("F-150").category("Truck").price(new BigDecimal("42000.00")).quantity(12).build(),
                    Vehicle.builder().make("Honda").model("Civic").category("Sedan").price(new BigDecimal("24000.00")).quantity(20).build(),
                    Vehicle.builder().make("BMW").model("X5").category("SUV").price(new BigDecimal("65000.00")).quantity(5).build(),
                    Vehicle.builder().make("Volkswagen").model("Golf").category("Hatchback").price(new BigDecimal("26000.00")).quantity(10).build(),
                    Vehicle.builder().make("Tesla").model("Model 3").category("Electric").price(new BigDecimal("38990.00")).quantity(14).build(),
                    Vehicle.builder().make("Mercedes-Benz").model("S-Class").category("Luxury").price(new BigDecimal("115000.00")).quantity(3).build(),
                    Vehicle.builder().make("Chevrolet").model("Silverado").category("Truck").price(new BigDecimal("44500.00")).quantity(9).build(),
                    Vehicle.builder().make("Porsche").model("911").category("Luxury").price(new BigDecimal("120000.00")).quantity(2).build()
            );

            vehicleRepository.saveAll(vehicles);
            System.out.println("DatabaseSeeder: Successfully seeded 10 vehicles.");
        }
    }
}
