package com.gym.gateway.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();

        if (path.startsWith("/api/auth/") || path.equals("/api/usuarios/login")
                || path.equals("/api/usuarios/registro") || path.equals("/api/usuarios/logout")
                || path.equals("/api/health") || path.startsWith("/actuator/")
                || path.startsWith("/css/") || path.startsWith("/js/") || path.equals("/")
                || path.startsWith("/login") || path.startsWith("/registro")) {
            return true;
        }

        HttpSession session = request.getSession(false);
        boolean loggedIn = session != null && session.getAttribute("userId") != null;

        if (!loggedIn) {
            if (path.startsWith("/api/")) {
                response.setStatus(401);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"No autenticado\"}");
                return false;
            }
            response.sendRedirect("/login");
            return false;
        }

        String rol = (String) session.getAttribute("userRol");
        if (path.startsWith("/admin") || path.startsWith("/api/admin/")) {
            if (!"DUENO".equalsIgnoreCase(rol) && !"ADMIN".equalsIgnoreCase(rol)) {
                if (path.startsWith("/api/")) {
                    response.setStatus(403);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Acceso denegado\"}");
                } else {
                    response.sendRedirect("/mi-cuenta");
                }
                return false;
            }
        }
        return true;
    }
}
