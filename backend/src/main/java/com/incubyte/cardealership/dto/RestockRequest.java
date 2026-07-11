package com.incubyte.cardealership.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestockRequest {

    @NotNull(message = "Restock quantity is required")
    @Min(value = 1, message = "Restock quantity must be at least 1")
    private Integer quantity;
}
