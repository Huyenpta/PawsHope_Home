package net.pawshope.cart;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import net.pawshope.common.ApiException;
import net.pawshope.common.ApiResponse;
import net.pawshope.security.CurrentUser;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    public record AddRequest(@NotNull @Positive Long productId, @NotNull @Positive Integer quantity) {}
    public record UpdateRequest(@NotNull @Positive Integer quantity) {}

    private final JdbcTemplate jdbc;
    private final CurrentUser currentUser;

    public CartController(JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ApiResponse<Map<String, Object>> list() {
        long me = currentUser.getOrThrow().userId();
        List<Map<String, Object>> items = jdbc.queryForList("""
                SELECT c.cart_id, c.product_id, c.quantity, c.created_at,
                       p.product_name, p.price, p.image_url, p.stock_quantity
                FROM cart c JOIN products p ON p.product_id = c.product_id
                WHERE c.user_id = ? ORDER BY c.created_at DESC
                """, me);
        BigDecimal total = items.stream()
                .map(r -> ((BigDecimal) r.get("price")).multiply(BigDecimal.valueOf(((Number) r.get("quantity")).intValue())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return ApiResponse.ok(Map.of("items", items, "totalAmount", total));
    }

    @PostMapping
    public ApiResponse<Void> add(@Valid @RequestBody AddRequest body) {
        long me = currentUser.getOrThrow().userId();
        jdbc.update("""
                INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
                """, me, body.productId(), body.quantity());
        return ApiResponse.ok(null);
    }

    @PatchMapping("/{cartId}")
    public ApiResponse<Void> update(@PathVariable long cartId, @Valid @RequestBody UpdateRequest body) {
        long me = currentUser.getOrThrow().userId();
        int n = jdbc.update("UPDATE cart SET quantity = ? WHERE cart_id = ? AND user_id = ?",
                body.quantity(), cartId, me);
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{cartId}")
    public ApiResponse<Void> remove(@PathVariable long cartId) {
        long me = currentUser.getOrThrow().userId();
        int n = jdbc.update("DELETE FROM cart WHERE cart_id = ? AND user_id = ?", cartId, me);
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }

    @DeleteMapping
    public ApiResponse<Void> clear() {
        long me = currentUser.getOrThrow().userId();
        jdbc.update("DELETE FROM cart WHERE user_id = ?", me);
        return ApiResponse.message("Đã xoá toàn bộ giỏ");
    }
}
