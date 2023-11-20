const express = require('express')
const app = express()
app.use(express.static('public'))
const port = 3000
const bodyParser = require("body-parser")
var urlencodedParser = bodyParser.urlencoded({extended:
false})

const { Op } = require("sequelize")
const Produto = require('./model/produto')
//Produto.sync()


app.get('/', (req, res) => {
 res.send('Bem vindo a loja');
})

app.post('/produtos',urlencodedParser,(req,res)=>{

var nomeFiltro = req.body.nome;

var todosProdutos = "<table><tr><th>código</th><th>nome</th><th>preço</th><th>marca</th><th>horário</th><th>id</th><tr>"

nomeFiltro= '%'+ nomeFiltro +'%'

Produto.findAll({
	where:{
		nome:{[Op.like]:nomeFiltro}}
}).then(function(produtos){
	console.log(produtos)
	
for(var i = 0; i < produtos.length;i++){
	todosProdutos += "<tr>"
	todosProdutos += " <td> " + produtos[i].codigo+"</td>"
	todosProdutos += " <td> " + produtos[i].nome+"</td>"
	todosProdutos += " <td> " + produtos[i].preco+"</td>"
	todosProdutos += " <td> " + produtos[i].marca+"</td>"
	todosProdutos += " <td> " + produtos[i].createdAt+"</td>"
	todosProdutos += " <td> " + produtos[i].id+"</td>"
	todosProdutos += "<tr>"
}

res.send("<b> Veja nossos produtos </b>" + todosProdutos)

	}).catch(function(erro){
	console.log("Erro na consulta: "+erro)
	res.send("Erro na consulta:"+ erro)
	}) 

})



app.post('/insereProdutos',urlencodedParser, (req, res) => {
var codigoProduto = req.body.codigo;
var nomeProduto = req.body.nome;
var precoProduto = req.body.preco;
var marcaProduto = req.body.marca;


var produto = Produto.create({
codigo:codigoProduto,
nome:nomeProduto,
preco:precoProduto,
marca:marcaProduto


}).then(function(){
res.send("Produto inserido com sucesso!")
}).catch(function(erro){
res.send("Erro ao inserir produto: "+erro)
})
});

	app.listen(port, () => {
 console.log("Esta aplicação está escutando a porta" + port)
})