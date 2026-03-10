package com.dinukas2004.foodiesapi.service;

import com.dinukas2004.foodiesapi.io.CartRequest;
import com.dinukas2004.foodiesapi.io.CartResponse;

public interface CartService {
    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);
}
