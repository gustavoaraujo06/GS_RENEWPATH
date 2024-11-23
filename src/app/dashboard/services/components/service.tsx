import { getCookie } from "cookies-next";
import { Service } from "../page";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

async function requestService(servicoId: number) {
    try {
        const token = await getCookie('token')?.toString();
        const response = await fetch('http://127.0.0.1:5000/requests', {
            method: 'POST',
            headers: {
                'Authorization': token ?? "",
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                servico_id: servicoId
            })
        })
        const data = await response.json();
        if (response.ok) {
            toast.success(data.message);
        }else{
            toast.error(data.message);
        }
    }catch(e) {
        console.error(e);
        toast.error('Erro ao solicitar serviço. Tente novamente mais tarde.');
    }
}

export default function ServiceComponent({ service }: { service: Service }) {
    return (
        <div key={service.servico_id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-verde">{service.nome_servico}</h2>
                <p className="mt-2 text-gray-600">{service.descricao}</p>
                <p className="mt-4 text-gray-800 font-bold">
                    Preço: R$ {service.preco.toFixed(2)}
                </p>
                <p className="mt-1 text-gray-600">Empresa: {service.nome_empresa}</p>
                <button
                    className="mt-4 w-full bg-verde text-white py-2 px-4 rounded hover:bg-green-700"
                    onClick={() => {
                        requestService(service.servico_id);
                    }}
                >
                    Solicitar Serviço
                </button>
            </div>
        </div>
    )
}