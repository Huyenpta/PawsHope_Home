package net.pawshope.volunteers;

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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class VolunteerController {

    public record ApplyRequest(
            @NotBlank @Size(max = 100) String fullName,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 10, max = 20) String phone,
            @Size(max = 2000) String skills,
            @Size(max = 2000) String reasonToJoin) {}

    public record ReviewRequest(@Pattern(regexp = "Approved|Rejected") String status) {}

    public record RegisterShiftRequest(@NotNull @Positive Long shiftId, @NotBlank String workDate) {}

    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert insertApp;
    private final SimpleJdbcInsert insertSched;
    private final CurrentUser currentUser;

    public VolunteerController(DataSource ds, JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
        this.insertApp = new SimpleJdbcInsert(ds).withTableName("volunteer_applications")
                .usingGeneratedKeyColumns("application_id");
        this.insertSched = new SimpleJdbcInsert(ds).withTableName("volunteer_schedules")
                .usingGeneratedKeyColumns("schedule_id");
    }

    @PostMapping("/api/volunteer-applications")
    public ResponseEntity<ApiResponse<Map<String, Object>>> apply(@Valid @RequestBody ApplyRequest body) {
        Map<String, Object> p = new HashMap<>();
        p.put("full_name", body.fullName());
        p.put("email", body.email());
        p.put("phone", body.phone());
        p.put("skills", body.skills());
        p.put("reason_to_join", body.reasonToJoin());
        p.put("status", "Pending");
        Number id = insertApp.executeAndReturnKey(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.ok(Map.of("applicationId", id.longValue())));
    }

    @GetMapping("/api/volunteer-applications")
    public ApiResponse<List<Map<String, Object>>> listApplications() {
        currentUser.requireRole("Admin");
        return ApiResponse.ok(jdbc.queryForList(
                "SELECT * FROM volunteer_applications ORDER BY applied_at DESC"));
    }

    @PatchMapping("/api/volunteer-applications/{id}")
    public ApiResponse<Void> review(@PathVariable long id, @Valid @RequestBody ReviewRequest body) {
        currentUser.requireRole("Admin");
        int n = jdbc.update("UPDATE volunteer_applications SET status = ? WHERE application_id = ?",
                body.status(), id);
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }

    @GetMapping("/api/shifts")
    public ApiResponse<List<Map<String, Object>>> shifts() {
        return ApiResponse.ok(jdbc.queryForList(
                "SELECT shift_id, shift_name, start_time, end_time, crosses_midnight FROM shifts ORDER BY shift_id"));
    }

    @PostMapping("/api/volunteer-schedules")
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerShift(
            @Valid @RequestBody RegisterShiftRequest body) {
        var me = currentUser.getOrThrow();
        if (!me.hasRole("Volunteer", "Admin")) throw ApiException.forbidden("Chỉ Volunteer/Admin được đăng ký");
        Map<String, Object> p = new HashMap<>();
        p.put("user_id", me.userId());
        p.put("shift_id", body.shiftId());
        p.put("work_date", body.workDate());
        try {
            Number id = insertSched.executeAndReturnKey(p);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ApiResponse.ok(Map.of("scheduleId", id.longValue())));
        } catch (org.springframework.dao.DuplicateKeyException e) {
            throw ApiException.conflict("Bạn đã đăng ký ca này rồi");
        }
    }

    @GetMapping("/api/volunteer-schedules/my")
    public ApiResponse<List<Map<String, Object>>> mySchedules() {
        long me = currentUser.getOrThrow().userId();
        return ApiResponse.ok(jdbc.queryForList("""
                SELECT s.schedule_id, s.work_date, s.registered_at,
                       sh.shift_name, sh.start_time, sh.end_time
                FROM volunteer_schedules s JOIN shifts sh ON sh.shift_id = s.shift_id
                WHERE s.user_id = ? AND s.work_date >= CURDATE()
                ORDER BY s.work_date, sh.start_time
                """, me));
    }

    @DeleteMapping("/api/volunteer-schedules/{id}")
    public ApiResponse<Void> cancelSchedule(@PathVariable long id) {
        long me = currentUser.getOrThrow().userId();
        int n = jdbc.update("DELETE FROM volunteer_schedules WHERE schedule_id = ? AND user_id = ?", id, me);
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }
}
