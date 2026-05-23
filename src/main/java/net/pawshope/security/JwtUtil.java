package net.pawshope.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import net.pawshope.config.AppProperties;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expiresMillis;

    public JwtUtil(AppProperties props) {
        this.key = Keys.hmacShaKeyFor(props.jwt().secret().getBytes(StandardCharsets.UTF_8));
        this.expiresMillis = props.jwt().expiresInDays() * 24L * 60L * 60L * 1000L;
    }

    public String sign(long userId, String username, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expiresMillis)))
                .signWith(key)
                .compact();
    }

    public AuthPrincipal verify(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return new AuthPrincipal(
                Long.parseLong(claims.getSubject()),
                claims.get("username", String.class),
                claims.get("role", String.class));
    }

    public String generateTrackingCode(String prefix) {
        int year = java.time.LocalDate.now().getYear();
        int rand = 1000 + new java.security.SecureRandom().nextInt(9000);
        return prefix + "-" + year + "-" + rand;
    }
}
