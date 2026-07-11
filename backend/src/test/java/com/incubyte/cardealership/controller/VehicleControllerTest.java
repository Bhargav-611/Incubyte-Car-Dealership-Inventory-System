package com.incubyte.cardealership.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.incubyte.cardealership.dto.*;
import com.incubyte.cardealership.exception.OutOfStockException;
import com.incubyte.cardealership.exception.VehicleNotFoundException;
import com.incubyte.cardealership.security.JwtTokenProvider;
import com.incubyte.cardealership.service.AuthService;
import com.incubyte.cardealership.service.CustomUserDetailsService;
import com.incubyte.cardealership.service.VehicleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = VehicleController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VehicleService vehicleService;

    // Security components that might be autowired in SecurityConfig scans
    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private VehicleResponse vehicleResponse;
    private VehicleCreateRequest createRequest;
    private VehicleUpdateRequest updateRequest;

    @BeforeEach
    void setUp() {
        vehicleResponse = VehicleResponse.builder()
                .id(1L)
                .make("Tesla")
                .model("Model 3")
                .category("Electric")
                .price(new BigDecimal("45000.00"))
                .quantity(10)
                .build();

        createRequest = VehicleCreateRequest.builder()
                .make("Tesla")
                .model("Model 3")
                .category("Electric")
                .price(new BigDecimal("45000.00"))
                .quantity(10)
                .build();

        updateRequest = VehicleUpdateRequest.builder()
                .make("Tesla")
                .model("Model 3")
                .category("Electric")
                .price(new BigDecimal("47000.00"))
                .quantity(12)
                .build();
    }

    @Test
    void shouldCreateVehicleAndReturn201() throws Exception {
        // Arrange
        when(vehicleService.addVehicle(any(VehicleCreateRequest.class))).thenReturn(vehicleResponse);

        // Act & Assert
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Vehicle added successfully"))
                .andExpect(jsonPath("$.data.make").value("Tesla"));
    }

    @Test
    void shouldReturn400BadRequestWhenCreateInputIsInvalid() throws Exception {
        // Arrange
        VehicleCreateRequest invalidRequest = VehicleCreateRequest.builder()
                .make("")
                .price(new BigDecimal("-100.00")) // negative price
                .quantity(-5) // negative quantity
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    void shouldGetVehicleByIdSuccessfullyAndReturn200() throws Exception {
        // Arrange
        when(vehicleService.getVehicleById(1L)).thenReturn(vehicleResponse);

        // Act & Assert
        mockMvc.perform(get("/api/vehicles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.model").value("Model 3"));
    }

    @Test
    void shouldReturn404NotFoundWhenVehicleDoesNotExist() throws Exception {
        // Arrange
        when(vehicleService.getVehicleById(99L)).thenThrow(new VehicleNotFoundException("Vehicle not found with id: 99"));

        // Act & Assert
        mockMvc.perform(get("/api/vehicles/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Vehicle not found with id: 99"));
    }

    @Test
    void shouldSearchVehiclesAndReturn200() throws Exception {
        // Arrange
        PagedVehicleResponse pagedResponse = PagedVehicleResponse.builder()
                .content(List.of(vehicleResponse))
                .pageNumber(0)
                .pageSize(10)
                .totalElements(1)
                .totalPages(1)
                .last(true)
                .build();

        when(vehicleService.searchVehicles(eq("Tesla"), any(), any(), any(), any(), anyInt(), anyInt(), anyString(), anyString()))
                .thenReturn(pagedResponse);

        // Act & Assert
        mockMvc.perform(get("/api/vehicles/search")
                        .param("make", "Tesla")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].make").value("Tesla"));
    }

    @Test
    void shouldPurchaseVehicleSuccessfullyAndReturn200() throws Exception {
        // Arrange
        PurchaseRequest request = new PurchaseRequest(3);
        VehicleResponse updatedResponse = vehicleResponse;
        updatedResponse.setQuantity(7); // 10 - 3 = 7

        when(vehicleService.purchaseVehicle(eq(1L), eq(3))).thenReturn(updatedResponse);

        // Act & Assert
        mockMvc.perform(post("/api/vehicles/1/purchase")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Purchase successful"))
                .andExpect(jsonPath("$.data.quantity").value(7));
    }

    @Test
    void shouldReturn409ConflictWhenPurchasingMoreThanStock() throws Exception {
        // Arrange
        PurchaseRequest request = new PurchaseRequest(15);

        when(vehicleService.purchaseVehicle(eq(1L), eq(15)))
                .thenThrow(new OutOfStockException("Not enough stock available"));

        // Act & Assert
        mockMvc.perform(post("/api/vehicles/1/purchase")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Not enough stock available"));
    }

    @Test
    void shouldRestockVehicleSuccessfullyAndReturn200() throws Exception {
        // Arrange
        RestockRequest request = new RestockRequest(5);
        VehicleResponse updatedResponse = vehicleResponse;
        updatedResponse.setQuantity(15); // 10 + 5 = 15

        when(vehicleService.restockVehicle(eq(1L), eq(5))).thenReturn(updatedResponse);

        // Act & Assert
        mockMvc.perform(post("/api/vehicles/1/restock")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Restock successful"))
                .andExpect(jsonPath("$.data.quantity").value(15));
    }
}
