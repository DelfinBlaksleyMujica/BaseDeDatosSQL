const { options } = require("./options/mysql.js")
const knex = require("knex")(options);

const createTable = async () => {
    try{
        await knex.schema.createTable("productos" , table => {
            table.increments("id")
            table.string("title" , 15 )
            table.string("descripcion" , 150 )
            table.integer("codigoDeProducto")
            table.integer("price")
            table.string("thumbnail")
            table.integer("stock")
            table.string("timestamp")
        })
        console.log("Tabla creada");
    } catch ( error ) { 
        console.log("Error" , e.message);
    } finally { 
        knex.destroy();
    }
}

createTable();