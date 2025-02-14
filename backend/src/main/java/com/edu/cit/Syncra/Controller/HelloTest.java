package com.edu.cit.Syncra.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloTest {
    public HelloTest() {
    }

    @GetMapping({"/"})
    public String getName() {
        return "Hello World";
    }
}
