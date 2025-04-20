package com.edu.cit.Syncra.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

import java.util.List;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id; // MongoDB uses String/ObjectId as IDs

    private String email;
    private String password;
    private String name;

    @DBRef
    private List<NewsFeed> newsFeeds;

    @DBRef
    private List<Portfolio> portfolios;

}
