package com.spring.back.users.users_back.model.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.back.users.users_back.model.dao.UserDao;
import com.spring.back.users.users_back.model.entity.User;

@Service
public class UserServiceImpl implements UserService{

    @Autowired 
    private UserDao userDao;

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
        return this.userDao.save(user);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        this.userDao.deleteById(id);
    }

}
