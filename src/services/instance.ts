import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: import.meta.env.TIME_OUT,
});



// const token = encryptDecrypt.decrypt(localStorage.getItem('accessTokenInternProject') as string) || encryptDecrypt.decrypt(sessionStorage.getItem('accessTokenInternProject') as string)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
axiosInstance.interceptors.request.use(async (config: any) => {
    
        const token = sessionStorage.getItem('accessToken');
        console.log("🚀 ~ axiosInstance.interceptors.request.use ~ token:", token)
    config.headers.Authorization = `Bearer ${token}`
    return config
})






export default axiosInstance