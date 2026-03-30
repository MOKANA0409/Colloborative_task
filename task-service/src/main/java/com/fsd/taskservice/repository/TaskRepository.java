package com.fsd.taskservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fsd.taskservice.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}