package net.pawshope.rescue;

import net.pawshope.common.ApiException;
import net.pawshope.common.ApiResponse;
import net.pawshope.security.JwtUtil;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.*;

@Service
public class RescueService {

    private static final String SELECT_BASE = """
            SELECT r.report_id, r.user_id, r.reporter_name, r.reporter_phone, r.location_text,
                   r.description, r.image_url, r.status, r.assigned_to,
                   u.full_name AS assigned_user_name,
                   r.tracking_code, r.created_at, r.updated_at
            FROM rescue_reports r
            LEFT JOIN users u ON u.user_id = r.assigned_to
            """;

    private static final RowMapper<RescueDto.RescueReport> MAPPER = (rs, i) -> new RescueDto.RescueReport(
            rs.getLong("report_id"),
            rs.getObject("user_id", Long.class),
            rs.getString("reporter_name"),
            rs.getString("reporter_phone"),
            rs.getString("location_text"),
            rs.getString("description"),
            rs.getString("image_url"),
            rs.getString("status"),
            rs.getObject("assigned_to", Long.class),
            rs.getString("assigned_user_name"),
            rs.getString("tracking_code"),
            rs.getString("created_at"),
            rs.getString("updated_at"));

    private final JdbcTemplate jdbc;
    private final JwtUtil jwtUtil;
    private final SimpleJdbcInsert insertReport;

    public RescueService(DataSource ds, JdbcTemplate jdbc, JwtUtil jwtUtil) {
        this.jdbc = jdbc;
        this.jwtUtil = jwtUtil;
        this.insertReport = new SimpleJdbcInsert(ds)
                .withTableName("rescue_reports")
                .usingGeneratedKeyColumns("report_id");
    }

    public RescueDto.RescueReport create(RescueDto.CreateRequest input, Long userId) {
        String trackingCode = jwtUtil.generateTrackingCode("RP");

        Map<String, Object> params = new HashMap<>();
        params.put("user_id", userId);
        params.put("reporter_name", emptyToNull(input.reporterName()));
        params.put("reporter_phone", input.reporterPhone());
        params.put("location_text", input.locationText());
        params.put("description", emptyToNull(input.description()));
        params.put("image_url", emptyToNull(input.imageUrl()));
        params.put("status", "Pending");
        params.put("tracking_code", trackingCode);

        Number id = insertReport.executeAndReturnKey(params);
        return getById(id.longValue());
    }

    public RescueDto.RescueReport getById(long id) {
        try {
            return jdbc.queryForObject(SELECT_BASE + " WHERE r.report_id = ?", MAPPER, id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw ApiException.notFound("Không tìm thấy ca cứu hộ");
        }
    }

    public RescueDto.TrackResponse trackByCode(String code) {
        RescueDto.RescueReport r;
        try {
            r = jdbc.queryForObject(SELECT_BASE + " WHERE r.tracking_code = ?", MAPPER, code);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw ApiException.notFound("Không tìm thấy mã tra cứu");
        }
        return new RescueDto.TrackResponse(r.trackingCode(), r.status(), r.locationText(), r.createdAt(), r.updatedAt());
    }

    public ListResult list(String status, Long assignedTo, int page, int limit) {
        StringBuilder where = new StringBuilder();
        List<Object> args = new ArrayList<>();
        if (status != null && !status.isBlank()) {
            where.append(where.isEmpty() ? " WHERE " : " AND ").append("r.status = ?");
            args.add(status);
        }
        if (assignedTo != null) {
            where.append(where.isEmpty() ? " WHERE " : " AND ").append("r.assigned_to = ?");
            args.add(assignedTo);
        }

        int offset = (page - 1) * limit;
        Long total = jdbc.queryForObject(
                "SELECT COUNT(*) FROM rescue_reports r" + where, Long.class, args.toArray());

        List<Object> listArgs = new ArrayList<>(args);
        listArgs.add(limit);
        listArgs.add(offset);
        List<RescueDto.RescueReport> items = jdbc.query(
                SELECT_BASE + where + " ORDER BY r.created_at DESC LIMIT ? OFFSET ?",
                MAPPER, listArgs.toArray());

        return new ListResult(items, ApiResponse.Pagination.of(page, limit, total == null ? 0 : total));
    }

    public RescueDto.RescueReport update(long id, RescueDto.UpdateRequest input) {
        List<String> sets = new ArrayList<>();
        List<Object> args = new ArrayList<>();
        if (input.status() != null) { sets.add("status = ?"); args.add(input.status()); }
        if (input.assignedTo() != null) { sets.add("assigned_to = ?"); args.add(input.assignedTo()); }
        if (input.description() != null) { sets.add("description = ?"); args.add(input.description()); }
        if (sets.isEmpty()) throw ApiException.badRequest("Không có trường nào để cập nhật");

        args.add(id);
        jdbc.update("UPDATE rescue_reports SET " + String.join(", ", sets) + " WHERE report_id = ?",
                args.toArray());
        return getById(id);
    }

    public void delete(long id) {
        int affected = jdbc.update("DELETE FROM rescue_reports WHERE report_id = ?", id);
        if (affected == 0) throw ApiException.notFound("Không tìm thấy ca cứu hộ");
    }

    public Map<String, Object> stats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("Pending", 0L);
        stats.put("In Progress", 0L);
        stats.put("Rescued", 0L);
        stats.put("Failed", 0L);
        long total = 0;
        List<Map<String, Object>> rows = jdbc.queryForList(
                "SELECT status, COUNT(*) AS cnt FROM rescue_reports GROUP BY status");
        for (Map<String, Object> row : rows) {
            String key = (String) row.get("status");
            if (key == null) continue;
            long c = ((Number) row.get("cnt")).longValue();
            stats.put(key, c);
            total += c;
        }
        stats.put("total", total);
        return stats;
    }

    private static String emptyToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }

    public record ListResult(List<RescueDto.RescueReport> items, ApiResponse.Pagination pagination) {}
}
