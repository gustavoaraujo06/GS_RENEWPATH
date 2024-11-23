import Image from "next/image";

export default function MemberCard({ nome, rm, github, foto }: {
    nome: string,
    rm: number,
    github: string,
    foto: string
}) {
    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
            <Image
                className="rounded-t-lg w-full h-48 object-cover"
                src={foto}
                alt={nome}
                width={500}
                height={500}
            />
            <div className="p-5 text-center">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                    {nome}
                </h5>
                <p className="mb-3 font-normal text-gray-700">RM: {rm}</p>
                <a
                    href={github}
                    target="_blank"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-black rounded-lg hover:bg-white hover:text-black hover:border-black border-2"
                >
                 <i className="bi bi-github"></i> GitHub
                </a>
            </div>
        </div>
    );
};