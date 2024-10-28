package com.spring.back.users.users_back.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.back.users.users_back.model.entity.User;
import com.spring.back.users.users_back.model.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = {"http://localhost:4200"})
@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    private UserService userService;


    @GetMapping
    public List<User>list() {
        return userService.findAll();
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> show(@PathVariable Long id) {
        Optional<User> opUser = userService.findById(id);
        if(opUser.isPresent()){
            //return ResponseEntity.ok(opUser.orElseThrow());
            return ResponseEntity.status(HttpStatus.OK).body(opUser.orElseThrow());
        }
        return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "user not found with the id: " + id));
    }


    @PostMapping
    public ResponseEntity<?>create(@Valid @RequestBody User user, BindingResult result) {
        
        if(result.hasErrors()){
            return this.getErrors(result);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(this.userService.save(user));
    }


    @PutMapping("/{id}")
    public ResponseEntity<?>update(@PathVariable Long id, @Valid @RequestBody User user, BindingResult result) {

        if(result.hasErrors()){
            return this.getErrors(result);
        }

        Optional<User>userOptional = this.userService.findById(id);

        if(userOptional.isPresent()){
            User userdb = userOptional.get();
            userdb.setName(user.getName());
            userdb.setLastname(user.getLastname());
            userdb.setEmail(user.getEmail());
            userdb.setUsername(user.getUsername());
            userdb.setPassword(user.getPassword());
            return ResponseEntity.status(HttpStatus.OK).body(userService.save(userdb));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void>delete(@PathVariable Long id) {
        Optional<User> opUser = userService.findById(id);
        if(opUser.isPresent()){
            this.userService.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }


    private ResponseEntity<?>getErrors(BindingResult result) {
        Map<String, String> errors = new HashMap<>();
        result.getFieldErrors().forEach(error -> {
            errors.put(error.getField(), "El campo " + error.getField() + " : " + error.getDefaultMessage());
        });
        return ResponseEntity.badRequest().body(errors);
    }

}
