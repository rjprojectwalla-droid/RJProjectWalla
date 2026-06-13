package com.rawProject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rawProject.entity.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
	
}