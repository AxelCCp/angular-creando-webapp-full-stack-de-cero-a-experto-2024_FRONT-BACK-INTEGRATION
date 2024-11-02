package com.spring.back.users.users_back.model.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.spring.back.users.users_back.model.request.IUser;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@Entity
@Table(name="users")
public class User implements IUser{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    private String name;
    
    @NotBlank
    private String lastname;
    
    @Email
    @NotEmpty
    private String email;
    
    @NotBlank
    @Size(min=5, max=12)
    private String username;
    
    @NotBlank
    @Size(min=5)
    private String password;

    @JsonIgnoreProperties({"handler","hibernateLazyInitializer"})   //150 - para quitar basura del proxy
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name="users_roles", joinColumns = {@JoinColumn(name="user_id")}, inverseJoinColumns = @JoinColumn(name="role_id"), uniqueConstraints = { @UniqueConstraint(columnNames = {"user_id", "role_id"}) })
    private List<Role>roles;

    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)          //169 - se puede escribir este valor en el user request, pero no a ir a la base de datos.
    private boolean admin;

    public User() {
        this.roles = new ArrayList<>();
    }
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getLastname() {
        return lastname;
    }
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    
    

}