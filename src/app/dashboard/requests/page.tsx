'use client'
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RequestComponent, { Request } from "./components/request";

async function getUserData() {
    const token = await getCookie('token')?.toString();
    if (token != undefined) {
        const response = await fetch('http://127.0.0.1:5000/auth/user', {
            headers: { 'Authorization': token },
        })
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            toast.error('Erro ao carregar informações do usuário.');
        }
    }
    return null;
}
async function exportRequests() {
    const token = await getCookie('token')?.toString();
    if (token != undefined) {
        const response = await fetch('http://127.0.0.1:5000/export/requests', {
            headers: { 'Authorization': token },
        })
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'solicitacoes.json');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            toast.success('Solicitações exportadas com sucesso.');
        } else {
            const data = await response.json();
            toast.error('Erro exportar solicitações: ' + data.message);
        }
    }
}


export default function Page() {
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>([]);
    const [role, setRole] = useState<number>(0);

    async function loadRequests() {
        const userData = await getUserData();
        const token = await getCookie('token')?.toString();
        if (userData != null && token != null) {
            const response = await fetch('http://127.0.0.1:5000/requests', {
                headers: { 'Authorization': token },
            })
            if (response.ok) {
                const data = await response.json();
                setRole(userData.role);
                setRequests(data.map((request: any) => {
                    return {
                        solicitacaoId: request.solicitacao_id,
                        nomeServico: request.nome_servico,
                        nomeEmpresa: request.nome_empresa,
                        nomeCliente: request.nome_cliente,
                        dataSolicitacao: request.data_solicitacao,
                        status: request.status
                    }
                }));
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        }
    }



    useEffect(() => {
        loadRequests();
    }, [])
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-verde mb-8 text-center">Minhas Solicitações</h1>
            {requests.length === 0 ? (
                <p className="text-center text-gray-600">Nenhuma solicitação encontrada.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-verde text-white">
                            <tr>
                                <th className="py-2 px-4 text-left">Serviço</th>
                                {role === 1 ? (
                                    <th className="py-2 px-4 text-left">Cliente</th>
                                ) : (
                                    <th className="py-2 px-4 text-left">Empresa</th>
                                )}
                                <th className="py-2 px-4 text-left">Data</th>
                                <th className="py-2 px-4 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {requests.map((request: Request) => (
                                <RequestComponent request={request} loadRequestsCallback={loadRequests} key={request.solicitacaoId}></RequestComponent>
                            ))}
                        </tbody>
                    </table>
                    <button className="w-full h-10 bg-green-700 rounded-md text-white text-2xl" onClick={() => exportRequests()}>
                        <i className="bi bi-file-earmark-arrow-down"></i>
                    </button>
                </div>
            )}
        </div>
    );
}