package com.dinukas2004.foodiesapi.service;

import com.dinukas2004.foodiesapi.entity.OrderEntity;
import com.dinukas2004.foodiesapi.io.OrderRequest;
import com.dinukas2004.foodiesapi.io.OrderResponse;
import com.dinukas2004.foodiesapi.repository.CartRepository;
import com.dinukas2004.foodiesapi.repository.OrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private CartRepository cartRepository;

    @Value("${payhere.merchant.id}")
    private String PAYHERE_MERCHANT_ID;

    @Value("${payhere.merchant.secret}")
    private String PAYHERE_MERCHANT_SECRET;

    @Value("${payhere.checkout.url}")
    private String PAYHERE_CHECKOUT_URL;

    @Value("${payhere.notify.url}")
    private String PAYHERE_NOTIFY_URL;

    @Value("${payhere.return.url}")
    private String PAYHERE_RETURN_URL;

    @Value("${payhere.cancel.url}")
    private String PAYHERE_CANCEL_URL;

    // Default currency — change to "USD" if needed
    private static final String CURRENCY = "LKR";

    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) {
        // 1. Persist the order with "Pending" payment status
        String loggedInUserId = userService.findByUserId();
        OrderEntity newOrder = convertToEntity(request);
        newOrder.setUserId(loggedInUserId);
        newOrder.setCurrency(CURRENCY);
        newOrder.setPaymentStatus("Pending");
        newOrder = orderRepository.save(newOrder);

        // 2. Generate the PayHere hash
        //    Hash = MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase()).toUpperCase()
        String formattedAmount = formatAmount(newOrder.getAmount());
        String hash = generatePayhereHash(
                PAYHERE_MERCHANT_ID,
                newOrder.getId(),
                formattedAmount,
                CURRENCY
        );

        // 3. Return all checkout parameters to the frontend
        return OrderResponse.builder()
                .id(newOrder.getId())
                .userId(newOrder.getUserId())
                .amount(newOrder.getAmount())
                .currency(CURRENCY)
                .email(newOrder.getEmail())
                .phoneNumber(newOrder.getPhoneNumber())
                .userAddress(newOrder.getUserAddress())
                .orderedItems(newOrder.getOrderedItems())
                .paymentStatus(newOrder.getPaymentStatus())
                .orderStatus(newOrder.getOrderStatus())
                // PayHere-specific fields
                .merchantId(PAYHERE_MERCHANT_ID)
                .payhereOrderId(newOrder.getId())
                .checkoutUrl(PAYHERE_CHECKOUT_URL)
                .hash(hash)
                .notifyUrl(PAYHERE_NOTIFY_URL)
                .returnUrl(PAYHERE_RETURN_URL)
                .cancelUrl(PAYHERE_CANCEL_URL)
                .build();
    }

    /**
     * Called by PayHere's server-to-server notification (notify_url).
     * Verifies the md5sig and updates order payment status.
     *
     * PayHere POST fields:
     *   merchant_id, order_id, payment_id, payhere_amount,
     *   payhere_currency, status_code, md5sig, ...
     */
    @Override
    public void verifyPayment(Map<String, String> notifyData) {
        String merchantId   = notifyData.get("merchant_id");
        String orderId      = notifyData.get("order_id");
        String payhereAmount = notifyData.get("payhere_amount");
        String payhereCurrency = notifyData.get("payhere_currency");
        String statusCode   = notifyData.get("status_code");
        String md5sig       = notifyData.get("md5sig");
        String paymentId    = notifyData.get("payment_id");

        // Verify signature:
        // Expected = MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code
        //                + MD5(merchant_secret).toUpperCase()).toUpperCase()
        String secretHash = md5(PAYHERE_MERCHANT_SECRET).toUpperCase();
        String expected = md5(merchantId + orderId + payhereAmount + payhereCurrency + statusCode + secretHash).toUpperCase();

        if (!expected.equals(md5sig)) {
            log.warn("PayHere signature mismatch for order {}. Ignoring notification.", orderId);
            return;
        }

        OrderEntity existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        existingOrder.setPayherePaymentId(paymentId);

        // PayHere status codes: 2 = Success, 0 = Pending, -1 = Cancelled, -2 = Failed, -3 = Chargebacked
        switch (statusCode) {
            case "2":
                existingOrder.setPaymentStatus("Paid");
                cartRepository.deleteByUserId(existingOrder.getUserId());
                break;
            case "0":
                existingOrder.setPaymentStatus("Pending");
                break;
            case "-1":
                existingOrder.setPaymentStatus("Cancelled");
                break;
            case "-2":
                existingOrder.setPaymentStatus("Failed");
                break;
            case "-3":
                existingOrder.setPaymentStatus("Chargebacked");
                break;
            default:
                log.warn("Unknown PayHere status code {} for order {}", statusCode, orderId);
        }

        orderRepository.save(existingOrder);
        log.info("Order {} payment status updated to {}", orderId, existingOrder.getPaymentStatus());
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId = userService.findByUserId();
        List<OrderEntity> list = orderRepository.findByUserId(loggedInUserId);
        return list.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        List<OrderEntity> list = orderRepository.findAll();
        return list.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        entity.setOrderStatus(status);
        orderRepository.save(entity);
    }

    // ─── Private helpers ────────────────────────────────────────────────────────

    /**
     * Generates the PayHere checkout hash.
     * Formula: MD5(merchant_id + order_id + amount + currency + MD5(secret).toUpperCase()).toUpperCase()
     */
    private String generatePayhereHash(String merchantId, String orderId, String amount, String currency) {
        String secretHash = md5(PAYHERE_MERCHANT_SECRET).toUpperCase();
        String raw = merchantId + orderId + amount + currency + secretHash;
        return md5(raw).toUpperCase();
    }

    /** MD5 hex string helper */
    private String md5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not available", e);
        }
    }

    /**
     * PayHere requires amount formatted to 2 decimal places (e.g. "1000.00").
     */
    private String formatAmount(double amount) {
        return new BigDecimal(amount).setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    private OrderResponse convertToResponse(OrderEntity order) {
        return OrderResponse.builder()
                .id(order.getId())
                .amount(order.getAmount())
                .currency(order.getCurrency())
                .userAddress(order.getUserAddress())
                .userId(order.getUserId())
                .paymentStatus(order.getPaymentStatus())
                .orderStatus(order.getOrderStatus())
                .email(order.getEmail())
                .phoneNumber(order.getPhoneNumber())
                .orderedItems(order.getOrderedItems())
                .payhereOrderId(order.getId())
                .build();
    }

    private OrderEntity convertToEntity(OrderRequest request) {
        return OrderEntity.builder()
                .userAddress(request.getUserAddress())
                .amount(request.getAmount())
                .orderedItems(request.getOrderedItems())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .orderStatus(request.getOrderStatus())
                .build();
    }
}