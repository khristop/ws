var Service = require('node-windows').Service;
var direccion = 'C:\\Path\\to\\app.js'; //se debe de cambiar por la direccion que se establecio
// Create a new service object
var svc = new Service({
    name:'Web Socket Node',
    description: 'Servidor web socket para el envio bidireccional de datos en tiempo real.',
    script: direccion
});

// Listen for the 'uninstall' event so we know when it is done.
svc.on('uninstall',function(){
    console.log('Uninstall complete.');
    console.log('The service exists: ',svc.exists);

});

// Uninstall the service.
svc.uninstall();
