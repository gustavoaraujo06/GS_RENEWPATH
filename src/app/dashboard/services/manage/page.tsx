'use client'
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
    const [services, setServices] = useState<any[]>([]);
    const router = useRouter();
    const loadServices = async () => {
        const token = await getCookie('token')?.toString();
        try {
            const response = await fetch('http://127.0.0.1:5000/empresa/services', {
                headers: {
                    'Authorization': token ?? '',
                }
            })
            if (response.ok) {
                const data = await response.json();
                setServices(data);
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (e) {
            console.log(e);
            toast.error('Erro ao carregar serviços. Tente novamente mais tarde.');
        }
    }
    const deleteService = async (id: number) => {
        if(!confirm('Tem certeza que deseja deletar este serviço?')){
            return;
        }
        const token = getCookie('token')?.toString();
        try {
            const response = await fetch(`http://127.0.0.1:5000/services/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token ?? '',
                },
            });
            if (response.ok) {
                toast.success('Serviço deletado com sucesso.');
                loadServices();

            } else if (response.status === 401) {
                deleteCookie('token');
                toast.error('Sessão expirada. Faça login novamente.');
                router.push('/auth/login');
            }
            else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (e) {
            console.log(e);
            toast.error('Erro ao deletar serviço. Tente novamente mais tarde.');
        }
    };
    useEffect(() => {
        loadServices();
    }, [])
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-verde mb-8 text-center">
                Gerenciar Serviços
            </h1>
            {services.length === 0 ? (
                <p className="text-center text-gray-600">Nenhum serviço encontrado.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-verde text-white">
                            <tr>
                                <th className="py-2 px-4 text-left">Serviço</th>
                                <th className="py-2 px-4 text-left">Descrição</th>
                                <th className="py-2 px-4 text-left">Preço</th>
                                <th className="py-2 px-4 text-left">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {services.map((service) => (
                                <tr key={service.servico_id} className="border-b">
                                    <td className="py-2 px-4">{service.nome_servico}</td>
                                    <td className="py-2 px-4">{service.descricao}</td>
                                    <td className="py-2 px-4">R$ {service.preco.toFixed(2)}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex space-x-2">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                                onClick={() => {
                                                    router.push(`/dashboard/services/manage/edit/${service.servico_id}`);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                                onClick={() => {
                                                    deleteService(service.servico_id);
                                                }}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="mt-6 text-center">
                <button
                    className="bg-verde text-white px-6 py-2 rounded hover:bg-green-700"
                    onClick={() => {
                        router.push('/dashboard/services/manage/novo');
                    }}
                >
                    Adicionar Serviço
                </button>
            </div>
        </div>
    );
}