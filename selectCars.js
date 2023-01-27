const { options } = require("./options/mysql.js");
const knex = require("knex")(options);

class Contenedor {
    constructor(configuracion , tabla  ){
        this.configuracion = configuracion,
        this.tabla = tabla
    }
    
}




knex
    .from("productos")
    .select("*")
    .then((rows) => {
        for ( const row of rows ) {
            console.log(`${row["id"]} ${row["title"]} ${row["descripcion"]} ${row["codigoDeProducto"]} ${row["price"]} ${row["thumbnail"]} ${row["stock"]} ${row["timestamp"]}`);
        }
    })
    .catch( (err) => {
        console.log(err);
        throw err;
    })
    .finally(() => {
        knex.destroy();
    });