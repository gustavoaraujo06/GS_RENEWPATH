'use client'
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Page() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        data.preco = parseFloat(data.preco);
        try {
            const token = await getCookie('token')?.toString();
            const response = await fetch('http://127.0.0.1:5000/services', {
                method: 'POST',
                headers: {
                    'Authorization': token ?? "",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                router.push('/dashboard/services/manage');
                toast.success('Serviço criado com sucesso');
            } else {
                const responseData = await response.json();
                toast.error(responseData.message);
            }
        } catch (e) {
            console.error(e);
            toast.error('Erro ao criar serviço. Tente novamente mais tarde');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-verde mb-8 text-center">
                Criar Novo Serviço
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block text-gray-700">Nome do Serviço</label>
                    <input
                        type="text"
                        {...register('nome_servico', { required: 'Nome do serviço é obrigatório' })}
                        className="w-full mt-1 p-2 border border-gray-300 rounded"
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
                        Criar Serviço
                    </button>
                </div>
            </form>
        </div>
    );
}