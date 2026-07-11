package com.incubyte.cardealership.mapper;

import com.incubyte.cardealership.dto.VehicleCreateRequest;
import com.incubyte.cardealership.dto.VehicleResponse;
import com.incubyte.cardealership.dto.VehicleUpdateRequest;
import com.incubyte.cardealership.entity.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VehicleMapper {

    VehicleResponse toResponse(Vehicle vehicle);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Vehicle toEntity(VehicleCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(VehicleUpdateRequest request, @MappingTarget Vehicle vehicle);
}
