const express = require("express");
const { options } = require("../../options/mysql.js")
const knex = require("knex")(options);

const { Router } = express;
const productosRouter = new Router();
//Importo la clase Container y la inicio 
const ContenedorProductos = require("../contenedores/ContainerProducts");
const ProductService = new ContenedorProductos( knex , "productos" );
const app = require("../server");

//Funcion Error
function crearErrorNoEsAdmin( ruta , metodo ) {
    const error = { 
        error: -1,
    }
    if ( ruta && metodo ) {
        error.descripcion = `ruta "${ruta}" metodo "${metodo} no autorizado`
    } else {
        error.descripcion = "No autorizado"
    }
    return error;
}


//Middleware para Administrador
const esAdmin = true;

function soloAdmins( req , res , next ) {
    if (!esAdmin) {
        res.json(crearErrorNoEsAdmin( req.url , req.method ))
    }else { 
        next();
    }
}


//Endpoints
productosRouter.get( "/" , async ( req , res ) => {
    try {
        let productos = await knex
        .from("productos")
        .select("*")
        res.send({message: productos})
    } catch (error) {
        res.status(500).send({ message : error.message })
    }finally{
        console.log("Conexion cerrada")
        knex.destroy();
    }
})

productosRouter.get( "/:id" , async ( req , res ) => {
    try{
        if (req.params) {
            const { id } = req.params;
            let producto = await knex
            .from("productos")
            .select("id" , "title" , "price" , "descripcion").where( "id" , "=" , id )
            res.send({ producto: producto})
        }
}catch ( error ) {
    console.log("Error en el get de producto por id");
    res.status(500).send({ message : error.message })
}finally{
    console.log("Conexion cerrada")
    knex.destroy();
}
})

productosRouter.post("/" , soloAdmins, ( req , res ) => {
    try {
        if (req.body.title && req.body.descripcion && req.body.codigoDeProducto && req.body.price && req.body.thumbnail && req.body.stock ) {
            let obj = req.body;
            obj ={...obj , timestamp: Date()}
            ProductService.save(obj);
            console.log("Se agrego un nuevo producto");
            return res.status(200).send({ nuevoProducto: obj })
        }
        console.log("No se completo toda la informacion del producto");
        res.status(200).send({ message:"Debe completar toda la informacion del producto para poder cargarlo" })
    }catch ( error ) {
            res.status(500).send({ message : error.message })
        }
    }  
)

productosRouter.put("/:id" , soloAdmins , async ( req , res ) => {
    try {
        if (req.params) {
            const { id } = req.params;
            if (req.body.title && req.body.descripcion && req.body.codigoDeProducto && req.body.price && req.body.thumbnail && req.body.stock) {
                const { title , descripcion , codigoDeProducto , price , thumbnail , stock  } = req.body;
                await knex.from("productos").where("id" , id ).update({ title: title , descripcion: descripcion , codigoDeProducto: codigoDeProducto , price: price , thumbnail: thumbnail , stock: stock , timestamp: Date() })
                .then(() => {
                    console.log("Car update");
                    return res.send({ message: "Producto actualizado"})
                }).catch((err) => {
                    console.log(err); throw err
                })
            }
        }
    } catch (error) {
        res.status(500).send({ message : error.message })
    }finally{ 
        console.log("Conexion cerrada")
        knex.destroy()
    }
})







module.exports = productosRouter;