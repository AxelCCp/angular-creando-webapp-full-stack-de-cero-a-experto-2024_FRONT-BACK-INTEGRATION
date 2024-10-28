package com.spring.back.users.users_back.model.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;

import com.spring.back.users.users_back.model.entity.User;
import com.spring.back.users.users_back.model.request.UserRequest;

public interface UserService {

    List<User>findAll();

    Page<User>findAll(Pageable pageable);

    Optional<User>findById(@NonNull Long id);
    User save(User user);
    void deleteById(Long id);


    Optional<User>update(UserRequest user, Long id);
    

}
