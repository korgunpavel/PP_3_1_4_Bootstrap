package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> loadUserByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username));
    }

    public boolean isUsernameUnique(String username, Long id) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return true;
        }
        return user.getId().equals(id);
    }
}
