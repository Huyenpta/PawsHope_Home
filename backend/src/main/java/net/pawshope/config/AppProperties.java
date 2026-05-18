package net.pawshope.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Cors cors, Jwt jwt, Upload upload) {

    /** Ít nhất một origin khớp với URL frontend (vite), ví dụ localhost vs 127.0.0.1. */
    public record Cors(List<String> allowedOrigins) {
        public Cors {
            allowedOrigins = allowedOrigins == null ? List.of() : List.copyOf(allowedOrigins);
        }
    }

    public record Jwt(String secret, int expiresInDays) {}

    public record Upload(String dir, int maxSizeMb) {}
}
