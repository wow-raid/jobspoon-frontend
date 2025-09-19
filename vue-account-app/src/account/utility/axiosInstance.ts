// 서버에 요청을 보내는 도메인
import axios, { type AxiosInstance } from "axios";
import { clearAdminSession } from "@/security/admin/adminSession.ts"; // ⬅️ 추가"

export let djangoAxiosInstance: AxiosInstance | null = null;
export let springAxiosInstance: AxiosInstance | null = null;
export let fastapiAxiosInst: AxiosInstance | null = null;
export let springAdminAxiosInst: AxiosInstance | null = null;
export function createAxiosInstances() {

    const djangoApiUrl = process.env.VUE_APP_DJANGO_API_BASE_URL;
    const springApiUrl = process.env.VUE_APP_SPRING_API_BASE_URL;
    const aiBaseUrl = process.env.VUE_APP_AI_API_BASE_URL;
    const adminApiUrl = process.env.VUE_APP_SPRING_API_BASE_URL;

    if (!djangoAxiosInstance) {
        console.log("🔎 Spring API URL:", process.env.VUE_APP_SPRING_API_BASE_URL);
        djangoAxiosInstance = axios.create({
            baseURL: djangoApiUrl,
            timeout: 80000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    if (!springAxiosInstance) {
        springAxiosInstance = axios.create({
            baseURL: springApiUrl,
            timeout: 80000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }


    if (!fastapiAxiosInst) {
        fastapiAxiosInst = axios.create({
            baseURL: aiBaseUrl,
            timeout: 20000,
        });
    }

    if (!springAdminAxiosInst) {


        springAdminAxiosInst = axios.create({
            baseURL: adminApiUrl,
            timeout: 80000,
            headers: { "Content-Type": "application/json" },
        });
    }

    return { djangoAxiosInstance, springAxiosInstance, fastapiAxiosInst, springAdminAxiosInst };
}

//admin 임시토큰 유효성 검증
export async function validateTempTokenOnServer(token:string): Promise<boolean>{
    if(!springAdminAxiosInst) createAxiosInstances();
    try{
        const resp = await springAdminAxiosInst!.get("/administrator/temptoken_valid", {
            headers: { "X-Temp-Admin-Token": token },
            validateStatus: () => true,
        });
        return resp.status === 200 || resp.status === 204;
    }catch {
        return false;
    }
}

export async function verifyAdminOnServer(accessToken:string):Promise<boolean>{
    if(!springAdminAxiosInst)createAxiosInstances();
    try{
        const resp= await springAdminAxiosInst!.post(
            "/administrator/social_login",
            null,
            {
                headers:{Authorization: `Bearer ${accessToken}`},
                validateStatus:() =>true,
            }
        );
        return resp.status === 200;
    }catch{
        return false;
    }
}

export function setupAdminInterceptors(){
    if(!springAdminAxiosInst)createAxiosInstances();
    springAxiosInstance!.interceptors.response.use(
        (res)=>{
            if(res.status ===401 || res.status===403){
                clearAdminSession();
                window.dispatchEvent(new CustomEvent("admin-unauthorized"));
            }
            return res;
        },
        (error)=> {
            return Promise.reject(error);
        }
    );
}