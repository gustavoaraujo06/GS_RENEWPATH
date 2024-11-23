'use client'
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Page() {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        try{
            const token = await getCookie('token')?.toString();
            const response = await fetch('http://127.0.0.1:5000/cliente', {
                method: 'PUT',
                headers: {
                    'Authorization': token ?? "",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const responseData = await response.json();
            if(response.ok){
                toast.success(responseData.message);
            }else if (response.status === 401) {
                deleteCookie('token');
                toast.error('Sessão expirada. Faça login novamente.');
                router.push('/auth/login');}
            else{
                toast.error(responseData.message);
            }
        }catch(e){
            console.error(e);
            toast.error('Erro ao atualizar perfil do cliente. Tente novamente mais tarde.');
        }
    };

    const loadClienteData = async () => {
        try {
            const token = await getCookie('token')?.toString();
            const response = await fetch('http://127.0.0.1:5000/cliente', {
                headers: {
                    'Authorization': token ?? '',
                },
            })
            const data = await response.json();
            if (response.ok) {
                setNome(data.nome_cliente);
                setTelefone(data.telefone);
                setEndereco(data.endereco);
            } else {
                toast.error(data.message);
            }
        } catch (e) {
            console.error(e);
            toast.error('Erro ao carregar informações do cliente. Tente novamente mais tarde.');
        }
    }
    useEffect(() => {
        loadClienteData();
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-verde mb-8 text-center">
                Perfil do Cliente
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block text-gray-700">Nome</label>
                    <input
                        type="text"
                        {...register('nome_cliente', { required: 'Nome é obrigatório' })}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    {errors.nome && (
                        <p className="text-red-500 text-sm mt-1">{errors.nome.message?.toString()}</p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700">Telefone</label>
                    <input
                        type="text"
                        {...register('telefone', { required: 'Telefone é obrigatório' })}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                    />
                    {errors.telefone && (
                        <p className="text-red-500 text-sm mt-1">{errors.telefone.message?.toString()}</p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700">Endereço</label>
                    <input
                        type="text"
                        {...register('endereco', { required: 'Endereço é obrigatório' })}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                    />
                    {errors.endereco && (
                        <p className="text-red-500 text-sm mt-1">{errors.endereco.message?.toString()}</p>
                    )}
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-verde text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
}