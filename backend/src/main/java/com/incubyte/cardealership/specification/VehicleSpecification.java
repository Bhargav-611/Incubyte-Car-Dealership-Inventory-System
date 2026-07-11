package com.incubyte.cardealership.specification;

import com.incubyte.cardealership.entity.Vehicle;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class VehicleSpecification {

    public static Specification<Vehicle> hasMake(String make) {
        return (root, query, criteriaBuilder) -> {
            if (make == null || make.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("make")), "%" + make.toLowerCase() + "%");
        };
    }

    public static Specification<Vehicle> hasModel(String model) {
        return (root, query, criteriaBuilder) -> {
            if (model == null || model.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("model")), "%" + model.toLowerCase() + "%");
        };
    }

    public static Specification<Vehicle> hasCategory(String category) {
        return (root, query, criteriaBuilder) -> {
            if (category == null || category.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(criteriaBuilder.lower(root.get("category")), category.toLowerCase());
        };
    }

    public static Specification<Vehicle> hasPriceGreaterThanOrEqual(BigDecimal minPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
        };
    }

    public static Specification<Vehicle> hasPriceLessThanOrEqual(BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (maxPrice == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }
}
