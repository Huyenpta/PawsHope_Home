package net.pawshope.auth;

import jakarta.validation.Valid;
import net.pawshope.common.ApiResponse;
import net.pawshope.security.CurrentUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;
    private final CurrentUser currentUser;

    public AuthController(AuthService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDto.LoginResponse>> register(
            @Valid @RequestBody AuthDto.RegisterRequest body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.register(body)));
    }

    @PostMapping("/login")
    public ApiResponse<AuthDto.LoginResponse> login(@Valid @RequestBody AuthDto.LoginRequest body) {
        return ApiResponse.ok(service.login(body));
    }

    @GetMapping("/me")
    public ApiResponse<AuthDto.UserResponse> me() {
        return ApiResponse.ok(service.me(currentUser.getOrThrow().userId()));
    }
}
