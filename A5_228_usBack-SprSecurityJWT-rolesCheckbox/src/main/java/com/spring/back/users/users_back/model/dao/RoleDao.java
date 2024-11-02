package com.spring.back.users.users_back.model.dao;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.spring.back.users.users_back.model.entity.Role;

@Repository
public interface RoleDao extends CrudRepository<Role, Long>{

    Optional<Role>findByName(String name);

}
