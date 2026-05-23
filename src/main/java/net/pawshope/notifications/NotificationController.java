package net.pawshope.notifications;

import net.pawshope.common.ApiException;
import net.pawshope.common.ApiResponse;
import net.pawshope.security.CurrentUser;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final JdbcTemplate jdbc;
    private final CurrentUser currentUser;

    public NotificationController(JdbcTemplate jdbc, CurrentUser currentUser) {
        this.jdbc = jdbc;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> list() {
        long me = currentUser.getOrThrow().userId();
        return ApiResponse.ok(jdbc.queryForList(
                "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50", me));
    }

    @GetMapping("/unread-count")
    public ApiResponse<Map<String, Object>> unreadCount() {
        long me = currentUser.getOrThrow().userId();
        Long n = jdbc.queryForObject(
                "SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = FALSE", Long.class, me);
        return ApiResponse.ok(Map.of("count", n == null ? 0 : n));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<Void> markRead(@PathVariable long id) {
        long me = currentUser.getOrThrow().userId();
        int n = jdbc.update(
                "UPDATE notifications SET is_read = TRUE WHERE noti_id = ? AND user_id = ?", id, me);
        if (n == 0) throw ApiException.notFound("Không tìm thấy");
        return ApiResponse.ok(null);
    }

    @PatchMapping("/read-all")
    public ApiResponse<Void> markAllRead() {
        long me = currentUser.getOrThrow().userId();
        jdbc.update("UPDATE notifications SET is_read = TRUE WHERE user_id = ?", me);
        return ApiResponse.message("Đã đánh dấu tất cả là đã đọc");
    }
}
