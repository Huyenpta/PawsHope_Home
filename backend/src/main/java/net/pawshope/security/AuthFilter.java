package net.pawshope.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AuthFilter.class);
    private final JwtUtil jwtUtil;
    private final CurrentUser currentUser;

    public AuthFilter(JwtUtil jwtUtil, CurrentUser currentUser) {
        this.jwtUtil = jwtUtil;
        this.currentUser = currentUser;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                AuthPrincipal principal = jwtUtil.verify(token);
                currentUser.set(principal);
            } catch (JwtException ex) {
                log.debug("Invalid JWT: {}", ex.getMessage());
                // Silently ignore - downstream guards will throw 401 if needed.
            }
        }
        chain.doFilter(req, res);
    }
}
