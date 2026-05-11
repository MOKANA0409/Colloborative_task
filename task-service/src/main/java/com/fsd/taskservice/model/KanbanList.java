package com.fsd.taskservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "kanban_list")
public class KanbanList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String listId; // Internal UI id, e.g. "TODO", "column-123"
    private String title;
    private Integer positionIndex;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getListId() { return listId; }
    public void setListId(String listId) { this.listId = listId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getPositionIndex() { return positionIndex; }
    public void setPositionIndex(Integer positionIndex) { this.positionIndex = positionIndex; }
}
