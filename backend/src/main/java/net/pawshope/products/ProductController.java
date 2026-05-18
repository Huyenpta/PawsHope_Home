package net.pawshope.products;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import net.pawshope.common.ApiException;
import net.pawshope.common.ApiResponse;
import net.pawshope.security.CurrentUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    public record ProductRequest(
            @Size(max = 150) String productName,
            @Size(max = 2000) String description,
            @PositiveOrZero BigDecimal price,
            @PositiveOrZero Integer stockQuantity,
            @Size(max = 255) String imageUrl,
            Boolean isActive
    ) {}

    private static final Map<String, String> FIELDS = Map.of(
            "productName", "product_name",
            "description", "description",
            "price", "price",
            "stockQuantity", "stock_quantity",
            "imageUrl", "image_url",
            "isActive", "is_active");

    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert insert;
    private final CurrentUser currentUser;

    public ProductController(DataSource ds, JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
        this.insert = new SimpleJdbcInsert(ds).withTableName("products").usingGeneratedKeyColumns("product_id");
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        return ApiResponse.ok(jdbc.queryForList(
                "SELECT * FROM products WHERE is_active = TRUE ORDER BY product_id DESC"));
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getOne(@PathVariable long id) {
        try {
            return ApiResponse.ok(jdbc.queryForMap("SELECT * FROM products WHERE product_id = ?", id));
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw ApiException.notFound("Không tìm thấy");
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(@Valid @RequestBody ProductRequest body) {
        currentUser.requireRole("Admin");
        Map<String, Object> p = new HashMap<>();
        p.put("product_name", body.productName());
        p.put("description", body.description());
        p.put("price", body.price());
        p.put("stock_quantity", body.stockQuantity() == null ? 0 : body.stockQuantity());
        p.put("image_url", body.imageUrl());
        p.put("is_active", body.isActive() == null ? true : body.isActive());
        Number id = insert.executeAndReturnKey(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.ok(Map.of("productId", id.longValue())));
    }

    @PatchMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable long id, @RequestBody Map<String, Object> body) {
        currentUser.requireRole("Admin");
        List<String> sets = new ArrayList<>();
        List<Object> args = new ArrayList<>();
        for (var e : FIELDS.entrySet()) {
            if (body.containsKey(e.getKey())) { sets.add(e.getValue() + " = ?"); args.add(body.get(e.getKey())); }
        }
        if (sets.isEmpty()) throw ApiException.badRequest("Không có trường nào để cập nhật");
        args.add(id);
        int n = jdbc.update("UPDATE products SET " + String.join(", ", sets) + " WHERE product_id = ?", args.toArray());
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable long id) {
        currentUser.requireRole("Admin");
        jdbc.update("UPDATE products SET is_active = FALSE WHERE product_id = ?", id);
        return ApiResponse.message("Đã deactivate sản phẩm");
    }
}
