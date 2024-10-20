package ru.kata.spring.boot_security.demo.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.security.UsersDetails;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;
import ru.kata.spring.boot_security.demo.services.UsersDetailsService;
import ru.kata.spring.boot_security.demo.util.UserValidator;

import java.util.List;


@RestController
@RequestMapping("/api")
public class AdminController {

    private final UsersDetailsService usersDetailsService;
    private final RoleService roleService;
    private final UserService userService;
    private final UserValidator userValidator;

    @Autowired
    public AdminController(UsersDetailsService usersDetailsService, RoleService roleService, UserService userService, UserValidator userValidator) {
        this.usersDetailsService = usersDetailsService;
        this.roleService = roleService;
        this.userService = userService;
        this.userValidator = userValidator;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> showAllUsers() {
        return new ResponseEntity<>(usersDetailsService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") Long id) {
        User user = usersDetailsService.findUserById(id);
        return user != null
                ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> showAllRoles() {
        return new ResponseEntity<>(roleService.getAllRoles(), HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<?> create(@RequestBody @Valid User user, BindingResult bindingResult) {
        userValidator.validate(user, bindingResult);

        if (bindingResult.hasErrors()) {
            StringBuilder sbErrors = new StringBuilder();
            List<FieldError> errors = bindingResult.getFieldErrors();
            for(FieldError error: errors){
                sbErrors.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append("; ");
            }
            return ResponseEntity.badRequest().body(sbErrors);
        }
        usersDetailsService.save(user);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<?> showUser(@RequestBody @Valid User user, BindingResult bindingResult,
                           @PathVariable("id") Long id) {
        if (!userService.isUsernameUnique(user.getUsername(), user.getId())) {
            bindingResult.rejectValue("username", "", "Username already exists");
        }
        if (bindingResult.hasErrors()) {
            StringBuilder sbErrors = new StringBuilder();
            List<FieldError> errors = bindingResult.getFieldErrors();
            for(FieldError error: errors){
                sbErrors.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append("; ");
            }
            return ResponseEntity.badRequest().body(sbErrors);
        }
        usersDetailsService.update(id, user);
        return ResponseEntity.ok(user);
    }



    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        usersDetailsService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}