package net.pawshope.orders;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import net.pawshope.common.ApiException;
import net.pawshope.common.ApiResponse;
import net.pawshope.security.CurrentUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    public record CheckoutRequest(@NotBlank @Size(min = 5, max = 500) String shippingAddress) {}
    public record UpdateStatusRequest(
            @Pattern(regexp = "Pending|Paid|Shipped|Completed|Cancelled") String status) {}

    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert insertOrder;
    private final SimpleJdbcInsert insertItem;
    private final CurrentUser currentUser;

    public OrderController(DataSource ds, JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
        this.insertOrder = new SimpleJdbcInsert(ds).withTableName("orders").usingGeneratedKeyColumns("order_id");
        this.insertItem = new SimpleJdbcInsert(ds).withTableName("order_items").usingGeneratedKeyColumns("order_item_id");
    }

    @GetMapping("/my")
    public ApiResponse<List<Map<String, Object>>> my() {
        long me = currentUser.getOrThrow().userId();
        return ApiResponse.ok(jdbc.queryForList(
                "SELECT * FROM orders WHERE user_id = ? ORDER BY order_id DESC", me));
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> all() {
        currentUser.requireRole("Admin");
        return ApiResponse.ok(jdbc.queryForList("""
                SELECT o.*, u.full_name AS user_name
                FROM orders o JOIN users u ON u.user_id = o.user_id
                ORDER BY o.order_id DESC
                """));
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getOne(@PathVariable long id) {
        var me = currentUser.getOrThrow();
        Map<String, Object> order;
        try {
            order = jdbc.queryForMap("SELECT * FROM orders WHERE order_id = ?", id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw ApiException.notFound("Không tìm thấy");
        }
        if (!me.hasRole("Admin") && ((Number) order.get("user_id")).longValue() != me.userId()) {
            throw ApiException.forbidden("Forbidden");
        }
        List<Map<String, Object>> items = jdbc.queryForList("""
                SELECT oi.*, p.product_name, p.image_url
                FROM order_items oi JOIN products p ON p.product_id = oi.product_id
                WHERE order_id = ?
                """, id);
        Map<String, Object> result = new LinkedHashMap<>(order);
        result.put("items", items);
        return ApiResponse.ok(result);
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkout(@Valid @RequestBody CheckoutRequest body) {
        long me = currentUser.getOrThrow().userId();

        List<Map<String, Object>> cart = jdbc.queryForList("""
                SELECT c.product_id, c.quantity, p.price, p.stock_quantity, p.product_name
                FROM cart c JOIN products p ON p.product_id = c.product_id
                WHERE c.user_id = ?
                """, me);
        if (cart.isEmpty()) throw ApiException.badRequest("Giỏ hàng trống");

        BigDecimal total = BigDecimal.ZERO;
        for (Map<String, Object> row : cart) {
            int qty = ((Number) row.get("quantity")).intValue();
            int stock = ((Number) row.get("stock_quantity")).intValue();
            if (stock < qty) throw ApiException.badRequest("Sản phẩm \"" + row.get("product_name") + "\" không đủ hàng");
            total = total.add(((BigDecimal) row.get("price")).multiply(BigDecimal.valueOf(qty)));
        }

        Map<String, Object> orderP = new HashMap<>();
        orderP.put("user_id", me);
        orderP.put("total_amount", total);
        orderP.put("shipping_address", body.shippingAddress());
        orderP.put("order_status", "Pending");
        Number orderId = insertOrder.executeAndReturnKey(orderP);

        for (Map<String, Object> row : cart) {
            Map<String, Object> p = new HashMap<>();
            p.put("order_id", orderId);
            p.put("product_id", row.get("product_id"));
            p.put("quantity", row.get("quantity"));
            p.put("price_at_purchase", row.get("price"));
            insertItem.execute(p);
            jdbc.update("UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?",
                    row.get("quantity"), row.get("product_id"));
        }
        jdbc.update("DELETE FROM cart WHERE user_id = ?", me);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.ok(Map.of("orderId", orderId.longValue(), "totalAmount", total)));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Void> updateStatus(@PathVariable long id, @Valid @RequestBody UpdateStatusRequest body) {
        currentUser.requireRole("Admin");
        int n = jdbc.update("UPDATE orders SET order_status = ? WHERE order_id = ?", body.status(), id);
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }
}
