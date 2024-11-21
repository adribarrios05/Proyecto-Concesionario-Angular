import { Observable } from "rxjs";

export interface IAuthentication{
    getToken(): unknown;
    signIn(authPayload:any):Observable<any>;
    signUp(registerPayload:any):Observable<any>;
    signOut():Observable<any>;
    me():Observable<any>;
    getCurrentUser():Promise<any>;
}