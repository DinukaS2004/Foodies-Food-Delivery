package com.dinukas2004.foodiesapi.service;

import com.dinukas2004.foodiesapi.io.UserRequest;
import com.dinukas2004.foodiesapi.io.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);
    String findByUserId();
}
