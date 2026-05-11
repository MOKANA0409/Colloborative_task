package com.fsd.taskservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.fsd.taskservice.model.KanbanList;
import com.fsd.taskservice.repository.KanbanListRepository;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/lists")
public class ListController {

    @Autowired
    private KanbanListRepository repo;

    @GetMapping
    public List<KanbanList> getAllLists() {
        return repo.findAll();
    }

    @PostMapping
    public KanbanList createOrUpdateList(@RequestBody KanbanList list) {
        KanbanList existing = repo.findByListId(list.getListId());
        if (existing != null) {
            existing.setTitle(list.getTitle());
            existing.setPositionIndex(list.getPositionIndex());
            return repo.save(existing);
        }
        return repo.save(list);
    }

    @DeleteMapping("/{id}")
    public String deleteList(@PathVariable Long id) {
        repo.deleteById(id);
        return "List deleted";
    }
}
