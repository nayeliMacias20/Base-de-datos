const express = require('express');
const _ = require('underscore');
const ColacionesModel = require('../../models/colaciones.model');
var mongoose = require('mongoose');
const app = express();

//obtener todos los dietas de colaciones por nombre
app.get('/', async(req, res) => {
  try {
    if (req.query.idcolacion) req.queryMatch._id = req.query.idcolacion;
    if (req.query.termino) req.queryMatch.$or = Helper(["name"], req.query.termino);

    const colaciones = await ColacionesModel.aggregate([
        {
            $match: { ...req.queryMatch }
        }
    ])

    if (colaciones.length <= 0) {
        res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'No se encontro las dietas en la base de datos.',
            cont: {
                colaciones
            }
        });
    } else {
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion obtenida correctamente.',
            cont: {
                colaciones
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
//Insertar dietas de colaciones
app.post('/', async (req, res) => {//req = obtener datos mandados por el cliente, res = mandar una respuesta
  try {
    const us = new ColacionesModel(req.body);

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
    const colacionEncontrada = await ColacionesModel.findById({ _id: us._id });
    if (colacionEncontrada){
        const colacionUpdated =  await ColacionesModel.findByIdAndUpdate(us._id, req.body, { new: true });
        return res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'La dieta ya existe en la base de datos pero se actualizo.',
            cont:{
                colacionUpdated
            } 
        });
    }

    const colacion = await us.save();
    if (colacion.length <= 0) {
        res.status(400).send({
            estatus: '400',
            err: true,
            msg: 'No se pudo registrar la dieta en la base de datos.',
            cont: {
                colacion
            }
        });
    } else {
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion insertada correctamente.',
            cont: {
                colacion
            }
        });
    }
    console.log(colacion);
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
      const idcolacion = new mongoose.mongo.ObjectId(req.body._id);
      console.log(req.body._id)

      if (idcolacion == '') {
          return res.status(400).send({
              estatus: '400',
              err: true,
              msg: 'Error: No se envio un id valido.',
              cont: 0
          });
      }

      req.body._name = idcolacion;

      const colacionFind = await ColacionesModel.findById(idcolacion);

      if (!colacionFind)
          return res.status(404).send({
              estatus: '404',
              err: true,
              msg: 'Error: No se encontro el usuario en la base de datos.',
              cont: colacionFind
          });

      const newColacion = new ColacionesModel(req.body);

      let err = newColacion.validateSync();

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

      const colacionUpdate = await ColacionesModel.findByIdAndUpdate(idColacion, { $set: newColacion }, { new: true });

      if (!colacionUpdate) {
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
                colacionUpdate
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
    const idColaciones = new mongoose.mongo.ObjectId(req.body._id);
    console.log(req.body._id);
    blnActivo = req.body.blnActivo;

    if (req.query.idColaciones == '') {
        return res.status(400).send({
            estatus: '400',
            err: true,
            msg: 'Error: No se envio un id valido.',
            cont: 0
        });
    }

    const colacionFind = await ColacionesModel.findById(idColacion);

    if (!colacionFind)
        return res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'Error: No se encontro la dieta en la base de datos.',
            cont: colacionFind
        });

    const newColacion = new ColacionesModel(req.body);

    let err = newColacion.validateSync();

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

    const colacionUpdate = await ColacionesModel.findByIdAndUpdate(idColaciones, { $set: {active} }, { new: true });

    if (!colacionUpdate) {
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
            colacionUpdate        
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