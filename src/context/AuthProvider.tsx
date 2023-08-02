import React, { PropsWithChildren, useMemo, useContext } from "react";  
  
interface AuthContextType {  
  token: string;  
  addToken: (token: string) => void;  
  clearToken: () => void;  
}  
  
const API_KEY = process.env.AZURE_OPENAI_API_KEY || "d020880e0119447fbde26d3dcfb09bd7";  
  
const defaultContext: AuthContextType = {  
  token: API_KEY,  
  addToken: () => {},  
  clearToken: () => {},  
};  
  
const AuthContext = React.createContext<AuthContextType>(defaultContext);  
  
export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {  
  const value = useMemo<AuthContextType>(  
    () => ({  
      token: API_KEY,  
      addToken: (token: string) => {  
        console.warn("Attempting to add a token, but the token is read-only.");  
      },  
      clearToken: () => {  
        console.warn("Attempting to clear the token, but the token is read-only.");  
      },  
    }),  
    []  
  );  
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;  
};  
  
export const useAuth = () => useContext(AuthContext);  


// import React, { PropsWithChildren } from "react";
// import secureLocalStorage from "react-secure-storage";

// const defaultContext = {
//   token: "",
//   addToken: () => {},
//   clearToken: () => {},
// };

// const AuthContext = React.createContext<{
//   token: string;
//   addToken: (token: string) => void;
//   clearToken: () => void;
// }>(defaultContext);

// export const AuthProvider = ({ children }: PropsWithChildren) => {
//   const [token, setToken] = React.useState("");

//   React.useEffect(() => {
//     const token = secureLocalStorage.getItem("open-ai-token") as string;
//     if (token) {
//       setToken(token);
//     }
//   }, []);

//   const addToken = (token: string) => {
//     setToken(token);
//     secureLocalStorage.setItem("open-ai-token", token);
//   };

//   const clearToken = () => {
//     setToken("");
//     secureLocalStorage.removeItem("open-ai-token");
//   };

//   const value = React.useMemo(() => ({ token, addToken, clearToken }), [token]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => React.useContext(AuthContext);
