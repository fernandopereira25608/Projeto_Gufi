import {Component} from 'react'
import axios from 'axios'
import { parseJwt } from '../../services/auth';
import { usuarioAutenticado } from '../../services/auth';

// import 'css' 

export default class Login extends Component{
    constructor(props){
        super(props);
        this.state ={
            email : '',
            senha : '',
            erroMensagem: '',
            isLoading: false //variavel flag
        };
    };

    //Função que faz a chamada para API para realizar login
    efetuaLogin = (event) => {
        event.preventDefault();

        this.setState({erroMensagem : "", isLoading : true})

        axios.post("http://localhst:5000/api/login",{
            email: this.state.email,
            senha: this.state.senha
        })

        //Recebe todo o conteúdo da requisição na variável resposta
        .then(resposta => {
            if(resposta.status === 200){
                //Deu certo, exibe o token no console e salva no localstorage
                console.log("Meu token é" + resposta.data.token);
                localStorage.setItem("usuario-login", resposta.data.token)

                //define que a requicao terminou
                this.setState({isLoading : false})

                //Define a variavel base64 que vai receber o payload do token
                //acessa o armazenamento local e através da chave "usuario login" pega o token
                // let base64 = localStorage.getItem("usuario-login").split(".")[1];

                // console.log(window.atob(base64));

                // console.log(JSON.parse(window.atob(base64)));
                //^ logica acima contida no parseJwt

                console.log(parseJwt());

                //exibe as propriedades da página
                // console.log(this.props);

                if (parseJwt().role === "1") {
                    this.props.history.push("/tiposeventos");
                } else{
                    this.props.history.push("/");
                }
            }
        })

        //caso haja erro, o valor do state erroMensagem é definido 
        .catch(() =>{
            this.setState({erroMensagem: "Email e/ou senha inválidos", isLoading : false})
            
        });

    };

    atualizaStateCampo = (campo) =>{
        //Quando estiver digitando no campo email:
        // ex:  this.setState({email: email@legal})
        this.setState({[campo.target.name]: campo.target.value});
    }



    render(){
        return(
            <div>
                <main>
                    <section>
                        <p>Bem vinde <br/> Faça login pra acessar sua conta</p>
                        {/* Chamada para a função de login quando o botao for acionado */}

                        <form onSubmit={this.efetuaLogin}>
                            {/* name deve ser igual ao definido no state */}
                            <input type="email" name="email" value={this.state.email} onChange={this.atualizaStateCampo} placeholder="email"/>
                            <input type="password" name="senha" value={this.state.senha} onChange={this.atualizaStateCampo} placeholder="senha" />
                            
                            {/* Exibe a mensagem de erro caso tenha */}
                            <p style={{color: 'red'}}>{this.state.erroMensagem}</p>

                            {/* verifica se a requisição está em andamento, se estiver, desabilita o click do botao */}
                            {
                                //Caso seja true renderiza o carregando
                                this.state.isLoading === true && 
                                <button type="submit" disabled>Loading</button>

                            }
                            {
                                //Caso seja falso renderiza o login
                                this.state.isLoading === false &&
                                <button type="submit" disabled={this.state.email === "" || this.state.senha === "" ? "none" : ""}>Login</button>
                            }
                        </form>
                    </section>
                </main>
            </div>
        )
    }
};