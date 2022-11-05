import { createContext, ReactNode } from "react";

interface UserProps{
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    singIn: () => Promise<void>;
}

interface AuthProviderProps {
    children:ReactNode
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthProviderProps){

    async function singIn(){}

    return(
        <AuthContext.Provider value={{
            singIn,
            user:{
                name:'Maiara',
                avatarUrl:'https://https://github.com/maiarawill.png'
            }
        }}>
            {children}
        </AuthContext.Provider>
    );
}