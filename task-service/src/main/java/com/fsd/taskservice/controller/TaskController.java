package com.fsd.taskservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fsd.taskservice.model.Task;
import com.fsd.taskservice.repository.TaskRepository;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskRepository repo;

    @Autowired
    private RestTemplate restTemplate;

    private final String USER_SERVICE_URL = "http://localhost:8081/users/";

   
    @GetMapping
    public List<Task> getAllTasks() {
        return repo.findAll();
    }
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        repo.deleteById(id);
        return "Task deleted";
    }

 
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return repo.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Task task = repo.findById(id).orElse(null);
        if (task != null) {
            if(taskDetails.getTitle() != null) task.setTitle(taskDetails.getTitle());
            if(taskDetails.getDescription() != null) task.setDescription(taskDetails.getDescription());
            if(taskDetails.getStatus() != null) task.setStatus(taskDetails.getStatus());
            if(taskDetails.getUserId() != null) task.setUserId(taskDetails.getUserId());
            if(taskDetails.getPriority() != null) task.setPriority(taskDetails.getPriority());
            if(taskDetails.getDeadline() != null) task.setDeadline(taskDetails.getDeadline());
            if(taskDetails.getStoryPoints() != null) task.setStoryPoints(taskDetails.getStoryPoints());
            if(taskDetails.getType() != null) task.setType(taskDetails.getType());
            if(taskDetails.getComments() != null) task.setComments(taskDetails.getComments());
            if(taskDetails.getSubtasks() != null) task.setSubtasks(taskDetails.getSubtasks());
            if(taskDetails.getLabels() != null) task.setLabels(taskDetails.getLabels());
            if(taskDetails.getAttachments() != null) task.setAttachments(taskDetails.getAttachments());
            return repo.save(task);
        }
        return null;
    }

   
    @GetMapping("/with-user/{id}")
    public Map<String, Object> getTaskWithUser(@PathVariable Long id) {

        Task task = repo.findById(id).orElse(null);

        if (task == null) {
            return Collections.singletonMap("error", "Task not found");
        }

        Object user = restTemplate.getForObject(
                USER_SERVICE_URL + task.getUserId(),
                Object.class
        );

        Map<String, Object> response = new HashMap<>();
        response.put("task", task);
        response.put("user", user);

        return response;
    }
}