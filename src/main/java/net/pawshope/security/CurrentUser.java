package net.pawshope.security;

import net.pawshope.common.ApiException;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

/**
 * Holder bind theo request. Được {@link AuthFilter} set, rồi inject vào controller / service.
 */
@Component
@RequestScope
public class CurrentUser {
    private AuthPrincipal principal;

    public void set(AuthPrincipal principal) {
        this.principal = principal;
    }

    public AuthPrincipal getOrNull() {
        return principal;
    }

    public AuthPrincipal getOrThrow() {
        if (principal == null) throw ApiException.unauthorized("Missing or invalid token");
        return principal;
    }

    public boolean isAuthenticated() {
        return principal != null;
    }

    public void requireRole(String... roles) {
        AuthPrincipal me = getOrThrow();
        if (!me.hasRole(roles)) {
            throw ApiException.forbidden("Requires role: " + String.join(" or ", roles));
        }
    }
}
