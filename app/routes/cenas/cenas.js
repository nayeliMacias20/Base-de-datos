const express = require('express');
const _ = require('underscore');
const CenasModel = require('../../models/cenas.model');
var mongoose = require('mongoose');
const app = express();

//obtener todos los dietas de cena por nombre
app.get('/', async(req, res) => {
  try {
    if (req.query.idcena) req.queryMatch._id = req.query.idcena;
    if (req.query.termino) req.queryMatch.$or = Helper(["name"], req.query.termino);

    const cenas = await CenasModel.aggregate([
        {
            $match: { ...req.queryMatch }
        }
    ])

    if (cenas.length <= 0) {
        res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'No se encontro las dietas en la base de datos.',
            cont: {
                cenas
            }
        });
    } else {
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion obtenida correctamente.',
            cont: {
                cenas
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
//Insertar dietas de cena
app.post('/', async (req, res) => {//req = obtener datos mandados por el cliente, res = mandar una respuesta
  try {
    const us = new CenasModel(req.body);

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
    const cenaEncontrada = await CenasModel.findById({ _id: us._id });
    if (cenaEncontrada){
        const cenaUpdated =  await CenasModel.findByIdAndUpdate(us._id, req.body, { new: true });
        return res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'La dieta ya existe en la base de datos pero se actualizo.',
            cont:{
                cenaUpdated
            } 
        });
    }

    const cena = await us.save();
    if (cena.length <= 0) {
        res.status(400).send({
            estatus: '400',
            err: true,
            msg: 'No se pudo registrar la dieta en la base de datos.',
            cont: {
                cena
            }
        });
    } else {
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion insertada correctamente.',
            cont: {
                cena
            }
        });
    }
    console.log(cena);
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
      const idcena = new mongoose.mongo.ObjectId(req.body._id);
      console.log(req.body._id)

      if (idcena == '') {
          return res.status(400).send({
              estatus: '400',
              err: true,
              msg: 'Error: No se envio un id valido.',
              cont: 0
          });
      }

      req.body._name = idcena;

      const cenaFind = await ColacionesModel.findById(idcena);

      if (!cenaFind)
          return res.status(404).send({
              estatus: '404',
              err: true,
              msg: 'Error: No se encontro el usuario en la base de datos.',
              cont: cenaFind
          });

      const newCena = new CenasModel(req.body);

      let err = newCena.validateSync();

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

      const cenaUpdate = await CenasModel.findByIdAndUpdate(idcena, { $set: newCena }, { new: true });

      if (!cenaUpdate) {
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
                cenaUpdate
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
    const idCenas = new mongoose.mongo.ObjectId(req.body._id);
    console.log(req.body._id);
    blnActivo = req.body.blnActivo;

    if (req.query.idCenas == '') {
        return res.status(400).send({
            estatus: '400',
            err: true,
            msg: 'Error: No se envio un id valido.',
            cont: 0
        });
    }

    const cenaFind = await CenasModel.findById(idCenas);

    if (!cenaFind)
        return res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'Error: No se encontro la dieta en la base de datos.',
            cont: cenaFind
        });

    const newCena = new CenasModel(req.body);

    let err = newCena.validateSync();

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

    const cenaUpdate = await CenasModel.findByIdAndUpdate(idCenas, { $set: {active} }, { new: true });

    if (!cenaUpdate) {
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
            cenaUpdate        
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