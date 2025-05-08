package com.edu.cit.Syncra.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDTO {

    private String id;
    private String name;
    private String description;
    private String websiteUrl;
    private String logoUrl;
    private String industry;
    private String location;
    private String size;
    private Date foundedDate;
    private String email;
    private String phone;
}