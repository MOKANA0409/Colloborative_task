package com.fsd.taskservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fsd.taskservice.model.KanbanList;

public interface KanbanListRepository extends JpaRepository<KanbanList, Long> {
    KanbanList findByListId(String listId);
}
