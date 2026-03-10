package com.dinukas2004.foodiesapi.service;

import org.springframework.security.core.Authentication;

public interface AuthenticationFacade {
     Authentication getAuthentication();
}
