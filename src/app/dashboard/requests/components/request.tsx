import { getCookie } from "cookies-next";
import RequestUpdateButton from "./requestUpdateButton";
import { toast } from "react-toastify";
import { useState } from "react";

export interface Request {
    solicitacaoId: number;
    nomeServico: string;
    nomeEmpresa?: string;
    nomeCliente?: string;
    dataSolicitacao: string;
    status: string;
}
const updateRequest = async (accept: boolean, solicitacaoId: number) => {
    const token = await getCookie('token')?.toString();
    const response = await fetch(`http://127.0.0.1:5000/requests/${solicitacaoId}`, {
        method: 'PUT',
        headers: {
            'Authorization': token ?? "",
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            status: accept ? 'CONFIRMADO' : 'PENDENTE'
        })
    });
    if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
    }
}

export default function RequestComponent({ request, loadRequestsCallback }: { request: Request, loadRequestsCallback: any }) {
    const [showInfo, setShowInfo] = useState(false);
    const handleUpdate = async (accept: boolean) => {
        await updateRequest(accept, request.solicitacaoId);
        loadRequestsCallback();
    }
    return (
        <tr className="border-b">
            <td className="py-2 px-4">{request.nomeServico}</td>
            {request.nomeEmpresa ? (
                <td className="py-2 px-4">{request.nomeEmpresa}</td>
            ) : (
                <td className="py-2 px-4">{request.nomeCliente}</td>
            )}
            <td className="py-2 px-4">{request.dataSolicitacao}</td>
            <td className={`py-2 px-4 ${request.status == 'PENDENTE' ? 'bg-yellow-400' : 'bg-green-400'}`}>
                {request.status}
                {request.nomeCliente && (
                    <RequestUpdateButton confirm={request.status == 'PENDENTE'} callback={handleUpdate} />
                )}
                {request.nomeEmpresa && (
                    <i className="relative ml-2 bi bi-info-circle cursor-pointer" onMouseEnter={() => setShowInfo(true)} onMouseLeave={() => setShowInfo(false)}>
                        {showInfo && <div className="fixed p-2 z-10 mt-2 w-48 bg-white border rounded-md shadow-lg">
                            {request.status == 'PENDENTE' ? "Aguardando confirmação da empresa" : "A empresa confirmou a solicitação, logo ela entrará em contato com voce para mais detalhes como orçamento, contrato, instalação e prazo."}
                        </div>}
                    </i>
                )}
            </td>
        </tr>
    )
}