package com.Nhom2.booking.service;

import com.Nhom2.booking.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final String SECRET_KEY =
            "mysecretkeymysecretkeymysecretkey";

    public String generateToken(User username) {

        return Jwts.builder()
                .setSubject(String.valueOf(username))
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + 86400000)
                )
                .signWith(
                        SignatureAlgorithm.HS256,
                        SECRET_KEY
                )
                .compact();
    }
}