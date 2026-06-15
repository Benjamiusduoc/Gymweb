package com.gym.gateway.controller;

import com.gym.gateway.model.Usuario;
import com.gym.gateway.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> listarActivos() {
        return ResponseEntity.ok(service.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(service.actualizar(id, usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body,
                                                      HttpServletRequest request) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email y contraseña son requeridos"));
        }
        Usuario u = service.login(email, password);
        HttpSession session = request.getSession(true);
        session.setAttribute("userId", u.getId());
        session.setAttribute("userRol", u.getRol());
        session.setAttribute("userNombre", u.getNombre() + " " + u.getApellido());
        return ResponseEntity.ok(usuarioPublico(u));
    }

    @PostMapping("/registro")
    public ResponseEntity<Map<String, Object>> registro(@RequestBody Map<String, String> body,
                                                        HttpServletRequest request) {
        Usuario u = new Usuario();
        u.setNombre(body.getOrDefault("nombre", "").trim());
        u.setApellido(body.getOrDefault("apellido", "").trim());
        u.setEmail(body.getOrDefault("email", "").trim().toLowerCase());
        u.setPassword(body.getOrDefault("password", ""));
        u.setRut(body.getOrDefault("rut", ""));
        u.setTelefono(body.getOrDefault("telefono", ""));
        u.setDireccion(body.getOrDefault("direccion", ""));
        u.setRol("MIEMBRO");

        if (u.getNombre().isEmpty() || u.getApellido().isEmpty() || u.getEmail().isEmpty() || u.getPassword().length() < 4) {
            return ResponseEntity.badRequest().body(Map.of("error", "Datos incompletos (contraseña mínimo 4 caracteres)"));
        }
        Usuario creado = service.crear(u);
        HttpSession session = request.getSession(true);
        session.setAttribute("userId", creado.getId());
        session.setAttribute("userRol", creado.getRol());
        session.setAttribute("userNombre", creado.getNombre() + " " + creado.getApellido());
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioPublico(creado));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        return ResponseEntity.ok(Map.of("ok", "true"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No autenticado"));
        }
        Long userId = (Long) session.getAttribute("userId");
        Usuario u = service.obtenerPorId(userId);
        return ResponseEntity.ok(usuarioPublico(u));
    }

    private Map<String, Object> usuarioPublico(Usuario u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("nombre", u.getNombre());
        m.put("apellido", u.getApellido());
        m.put("email", u.getEmail());
        m.put("telefono", u.getTelefono());
        m.put("direccion", u.getDireccion());
        m.put("rut", u.getRut());
        m.put("estado", u.getEstado());
        m.put("rol", u.getRol());
        m.put("fechaRegistro", u.getFechaRegistro());
        m.put("fechaNacimiento", u.getFechaNacimiento());
        return m;
    }
}
