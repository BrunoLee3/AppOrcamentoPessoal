class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor 
    }

    //verifica o valor de cada atributo, se algum dado for inválido retorna false.
    validarDados(){
        for(let i in this){
            if(this[i] === undefined || this[i] === '' || this[i] === null){
                return false
            }
        }
        return true
    }
}

//classe responsável por controlar o local storage
class Bd{
    constructor(){
        //atrbuição do ID para a variável id
        let id = localStorage.getItem('id')

        //se id for nulo, seta a id como 0
        if(id===null){
            localStorage.setItem('id', 0)
        }
    }

    //método que cria o ID dinâmicamente
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    //método que recebe o objeto despesa e converte-o em JSON para armazenar em local storage
    gravar(d){
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        let despesas = []

        let id = localStorage.getItem('id') //recuperando o ID
        
        //recuperando todas as despesas cadastradas em local storage e passando como objeto para um array
        for(let i = 1; i <= id; i++){

            let despesa = JSON.parse(localStorage.getItem(i))


            //despesas que foram excluídas não serão passadas para o array
            if(despesa !== null){
                despesa.id = i
                despesas.push(despesa)
            }
        }
        return despesas
    }

    //método para filtar as despesas
    pesquisar(despesa){

        let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()

		//ano
		if(despesa.ano !== ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
			
		//mes
		if(despesa.mes !== ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if(despesa.dia !== ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if(despesa.tipo !== ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if(despesa.descricao !== ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if(despesa.valor != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		
		return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

//function acionada pelo botao 
function cadastrarDespesa(){
    //elementos sendo atribuídos a variáveis locais
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //instanciândo objeto da classe despesa com os valores das variaveis anteriores
    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
  
    //validando os dados antes de gravar em local storage
    if(despesa.validarDados()){
        //chamando o método "gravar" passando o objeto instânciado como parâmetro 
        bd.gravar(despesa) 

        dialogSucesso()
        $('#erroGravacao').modal('show')

        //limpando os campos
        ano.value = ''
        mes.value = ''
        dia.value = '' 
        tipo.value = '' 
        descricao.value = '' 
        valor.value = '' 

    }else{
        dialogErro()
        $('#erroGravacao').modal('show')
    }

}

function dialogErro(){
    document.getElementById('header-modal').className = 'modal-header text-danger'
    document.getElementById('titulo-modal').innerHTML = 'Erro!'
    document.getElementById('botao-close').className = 'btn btn-danger'
    document.getElementById('botao-close').innerHTML = 'Fechar'
    document.getElementById('corpo-modal').innerText = 'Há dados inválidos ou incompletos.'
}

function dialogSucesso(){
    document.getElementById('header-modal').className = 'modal-header text-success'
    document.getElementById('titulo-modal').innerHTML = 'Despesa Registrada!'
    document.getElementById('botao-close').className = 'btn btn-success'
    document.getElementById('botao-close').innerHTML = 'Fechar'
    document.getElementById('corpo-modal').innerHTML = 'A despesa foi registrada com sucesso.'
}

//o parametro default é um array vazio
function carregaListaDespesas(despesas = Array(), filtroAtivado = false){
    //se nenhum parametro for passado, ele recupera todas as despesas
    if(despesas.length == 0 && filtroAtivado == false){
        despesas = bd.recuperarTodosRegistros()
    }

    //selecionando o elemento tbody da tabela de consulta
    let listaDespesas = document.getElementById('lista-despesas')

    listaDespesas.innerHTML = ''

    //percorrendo o array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d){ // d = despesa
        //criando linha(tr)
        let linha = listaDespesas.insertRow()

        //criando colunas(td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break    
            case '3': d.tipo = 'Lazer'
                break 
            case '4': d.tipo = 'Saúde'  
                break
            case '5': d.tipo = 'Transporte'   
                break 
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criando o botao de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){

            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)

            dialogRemovido()
            $('#erroGravacao').modal('show')
            
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })
}

function pesquisaDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    //instanciando um objeto que contém os valores inseridos na barra de filtro
    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}

function dialogRemovido(){
    document.getElementById('header-modal').className = 'modal-header text-warning'
    document.getElementById('titulo-modal').innerHTML = 'Despesa Excluída!'
    document.getElementById('corpo-modal').innerHTML = 'A despesa foi excluída com sucesso'
    document.getElementById('botao-close').className = 'btn btn-warning'
    document.getElementById('botao-close').innerHTML = 'Fechar'
}