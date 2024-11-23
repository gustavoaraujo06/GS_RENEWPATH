'use client';

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

export default function Page() {
  const [role, setRole] = useState(0);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    data.role = role;

    if (data.senha !== data.confirmSenha) {
      toast.error('As senhas sao diferentes');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          telefone: data.telefone,
          endereco: data.endereco,
          role: data.role
        })
      });

      if (response.ok) {
        toast.success('Usuário cadastrado com sucesso!');
        router.push('/auth/login');
      } else {
        const result = await response.json();
        toast.error(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      toast.error('Ocorreu um erro. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-verde">
            Criar uma conta
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            ou{' '}
            <Link href="/auth/login" className="font-medium text-verde hover:text-green-700">
              entre na sua conta
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nome" className="sr-only">
                {role === 0 ? 'Nome Completo' : 'Nome da Empresa'}
              </label>
              <input
                id="nome"
                {...register('nome', { required: true })}
                name="nome"
                type="text"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-verde focus:border-verde focus:z-10 sm:text-sm"
                placeholder={role === 0 ? 'Nome Completo' : 'Nome da Empresa'}
              />
              {errors.nome && <span className="text-red-500 text-sm">Nome é obrigatório</span>}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                {...register('email', { 
                    required: 'Email é obrigatório', 
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Digite um email valido'
                      }
                })}
                name="email"
                type="email"
                autoComplete="email"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-verde focus:border-verde focus:z-10 sm:text-sm"
                placeholder="Email"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message?.toString()}</span>}
            </div>
            <div>
              <label htmlFor="senha" className="sr-only">
                Senha
              </label>
              <input
                id="senha"
                {...register('senha', { required: true })}
                name="senha"
                type="password"
                autoComplete="new-password"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-verde focus:border-verde focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
              {errors.senha && <span className="text-red-500 text-sm">Senha é obrigatória</span>}
            </div>
            <div>
              <label htmlFor="confirmSenha" className="sr-only">
                Confirmar Senha
              </label>
              <input
                id="confirmSenha"
                {...register('confirmSenha', { required: true })}
                name="confirmSenha"
                type="password"
                autoComplete="new-password"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-verde focus:border-verde focus:z-10 sm:text-sm"
                placeholder="Confirmar Senha"
              />
              {errors.confirmSenha && <span className="text-red-500 text-sm">Confirme a senha</span>}
            </div>
            <div>
              <label htmlFor="telefone" className="sr-only">
                Telefone
              </label>
              <input
                id="telefone"
                {...register('telefone', { required: true })}
                name="telefone"
                type="text"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-verde focus:border-verde focus:z-10 sm:text-sm"
                placeholder="Telefone"
              />
              {errors.nome && <span className="text-red-500 text-sm">Telefone é obrigatório</span>}
            </div>
            <div>
              <label htmlFor="endereco" className="sr-only">
                Endereço
              </label>
              <input
                id="endereco"
                {...register('endereco', { required: true })}
                name="endereco"
                type="text"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-verde focus:border-verde focus:z-10 sm:text-sm"
                placeholder="Endereço"
              />
              {errors.nome && <span className="text-red-500 text-sm">Endereço é obrigatório</span>}
            </div>
          </div>

          <div className="mt-4">
            <span className="text-gray-700">Eu sou:</span>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="text-verde form-radio focus:ring-verde"
                  name="role"
                  value={0}
                  checked={role === 0}
                  onChange={(e) => setRole(parseInt(e.target.value))}
                />
                <span className="ml-2">Cliente</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  className="text-verde form-radio focus:ring-verde"
                  name="role"
                  value={1}
                  checked={role === 1}
                  onChange={(e) => setRole(parseInt(e.target.value))}
                />
                <span className="ml-2">Empresa</span>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 mt-6 text-sm font-medium text-white bg-verde border border-transparent rounded-md group hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde"
            >
              Registrar-se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
