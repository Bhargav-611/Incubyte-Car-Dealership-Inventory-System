package com.incubyte.cardealership.service;

import com.incubyte.cardealership.dto.PagedVehicleResponse;
import com.incubyte.cardealership.dto.VehicleCreateRequest;
import com.incubyte.cardealership.dto.VehicleResponse;
import com.incubyte.cardealership.dto.VehicleUpdateRequest;

import java.math.BigDecimal;

public interface VehicleService {
    VehicleResponse addVehicle(VehicleCreateRequest request);
    VehicleResponse updateVehicle(Long id, VehicleUpdateRequest request);
    void deleteVehicle(Long id);
    VehicleResponse getVehicleById(Long id);
    PagedVehicleResponse getAllVehicles(int page, int size, String sortBy, String sortDir);
    PagedVehicleResponse searchVehicles(String make, String model, String category, BigDecimal minPrice, BigDecimal maxPrice, int page, int size, String sortBy, String sortDir);
    VehicleResponse purchaseVehicle(Long id, Integer quantity);
    VehicleResponse restockVehicle(Long id, Integer quantity);
}
