package net.pawshope.common;

import at.favre.lib.crypto.bcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * Tự động chạy schema.sql + insert sample data khi khởi động nếu env
 * <code>APP_INIT_DB=true</code>.
 *
 * Có thể chạy thủ công qua endpoint debug nếu cần, nhưng mặc định off để
 * tránh xóa nhầm DB.
 */
@Component
public class DbInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DbInitializer.class);
    private final JdbcTemplate jdbc;
    private final boolean enabled;

    public DbInitializer(JdbcTemplate jdbc, @Value("${APP_INIT_DB:false}") boolean enabled) {
        this.jdbc = jdbc;
        this.enabled = enabled;
    }

    @Override
    public void run(String... args) throws Exception {
        boolean fromArgs = false;
        for (String a : args) if ("--init-db".equals(a)) fromArgs = true;
        if (!enabled && !fromArgs) return;

        log.info("[DbInitializer] APP_INIT_DB=true. Running schema.sql + seed data...");
        runSqlFile("db/schema.sql");
        seedSampleData();
        seedDefaultUsers();
        log.info("[DbInitializer] Done. Set APP_INIT_DB=false to prevent re-init.");
    }

    private void runSqlFile(String classpath) throws Exception {
        ClassPathResource res = new ClassPathResource(classpath);
        String sql = StreamUtils.copyToString(res.getInputStream(), StandardCharsets.UTF_8);
        // Pass entire script with allowMultiQueries=true datasource URL
        jdbc.execute(sql);
    }

    private void seedSampleData() {
        jdbc.update("""
                INSERT INTO organization_info (id, org_name, hotline, email, address, mission_statement)
                VALUES (1, ?, ?, ?, ?, ?)
                """,
                "PawsHope - Sân Nhà Nhiều Chó", "0988015445", "contact@pawshope.net",
                "Hà Nội, Việt Nam",
                "Cứu hộ khẩn cấp - Chăm sóc y tế - Tìm mái ấm trọn đời cho chó mèo bị bỏ rơi.");

        jdbc.batchUpdate("INSERT INTO adoption_guidelines (title, content, priority) VALUES (?, ?, ?)",
                java.util.List.of(
                        new Object[]{"Điều kiện nhận nuôi", "Người nhận nuôi phải từ 18 tuổi, có nơi ở ổn định.", 1},
                        new Object[]{"Quy trình duyệt đơn", "Sau khi điền đơn, đội ngũ sẽ phỏng vấn online và có thể yêu cầu thăm nhà.", 2},
                        new Object[]{"Phí nhận nuôi", "Không thu phí, khuyến khích đóng góp tự nguyện.", 3}));

        jdbc.batchUpdate("INSERT INTO kennels (name, capacity, description) VALUES (?, ?, ?)",
                java.util.List.of(
                        new Object[]{"Khu Cún A", 20, "Khu chó trưởng thành, có sân chơi rộng."},
                        new Object[]{"Khu Miu B", 30, "Khu mèo, lồng riêng và khu vui chơi."},
                        new Object[]{"Khu cách ly", 10, "Bé mới về, cần kiểm tra y tế."}));

        jdbc.batchUpdate(
                "INSERT INTO products (product_name, description, price, stock_quantity) VALUES (?, ?, ?, ?)",
                java.util.List.of(
                        new Object[]{"Áo thun PawsHope", "Áo thun cotton in logo, gây quỹ cứu hộ", 199000, 50},
                        new Object[]{"Móc khóa hình chó", "Móc khóa kim loại, dây da nâu", 35000, 100},
                        new Object[]{"Bộ bưu thiếp PawsHope", "Bộ 6 bưu thiếp các bé đã được cứu hộ", 50000, 80},
                        new Object[]{"Mũ lưỡi trai PawsHope", "Snapback in logo, cotton", 150000, 30}));

        jdbc.batchUpdate(
                "INSERT INTO rescue_reports (reporter_name, reporter_phone, location_text, description, status, tracking_code) VALUES (?, ?, ?, ?, ?, ?)",
                java.util.List.of(
                        new Object[]{"Nguyễn Văn An", "0901234567", "Đầu hẻm 234 Lê Văn Sỹ, Q.3, TP.HCM",
                                "Bé mèo con bị thương ở chân, lông xám trắng.", "Pending", "RP-2026-0001"},
                        new Object[]{"Phạm Thị Lan", "0987654321", "Công viên Tao Đàn, Q.1, TP.HCM",
                                "Một bé chó vàng nhỏ lang thang, đói khát.", "In Progress", "RP-2026-0002"},
                        new Object[]{null, "0911222333", "Gầm cầu Sài Gòn, P. Thảo Điền, Q.2",
                                "Đàn 4 bé mèo sơ sinh bị bỏ rơi trong thùng giấy.", "Rescued", "RP-2026-0003"}));
    }

    private void seedDefaultUsers() {
        Map<String, String> creds = Map.of(
                "admin", "admin123",
                "volunteer1", "volunteer123",
                "user1", "user123");

        record SeedUser(String username, String role, String fullName, String email, String phone) {}
        java.util.List<SeedUser> users = java.util.List.of(
                new SeedUser("admin", "Admin", "Quản trị PawsHope", "admin@pawshope.net", "0988015445"),
                new SeedUser("volunteer1", "Volunteer", "TNV Trần Bình", "volunteer1@pawshope.net", "0901111222"),
                new SeedUser("user1", "User", "Nguyễn Văn A", "user1@example.com", "0903333444"));

        for (SeedUser u : users) {
            String hash = BCrypt.withDefaults().hashToString(10, creds.get(u.username()).toCharArray());
            jdbc.update(
                    "INSERT INTO users (username, password_hash, full_name, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
                    u.username(), hash, u.fullName(), u.email(), u.phone(), u.role());
        }

        log.info("[DbInitializer] Default accounts: admin/admin123, volunteer1/volunteer123, user1/user123");
    }
}
