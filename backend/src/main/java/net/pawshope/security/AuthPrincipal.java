package net.pawshope.security;

public record AuthPrincipal(long userId, String username, String role) {

    public boolean hasRole(String... roles) {
        for (String r : roles) {
            if (r.equalsIgnoreCase(role)) return true;
        }
        return false;
    }
}
