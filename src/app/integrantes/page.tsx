import MemberCard from "./components/MemberCard";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-verde mb-8 text-center">
        Integrantes da Equipe
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
        <MemberCard nome="Gustavo Araujo" rm={555277} foto="/gustavo.png" github="https://github.com/gustavoaraujo06"></MemberCard>
        <MemberCard nome="Samuel Maragato" rm={556731} foto="/samuel.png" github="https://github.com/MUKINH4"></MemberCard>
        <MemberCard nome="Matheus Munuera" rm={557812} foto="/matheus.png" github="https://github.com/gustavoaraujo06"></MemberCard>
      </div>
    </div>
  );
}
