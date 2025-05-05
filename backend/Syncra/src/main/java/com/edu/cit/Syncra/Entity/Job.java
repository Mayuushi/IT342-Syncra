package com.edu.cit.Syncra.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

import java.util.List;

@Document(collection = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    private String id;

    private String company;
    private String title;
    private String date;
    private List<String> tags;
    private String rate;

    // Additional fields that might be useful
    private String description;
    private String location;
    private String applicationUrl;
}