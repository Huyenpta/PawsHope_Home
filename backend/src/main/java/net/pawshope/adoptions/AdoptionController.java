package net.pawshope.adoptions;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
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
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/adoptions")
public class AdoptionController {

    public record CreateRequest(@NotNull @Positive Long petId,
                                String applyDate,
                                @Size(max = 2000) String notes) {}

    public record UpdateRequest(
            @Pattern(regexp = "Pending|Interviewing|Approved|Rejected") String status,
            @Size(max = 2000) String notes) {}

    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert insert;
    private final CurrentUser currentUser;

    public AdoptionController(DataSource ds, JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
        this.insert = new SimpleJdbcInsert(ds).withTableName("adoptions").usingGeneratedKeyColumns("adoption_id");
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        currentUser.requireRole("Admin", "Volunteer");
        return ApiResponse.ok(jdbc.queryForList("""
                SELECT a.*, p.name AS pet_name, u.full_name AS user_name
                FROM adoptions a JOIN pets p ON p.pet_id = a.pet_id
                JOIN users u ON u.user_id = a.user_id
                ORDER BY a.adoption_id DESC
                """));
    }

    @GetMapping("/my")
    public ApiResponse<List<Map<String, Object>>> my() {
        long me = currentUser.getOrThrow().userId();
        return ApiResponse.ok(jdbc.queryForList("""
                SELECT a.*, p.name AS pet_name, p.image_url AS pet_image
                FROM adoptions a JOIN pets p ON p.pet_id = a.pet_id
                WHERE a.user_id = ? ORDER BY a.adoption_id DESC
                """, me));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> create(@Valid @RequestBody CreateRequest body) {
        long me = currentUser.getOrThrow().userId();
        List<String> petStatus = jdbc.queryForList("SELECT status FROM pets WHERE pet_id = ?", String.class, body.petId());
        if (petStatus.isEmpty()) throw ApiException.notFound("Pet không tồn tại");
        if ("Adopted".equals(petStatus.get(0))) throw ApiException.conflict("Pet đã được nhận nuôi");

        Map<String, Object> p = new HashMap<>();
        p.put("pet_id", body.petId());
        p.put("user_id", me);
        p.put("apply_date", body.applyDate() == null ? LocalDate.now().toString() : body.applyDate());
        p.put("status", "Pending");
        p.put("notes", body.notes());
        Number id = insert.executeAndReturnKey(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.ok(Map.of("adoptionId", id.longValue())));
    }

    @PatchMapping("/{id}")
    @Transactional
    public ApiResponse<Void> review(@PathVariable long id, @Valid @RequestBody UpdateRequest body) {
        currentUser.requireRole("Admin", "Volunteer");
        long processedBy = currentUser.getOrThrow().userId();

        List<Long> petIds = jdbc.queryForList("SELECT pet_id FROM adoptions WHERE adoption_id = ?", Long.class, id);
        if (petIds.isEmpty()) throw ApiException.notFound("Không tìm thấy đơn");
        long petId = petIds.get(0);

        jdbc.update("UPDATE adoptions SET status = ?, notes = COALESCE(?, notes), processed_by = ? WHERE adoption_id = ?",
                body.status(), body.notes(), processedBy, id);

        if ("Approved".equals(body.status())) {
            jdbc.update("UPDATE pets SET status = 'Adopted' WHERE pet_id = ?", petId);
            jdbc.update("""
                    UPDATE adoptions SET status = 'Rejected'
                    WHERE pet_id = ? AND adoption_id != ? AND status NOT IN ('Approved','Rejected')
                    """, petId, id);
        }
        return ApiResponse.ok(null);
    }
}
