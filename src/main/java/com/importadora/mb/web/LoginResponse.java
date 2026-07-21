package com.importadora.mb.web;

public record LoginResponse(String token, String email, String nombre, String rol) {}