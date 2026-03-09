package com.dinukas2004.foodiesapi.controller;

import com.dinukas2004.foodiesapi.io.UserRequest;
import com.dinukas2004.foodiesapi.io.UserResponse;
import com.dinukas2004.foodiesapi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request){
        return userService.registerUser(request);
    }
}
