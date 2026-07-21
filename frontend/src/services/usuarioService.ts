import api from "./api";
import type { UsuarioDto } from "../types";

export const usuarioService = {
  getAll: () =>
    api.get<UsuarioDto[]>("/usuarios").then((r) => r.data),

  updateRol: (id: number, rol: string) =>
    api.put(`/usuarios/${id}/rol`, { rol }).then((r) => r.data),

  updateEstado: (id: number, estado: string) =>
    api.put(`/usuarios/${id}/estado`, { estado }).then((r) => r.data),
};
