package com.fsd.taskservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fsd.taskservice.model.Task;
import com.fsd.taskservice.repository.TaskRepository;

import java.util.*;

@RestController
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