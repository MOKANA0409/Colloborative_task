package com.fsd.userservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fsd.userservice.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}