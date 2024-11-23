'use client'

import { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    interface User {
        id: number,
        role: number
    }
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const loadUserInfo = async () => {
        try {
            const token = await getCookie('token')?.toString();
            if(token != undefined){
                const response = await fetch('http://127.0.0.1:5000/auth/user', {
                    headers: { 'Authorization': token },
                })
                if (response.ok) {
                    const data = await response.json();
                    setUser({
                        id: data.id,
                        role: data.role
                    });
                } else {
                    setUser(null);
                    deleteCookie('token');
                }
            }
            
        }

        catch (error) {
            console.error('Erro ao carregar informações do usuário:', error);
            toast.error('Ocorreu um erro. Tente novamente mais tarde.');
            router.push('/auth/login');
        } finally {
            setLoading(false);
        }
    }
    const logout = () => {
        deleteCookie('token');
        setUser(null);
        router.push('/auth/login');
    }
    const pathname = usePathname();
    useEffect(() => {
        loadUserInfo();
      }, [pathname]);
    const renderizarNav = () => {
        if (!user) {
            return (
                <>
                    <Link href="/auth/login" className="text-white hover:text-gray-300 ml-4">
                        Login
                    </Link>
                    <Link href="/auth/register" className="text-white hover:text-gray-300 ml-4">
                        Registrar-se
                    </Link>
                </>
            );
        } else if (user.role === 0) {
            return (
                <>
                    <Link href="/dashboard/services" className="text-white hover:text-gray-300 ml-4">
                        Serviços
                    </Link>
                    <Link href="/dashboard/requests" className="text-white hover:text-gray-300 ml-4">
                        Minhas Solicitações
                    </Link>
                    <Link href="/dashboard/profile" className="text-white hover:text-gray-300 ml-4">
                        Perfil
                    </Link>
                    <button
                        className="bg-green-500 text-white hover:bg-green-600 ml-4 px-4 py-2 rounded"
                        onClick={logout}
                    >
                        Sair
                    </button>
                </>
            );
        } else if (user.role === 1) {
            return (
                <>
                    <Link href="/dashboard/services/manage" className="text-white hover:text-gray-300 ml-4">
                        Gerenciar Serviços
                    </Link>
                    <Link href="/dashboard/requests" className="text-white hover:text-gray-300 ml-4">
                        Solicitações de Clientes
                    </Link>
                    <Link href="/dashboard/empresa/profile" className="text-white hover:text-gray-300 ml-4">
                        Perfil
                    </Link>
                    <button
                        className="bg-green-500 text-white hover:bg-green-600 ml-4 px-4 py-2 rounded"
                        onClick={logout}
                    >
                        Sair
                    </button>
                </>
            );
        }
    };

    return (
        <header className="bg-verde h-40 flex items-center justify-center">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center text-white">
                    <Image src="/logo.png" width={120} height={120} alt="Logo"
                    ></Image>
                </div>
                <nav className="flex items-center">
                    <Link href="/integrantes" className="text-white hover:text-gray-300 ml-4">
                        Integrantes
                    </Link>
                    {!loading && renderizarNav()}
                </nav>
            </div>
        </header>
    )
}