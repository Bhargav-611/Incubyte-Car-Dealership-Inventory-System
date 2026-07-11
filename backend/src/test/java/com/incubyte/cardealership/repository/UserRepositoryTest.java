package com.incubyte.cardealership.repository;

import com.incubyte.cardealership.entity.User;
import com.incubyte.cardealership.entity.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import com.incubyte.cardealership.config.AuditConfig;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(AuditConfig.class)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void shouldSaveAndFindUserByEmail() {
        // Arrange
        User user = User.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .password("HashedPassword123!")
                .role(UserRole.ROLE_USER)
                .build();

        // Act
        User savedUser = userRepository.save(user);
        Optional<User> foundUser = userRepository.findByEmail("john.doe@example.com");

        // Assert
        assertThat(savedUser.getId()).isNotNull();
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getName()).isEqualTo("John Doe");
        assertThat(foundUser.get().getRole()).isEqualTo(UserRole.ROLE_USER);
    }

    @Test
    void shouldReturnTrueWhenUserExistsByEmail() {
        // Arrange
        User user = User.builder()
                .name("Jane Smith")
                .email("jane.smith@example.com")
                .password("Password123!")
                .role(UserRole.ROLE_ADMIN)
                .build();
        userRepository.save(user);

        // Act
        boolean exists = userRepository.existsByEmail("jane.smith@example.com");
        boolean notExists = userRepository.existsByEmail("nonexistent@example.com");

        // Assert
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }
}
