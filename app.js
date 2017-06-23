/*
*   WebSocket para el manejo de incidendicas
*   en tigo
*   TigoLife
* */

var express = require('express');
var path = require('path');

//creacion del server express
var app = express();
var http = require('http');
var server =  http.Server(app);

server.listen(3000, function(){
    console.log('listening on *:3000');
});

//variable para el socket
var io = require('socket.io')(server);

// configuracion de la direccion de los archivos html
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// configuracion de la direccion de los archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// toma la raiz y renderiza un html
app.get('/', function(req, res){
    res.sendFile(__dirname+'/index.html');
});

//coneccion a el server de php

function peticionWS(metodo, parametros) {
//metodo es un string con el tipo de metodo, parametros un json con los parametros
    var options = {
        host: '192.168.19.58',
        port: '8080',
        path: '/tigolife/ajax/webSocketData.php',
        method: 'POST'
    };

    if(metodo != '' && metodo != null){
        options.method = metodo;
    }else{
        return 'metodo no especificado';
    }

    if(parametros && parametros.length){
        options['headers'] = parametros;
    }
    console.log(options);

    var req = http.request(options, function (res) {
        console.log('entra');
        console.log('STATUS: ' + res.statusCode+ 'HEADERS: ' + JSON.stringify(res.headers));

        var partesRespuesta = [];
        res.on('data', function(parte) {
            partesRespuesta.push(parte);
            console.log('partes:' + partesRespuesta);
        }).on('end', function() {
            var dataRes = Buffer.concat(partesRespuesta);
            console.log('DATA: ' + dataRes);
            //return dataRes;
        })
    });

    req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });
}

//WebSocket
//eventos
var listaTickets = [];

var tickets = io
    .of('/ticket')
    .on('connection', function (socket) {
        console.log('nuevo usuario conectado');

        if(listaTickets.length == 0){
            console.log('entra porque no hay');
            var lista = peticionWS({
                action: 2
            });
            if( lista != null){
                listaTickets = lista;
            }
        }
        //socket.broadcast.emit('tickets', listaTickets);

        socket.on('disconnect', function(){
            console.log('usuario desconectado');
        });

        socket.on('nuevo ticket', function(ticket){
            socket.emit('nuevo ticket', ticket);
            //post hacia el ws
            listaTickets.push(ticket);
            
        });

        socket.on('asignar ticket', function (ticketActualizado) {
            console.log('ticket actualizado');
            socket.on('asginado', ticketActualizado);
            index = listaTickets.indexOf(ticketActualizado['id']);
            listaTickets[index]= ticketActualizado;
        });

        socket.on('estado ticket', function (idTicket, status) {

        })
    });

//carga del server en el puerto especificado


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('No encontrado');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
