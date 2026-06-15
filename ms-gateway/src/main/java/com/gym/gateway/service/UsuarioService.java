package com.gym.gateway.service;

import com.gym.gateway.model.Usuario;
import com.gym.gateway.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public List<Usuario> listarActivos() {
        return repository.findByEstado("activo");
    }

    public Usuario obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    public Usuario obtenerPorEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    public Usuario crear(Usuario usuario) {
        if (repository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con el email: " + usuario.getEmail());
        }
        if (usuario.getPassword() == null || usuario.getPassword().isBlank()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }
        usuario.setPassword(hash(usuario.getPassword()));
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("MIEMBRO");
        }
        return repository.save(usuario);
    }

    public Usuario actualizar(Long id, Usuario datos) {
        Usuario usuario = obtenerPorId(id);
        if (datos.getNombre() != null) usuario.setNombre(datos.getNombre());
        if (datos.getApellido() != null) usuario.setApellido(datos.getApellido());
        if (datos.getEmail() != null) usuario.setEmail(datos.getEmail());
        if (datos.getTelefono() != null) usuario.setTelefono(datos.getTelefono());
        if (datos.getDireccion() != null) usuario.setDireccion(datos.getDireccion());
        if (datos.getRut() != null) usuario.setRut(datos.getRut());
        if (datos.getFechaNacimiento() != null) usuario.setFechaNacimiento(datos.getFechaNacimiento());
        if (datos.getEstado() != null) usuario.setEstado(datos.getEstado());
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            usuario.setPassword(hash(datos.getPassword()));
        }
        return repository.save(usuario);
    }

    public void eliminar(Long id) {
        Usuario usuario = obtenerPorId(id);
        usuario.setEstado("inactivo");
        repository.save(usuario);
    }

    public Usuario login(String email, String passwordPlano) {
        Usuario u = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));
        if (!hash(passwordPlano).equals(u.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }
        if (!"activo".equalsIgnoreCase(u.getEstado())) {
            throw new RuntimeException("Tu cuenta está inactiva. Contacta al administrador.");
        }
        return u;
    }

    public static String hash(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(s.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception e) {
            throw new RuntimeException("Error al hashear contraseña", e);
        }
    }
}
