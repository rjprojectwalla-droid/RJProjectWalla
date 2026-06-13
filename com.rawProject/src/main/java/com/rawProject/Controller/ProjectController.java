package com.rawProject.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rawProject.entity.Project;
import com.rawProject.repository.ProjectRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository repo;

    @GetMapping
    public List<Project> getAllProjects(){
        return repo.findAll();
    }

    @PostMapping
    public Project addProject(@RequestBody Project project){
        return repo.save(project);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable("id") Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(404).body("Project not found");
        }

        repo.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable("id") Long id,
            @RequestBody Project updatedProject) {

        return repo.findById(id)
                .map(project -> {

                    project.setTitle(updatedProject.getTitle());
                    project.setCat(updatedProject.getCat());
                    project.setIcon(updatedProject.getIcon());
                    project.setDescription(updatedProject.getDescription());
                    project.setPrice(updatedProject.getPrice());
                    project.setPopular(updatedProject.isPopular());

                    return ResponseEntity.ok(repo.save(project));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}