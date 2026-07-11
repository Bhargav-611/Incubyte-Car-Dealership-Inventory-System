package com.incubyte.cardealership.service;

import com.incubyte.cardealership.dto.VehicleResponse;
import com.incubyte.cardealership.entity.Vehicle;
import com.incubyte.cardealership.exception.OutOfStockException;
import com.incubyte.cardealership.exception.VehicleNotFoundException;
import com.incubyte.cardealership.mapper.VehicleMapper;
import com.incubyte.cardealership.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PurchaseServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private VehicleMapper vehicleMapper;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    private Vehicle vehicle;
    private VehicleResponse vehicleResponse;

    @BeforeEach
    void setUp() {
        vehicle = Vehicle.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("30000.00"))
                .quantity(5)
                .build();

        vehicleResponse = VehicleResponse.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("30000.00"))
                .quantity(3) // Quantiy after purchasing 2 cars
                .build();
    }

    @Test
    void shouldPurchaseVehicleSuccessfully() {
        // Arrange
        // For purchase, we must load using the locking query findByIdForUpdate
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(vehicle);
        when(vehicleMapper.toResponse(any(Vehicle.class))).thenReturn(vehicleResponse);

        // Act
        VehicleResponse result = vehicleService.purchaseVehicle(1L, 2);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getQuantity()).isEqualTo(3);
        verify(vehicleRepository).findByIdForUpdate(1L);
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void shouldThrowExceptionWhenPurchasingMoreThanAvailableStock() {
        // Arrange
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(vehicle));

        // Act & Assert
        assertThatThrownBy(() -> vehicleService.purchaseVehicle(1L, 6))
                .isInstanceOf(OutOfStockException.class)
                .hasMessageContaining("Not enough stock available");

        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    @Test
    void shouldThrowExceptionWhenPurchasingNonExistentVehicle() {
        // Arrange
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> vehicleService.purchaseVehicle(1L, 1))
                .isInstanceOf(VehicleNotFoundException.class)
                .hasMessageContaining("Vehicle not found with id: 1");
    }
}
