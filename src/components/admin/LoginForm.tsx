
"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";

type LoginFormProps = {
  onLogin: () => void;
  onCancel: () => void;
};

export function LoginForm({ onLogin, onCancel }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) throw error;

    const { data: isAdmin, error: erroAdmin } = await supabase.rpc("is_admin");

    if (erroAdmin || isAdmin !== true) {
    await supabase.auth.signOut();
    throw new Error("Este usuário não possui permissão de administrador.");
    }

      onLogin();
    } catch (erroLogin) {
      setErro(
        erroLogin instanceof Error
          ? erroLogin.message
          : "Não foi possível entrar. Verifique suas credenciais."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="card-frame max-w-md mx-auto p-8 page-enter">
      <h2 className="font-serif text-2xl text-brown-dark mb-2">
        Acesso administrativo
      </h2>

      <p className="text-sm text-brown-mid mb-6">
        Entre com sua conta autorizada para administrar o Legado Familiar.
      </p>

      <form onSubmit={entrar} className="space-y-4">
        <div>
          <label
            htmlFor="email-admin"
            className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1"
          >
            E-mail
          </label>
          <input
            id="email-admin"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            className="w-full border border-beige bg-parchment px-3 py-2 text-sm text-brown-dark rounded-sm"
          />
        </div>

        <div>
          <label
            htmlFor="senha-admin"
            className="block text-xs font-sans uppercase tracking-wide text-caramel mb-1"
          >
            Senha
          </label>
          <input
            id="senha-admin"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full border border-beige bg-parchment px-3 py-2 text-sm text-brown-dark rounded-sm"
          />
        </div>

        {erro && (
          <p role="alert" className="text-sm text-red-700">
            {erro}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={carregando}
            className="px-6 py-2 bg-terracotta text-cream text-sm rounded-sm disabled:opacity-60"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-beige text-brown-mid text-sm rounded-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
