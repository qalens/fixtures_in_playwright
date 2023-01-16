import {APIRequestContext, expect, test as base} from "@playwright/test"
class AuthenticatedRequest {
    static tokens:Record<string,string>={}
    constructor(private request:APIRequestContext){}
    private login = async (username:string,password:string)=>{
        const resp = await this.request.post("http://localhost:8080/v3/user/login",{
                data:{
                    username: username,
                    password: password
                }
            })
            await expect(resp.status()).toBe(200)
            const {token}=await resp.json()
            return token
    }
    post = async (username:string,password:string,url:string,data:any)=>{
        const tokenKey = `${username}|${password}`
        if(!AuthenticatedRequest.tokens[tokenKey]){
            AuthenticatedRequest.tokens[tokenKey]=await this.login(username,password)
        }
        return this.request.post(url,{
            data,
            headers:{
                Authorization: `Bearer ${AuthenticatedRequest.tokens[tokenKey]}`
            }
        })
    }
}
export const test = base.extend<{authenticatedRequest:AuthenticatedRequest}>(({
    authenticatedRequest: async ({request}, use)=>{
        const ar= new AuthenticatedRequest(request)
        use(ar)
    }
}))