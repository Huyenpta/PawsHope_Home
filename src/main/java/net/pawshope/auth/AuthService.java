package net.pawshope.auth;

import net.pawshope.common.ApiException;
import net.pawshope.common.PasswordUtil;
import net.pawshope.security.JwtUtil;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    private final JdbcTemplate jdbc;
    private final PasswordUtil passwordUtil;
    private final JwtUtil jwtUtil;
    private final SimpleJdbcInsert insertUser;

    public AuthService(DataSource ds, JdbcTemplate jdbc, PasswordUtil passwordUtil, JwtUtil jwtUtil) {
        this.jdbc = jdbc;
        this.passwordUtil = passwordUtil;
        this.jwtUtil = jwtUtil;
        this.insertUser = new SimpleJdbcInsert(ds)
                .withTableName("users")
                .usingGeneratedKeyColumns("user_id");
    }

    private static final RowMapper<AuthDto.UserResponse> USER_MAPPER = (rs, i) -> new AuthDto.UserResponse(
            rs.getLong("user_id"),
            rs.getString("username"),
            rs.getString("full_name"),
            rs.getString("email"),
            rs.getString("phone"),
            rs.getString("role"),
            rs.getInt("status"),
            rs.getString("created_at"));

    public AuthDto.LoginResponse register(AuthDto.RegisterRequest input) {
        List<Long> dupes = jdbc.queryForList(
                "SELECT user_id FROM users WHERE username = ? OR email = ? LIMIT 1",
                Long.class, input.username(), input.email());
        if (!dupes.isEmpty()) {
            throw ApiException.conflict("Username hoặc email đã tồn tại");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("username", input.username());
        params.put("password_hash", passwordUtil.hash(input.password()));
        params.put("full_name", input.fullName());
        params.put("email", input.email());
        params.put("phone", input.phone());
        params.put("role", "User");
        params.put("status", 1);

        Number userId = insertUser.executeAndReturnKey(params);
        AuthDto.UserResponse user = jdbc.queryForObject(
                "SELECT * FROM users WHERE user_id = ?", USER_MAPPER, userId.longValue());

        String token = jwtUtil.sign(user.userId(), user.username(), user.role());
        return new AuthDto.LoginResponse(user, token);
    }

    public AuthDto.LoginResponse login(AuthDto.LoginRequest input) {
        Map<String, Object> row;
        try {
            row = jdbc.queryForMap("SELECT * FROM users WHERE username = ? LIMIT 1", input.username());
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw ApiException.unauthorized("Sai tài khoản hoặc mật khẩu");
        }

        if (((Number) row.get("status")).intValue() != 1) {
            throw ApiException.forbidden("Tài khoản đã bị khoá");
        }
        if (!passwordUtil.verify(input.password(), (String) row.get("password_hash"))) {
            throw ApiException.unauthorized("Sai tài khoản hoặc mật khẩu");
        }

        AuthDto.UserResponse user = new AuthDto.UserResponse(
                ((Number) row.get("user_id")).longValue(),
                (String) row.get("username"),
                (String) row.get("full_name"),
                (String) row.get("email"),
                (String) row.get("phone"),
                (String) row.get("role"),
                ((Number) row.get("status")).intValue(),
                String.valueOf(row.get("created_at")));

        String token = jwtUtil.sign(user.userId(), user.username(), user.role());
        return new AuthDto.LoginResponse(user, token);
    }

    public AuthDto.UserResponse me(long userId) {
        try {
            return jdbc.queryForObject("SELECT * FROM users WHERE user_id = ?", USER_MAPPER, userId);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw ApiException.notFound("User không tồn tại");
        }
    }
}
