package com.dinukas2004.foodiesapi.io;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrderResponse {
    // Order details
    private String id;
    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private double amount;
    private String currency;
    private String paymentStatus;
    private String orderStatus;
    private List<OrderItem> orderedItems;

    // PayHere checkout parameters (populated on order creation, null for list responses)
    private String merchantId;
    private String payhereOrderId;
    private String checkoutUrl;
    private String hash;
    private String notifyUrl;
    private String returnUrl;
    private String cancelUrl;
}