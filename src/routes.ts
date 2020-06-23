import express from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';

import ItemsController from './controllers/ItemsController';
const itemsController = new ItemsController();
import PointsController from './controllers/PointsController';
const pointsController = new PointsController();

const routes = express.Router();
const upload = multer(multerConfig);

routes.route('/')
    .get((req, res) => {
        res.send('Server Online');
    })

routes.route('/items')
    .get(itemsController.index);

routes.route('/points')
    .get(pointsController.index)
    .post(
        upload.single('image'),
        celebrate({
            body: Joi
                .object()
                    .keys({
                        name: Joi.string().required(),
                        email: Joi.string().required(),
                        whatsapp: Joi.string().required(),
                        latitude: Joi.number().required(),
                        longitude: Joi.number().required(),
                        uf: Joi.string().required().min(2).max(2),
                        city: Joi.string().required().min(2),
                        items: Joi.string().required(),
                    })
        },
        {
            abortEarly: false,
        }),
        pointsController.create
    );

routes.route('/points/:id')
    .get(pointsController.show)
    .delete(pointsController.delete);

export default routes;