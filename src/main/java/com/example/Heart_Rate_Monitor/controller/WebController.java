package com.example.Heart_Rate_Monitor.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @RequestMapping(value = {"/", "/login", "/signup", "/history"})
    public String forward() {
        return "forward:/index.html";
    }
}
