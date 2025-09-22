import springAxiosInst from "./AxiosInst.ts";


export const logoutRequest = async () => {
    const uri = springAxiosInst.getUri();



    return await springAxiosInst.post('/api/authentication/logout',
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            }
    );
}


export const tokenVerification = async () => {
    const uri = springAxiosInst.getUri();

    return await springAxiosInst.get('/api/authentication/token/verification',
        {
            withCredentials: true
        }
    );
}