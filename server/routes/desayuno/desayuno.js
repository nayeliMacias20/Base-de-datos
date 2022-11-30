const express = require('express');
const _ = require('underscore');
const DesayunoModel = require('../../models/desayuno.model');
var mongoose = require('mongoose');
const app = express();

//obtener todos los dietas de desayuno por nombre
app.get('/', async(req, res) => {
  try {
    if (req.query.iddesayuno) req.queryMatch._id = req.query.iddesayuno;
    if (req.query.termino) req.queryMatch.$or = Helper(["name"], req.query.termino);

    const desayunos = await DesayunoModel.aggregate([
        {
            $match: { ...req.queryMatch }
        }
    ])

    if (desayunos.length <= 0) {
        res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'No se encontro las dietas en la base de datos.',
            cont: {
                desayunos
            }
        });
    } else {
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion obtenida correctamente.',
            cont: {
                desayunos
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
//Insertar dietas de desayunos
app.post('/', async (req, res) => {//req = obtener datos mandados por el cliente, res = mandar una respuesta
  try {
    const us = new DesayunoModel(req.body);

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

    const desayunoEncontrada = await DesayunoModel.findById({ _id: us._id });
    if (desayunoEncontrada){
        const desayunoUpdated =  await DesayunoModel.findByIdAndUpdate(us._id, req.body, { new: true });
        return res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'La dieta ya existe en la base de datos pero se actualizo.',
            cont:{
                desayunoUpdated
            } 
        });
    }

    const desayuno = await us.save();
    if (desayuno.length <= 0) {
        res.status(400).send({
            estatus: '400',
            err: true,
            msg: 'No se pudo registrar la dieta en la base de datos.',
            cont: {
                desayuno
            }
        });
    } else {
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion insertada correctamente.',
            cont: {
                desayuno
            }
        });
    }
    console.log(desayuno);
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
      const idDesayuno = new mongoose.mongo.ObjectId(req.body._id);
      console.log(req.body._id)

      if (idDesayuno == '') {
          return res.status(400).send({
              estatus: '400',
              err: true,
              msg: 'Error: No se envio un id valido.',
              cont: 0
          });
      }

      req.body._name = idDesayuno;

      const desayunoFind = await DesayunoModel.findById(idDesayuno);

      if (!desayunoFind)
          return res.status(404).send({
              estatus: '404',
              err: true,
              msg: 'Error: No se encontro el usuario en la base de datos.',
              cont: desayunoFind
          });

      const newDesayuno = new DesayunoModel(req.body);

      let err = newDesayuno.validateSync();

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

      const desayunoUpdate = await DesayunoModel.findByIdAndUpdate(idDesayuno, { $set: newDesayuno }, { new: true });

      if (!desayunoUpdate) {
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
                desayunoUpdate
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
    const idDesayunos = new mongoose.mongo.ObjectId(req.body._id);
    console.log(req.body._id);
    blnActivo = req.body.blnActivo;

    if (req.query.idDesayunos == '') {
        return res.status(400).send({
            estatus: '400',
            err: true,
            msg: 'Error: No se envio un id valido.',
            cont: 0
        });
    }

    const desayunoFind = await DesayunoModel.findById(idDesayunos);

    if (!desayunoFind)
        return res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'Error: No se encontro la dieta en la base de datos.',
            cont: desayunoFind
        });

    const newDesayuno = new DesayunoModel(req.body);

    let err = newDesayuno.validateSync();

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

    const desayunoUpdate = await DesayunoModel.findByIdAndUpdate(idDesayunos, { $set: {active} }, { new: true });

    if (!desayunoUpdate) {
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
            dietsUpdate
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