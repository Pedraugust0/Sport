import React, { useState } from "react";
import { loginUser, registerUser } from '../services/authService.js';
import { getUserByEmail } from '../services/usersService.js';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  // Campos do cadastro
  const [registerData, setRegisterData] = useState({
    nome: "",
    idade: "",
    cidade: "",
    email: "",
    senha: "",
  });

  // Campos do login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");

  const resetForm = () => {
    setRegisterData({
        nome: "",
        idade: "",
        cidade: "",
        email: "",
        senha: "",
    });
    setLoginEmail("");
    setLoginSenha("");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerData.email || !registerData.senha || !registerData.nome) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    setLoading(true);

    try {
      await registerUser(registerData); 
      alert("✅ Conta criada com sucesso! Faça login.");
      resetForm();
      setIsRegistering(false);
    } catch (error) {
      alert(`❌ Falha no cadastro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 AQUI ESTÁ A CORREÇÃO PRINCIPAL
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginEmail || !loginSenha) {
        alert("Preencha todos os campos!");
        return;
    }

    setLoading(true);

    try {
      // 1. Faz o login (Isso define o Cookie JSESSIONID)
      await loginUser(loginEmail, loginSenha);

      // 2. Busca os dados completos do usuário usando o email
      // (Isso recupera o nome, foto, id, etc. para exibir no painel)
      const userDetails = await getUserByEmail(loginEmail);

      resetForm();
      
      // 3. Passa o objeto COMPLETO do usuário para o App.js
      onLogin(userDetails); 

    } catch (error) {
      console.error(error);
      alert(`❌ Falha no login: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col px-20 py-5 border rounded-2xl bg-gray-100 shadow-2xl">
      {!isRegistering ? (
        <>
          <header className="flex flex-col">
            <h1>
              <span className="font-sans text-4xl mb-1 font-bold text-blue-400">
                Acesse o
                <span className="text-blue-400"> Community Health</span>
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 mb-5 font-serif">
              Faça o login ou registre-se.
            </p>
          </header>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="font-sans font-semibold text-sm text-gray-800">E-mail</label>
              <input
                className="px-4 py-3 bg-white border text-gray-800 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                type="email"
                required
                placeholder="Digite seu e-mail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-sans font-semibold text-sm text-gray-800">Senha</label>
              <input
                className="px-4 py-3 bg-white border text-gray-800 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                type="password"
                required
                placeholder="Digite sua senha..."
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded text-white font-sans transition-all ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'}`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <span className="text-blue-400 px-2 py-3 flex gap-1 justify-center">
              Ainda não tem uma conta?
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="font-bold hover:underline hover:text-purple-900"
              >
                Inscreva-se
              </button>
            </span>
          </form>
        </>
      ) : (
        <>
          <header className="flex flex-col mb-4">
            <h1 className="font-sans text-3xl font-bold text-blue-500">Criar conta</h1>
            <p className="text-sm text-gray-500">Preencha seus dados para continuar</p>
          </header>

          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-semibold">Nome completo</label>
              <input
                className="px-4 py-3 border rounded bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                type="text"
                required
                placeholder="Seu nome"
                value={registerData.nome}
                onChange={(e) => setRegisterData({ ...registerData, nome: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-semibold">Idade</label>
              <input
                className="px-4 py-3 border rounded bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                type="number"
                required
                placeholder="Sua idade"
                value={registerData.idade}
                onChange={(e) => setRegisterData({ ...registerData, idade: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-semibold">Onde mora?</label>
              <input
                className="px-4 py-3 border rounded bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                type="text"
                required
                placeholder="Sua cidade"
                value={registerData.cidade}
                onChange={(e) => setRegisterData({ ...registerData, cidade: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-semibold">E-mail</label>
              <input
                className="px-4 py-3 border rounded bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                type="email"
                required
                placeholder="exemplo@email.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700 font-semibold">Senha</label>
              <input
                className="px-4 py-3 border rounded bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                type="password"
                required
                placeholder="Crie uma senha"
                value={registerData.senha}
                onChange={(e) => setRegisterData({ ...registerData, senha: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded text-white font-sans mt-2 transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>

            <button
              type="button"
              className="text-blue-500 underline mt-2 text-center"
              onClick={() => setIsRegistering(false)}
            >
              Já tenho conta
            </button>
          </form>
        </>
      )}
    </main>
  );
};

export default Login;