package com.dinukas2004.foodiesapi.controller;

import com.dinukas2004.foodiesapi.io.OrderRequest;
import com.dinukas2004.foodiesapi.io.OrderResponse;
import com.dinukas2004.foodiesapi.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * Creates an order and returns PayHere checkout parameters.
     * The frontend uses these parameters to submit the PayHere payment form.
     */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest request) {
        return orderService.createOrderWithPayment(request);
    }

    /**
     * PayHere notify URL — called server-to-server by PayHere after payment.
     * Must be a publicly accessible URL (use ngrok in development).
     * PayHere docs: https://support.payhere.lk/api-&-mobile-sdk/payhere-checkout
     */
    @PostMapping("/notify")
    public void payhereNotify(@RequestParam Map<String, String> notifyData) {
        orderService.verifyPayment(notifyData);
    }

    @GetMapping
    public List<OrderResponse> getOrders() {
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId) {
        orderService.removeOrder(orderId);
    }

    // Admin panel
    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers() {
        return orderService.getOrdersOfAllUsers();
    }

    // Admin panel
    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        orderService.updateOrderStatus(orderId, status);
    }
}