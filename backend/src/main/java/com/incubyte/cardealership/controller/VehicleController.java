package com.incubyte.cardealership.controller;

import com.incubyte.cardealership.dto.*;
import com.incubyte.cardealership.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponse>> addVehicle(@Valid @RequestBody VehicleCreateRequest request) {
        VehicleResponse response = vehicleService.addVehicle(request);
        return new ResponseEntity<>(ApiResponse.success("Vehicle added successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedVehicleResponse>> getAllVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        PagedVehicleResponse response = vehicleService.getAllVehicles(page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Vehicles retrieved successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> getVehicleById(@PathVariable Long id) {
        VehicleResponse response = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle retrieved successfully", response));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedVehicleResponse>> searchVehicles(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        PagedVehicleResponse response = vehicleService.searchVehicles(
                make, model, category, minPrice, maxPrice, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleResponse>> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleUpdateRequest request) {
        VehicleResponse response = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle deleted successfully", null));
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<ApiResponse<VehicleResponse>> purchaseVehicle(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseRequest request) {
        VehicleResponse response = vehicleService.purchaseVehicle(id, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Purchase successful", response));
    }

    @PostMapping("/{id}/restock")
    public ResponseEntity<ApiResponse<VehicleResponse>> restockVehicle(
            @PathVariable Long id,
            @Valid @RequestBody RestockRequest request) {
        VehicleResponse response = vehicleService.restockVehicle(id, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Restock successful", response));
    }
}
