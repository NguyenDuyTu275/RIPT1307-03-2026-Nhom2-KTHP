package com.Nhom2.booking.repository;

import com.Nhom2.booking.entity.User;
import com.Nhom2.booking.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    List<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByRoleIsNull();

    long countByRole(UserRole role);
}
