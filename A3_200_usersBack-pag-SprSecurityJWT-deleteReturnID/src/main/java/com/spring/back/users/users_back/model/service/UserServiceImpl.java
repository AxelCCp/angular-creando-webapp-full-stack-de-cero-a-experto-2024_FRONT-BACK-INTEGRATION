package com.spring.back.users.users_back.model.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.back.users.users_back.model.dao.RoleDao;
import com.spring.back.users.users_back.model.dao.UserDao;
import com.spring.back.users.users_back.model.entity.Role;
import com.spring.back.users.users_back.model.entity.User;
import com.spring.back.users.users_back.model.request.IUser;
import com.spring.back.users.users_back.model.request.UserRequest;

@Service
public class UserServiceImpl implements UserService{

    @Autowired 
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private RoleDao roleDao;

    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return (List<User>) this.userDao.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<User> findAll(Pageable pageable) {
        return this.userDao.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findById(@NonNull Long id) {
        return this.userDao.findById(id);
    }


    @Override
    @Transactional
    public User save(User user) {
        
        user.setRoles(this.getRolesUser(user));
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return this.userDao.save(user);
    
    }

   
    @Override
    @Transactional
    public Long deleteById(Long id) {
        this.userDao.deleteById(id);
        return id;
    }


    @Override
    @Transactional
    public Optional<User> update(UserRequest user, Long id) {
      
        Optional<User>userOptional = this.userDao.findById(id);

        if(userOptional.isPresent()){
            User userdb = userOptional.get();
            userdb.setName(user.getName());
            userdb.setLastname(user.getLastname());
            userdb.setEmail(user.getEmail());
            userdb.setUsername(user.getUsername());

            userdb.setRoles(this.getRolesUser(user));

            return Optional.of(this.userDao.save(userdb));
        }
        return Optional.empty();
    }


    private List<Role> getRolesUser(IUser user) {
        List<Role>roles = new ArrayList<>();
        Optional<Role>opRoleUser = this.roleDao.findByName("ROLE_USER");

        opRoleUser.ifPresent(role -> roles.add(role));

        if (user.isAdmin()) {

            Optional<Role>opRoleAdmin = this.roleDao.findByName("ROLE_ADMIN");
            opRoleAdmin.ifPresent(role -> roles.add(role));

        }
        return roles;
    }

}
