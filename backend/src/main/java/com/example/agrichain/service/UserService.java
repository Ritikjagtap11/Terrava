package com.example.agrichain.service;

import com.example.agrichain.dto.AuthResponse;
import com.example.agrichain.dto.LoginRequest;
import com.example.agrichain.dto.RegisterRequest;
import com.example.agrichain.exception.ResourceNotFoundException;
import com.example.agrichain.model.User;
import com.example.agrichain.repository.UserRepository;
import com.example.agrichain.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
private final AuthenticationManager authenticationManager;
private final JwtTokenProvider tokenProvider;

// ✅ Manual Constructor (Replacement for @RequiredArgsConstructor)
public UserService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder,
                   AuthenticationManager authenticationManager,
                   JwtTokenProvider tokenProvider) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.tokenProvider = tokenProvider;
}

@Transactional
public AuthResponse registerUser(RegisterRequest request) {
    if (userRepository.existsByUsername(request.getUsername())) {
        throw new RuntimeException("Username already exists");
    }

    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already exists");
    }

    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(User.UserRole.valueOf(request.getRole()));
    user.setFullName(request.getFullName());
    user.setPhone(request.getPhone());
    user.setAddress(request.getAddress());
    user.setWalletAddress(request.getWalletAddress());

    User savedUser = userRepository.save(user);

    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
            )
    );

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = tokenProvider.generateToken(authentication);

    return new AuthResponse(
        jwt,
        savedUser.getId(),
        savedUser.getUsername(),
        savedUser.getEmail(),
        savedUser.getRole().name(),
        savedUser.getWalletAddress()
);

}

public AuthResponse loginUser(LoginRequest request) {

    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
            )
    );

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = tokenProvider.generateToken(authentication);

    User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    return new AuthResponse(
        jwt,
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        user.getRole().name(),
        user.getWalletAddress()
);

}

public User getCurrentUser() {
    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String username = authentication.getName();

    return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
}

public User getUserById(Long id) {
    return userRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("User not found with id: " + id));
}


}