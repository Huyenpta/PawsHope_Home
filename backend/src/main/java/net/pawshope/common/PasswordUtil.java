package net.pawshope.common;

import at.favre.lib.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class PasswordUtil {
    private static final int COST = 10;

    public String hash(String plain) {
        return BCrypt.withDefaults().hashToString(COST, plain.toCharArray());
    }

    public boolean verify(String plain, String hash) {
        return BCrypt.verifyer().verify(plain.toCharArray(), hash).verified;
    }
}
