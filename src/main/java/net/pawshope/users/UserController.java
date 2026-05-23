package net.pawshope.users;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import net.pawshope.common.ApiException;
import net.pawshope.common.ApiResponse;
import net.pawshope.security.CurrentUser;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final JdbcTemplate jdbc;
    private final CurrentUser currentUser;

    public UserController(JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
    }

    public record UpdateUserRequest(
            @Size(min = 2, max = 100) String fullName,
            @Email String email,
            @Size(min = 10, max = 20) String phone,
            String role,
            Integer status
    ) {}

    private static final String SELECT_COLS = "user_id, username, full_name, email, phone, role, status, created_at";

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        currentUser.requireRole("Admin");
        return ApiResponse.ok(jdbc.queryForList(
                "SELECT " + SELECT_COLS + " FROM users ORDER BY created_at DESC"));
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getOne(@PathVariable long id) {
        var me = currentUser.getOrThrow();
        if (!me.hasRole("Admin") && me.userId() != id) throw ApiException.forbidden("Forbidden");
        try {
            return ApiResponse.ok(jdbc.queryForMap(
                    "SELECT " + SELECT_COLS + " FROM users WHERE user_id = ?", id));
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw ApiException.notFound("Không tìm thấy user");
        }
    }

    @PatchMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable long id, @Valid @RequestBody UpdateUserRequest body) {
        currentUser.requireRole("Admin");
        List<String> sets = new ArrayList<>();
        List<Object> args = new ArrayList<>();
        if (body.fullName() != null) { sets.add("full_name = ?"); args.add(body.fullName()); }
        if (body.email() != null) { sets.add("email = ?"); args.add(body.email()); }
        if (body.phone() != null) { sets.add("phone = ?"); args.add(body.phone()); }
        if (body.role() != null) { sets.add("role = ?"); args.add(body.role()); }
        if (body.status() != null) { sets.add("status = ?"); args.add(body.status()); }
        if (sets.isEmpty()) throw ApiException.badRequest("Không có trường nào để cập nhật");

        args.add(id);
        int n = jdbc.update("UPDATE users SET " + String.join(", ", sets) + " WHERE user_id = ?", args.toArray());
        if (n == 0) throw ApiException.notFound("Không tìm thấy user");
        return ApiResponse.message("Đã cập nhật");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable long id) {
        currentUser.requireRole("Admin");
        int n = jdbc.update("DELETE FROM users WHERE user_id = ?", id);
        if (n == 0) throw ApiException.notFound("Không tìm thấy user");
        return ApiResponse.message("Đã xoá");
    }
}
