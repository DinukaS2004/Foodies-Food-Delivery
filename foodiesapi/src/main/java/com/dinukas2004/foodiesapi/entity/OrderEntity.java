package com.dinukas2004.foodiesapi.entity;

import com.dinukas2004.foodiesapi.io.OrderItem;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "orders")
@Data
@Builder
public class OrderEntity {
    @Id
    private String id;
    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private List<OrderItem> orderedItems;
    private double amount;
    private String currency;
    private String paymentStatus;       // "Pending", "Paid", "Failed", "Cancelled"
    private String payhereOrderId;      // Our internal order ID sent to PayHere
    private String payherePaymentId;    // PayHere's payment_id from notify
    private String orderStatus;
}