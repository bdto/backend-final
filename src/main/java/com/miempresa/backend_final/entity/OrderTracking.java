package com.miempresa.backend_final.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;

@Table("order_tracking")
public class OrderTracking {

    @Id
    private Long id;
    private Long orderId;
    private String status;
    private String location;
    private String description;
    private LocalDateTime trackedAt;

    public OrderTracking() {}

    public OrderTracking(Long id, Long orderId, String status,
                         String location, String description, LocalDateTime trackedAt) {
        this.id = id;
        this.orderId = orderId;
        this.status = status;
        this.location = location;
        this.description = description;
        this.trackedAt = trackedAt;
    }

    public Long getId() { return id; }
    public Long getOrderId() { return orderId; }
    public String getStatus() { return status; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }
    public LocalDateTime getTrackedAt() { return trackedAt; }

    public void setId(Long id) { this.id = id; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public void setStatus(String status) { this.status = status; }
    public void setLocation(String location) { this.location = location; }
    public void setDescription(String description) { this.description = description; }
    public void setTrackedAt(LocalDateTime trackedAt) { this.trackedAt = trackedAt; }
}