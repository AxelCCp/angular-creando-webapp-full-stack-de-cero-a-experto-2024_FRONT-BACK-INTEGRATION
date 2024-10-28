package com.spring.back.users.users_back.model.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import com.spring.back.users.users_back.model.entity.User;


public interface UserDao extends CrudRepository<User, Long>{

    Page<User>findAll(Pageable pageable);

}
