package net.pawshope.kennels;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import net.pawshope.common.ApiException;
import net.pawshope.common.ApiResponse;
import net.pawshope.security.CurrentUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.util.*;

@RestController
@RequestMapping("/api/kennels")
public class KennelController {

    public record KennelRequest(
            @NotBlank @Size(max = 100) String name,
            @Positive Integer capacity,
            @Size(max = 2000) String description
    ) {}

    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert insert;
    private final CurrentUser currentUser;

    public KennelController(DataSource ds, JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
        this.insert = new SimpleJdbcInsert(ds).withTableName("kennels").usingGeneratedKeyColumns("kennel_id");
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        return ApiResponse.ok(jdbc.queryForList("""
                SELECT k.kennel_id, k.name, k.capacity, k.description,
                       (SELECT COUNT(*) FROM pets WHERE kennel_id = k.kennel_id
                          AND status NOT IN ('Adopted','Deceased')) AS current_count
                FROM kennels k ORDER BY k.kennel_id
                """));
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getOne(@PathVariable long id) {
        try {
            return ApiResponse.ok(jdbc.queryForMap("SELECT * FROM kennels WHERE kennel_id = ?", id));
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw ApiException.notFound("Không tìm thấy");
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(@Valid @RequestBody KennelRequest body) {
        currentUser.requireRole("Admin");
        Map<String, Object> p = new HashMap<>();
        p.put("name", body.name());
        p.put("capacity", body.capacity());
        p.put("description", body.description());
        Number id = insert.executeAndReturnKey(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.ok(Map.of("kennelId", id.longValue())));
    }

    @PatchMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable long id, @RequestBody KennelRequest body) {
        currentUser.requireRole("Admin");
        List<String> sets = new ArrayList<>();
        List<Object> args = new ArrayList<>();
        if (body.name() != null) { sets.add("name = ?"); args.add(body.name()); }
        if (body.capacity() != null) { sets.add("capacity = ?"); args.add(body.capacity()); }
        if (body.description() != null) { sets.add("description = ?"); args.add(body.description()); }
        if (sets.isEmpty()) throw ApiException.badRequest("Không có trường nào để cập nhật");
        args.add(id);
        int n = jdbc.update("UPDATE kennels SET " + String.join(", ", sets) + " WHERE kennel_id = ?", args.toArray());
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable long id) {
        currentUser.requireRole("Admin");
        int n = jdbc.update("DELETE FROM kennels WHERE kennel_id = ?", id);
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }
}
