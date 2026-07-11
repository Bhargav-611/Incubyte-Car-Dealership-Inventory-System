package com.incubyte.cardealership.service;

import com.incubyte.cardealership.dto.PagedVehicleResponse;
import com.incubyte.cardealership.dto.VehicleCreateRequest;
import com.incubyte.cardealership.dto.VehicleResponse;
import com.incubyte.cardealership.dto.VehicleUpdateRequest;
import com.incubyte.cardealership.entity.Vehicle;
import com.incubyte.cardealership.exception.VehicleNotFoundException;
import com.incubyte.cardealership.mapper.VehicleMapper;
import com.incubyte.cardealership.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private VehicleMapper vehicleMapper;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    private Vehicle vehicle;
    private VehicleResponse vehicleResponse;
    private VehicleCreateRequest createRequest;
    private VehicleUpdateRequest updateRequest;

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
                .quantity(5)
                .build();

        createRequest = VehicleCreateRequest.builder()
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("30000.00"))
                .quantity(5)
                .build();

        updateRequest = VehicleUpdateRequest.builder()
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("32000.00"))
                .quantity(8)
                .build();
    }

    @Test
    void shouldAddVehicleSuccessfully() {
        // Arrange
        when(vehicleMapper.toEntity(createRequest)).thenReturn(vehicle);
        when(vehicleRepository.save(vehicle)).thenReturn(vehicle);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(vehicleResponse);

        // Act
        VehicleResponse result = vehicleService.addVehicle(createRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getMake()).isEqualTo("Toyota");
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    void shouldGetVehicleById() {
        // Arrange
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(vehicleMapper.toResponse(vehicle)).thenReturn(vehicleResponse);

        // Act
        VehicleResponse result = vehicleService.getVehicleById(1L);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void shouldThrowExceptionWhenVehicleNotFoundById() {
        // Arrange
        when(vehicleRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> vehicleService.getVehicleById(1L))
                .isInstanceOf(VehicleNotFoundException.class)
                .hasMessageContaining("Vehicle not found with id: 1");
    }

    @Test
    void shouldUpdateVehicleSuccessfully() {
        // Arrange
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        doAnswer(invocation -> {
            Vehicle v = invocation.getArgument(1);
            v.setPrice(new BigDecimal("32000.00"));
            v.setQuantity(8);
            return null;
        }).when(vehicleMapper).updateEntityFromDto(eq(updateRequest), any(Vehicle.class));
        when(vehicleRepository.save(vehicle)).thenReturn(vehicle);
        
        VehicleResponse updatedResponse = VehicleResponse.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("32000.00"))
                .quantity(8)
                .build();
        when(vehicleMapper.toResponse(vehicle)).thenReturn(updatedResponse);

        // Act
        VehicleResponse result = vehicleService.updateVehicle(1L, updateRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getPrice()).isEqualTo(new BigDecimal("32000.00"));
        assertThat(result.getQuantity()).isEqualTo(8);
    }

    @Test
    void shouldDeleteVehicleSuccessfully() {
        // Arrange
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        doNothing().when(vehicleRepository).delete(vehicle);

        // Act
        vehicleService.deleteVehicle(1L);

        // Assert
        verify(vehicleRepository).delete(vehicle);
    }

    @Test
    void shouldGetAllVehiclesPaged() {
        // Arrange
        Page<Vehicle> page = new PageImpl<>(List.of(vehicle));
        when(vehicleRepository.findAll(any(PageRequest.class))).thenReturn(page);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(vehicleResponse);

        // Act
        PagedVehicleResponse result = vehicleService.getAllVehicles(0, 10, "price", "asc");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
    }
}
