package com.miempresa.backend_final.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.math.BigDecimal;

@Table("products")
public class Product {

    @Id
    private Long id;
    private Long categoryId;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private Integer stock;
    private Boolean active;

    public Product() {}

    public Product(Long id, Long categoryId, String name, String description,
                   String imageUrl, BigDecimal price, Integer stock, Boolean active) {
        this.id = id;
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.stock = stock;
        this.active = active;
    }

    public Long getId() { return id; }
    public Long getCategoryId() { return categoryId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public BigDecimal getPrice() { return price; }
    public Integer getStock() { return stock; }
    public Boolean getActive() { return active; }

    public void setId(Long id) { this.id = id; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setActive(Boolean active) { this.active = active; }
}