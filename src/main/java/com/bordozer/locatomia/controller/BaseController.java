package com.bordozer.locatomia.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@Controller
public class BaseController {

    @GetMapping("/")
    public String index(final Map<String, Object> model) {
        return "index";
    }
}
