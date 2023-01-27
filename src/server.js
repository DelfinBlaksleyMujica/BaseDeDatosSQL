const express = require("express");

const ContenedorProductos = require("./contenedores/ContainerProducts.js");

const productosRouter = require("./routes/productsRouter");


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use("/api/productos" , productosRouter);


app.get("*" , function ( req , res ) {
    res.send({ status:"error" , description: `ruta ${ req.url } metodo ${req.method } no implmentada`})
})

module.exports = app;