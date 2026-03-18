package com.dinukas2004.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private String foodId;
    private int quantity;
    private double price;
    private String category;
    private String imageUrl;
    private String description;
    private String name;
}