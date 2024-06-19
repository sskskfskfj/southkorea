package no.muhyun.southkorea.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {
    @GetMapping("/")
    public String main(){ return "/register.html"; }

    @GetMapping("/register")
    public String signin(){ return "/register.html"; }

    @GetMapping("/login")
    public String login(){ return "/login.html";}

}
