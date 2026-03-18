package com.dinukas2004.foodiesapi.service;

import com.dinukas2004.foodiesapi.io.OrderRequest;
import com.dinukas2004.foodiesapi.io.OrderResponse;

import java.util.List;
import java.util.Map;

public interface OrderService {

    OrderResponse createOrderWithPayment(OrderRequest request);

    void verifyPayment(Map<String, String> notifyData);

    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    List<OrderResponse> getOrdersOfAllUsers();

    void updateOrderStatus(String orderId, String status);
}