
var soap = require('soap');
var express = require('express');
var fs = require('fs');
require("dotenv").config();
var oracledb = require("oracledb");
var dbConfig = require("./configDB")

// the splitter function, used by the service
// function splitter_function(args) {
//     //console.log('splitter_function');
//     var splitter = args.splitter;
    
//     var splitted_msg = args.message.split(splitter);
//     var result = [];
//     console.log(splitted_msg,"novo teste");
//     for (var i = 0; i < splitted_msg.length; i++) {
//         result.push(splitted_msg[i]);
//     }
//     return {
//         result: result
//     }
// }



const getAllUsuarios = async () => {
    let connection = await oracledb.getConnection(dbConfig);
    try {
        let result = await connection.execute(
            `SELECT US.ID_USUARIO,
        US.USRO_USUARIO AS USUARIO,
        US.USRO_NOME    AS NOME,
        US.USRO_CPF     AS CPF
       FROM USUARIO US`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        }
        );

        return result.rows;
    } catch (error) {
        console.log("Erro", error);
        return {
            erro: error
        }

    } finally {
        if (connection) {
            try {
                await connection.close();

            } catch (error) {
                console.error(error);
            }
        }
    }
}
const getUsuarioCPF = async (args) => {
    let connection = await oracledb.getConnection(dbConfig);
    try {
        let result = await connection.execute(
            `SELECT US.ID_USUARIO,
          US.USRO_USUARIO AS USUARIO,
          US.USRO_NOME    AS NOME,
          US.USRO_CPF     AS CPF
         FROM USUARIO US
         WHERE USRO_CPF = :CPF
         
         `, [args.cpf], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        }
        );

        return result.rows.length > 0 ? result.rows : { result: "Nenhum registro encontrado" };
    } catch (error) {
        console.log("Erro", error);
        return {
            erro: error.message
        }

    } finally {
        if (connection) {
            try {
                await connection.close();

            } catch (error) {
                console.error(error);
            }
        }
    }
}
const getUsuarioID = async (args) => {
    let connection = await oracledb.getConnection(dbConfig);
    try {
        let result = await connection.execute(
            `SELECT US.ID_USUARIO,
          US.USRO_USUARIO AS USUARIO,
          US.USRO_NOME    AS NOME,
          US.USRO_CPF     AS CPF
         FROM USUARIO US
         WHERE ID_USUARIO = :IDUSER
         
         `, [args.id], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        }
        );

        return result.rows.length > 0 ? result.rows : { result: "Nenhum registro encontrado" };
    } catch (error) {
        console.log("Erro", error);
        return {
            erro: error.message
        }

    } finally {
        if (connection) {
            try {
                await connection.close();

            } catch (error) {
                console.error(error);
            }
        }
    }
}


// the service
var serviceObject = {
    WebServiceNodeJs: {
        WebServiceNodeJsPort: {
           // MessageSplitter: splitter_function,
            listarTodosUsuarios: getAllUsuarios,
            listaUsuarioCPF: getUsuarioCPF,
            listaUsuarioID: getUsuarioID


        }
    }
};


// load the WSDL file
var xml = fs.readFileSync('webService.wsdl', 'utf8');
// create express app
var app = express();

// root handler
// app.get('/', function (req, res) {
//   //res.send('Node Soap Example!<br /><a href="https://github.com/macogala/node-soap-example#readme">Git README</a>');
// })

// Launch the server and listen
var port = 9000;
app.listen(port, function () {
    console.log('Listening on port ' + port);
    var wsdl_path = "/wsdl";
    soap.listen(app, wsdl_path, serviceObject, xml);
    console.log("Check http://localhost:" + port + wsdl_path + "?wsdl to see if the service is working");
});