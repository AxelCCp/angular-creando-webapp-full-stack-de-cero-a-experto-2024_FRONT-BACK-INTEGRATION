package com.spring.back.users.users_back.model.service;

import java.util.List;
import java.util.Optional;

import org.springframework.lang.NonNull;

import com.spring.back.users.users_back.model.entity.User;

public interface UserService {

    List<User>findAll();
    Optional<User>findById(@NonNull Long id);
    User save(User user);
    void deleteById(Long id);

}
