package com.rawProject.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "projects")
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String cat;
    private String icon;

    @Column(length = 1000)
    private String description;

    private int price;
    @Column(name = "popular")
    private boolean popular;
}