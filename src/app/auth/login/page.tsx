'use client';

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from "react-toastify";
import { setCookie } from "cookies-next";

export default function Page() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          senha: data.senha,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        setCookie('token', token, {
            maxAge: 30 * 30,
            path: '/',
        })
        router.push('/dashboard/requests');

      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Ocorreu um erro. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-white">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-verde">
            Entrar na sua conta
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            ou{' '}
            <Link href="/auth/register" className="font-medium text-verde hover:text-green-700">
              registre-se aqui
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                {...register('email', { required: 'Email é obrigatório', 
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Digite um email valido'
                      } })}
                name="email"
                type="email"
                autoComplete="email"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-verde focus:border-verde focus:z-10 sm:text-sm"
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
                {...register('senha', { required: 'Senha é obrigatória' })}
                name="senha"
                type="password"
                autoComplete="current-password"
                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-verde focus:border-verde focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
              {errors.senha && <span className="text-red-500 text-sm">{errors.senha.message?.toString()}</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-verde border border-transparent rounded-md group hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
