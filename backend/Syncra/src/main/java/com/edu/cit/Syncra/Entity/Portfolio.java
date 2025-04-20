package com.edu.cit.Syncra.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Document(collection = "portfolio")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Portfolio {

    @Id
    private String id; // MongoDB uses String IDs (ObjectId)

    private String projectTitle;
    private String description;
    private String imageUrl;

    @DBRef
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "newsFeeds", "portfolios"})
    private User user;

}
