package com.incubyte.cardealership.service;

import com.incubyte.cardealership.dto.PagedVehicleResponse;
import com.incubyte.cardealership.dto.VehicleCreateRequest;
import com.incubyte.cardealership.dto.VehicleResponse;
import com.incubyte.cardealership.dto.VehicleUpdateRequest;
import com.incubyte.cardealership.entity.Vehicle;
import com.incubyte.cardealership.exception.OutOfStockException;
import com.incubyte.cardealership.exception.VehicleNotFoundException;
import com.incubyte.cardealership.mapper.VehicleMapper;
import com.incubyte.cardealership.repository.VehicleRepository;
import com.incubyte.cardealership.specification.VehicleSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMapper = vehicleMapper;
    }

    @Override
    @Transactional
    public VehicleResponse addVehicle(VehicleCreateRequest request) {
        Vehicle vehicle = vehicleMapper.toEntity(request);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(savedVehicle);
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long id, VehicleUpdateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found with id: " + id));

        vehicleMapper.updateEntityFromDto(request, vehicle);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(savedVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found with id: " + id));
        vehicleRepository.delete(vehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found with id: " + id));
        return vehicleMapper.toResponse(vehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedVehicleResponse getAllVehicles(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<Vehicle> vehiclePage = vehicleRepository.findAll(pageRequest);

        List<VehicleResponse> responses = vehiclePage.getContent().stream()
                .map(vehicleMapper::toResponse)
                .toList();

        return PagedVehicleResponse.builder()
                .content(responses)
                .pageNumber(vehiclePage.getNumber())
                .pageSize(vehiclePage.getSize())
                .totalElements(vehiclePage.getTotalElements())
                .totalPages(vehiclePage.getTotalPages())
                .last(vehiclePage.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PagedVehicleResponse searchVehicles(String make, String model, String category,
                                               BigDecimal minPrice, BigDecimal maxPrice,
                                               int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Specification<Vehicle> spec = Specification.where(VehicleSpecification.hasMake(make))
                .and(VehicleSpecification.hasModel(model))
                .and(VehicleSpecification.hasCategory(category))
                .and(VehicleSpecification.hasPriceGreaterThanOrEqual(minPrice))
                .and(VehicleSpecification.hasPriceLessThanOrEqual(maxPrice));

        Page<Vehicle> vehiclePage = vehicleRepository.findAll(spec, pageRequest);

        List<VehicleResponse> responses = vehiclePage.getContent().stream()
                .map(vehicleMapper::toResponse)
                .toList();

        return PagedVehicleResponse.builder()
                .content(responses)
                .pageNumber(vehiclePage.getNumber())
                .pageSize(vehiclePage.getSize())
                .totalElements(vehiclePage.getTotalElements())
                .totalPages(vehiclePage.getTotalPages())
                .last(vehiclePage.isLast())
                .build();
    }

    @Override
    @Transactional
    public VehicleResponse purchaseVehicle(Long id, Integer quantity) {
        // Use pessimistic locking to prevent race conditions during concurrent purchase requests
        Vehicle vehicle = vehicleRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found with id: " + id));

        if (vehicle.getQuantity() < quantity) {
            throw new OutOfStockException("Not enough stock available. Requested: " + quantity + ", Available: " + vehicle.getQuantity());
        }

        vehicle.setQuantity(vehicle.getQuantity() - quantity);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(savedVehicle);
    }

    @Override
    @Transactional
    public VehicleResponse restockVehicle(Long id, Integer quantity) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found with id: " + id));

        vehicle.setQuantity(vehicle.getQuantity() + quantity);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(savedVehicle);
    }
}
