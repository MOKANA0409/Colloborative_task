package com.fsd.taskservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "task") 
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String status;

    private Long userId;

    private String priority;
    private String deadline;
    private String storyPoints;
    private String type;

    @Column(columnDefinition = "LONGTEXT")
    private String comments;

    @Column(columnDefinition = "LONGTEXT")
    private String subtasks;

    @Column(columnDefinition = "LONGTEXT")
    private String labels;

    @Column(columnDefinition = "LONGTEXT")
    private String attachments;

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getStoryPoints() { return storyPoints; }
    public void setStoryPoints(String storyPoints) { this.storyPoints = storyPoints; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getSubtasks() { return subtasks; }
    public void setSubtasks(String subtasks) { this.subtasks = subtasks; }

    public String getLabels() { return labels; }
    public void setLabels(String labels) { this.labels = labels; }

    public String getAttachments() { return attachments; }
    public void setAttachments(String attachments) { this.attachments = attachments; }
}