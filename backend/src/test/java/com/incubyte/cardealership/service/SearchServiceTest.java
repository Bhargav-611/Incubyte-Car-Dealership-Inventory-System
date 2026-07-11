package com.incubyte.cardealership.service;

import com.incubyte.cardealership.dto.PagedVehicleResponse;
import com.incubyte.cardealership.dto.VehicleResponse;
import com.incubyte.cardealership.entity.Vehicle;
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
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

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
                .quantity(5)
                .build();
    }

    @Test
    @SuppressWarnings("unchecked")
    void shouldSearchVehiclesWithFiltersAndReturnPagedResponse() {
        // Arrange
        Page<Vehicle> page = new PageImpl<>(List.of(vehicle));
        when(vehicleRepository.findAll(any(Specification.class), any(PageRequest.class))).thenReturn(page);
        when(vehicleMapper.toResponse(any(Vehicle.class))).thenReturn(vehicleResponse);

        // Act
        PagedVehicleResponse result = vehicleService.searchVehicles(
                "Toyota", "Camry", "Sedan",
                new BigDecimal("20000.00"), new BigDecimal("40000.00"),
                0, 10, "price", "asc"
        );

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getMake()).isEqualTo("Toyota");
        verify(vehicleRepository).findAll(any(Specification.class), any(PageRequest.class));
    }
}
