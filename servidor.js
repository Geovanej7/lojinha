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

app.get('/alteraProduto', (req, res) => {

    var idProduto = req.query.id

    produto.findOne({
        where: {
            id: idProduto
        }

    }).then((produtos) => {

        var formulario = 
        `<form action="/updateProduto" method="post">
            <input type='hidden' name='idUp' value='${produtos.id}'><br>
            Código:<input type='text' name='codigoUp' id='codigo' value='${produtos.codigo}'> <br>
            Nome do Produto: <input type='text' name='nomeUp' id='nome' value='${produtos.nome}'> <br>
            Preço: <input type='text' name='precoUp' id='preco' value='${produtos.preco}'> <br>
            Marca: <input type="text" name="marcaUp" id="marca" value='${produtos.marca}'><br>
            <input type='submit' value='Cadastrar'>
        </form>`

        res.send(formulario)
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})

app.post('/updateProduto', urlencodedParser, (req, res) => {

    let idUp = req.body.idUp
    let codigoUp = req.body.codigoUp
    let nomeUp = req.body.nomeUp
    let precoUp = req.body.precoUp
    let marcaUp = req.body.marcaUp

    produto.update({
        codigo: codigoUp,
        nome: nomeUp,
        preco: precoUp,
        marca: marcaUp
    } , {
        where: {
            id: idUp
        }
    }).then((produto) => {
        res.send('Produto alterado com sucesso!')
    }).catch((erro) => {
        res.send('Erro: ' + erro)
    })
})

	app.listen(port, () => {
 console.log("Esta aplicação está escutando a porta" + port)
})
