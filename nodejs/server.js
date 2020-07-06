const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

const CryptoJS = require("crypto-js")
port = process.env.PORT || 3001;
const cors = require('cors')

const mysql = require('mysql');
const aesEncryptKey = "NUESTRA_CLAVE_DE_ENCRIPTACION";
// connection configurations

const mc = mysql.createConnection({
    host: '192.168.1.70',
    user: 'nodejs',
    password: 'nodejs',
    database: 'multiusuario'
});

mc.connect(function (err) {
    if (err) throw err;
});

app.listen(port);

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(bodyParser.json());
app.get('/verificarDb', function (req, res) {
    //Una llamada para verificar la existencia de la tabla usuarios
    mc.query("Select * from usuarios", function (err, queryResult) {

        if (err) {
            console.log("error: ", err);
            res.send("Error al obtener tabla usuarios: " + err)
        } else {
            console.log('tasks : ', res);

            res.send(queryResult);
        }
    });
})
const validateEmail = (mail) =>
{
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(mail).toLowerCase());
}

app.post('/authUser', function (req, res) {
    const {
        correo,
        clave
    } = req.body;

    if(correo === undefined || correo === null || correo === ""){
        return res.send({
            title:"Error 👾",
            message:"El correo es un campo obligatorio"
        })
    }


    if(clave === undefined || clave === null || clave === ""){
        return res.send({
            title:"Error 👾",
            message:"La clave es un campo obligatorio"
        })
        return;
    }

    var encryptedAES = CryptoJS.AES.encrypt(clave, aesEncryptKey);
    var encryptedPasswordString = encryptedAES.toString();
    console.log(encryptedPasswordString)

    mc.query(`Select * from usuarios where correo = "${correo}" and clave = "${clave}"`, function (err, queryResult) {
        if (err) {
            console.log(err)
            return res.send({
                title:"Error 👾",
                message:"Error desconocido."
            })
        }
        if(queryResult.length > 0){
            var usuario = queryResult[0];
            return res.send({
                title:"Hola",
                message:"Buenvenido de nuevo",
                status:"success",
                nombre:usuario.nombre,
                apellido:usuario.apellido,
                correo:usuario.correo,
                rol:usuario.rol
            })
        }else{
            return res.send({
                title:"Error 👾",
                message:"No se encontró al usuario"
            })
        }
    })

})


app.post('/createUser', function (req, res) {
    //Creación de usuario

    const {
        nombre,
        apellido,
        correo,
        clave,
        rol
    } = req.body;

    //Validamos que traiga todos los campos
    if(nombre === undefined || nombre === null || nombre === ""){
        return res.send({
            title:"Error 👾",
            message:"El nombre es un campo obligatorio"
        })
        return;
    }

    if(rol === undefined || rol === null || rol === ""){
        return res.send({
            title:"Error 👾",
            message:"El rol es un campo obligatorio"
        })
        return;
    }

    if(apellido === undefined || apellido === null || apellido === ""){
        return res.send({
            title:"Error 👾",
            message:"El apellido es un campo obligatorio"
        })
    }

    if(correo === undefined || correo === null || correo === ""){
        return res.send({
            title:"Error 👾",
            message:"El correo es un campo obligatorio"
        })
    }


    if(clave === undefined || clave === null || clave === ""){
        return res.send({
            title:"Error 👾",
            message:"La clave es un campo obligatorio"
        })
        return;
    }

    try{
        if(clave.length < 8){
            return res.send({
                title:"Error 👾",
                message:"La clave debe tener al menos 8 caracteres"
            })
        }
    }catch(error){
        console.log("error" + error)
    }

    /*
        Ejemplo para encriptar y desencriptar en AES usando la librería CRYTPO JS 🔑
        var encryptedAES = CryptoJS.AES.encrypt("Message", "My Secret Passphrase");
        var decryptedBytes = CryptoJS.AES.decrypt(encryptedAES, "My Secret Passphrase");
        var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
    */

    //Primero vamos a revusar que no tenga un usuario con el miso correo
    mc.query(`Select * from usuarios where correo = "${correo}"`, function (err, queryResult) {

        if (err) {
            console.log(err)
            return res.send({
                title:"Error 👾",
                message:"Error desconocido."
            })
        } else {
            //onsole.log('tasks : ', res);
            //res.send(queryResult);
            if(queryResult.length > 0){
                //Hay usuario
                return res.send({
                    title:"Error 👾",
                    message:`Ya existe un usuario con el correo ${correo}`
                })
            }else{
                //NO hay correo :)

                //Encriptar clave
                //Probando el encriptado
                var encryptedAES = CryptoJS.AES.encrypt(clave, aesEncryptKey);
                var encryptedPasswordString = encryptedAES.toString();

                mc.query(`INSERT INTO usuarios (nombre, apellido, correo, clave, rol) VALUES ("${nombre}","${apellido}","${correo}","${clave}","${rol}")`, function (err, queryResult) {
                    if(err){
                        console.log(err)
                        return res.send({
                            title:"Error 👾",
                            message:`Error guardando el usuario, inténtalo más tarde`
                        })
                    }
                    console.log("Resultado: " + queryResult)
                    res.send({
                        title:"Éxito ✅",
                        message:`Usuario registrado :)`
                    })
                })
            }
        }
    });
    
})