package net.pawshope.pets;

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
import java.util.*;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    public record PetRequest(
            @Size(max = 100) String name,
            String species,
            @Size(max = 100) String breed,
            @Min(0) @Max(360) Integer ageMonths,
            String status,
            @Size(max = 255) String imageUrl,
            Long kennelId,
            Long fromReportId,
            String intakeDate,
            @Size(max = 2000) String description
    ) {}

    private static final Map<String, String> FIELD_MAP = Map.ofEntries(
            Map.entry("name", "name"),
            Map.entry("species", "species"),
            Map.entry("breed", "breed"),
            Map.entry("ageMonths", "age_months"),
            Map.entry("status", "status"),
            Map.entry("imageUrl", "image_url"),
            Map.entry("kennelId", "kennel_id"),
            Map.entry("fromReportId", "from_report_id"),
            Map.entry("intakeDate", "intake_date"),
            Map.entry("description", "description"));

    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert insert;
    private final CurrentUser currentUser;

    public PetController(DataSource ds, JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
        this.insert = new SimpleJdbcInsert(ds).withTableName("pets").usingGeneratedKeyColumns("pet_id");
    }

    @GetMapping
    public ApiResponse<Void> list(
            @RequestParam(required = false) String species,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long kennelId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        StringBuilder where = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (species != null) { where.append(where.isEmpty() ? " WHERE " : " AND ").append("species = ?"); args.add(species); }
        if (status != null) { where.append(where.isEmpty() ? " WHERE " : " AND ").append("status = ?"); args.add(status); }
        if (kennelId != null) { where.append(where.isEmpty() ? " WHERE " : " AND ").append("kennel_id = ?"); args.add(kennelId); }

        int offset = (page - 1) * limit;
        Long total = jdbc.queryForObject("SELECT COUNT(*) FROM pets" + where, Long.class, args.toArray());

        List<Object> listArgs = new ArrayList<>(args);
        listArgs.add(limit);
        listArgs.add(offset);
        var items = jdbc.queryForList(
                "SELECT * FROM pets" + where + " ORDER BY pet_id DESC LIMIT ? OFFSET ?", listArgs.toArray());

        return ApiResponse.paginated(items, ApiResponse.Pagination.of(page, limit, total == null ? 0 : total));
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getOne(@PathVariable long id) {
        try {
            return ApiResponse.ok(jdbc.queryForMap("""
                    SELECT p.*, k.name AS kennel_name
                    FROM pets p LEFT JOIN kennels k ON k.kennel_id = p.kennel_id
                    WHERE p.pet_id = ?
                    """, id));
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw ApiException.notFound("Không tìm thấy");
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(@Valid @RequestBody PetRequest body) {
        currentUser.requireRole("Admin", "Volunteer");
        Map<String, Object> p = new HashMap<>();
        p.put("name", body.name());
        p.put("species", body.species());
        p.put("breed", body.breed());
        p.put("age_months", body.ageMonths());
        p.put("status", body.status() == null ? "New" : body.status());
        p.put("image_url", body.imageUrl());
        p.put("kennel_id", body.kennelId());
        p.put("from_report_id", body.fromReportId());
        p.put("intake_date", body.intakeDate());
        p.put("description", body.description());
        Number id = insert.executeAndReturnKey(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.ok(Map.of("petId", id.longValue())));
    }

    @PatchMapping("/{id}")
    public ApiResponse<Void> update(@PathVariable long id, @RequestBody Map<String, Object> body) {
        currentUser.requireRole("Admin", "Volunteer");
        List<String> sets = new ArrayList<>();
        List<Object> args = new ArrayList<>();
        for (var e : FIELD_MAP.entrySet()) {
            if (body.containsKey(e.getKey())) { sets.add(e.getValue() + " = ?"); args.add(body.get(e.getKey())); }
        }
        if (sets.isEmpty()) throw ApiException.badRequest("Không có trường nào để cập nhật");
        args.add(id);
        int n = jdbc.update("UPDATE pets SET " + String.join(", ", sets) + " WHERE pet_id = ?", args.toArray());
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable long id) {
        currentUser.requireRole("Admin");
        int n = jdbc.update("DELETE FROM pets WHERE pet_id = ?", id);
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }
}
