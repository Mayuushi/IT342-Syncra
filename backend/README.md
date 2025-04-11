# Syncra
Syncra is an independent, self-contained software product designed to serve as an online portfolio and professional networking platform, similar to LinkedIn and JobStreet. It provides individuals a space to showcase their skills, experience, and accomplishments, while allowing recruiters and employers to connect with potential candidates. The platform integrates with third-party tools (e.g., job application portals, social media), but functions fully as a stand-alone system.


## Features

- User Registration and Login
- Create and View Portfolios
- Post to News Feed (Text/Image)
- Search and View Other Users
- RESTful API Backend
- Admin Controls (Ban/Delete Users)
- Future Support for Messaging via WebSocket
- Company Account Support (Job Posting)


## Installation

1. Clone the repository:
```bash
git clone https://github.com/Mayuushi/IT342-Syncra.git
```
2. Open the project in an IDE with Java support (e.g., IntelliJ IDEA).

3. Make sure Java JDK 17+ is installed.

4. Build and run the project via SyncraApplication.java.


## Dependencies

This project uses the following key dependencies:

- Spring Boot

- Spring Web

- Spring Data JPA

- Spring Security

- H2 Database (in-memory for dev)

- Lombok

- Jackson (JSON processing)

You can find all dependencies listed in the pom.xml file.

##  Usage Guide

1. Start the application from your IDE (SyncraApplication.java).

2. Access APIs at: http://localhost:8080/api/

3. Example usage:

- Create a user: POST /api/users

- Create a portfolio: POST /api/portfolio/user/{id}

- Post to newsfeed: POST /api/newsfeed/user/{id}

4. Use Postman or Swagger for testing endpoints.


