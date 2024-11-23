'use client';

import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ServiceComponent from "./components/service";

export interface Service {
    servico_id: number,
    nome_servico: string,
    descricao: string,
    preco: number,
    nome_empresa: string
}
export default function Page() {
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [dropdown, setDropdown] = useState(false);
    const [minPreco, setMinPreco] = useState<number>(0);
    const [maxPreco, setMaxPreco] = useState<number>(0);
    const [nomeServico, setNomeServico] = useState<string>('');
    const router = useRouter();
    async function loadServices(config:{
        orderBy?: string,
        descending?: string,
    } = {}) {
        const token = await getCookie('token')?.toString();
        const params = new URLSearchParams();
        if (config.orderBy) params.append('order_by', config.orderBy);
        if (config.descending) params.append('descending', config.descending);
        console.log(params)
        const response = await fetch(`http://127.0.0.1:5000/services?${params}`, {
            headers: {
                'Authorization': token ?? "",
            }
        })
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            setServices(data);
            setFilteredServices(data);
        } else if (response.status === 401) {
            deleteCookie('token');
            toast.error('Sessão expirada. Faça login novamente.');
            router.push('/auth/login');
        } else {
            toast.error('Erro ao carregar serviços. Tente novamente mais tarde.');
        }
    }
    useEffect(() => {
        loadServices();
    }, [])
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-verde mb-8 text-center">Serviços Disponíveis</h1>
            <div className="flex items-center mb-6">
                <input
                    type="text"
                    placeholder="Pesquisar serviços..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-verde"
                    onChange={
                        (e) => {
                            setNomeServico(e.target.value);
                        }
                    }
                />
                <div className="relative ml-4">
                    <button className="flex items-center px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-verde"
                        onClick={
                            () => setDropdown(!dropdown)
                        }>
                        <i className="bi bi-filter text-xl"></i>
                    </button>
                    {dropdown && <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                        <ul className="py-1">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    loadServices();
                                    setDropdown(false);
                                }}>Padrão</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    loadServices({
                                        orderBy: 'preco',
                                        descending: 'true'
                                    });
                                    setDropdown(false);
                                }}><i className="bi bi-graph-down-arrow"></i> Maior Preço</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    loadServices({
                                        orderBy: 'preco',
                                    });
                                    setDropdown(false);
                                }}><i className="bi bi-graph-up-arrow"></i> Menor Preço</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    loadServices({
                                        orderBy: 'nome_servico',
                                        descending: 'true'
                                    });
                                    setDropdown(false);
                                }}><i className="bi bi-sort-alpha-down-alt"></i> Nome Crescente</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    loadServices({
                                        orderBy: 'nome_servico',
                                    });
                                    setDropdown(false);
                                }}><i className="bi bi-sort-alpha-down"></i> Nome Decrescente</li>
                        </ul>
                    </div>}
                </div>
                <div className="flex items-center ml-4">
                    <div className="flex flex-col mr-2">
                        <label htmlFor="minPreco" className="mb-1">Mínimo</label>
                        <input
                            type="number"
                            id="minPreco"
                            placeholder="Min"
                            className="w-24 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-verde"
                            onChange={(e) => setMinPreco(Number(e.target.value))}
                        />
                    </div>
                    <span className="mx-2">-</span>
                    <div className="flex flex-col">
                        <label htmlFor="maxPreco" className="mb-1">Máximo</label>
                        <input
                            type="number"
                            id="maxPreco"
                            placeholder="Max"
                            className="w-24 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-verde"
                            onChange={(e) => setMaxPreco(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>
            {/* Lista de serviços */}
            <div className="grid grid-cols-1 gap-6">
                {nomeServico.length > 0 || minPreco > 0 || maxPreco > 0?
                services.filter(
                    (service) => {
                        const nameQuery = service.nome_servico.toLowerCase().includes(nomeServico.toLowerCase())
                        if(maxPreco > 0){
                            return service.preco >= minPreco && service.preco <= maxPreco && nameQuery
                        }else{
                            return service.preco >= minPreco && nameQuery
                        }
                        
                    }).map((service) => (
                    <ServiceComponent service={service} key={service.servico_id}/>
                )) : services.map((service) => (
                    <ServiceComponent service={service} key={service.servico_id}/>
                ))}
            </div>
        </div>
    );
}