package no.muhyun.southkorea.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.muhyun.southkorea.User;
import no.muhyun.southkorea.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://ec2-43-201-116-173.ap-northeast-2.compute.amazonaws.com:8080/register.html",
                        "http://ec2-43-201-116-173.ap-northeast-2.compute.amazonaws.com:8080/login.html",
                        "http://ec2-43-201-116-173.ap-northeast-2.compute.amazonaws.com:8080/index.html",
                        "http://ec2-43-201-116-173.ap-northeast-2.compute.amazonaws.com:8080/videocall.html"
                        })
@Slf4j
public class UserController {

    private final UserService service;

    @PostMapping
    public void register(@RequestBody User user) {
        service.register(user);
    }


    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return service.login(user);
    }

    @PostMapping("/logout")
    public void logout(@RequestBody User email) {
        service.logout(email.getEmail());
    }




    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handle(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity
                .status(INTERNAL_SERVER_ERROR)
                .body(ex.getMessage());
    }
}
