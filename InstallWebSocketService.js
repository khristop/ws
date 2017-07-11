var Service = require('node-windows').Service;
var direccion = 'C:\\Path\\to\\app.js'; //se debe de cambiar por la direccion que se establecio
// Create a new service object
var svc = new Service({
    name:'Web Socket Node',
    description: 'Servidor web socket para el envio bidireccional de datos en tiempo real.',
    script: direccion
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
    svc.start();
});

svc.install();
