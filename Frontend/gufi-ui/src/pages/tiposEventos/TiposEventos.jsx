import { Component } from "react";

export default class TiposEventos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listaTiposEventos: [],
            titulo: "",
            IdTipoEventoAlterado: 0
        }
    };

    limparCampos = () => {
        this.setState({
            titulo : '',
            IdTipoEventoAlterado : 0
        })
        console.log("Os states foram resetados");
    }

    buscarTipoEventos = () => {

        console.log("agora vamos fazer a chamada para a API")


        //funcao nativa JS, ele é uma API com métodos.

        //dentro dos parenteses vamos informar qual é o endpoint
        fetch('http://localhst:5000/api/tipoeventos',{
            headers : {
                'Authorization' : 'Bearer' + localStorage.getItem('usuario-login')
            }
        })
            //por parão ele sempre inicia como GET.

            //quando vvc tiver um retorno vai trazer a resposta em json

            //Define o tipo de dado do retorn da requisição como JSON
            .then(resposta => resposta.json())

            //Atualizar o state listaTipoEventos com os dados obtidos em formato json
            .then(dados => this.setState({ listaTiposEventos: dados }))

            .catch(erro => console.log(erro))
    };

    atualizaEstadoTitulo = async (event) => {

        console.log("acionou a função");

        await this.setState({

            //dizendo que o target (letclagem) do evento, vamos pegar o value(valor)
            titulo: event.target.value
        })

        console.log(this.state.titulo);
    };

    manipularTipoEvento = (event) => {
        event.preventDefault();

        //Caso algum tipo de evento seja selecionado para edição,
        if (this.state.IdTipoEventoAlterado !== 0) {

            //faz a chamada para a API usando fetcj e passando o ID do tipo de evento que será atualizado na URL da requisição
            fetch('http://localhst:5000/api/tipoeventos/' + this.state.IdTipoEventoAlterado, {
                //Define o método da requisição
                method: 'PUT',
                //Define o corpo da requisição especicando o tipo(JSON)
                body: JSON.stringify({ tituloTipoEvento: this.state.titulo }),
                //Define o cabeçalho da requisição
                headers: {
                    "Content-Type": "application/json",
                    'Authorization' : 'Bearer' + localStorage.getItem('usuario-login')
                }
            })

                .then(resposta => {
                    //Caso a requisição retorne um status code 204
                    if (resposta.status === 204) {
                        //Exibe no console a mensagem
                        console.log(
                            "O Tipo de evento" + this.state.IdTipoEventoAlterado + " foi atualizado",
                            "Seu novo título agora é: " + this.state.titulo

                        )
                    }
                })

                .catch(erro => console.log(erro))


                //Então, atualiza a lista de tipos de eventos sem o usuário executar outra ação
                .then(this.buscarTipoEventos)

                .then(this.limparCampos);
        }
        else 
        {

                fetch('http://localhst:5000/api/tipoeventos', {
                    method: 'POST',
                    //body: {tituloTipoEvento = this.state.titulo} lembrando que aqui é um objeto JS e não um json

                    body: JSON.stringify({ tituloTipoEvento: this.state.titulo }),

                    headers: {
                        "Content-Type": "application/json",
                        'Authorization' : 'Bearer' + localStorage.getItem('usuario-login')
                    }
                })

                    .then(console.log("Tipo de evento cadastrado"))

                    .catch(erro => console.log(erro))

                    .then(this.buscarTipoEventos)

                    .then(this.limparCampos);

            };

        }


    componentDidMount() {
        this.buscarTipoEventos();
    }

    buscarTipoEventoPorId = (tipoEvento) => {
        this.setState({
            //Atualiza o state idTipoEventoAlterado com o valo do Id recebido
            IdTipoEventoAlterado: tipoEvento.IdTipoEvento,
            //Atualiza o state titulo com o valo do titulo recebido
            titulo: tipoEvento.tituloTipoEvento
        }, () => {
            console.log(
                "O tipo de evento " + tipoEvento.IdTipoEvento + " foi selecionado ", "agora o valor do state idTipoEventoAlterado é: " + this.state.IdTipoEventoAlterado + " e o valor do state titulo é: " + this.state.titulo
            )
        });
    }

    excluirTipoEvento = (tipoEvento) => {
        console.log("O tipo de evento " + tipoEvento.IdTipoEvento + "foi selecionado");

        //faz a chamada para a API usando fetcj e passando o ID do tipo de evento que será atualizado na URL da requisição
        fetch('http://localhst:5000/api/tipoeventos/' + this.state.IdTipoEventoAlterado, {
            //Define o método da requisição
            method: 'DELETE',
            headers : {
                'Authorization' : 'Bearer' + localStorage.getItem('usuario-login')
            }
        }) 

        .then(resposta => {
            if(resposta.status === 204){
                console.log("O tipo de evento " + tipoEvento.IdTipoEvento + "foi excluido");
            }
        })

        .catch(erro => console.log(erro))

        .then(this.buscarTipoEventoPorId);
        

    }

    render() {
        return (
            <div>
                <main>
                    <section>
                        {/* Subtítulo da página */}
                        <h2>Lista de Tipos de Eventos</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Titulo</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    this.state.listaTiposEventos.map((tipoEvento) => {
                                        return (
                                            <tr key={tipoEvento.IdTipoEvento}>
                                                <td>{tipoEvento.IdTipoEvento}</td>
                                                <td>{tipoEvento.titulo}</td>

                                                <td><button onClick={() => this.buscarTipoEventoPorId(tipoEvento)}>Editar</button></td>

                                                <td><button onClick={() => this.excluirTipoEvento(tipoEvento)}>Excluir</button></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </section>

                    <section>
                        {/* Cadastro por tipo de evento */}
                        <h2>Cadastro de tipo evento</h2>

                        <form onSubmit={this.manipularTipoEvento}>
                            <div>
                                {/*  valor do state é o input */}
                                <input type="text" value={this.state.titulo} placeholder="Titulo do tipo de evento"

                                    //cada vez que tiver mudança (por tecla)
                                    onChange={this.atualizaEstadoTitulo} />
                                    {/* <button type="submit">Cadastrar</button> */}

                                    {/* Altera o texto do botão de acordo com a operação( edição ou cadastro)  */}

                                    {/* Estrutura de um IF ternário
                                    
                                    CONDIÇÂO ? ACONTECE ALGO CASO VERDADEIRO : ACONTECE ALGO CASO FALSO

                                    */}

                                    {/* {
                                        this.state.IdTipoEventoAlterado === 0?
                                        <button type="submit">Cadastrar</button> : <button type="submit">Atualizar</button>
                                    } */}

                                    {
                                        <button type="submit" disable={ this.state.titulo === '' ? 'none': '' }>
                                            {this.state.IdTipoEventoAlterado === 0? "Cadastrar" : "Atualizar"}
                                        </button>
                                    }
                                    
                                    {/* Faz a chamada da função limpar campos */}

                                    <button type="button" onClick={this.limparCampos}>
                                        Cancelar
                                    </button>

                                    {/* Caso algum tipo de evento tenha sido selecionado para edição, exibe uma mensagem de feedback ao usuário */}

                                    {
                                        this.state.IdTipoEventoAlterado !== 0 && 
                                        <div>
                                            <p>O tipo de evento {this.state.titulo} está sendo editado.</p>
                                            <p>Clique em Cancelar, caso queira cancelar a operação antes de cadastrar um novo tipo de evento</p>
                                        </div>
                                    }

                            </div>
                        </form>


                    </section>
                </main>
            </div>
        )
    }

};

