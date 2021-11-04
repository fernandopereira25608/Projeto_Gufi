//auth comes from authentication

//define a constante usuarioAutrnticado para verificar se o usuário está logado 
export const usuarioAutenticado = () => localStorage.getItem('usuario-login') !== null;

//usuarioAutenticado() true -> logado / false -> não logado

//define a constante parse Jwt que retorna o payload do usuário logado convertido em JSON
export const parseJwt = () =>{

    //define a variavel base64 que recebe o paylooad do usuário logado
    let base64 = localStorage.getItem("usuario-login").split(".")[1];

    //converte o valor de base64 para string e em seguida para JSON
    return JSON.parse( window.atob(base64))
}