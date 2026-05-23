package net.pawshope.rescue;

import jakarta.validation.Valid;
import net.pawshope.common.ApiResponse;
import net.pawshope.security.CurrentUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/rescue-reports")
public class RescueController {

    private final RescueService service;
    private final CurrentUser currentUser;

    public RescueController(RescueService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RescueDto.RescueReport>> create(
            @Valid @RequestBody RescueDto.CreateRequest body) {
        Long userId = currentUser.isAuthenticated() ? currentUser.getOrNull().userId() : null;
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.create(body, userId)));
    }

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> stats() {
        currentUser.requireRole("Admin", "Volunteer");
        return ApiResponse.ok(service.stats());
    }

    @GetMapping("/public-stats")
    public ApiResponse<Map<String, Object>> publicStats() {
        return ApiResponse.ok(service.stats());
    }

    @GetMapping("/track/{code}")
    public ApiResponse<RescueDto.TrackResponse> track(@PathVariable String code) {
        return ApiResponse.ok(service.trackByCode(code));
    }

    @GetMapping
    public ApiResponse<Void> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        currentUser.requireRole("Admin", "Volunteer");
        RescueService.ListResult result = service.list(status, assignedTo, page, Math.min(limit, 100));
        return ApiResponse.paginated(result.items(), result.pagination());
    }

    @GetMapping("/{id}")
    public ApiResponse<RescueDto.RescueReport> getOne(@PathVariable long id) {
        currentUser.requireRole("Admin", "Volunteer");
        return ApiResponse.ok(service.getById(id));
    }

    @PatchMapping("/{id}")
    public ApiResponse<RescueDto.RescueReport> update(
            @PathVariable long id, @Valid @RequestBody RescueDto.UpdateRequest body) {
        currentUser.requireRole("Admin", "Volunteer");
        return ApiResponse.ok(service.update(id, body));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable long id) {
        currentUser.requireRole("Admin");
        service.delete(id);
        return ApiResponse.message("Đã xoá");
    }
}
