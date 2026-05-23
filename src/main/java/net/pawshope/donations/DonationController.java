package net.pawshope.donations;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import net.pawshope.common.ApiResponse;
import net.pawshope.security.CurrentUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    public record MoneyRequest(
            @Size(max = 100) String donorName,
            @NotNull @Positive BigDecimal amount,
            @Size(max = 50) String method,
            @Size(max = 255) String purpose) {}

    public record ItemRequest(
            @Size(max = 100) String donorName,
            @NotBlank @Size(max = 150) String itemName,
            @NotBlank String category,
            @Size(max = 50) String quantity) {}

    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert insertMoney;
    private final SimpleJdbcInsert insertItem;
    private final CurrentUser currentUser;

    public DonationController(DataSource ds, JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
        this.insertMoney = new SimpleJdbcInsert(ds).withTableName("donations").usingGeneratedKeyColumns("donation_id");
        this.insertItem = new SimpleJdbcInsert(ds).withTableName("item_donations").usingGeneratedKeyColumns("item_donation_id");
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        return ApiResponse.ok(jdbc.queryForList("""
                SELECT donation_id, donor_name_manual, amount, method, purpose, received_at
                FROM donations ORDER BY received_at DESC LIMIT 100
                """));
    }

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> stats() {
        Map<String, Object> row = jdbc.queryForMap(
                "SELECT COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total FROM donations");
        return ApiResponse.ok(row);
    }

    @PostMapping("/money")
    public ResponseEntity<ApiResponse<Map<String, Object>>> donateMoney(@Valid @RequestBody MoneyRequest body) {
        Long userId = currentUser.isAuthenticated() ? currentUser.getOrNull().userId() : null;
        Map<String, Object> p = new HashMap<>();
        p.put("user_id", userId);
        p.put("donor_name_manual", body.donorName() == null ? "Guest" : body.donorName());
        p.put("amount", body.amount());
        p.put("method", body.method());
        p.put("purpose", body.purpose());
        Number id = insertMoney.executeAndReturnKey(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.ok(Map.of("donationId", id.longValue())));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<Map<String, Object>>> donateItem(@Valid @RequestBody ItemRequest body) {
        Long userId = currentUser.isAuthenticated() ? currentUser.getOrNull().userId() : null;
        Map<String, Object> p = new HashMap<>();
        p.put("user_id", userId);
        p.put("donor_name_manual", body.donorName());
        p.put("item_name", body.itemName());
        p.put("category", body.category());
        p.put("quantity", body.quantity());
        p.put("status", "Pending");
        Number id = insertItem.executeAndReturnKey(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.ok(Map.of("itemDonationId", id.longValue())));
    }

    @GetMapping("/items")
    public ApiResponse<List<Map<String, Object>>> listItems() {
        currentUser.requireRole("Admin", "Volunteer");
        return ApiResponse.ok(jdbc.queryForList(
                "SELECT * FROM item_donations ORDER BY received_at DESC"));
    }
}
