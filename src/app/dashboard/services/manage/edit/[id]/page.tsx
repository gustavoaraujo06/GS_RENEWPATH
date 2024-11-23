'use client'
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Page() {
    const params = useParams<{ id: string }>();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [nomeServico, setNomeServico] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState<number>(0);
    const onSubmit = async (data: any) => {
        try {
            const token = await getCookie('token')?.toString();
            const response = await fetch('http://127.0.0.1:5000/services/' + params.id, {
                method: 'PUT',
                headers: {
                    'Authorization': token ?? "",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const responseData = await response.json();
            if (response.ok) {
                toast.success(responseData.message);
            } else {
                toast.error(responseData.message);
            }
        } catch (e) {
            console.error(e);
            toast.error('Erro ao atualizar informações do serviço. Tente novamente mais tarde.');
        }
    }
    const loadServiceData = async () => {
        try {
            const token = await getCookie('token')?.toString();
            const response = await fetch('http://127.0.0.1:5000/services/' + params.id, {
                headers: {
                    'Authorization': token ?? ''
                }
            })
            if (response.ok) {
                const data = await response.json();
                setNomeServico(data.nome_servico);
                setDescricao(data.descricao);
                setPreco(data.preco);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (e) {
            console.error(e);
            toast.error('Erro ao carregar informações do serviço. Tente novamente mais tarde.');
        }
    }
    useEffect(() => {
        loadServiceData();
    }, [])
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-verde mb-8 text-center">
                Editar Serviço
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block text-gray-700">Nome do Serviço</label>
                    <input
                        type="text"
                        {...register('nome_servico', { required: 'Nome do serviço é obrigatório' })}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                        value={nomeServico}
                        onChange={(e) => setNomeServico(e.target.value)}
                    />
                    {errors.nome_servico && (
                        <p className="text-red-500 text-sm mt-1">{errors.nome_servico.message?.toString()}</p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700">Descrição</label>
                    <textarea
                        {...register('descricao', { required: 'Descrição é obrigatória' })}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                        rows={4}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    ></textarea>
                    {errors.descricao && (
                        <p className="text-red-500 text-sm mt-1">{errors.descricao.message?.toString()}</p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700">Preço</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('preco', {
                            required: 'Preço é obrigatório',
                            min: { value: 0, message: 'O preço deve ser maior ou igual a zero' },
                        })}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
                        value={preco}
                        onChange={(e) => setPreco(Number(e.target.value))}
                    />
                    {errors.preco && (
                        <p className="text-red-500 text-sm mt-1">{errors.preco.message?.toString()}</p>
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