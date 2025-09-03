import springAxiosInst from "./AxiosInst.ts";


export const logoutRequest = async () => {
    const uri = springAxiosInst.getUri();
    console.log("URL : " + uri);
    console.log("로그인 진입");
    console.log("헤더 값 : " + `Bearer ${localStorage.getItem("userToken")}`);


    return await springAxiosInst.post('/api/account/logout',
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                },
            }
    );
}