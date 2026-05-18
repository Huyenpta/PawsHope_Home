package net.pawshope.expenses;

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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    public record ExpenseRequest(
            @NotBlank String category,
            @NotNull @Positive BigDecimal amount,
            @Size(max = 2000) String description,
            @NotBlank String expenseDate) {}

    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert insert;
    private final CurrentUser currentUser;

    public ExpenseController(DataSource ds, JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
        this.insert = new SimpleJdbcInsert(ds).withTableName("expenses").usingGeneratedKeyColumns("expense_id");
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        currentUser.requireRole("Admin");
        return ApiResponse.ok(jdbc.queryForList("""
                SELECT e.*, u.full_name AS created_by_name
                FROM expenses e LEFT JOIN users u ON u.user_id = e.created_by
                ORDER BY e.expense_date DESC, e.expense_id DESC
                """));
    }

    @GetMapping("/summary")
    public ApiResponse<Map<String, Object>> summary() {
        currentUser.requireRole("Admin");
        List<Map<String, Object>> byCategory = jdbc.queryForList(
                "SELECT category, SUM(amount) AS total FROM expenses GROUP BY category");
        Map<String, Object> total = jdbc.queryForMap(
                "SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count FROM expenses");
        return ApiResponse.ok(Map.of("byCategory", byCategory, "total", total));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(@Valid @RequestBody ExpenseRequest body) {
        currentUser.requireRole("Admin");
        Map<String, Object> p = new HashMap<>();
        p.put("category", body.category());
        p.put("amount", body.amount());
        p.put("description", body.description());
        p.put("expense_date", body.expenseDate());
        p.put("created_by", currentUser.getOrThrow().userId());
        Number id = insert.executeAndReturnKey(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.ok(Map.of("expenseId", id.longValue())));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable long id) {
        currentUser.requireRole("Admin");
        int n = jdbc.update("DELETE FROM expenses WHERE expense_id = ?", id);
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }
}
