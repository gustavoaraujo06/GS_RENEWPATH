import { getCookie } from "cookies-next";
import { toast } from "react-toastify";



export default function RequestUpdateButton({ confirm, callback }: { confirm: boolean, callback: any }) {
    return (
        <button className={`ml-2 ${confirm ? 'bg-green-700' : 'bg-red-400'} text-white rounded-full text-xl w-8`}
        onClick={() => callback(confirm)}>
            <i className={`bi bi-${confirm ? 'check' : 'x'}`}></i>
        </button>
    )
}