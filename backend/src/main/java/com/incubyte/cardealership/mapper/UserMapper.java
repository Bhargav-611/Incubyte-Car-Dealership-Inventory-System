package com.incubyte.cardealership.mapper;

import com.incubyte.cardealership.dto.RegisterRequest;
import com.incubyte.cardealership.dto.UserResponse;
import com.incubyte.cardealership.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "password", ignore = true) // Password will be hashed manually in service layer
    @Mapping(target = "role", ignore = true)
    User toEntity(RegisterRequest request);
}
