class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo 
		this.descricao = descricao
		this.valor = valor
	}
	validarDados() {
		for(let i in this) {
			//console.log(i, this[i])
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class DB {
	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}
	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId)+1
	}
	gravar(d) {
		let id = this.getProximoId()
		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id',id)
	}
	recuperarTodosRegistros() {
		//array de despesas
		let despesas = Array()
		
		let id = localStorage.getItem('id')

		for (let i = 1; i<= id; i++) {
			//recuperar despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//indices vazios
			if(despesa === null) {
				continue
			}
			despesa.id = i
			despesas.push(despesa)
		}
		return despesas
	}

	pesquisar(despesa) {
		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		//console.log(despesasFiltradas)

		//ano
		if (despesa.ano != '') {
			console.log('Ano')
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}

		//mes
		if (despesa.mes != '') {
			console.log('Mes')
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}
		//dia
		if (despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}
		//tipo
		if (despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if (despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}
		//valor
		if (despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}
		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)
	}
}

let bd = new DB()

function getCampos() {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')
}

function cadastrarDespesa() {
	getCampos()

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

	//storage
	if(despesa.validarDados()) {
		bd.gravar(despesa)
		formataModal("Sucesso na gravação!", "Depesa cadastrada com sucesso!")
		$('#modalRegistraDespesa').modal('show')
		limparCampos()
		
	} else {
	//dialog erro
		formataModal("Erro na gravação!", "Existem campos obrigatórios vazios!", 'erro')
		$('#modalRegistraDespesa').modal('show')
	}
}

function formataModal(title, text, tipo) {
	document.getElementById('modalTitulo').innerHTML = title
	document.getElementById('modalTexto').innerHTML = text
	var header = document.getElementById('modalHeader')
	var button = document.getElementById('btnModal')

	if (tipo === 'erro') {
		header.className = "modal-header text-danger"
		button.className = "btn btn-danger"
		button.innerHTML = "Voltar e corrigir"
	} else {
		header.className = "modal-header text-success"
		button.className = "btn btn-success"
		button.innerHTML = "OK"
	}
}

function carregaListaDespesas(despesas = Array(), filtro=false) {
	if(despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}

	//seleciona elemento tbody
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ""
	
	//percorrer o array depesas
	despesas.forEach(function(d) {
		
		//criando a linha (tr)
		let linha = listaDespesas.insertRow()

		//criar as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

		//ajustar o tipo
		switch(d.tipo) {
			case '1':
				d.tipo = 'Alimentação'
			break
			case '2':
				d.tipo = 'Educação'
			break
			case '3': 
				d.tipo = 'Lazer'
			break
			case '4':
				d.tipo = 'Saúde'
			break
			case '5': 
				d.tipo = 'Transporte'
			break
		}

		//console.log(sau)
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = `R$ ${d.valor}`

		//botao exclusao
		let btn = document.createElement("button")
		btn.className = "btn btn-danger"
		btn.innerHTML = "<i class='fas fa-times'></i>"
		btn.id = d.id
		btn.onclick = function() {
			formataModal("Atenção!", "Tem certeza que deseja deletar o registro?", "erro")
			$('#modalAlerta').modal('show')
			var btnModal = document.getElementById('btnModal')
			btnModal.innerHTML = "Sim"
			btnModal.onclick = function() {
				bd.remover(d.id)
				window.location.reload()
			}
		}
		linha.insertCell(4).append(btn)
	}) 
}
	
function pesquisarDespesas() {
	getCampos()

	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
	let despesas = 	bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)
}

function analisarDespesas() {
	//Despesas por categoria
	let despesa = new Despesa()
	let despesas = 	bd.pesquisar(despesa)
	carregaListaDespesas(despesas, false)

	console.log(despesas)

	//Despesas por ano

	//Despesas por mes

	//Despesas por semana

	//Despesas por dia

	//Despesas frequentes
}

function limparCampos() {
	let ano = document.getElementById('ano').value = ''
	let mes = document.getElementById('mes').value = ''
	let dia = document.getElementById('dia').value = ''
	let tipo = document.getElementById('tipo').value = ''
	let descricao = document.getElementById('descricao').value = ''
	let valor = document.getElementById('valor').value = ''
}