package com.dinukas2004.foodiesapi.service;

import com.razorpay.RazorpayException;
import com.dinukas2004.foodiesapi.io.OrderResponse;
import com.dinukas2004.foodiesapi.io.OrderRequest;

import java.util.List;
import java.util.Map;

public interface OrderService {

    OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException;

    void verifyPayment(Map<String, String> paymentData, String status);

    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    void updateOrderStatus(String orderId, String status);
}

