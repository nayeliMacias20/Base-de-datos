const express = require('express');
const _ = require('underscore');
const UserModel = require('../../models/users.model');
var mongoose = require('mongoose');
const app = express();


//Todos los usuarios
app.get('/', async(req, res) => {
  try {
    if (req.query.idusuarios) req.queryMatch._id = req.query.idUsuario;
    if (req.query.termino) req.queryMatch.$or = Helper(["email", "pass"], req.query.termino);

    const usuario = await UserModel.aggregate([
        {
            $match: { ...req.queryMatch }
        }
    ])

    if (usuario.length <= 0) {
        res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'No se encontro el usuario en la base de datos.',
            cont: {
                usuario
            }
        });
    } else {
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion obtenida correctamente.',
            cont: {
                usuario
            }
        });
    }
} catch (err) {
    res.status(500).send({
        estatus: '500',
        err: true,
        msg: 'Error al obtener a los usuarios.',
        cont: {
            err: Object.keys(err).length === 0 ? err.message : err
        }
    });
}
});

app.post('/', async (req, res) => {//req = obtener datos mandados por el cliente, res = mandar una respuesta
  try {
    const us = new UserModel(req.body);

    let err = us.validateSync();

    if (err) {
        return res.status(400).json({
            ok: false,
            err: true,
            resp: 400,
            msg: 'Error: Error al Insertar el usuario.',
            cont: {
                err
            }
        });
    }

    const usuarioEncontrado = await UserModel.findById({ _id: us._id });
    if (usuarioEncontrado){
        const usuarioUpdated =  await UserModel.findByIdAndUpdate(us._id, req.body, { new: true });
        return res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'El usuario ya existe en la base de datos pero se actualizo.',
            cont:{
                usuarioUpdated
            } 
        });
    }

    const usuario = await us.save();
    if (usuario.length <= 0) {
        res.status(400).send({
            estatus: '400',
            err: true,
            msg: 'No se pudo registrar el usuario en la base de datos.',
            cont: {
                usuario
            }
        });
    } else {
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion insertada correctamente.',
            cont: {
                usuario
            }
        });
    }
    console.log(usuario);
} catch (err) {
    res.status(500).send({
        estatus: '500',
        err: true,
        msg: 'Error al registrar al usuario.',
        cont: {
            err: Object.keys(err).length === 0 ? err.message : err
        }
    });
}
});

// http://localhost:3000/api/place/?idPlaces=603939becf1db633f87595b2
app.put('/', async (req, res) => {
  try {

      const idUser = new mongoose.mongo.ObjectId(req.body._id);
      console.log(req.body._id)

      if (idUser == '') {
          return res.status(400).send({
              estatus: '400',
              err: true,
              msg: 'Error: No se envio un id valido.',
              cont: 0
          });
      }

      req.body._id = idUser;

      const userFind = await UserModel.findById(idUser);

      if (!userFind)
          return res.status(404).send({
              estatus: '404',
              err: true,
              msg: 'Error: No se encontro el usuario en la base de datos.',
              cont: userFind
          });

      const newUser = new UserModel(req.body);

      let err = newUser.validateSync();

      if (err) {
          return res.status(400).json({
              ok: false,
              resp: 400,
              msg: 'Error: Error al Insertar el usuario.',
              cont: {
                  err
              }
          });
      }

      const userUpdate = await UserModel.findByIdAndUpdate(idUser, { $set: newUser }, { new: true });

      if (!userUpdate) {
          return res.status(400).json({
              ok: false,
              resp: 400,
              msg: 'Error: Al intentar actualizar el usuario.',
              cont: 0
          });
      } else {
          return res.status(200).json({
              ok: true,
              resp: 200,
              msg: 'Success: Se actualizo el usuario correctamente.',
              cont: {
                userUpdate
              }
          });
      }

  } catch (err) {
      res.status(500).send({
          estatus: '500',
          err: true,
          msg: 'Error: Error al actualizar el usuario.',
          cont: {
              err: Object.keys(err).length === 0 ? err.message : err
          }
      });
  }
});

app.delete('/', async (req, res) => {//se pueden declara variables dentro de la url usadas para eliminar
  try {

    const idUser = new mongoose.mongo.ObjectId(req.body._id);
    console.log(req.body._id);
    blnActivo = req.body.blnActivo;

    if (req.query.idUser == '') {
        return res.status(400).send({
            estatus: '400',
            err: true,
            msg: 'Error: No se envio un id valido.',
            cont: 0
        });
    }

    const userFind = await UserModel.findById(idUser);

    if (!userFind)
        return res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'Error: No se encontro el usuario en la base de datos.',
            cont: userFind
        });

    const newUser = new UserModel(req.body);

    let err = newUser.validateSync();

    if (err) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error: Error al Insertar el usuario.',
            cont: {
                err
            }
        });
    }

    const userUpdate = await UserModel.findByIdAndUpdate(idUser, { $set: {active} }, { new: true });

    if (!userUpdate) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error: Al intentar actualizar el usuario.',
            cont: 0
        });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: Se a ${blnActivo === 'true' ? 'activado' : 'desactivado'} el usuario correctamente.`,
        cont: {
            userUpdate
        }
    });
    }

} catch (err) {
    res.status(500).send({
        estatus: '500',
        err: true,
        msg: 'Error: Error al actualizar el usuario.',
        cont: {
            err: Object.keys(err).length === 0 ? err.message : err
        }
    });
}
});

module.exports = app;