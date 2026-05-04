package com.foodorder.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.foodorder.model.AppUser;
import com.foodorder.model.Role;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${app.jwt.secret}")
	private String secret;

	@Value("${app.jwt.expiration-ms:86400000}")
	private long expirationMs;

	public String generateToken(AppUser user) {
		Date now = new Date();
		Date exp = new Date(now.getTime() + expirationMs);
		Role role = user.getRole();
		return Jwts.builder()
				.subject(String.valueOf(user.getId()))
				.claim("username", user.getUsername())
				.claim("role", role.name())
				.issuedAt(now)
				.expiration(exp)
				.signWith(signingKey())
				.compact();
	}

	public Long parseUserId(String token) {
		Claims claims = Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token).getPayload();
		return Long.parseLong(claims.getSubject());
	}

	public List<String> getAuthorities(Role role) {
		return List.of("ROLE_" + role.name());
	}

	private SecretKey signingKey() {
		try {
			MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
			byte[] digest = sha256.digest(secret.getBytes(StandardCharsets.UTF_8));
			return Keys.hmacShaKeyFor(digest);
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException(e);
		}
	}
}
