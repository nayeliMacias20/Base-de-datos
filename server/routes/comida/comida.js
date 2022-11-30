const express = require('express');
const _ = require('underscore');
const ComidaModel = require('../../models/comida.model');
var mongoose = require('mongoose');
const app = express();

//obtener todos los dietas de comida por nombre
app.get('/', async(req, res) => {
  try {
    if (req.query.idcomida) req.queryMatch._id = req.query.idcomida;
    if (req.query.termino) req.queryMatch.$or = Helper(["name"], req.query.termino);

    const comidas = await ComidaModel.aggregate([
        {
            $match: { ...req.queryMatch }
        }
    ])

    if (comidas.length <= 0) {
        res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'No se encontro las dietas en la base de datos.',
            cont: {
                comidas
            }
        });
    } else {
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion obtenida correctamente.',
            cont: {
                comidas
            }
        });
    }
} catch (err) {
    res.status(500).send({
        estatus: '500',
        err: true,
        msg: 'Error al obtener a las dietas.',
        cont: {
            err: Object.keys(err).length === 0 ? err.message : err
        }
    });
}
});
//Insertar dietas de comida
app.post('/', async (req, res) => {//req = obtener datos mandados por el cliente, res = mandar una respuesta
  try {
    const us = new ComidaModel(req.body);

    let err = us.validateSync();

    if (err) {
        return res.status(400).json({
            ok: false,
            err: true,
            resp: 400,
            msg: 'Error: Error al Insertar la dieta.',
            cont: {
                err
            }
        });
    }
    const comidaEncontrada = await ComidaModel.findById({ _id: us._id });
    if (comidaEncontrada){
        const comidaUpdated =  await ComidaModel.findByIdAndUpdate(us._id, req.body, { new: true });
        return res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'La dieta ya existe en la base de datos pero se actualizo.',
            cont:{
                comidaUpdated
            } 
        });
    }

    const comida = await us.save();
    if (comida.length <= 0) {
        res.status(400).send({
            estatus: '400',
            err: true,
            msg: 'No se pudo registrar la dieta en la base de datos.',
            cont: {
                comida
            }
        });
    } else {
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion insertada correctamente.',
            cont: {
                comida
            }
        });
    }
    console.log(comida);
} catch (err) {
    res.status(500).send({
        estatus: '500',
        err: true,
        msg: 'Error al registrar la dieta.',
        cont: {
            err: Object.keys(err).length === 0 ? err.message : err
        }
    });
}
});

//Modificar dietas
app.put('/', async (req, res) => {
  try {
      const idComida = new mongoose.mongo.ObjectId(req.body._id);
      console.log(req.body._id)

      if (idComida == '') {
          return res.status(400).send({
              estatus: '400',
              err: true,
              msg: 'Error: No se envio un id valido.',
              cont: 0
          });
      }

      req.body._name = idComida;

      const comidaFind = await ComidaModel.findById(idComida);

      if (!comidaFind)
          return res.status(404).send({
              estatus: '404',
              err: true,
              msg: 'Error: No se encontro el usuario en la base de datos.',
              cont: comidaFind
          });

      const newComida = new ComidaModel(req.body);

      let err = newComida.validateSync();

      if (err) {
          return res.status(400).json({
              ok: false,
              resp: 400,
              msg: 'Error: Error al insertar la dieta.',
              cont: {
                  err
              }
          });
      }

      const comidaUpdate = await ComidaModel.findByIdAndUpdate(idComida, { $set: newComida }, { new: true });

      if (!comidaUpdate) {
          return res.status(400).json({
              ok: false,
              resp: 400,
              msg: 'Error: Al intentar actualizar la dieta.',
              cont: 0
          });
      } else {
          return res.status(200).json({
              ok: true,
              resp: 200,
              msg: 'Success: Se actualizo la dieta correctamente.',
              cont: {
                comidaUpdate
              }
          });
      }
  } catch (err) {
      res.status(500).send({
          estatus: '500',
          err: true,
          msg: 'Error: Error al actualizar la dieta.',
          cont: {
              err: Object.keys(err).length === 0 ? err.message : err
          }
      });
  }
});

app.delete('/', async (req, res) => {//se pueden declara variables dentro de la url usadas para eliminar
  try {
    const idComidas = new mongoose.mongo.ObjectId(req.body._id);
    console.log(req.body._id);
    blnActivo = req.body.blnActivo;

    if (req.query.idComidas == '') {
        return res.status(400).send({
            estatus: '400',
            err: true,
            msg: 'Error: No se envio un id valido.',
            cont: 0
        });
    }

    const comidaFind = await ComidaModel.findById(idComidas);

    if (!comidaFind)
        return res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'Error: No se encontro la dieta en la base de datos.',
            cont: comidaFind
        });

    const newComida = new ComidaModel(req.body);

    let err = newComida.validateSync();

    if (err) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error: Error al Insertar la dieta.',
            cont: {
                err
            }
        });
    }

    const comidaUpdate = await ComidaModel.findByIdAndUpdate(idComidas, { $set: {active} }, { new: true });

    if (!comidaUpdate) {
        return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'Error: Al intentar actualizar la dieta.',
            cont: 0
        });
    } else {
      return res.status(200).json({
        ok: true,
        resp: 200,
        msg: `Success: Se a ${blnActivo === 'true' ? 'activado' : 'desactivado'} el usuario correctamente.`,
        cont: {
            comidaUpdate        
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