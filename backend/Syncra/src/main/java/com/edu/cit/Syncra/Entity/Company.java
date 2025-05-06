package com.edu.cit.Syncra.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


import java.util.ArrayList;
import java.util.List;
import java.util.Date;

@JsonIgnoreProperties(value = { "owner", "postedJobs" }, allowGetters = true)
@Document(collection = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    private String id;

    private String name;
    private String description;
    private String websiteUrl;
    private String logoUrl;
    private String industry;
    private String location;
    private String size; // e.g., "1-10", "11-50", "51-200", etc.
    private Date foundedDate;

    // Contact information
    private String email;
    private String phone;

    // The user who owns/manages this company
    @DBRef
    private User owner;

    // Jobs posted by this company
    @DBRef
    private List<Job> postedJobs = new ArrayList<>();

    // Additional fields
    private boolean verified = false; // If the company is verified
    private Date createdAt;
    private Date updatedAt;
}