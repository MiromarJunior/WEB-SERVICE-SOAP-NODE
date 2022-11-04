
var soap = require('soap');
var url = 'http://localhost:9000/wsdl?wsdl';


// Create client
soap.createClient(url, function (err, client) {
  if (err){
    throw err;
  }
  
  args = {
    cpf : "51291523014",
    id : "72"
  }

  
//   client.listarTodosUsuarios(function (err, res) {
//     if (err)
//       throw err;     
//     console.log(res); 
//   });
  client.listaUsuarioCPF(args,function (err, res) {
    if (err)
      throw err;     
    console.log(res); 
  }); 
  
  
//   client.listaUsuarioID(args,function (err, res) {
//     if (err)
//       throw err;     
//     console.log(res); 
//   });



  
});

