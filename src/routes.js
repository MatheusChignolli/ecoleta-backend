"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var celebrate_1 = require("celebrate");
var multer_1 = __importDefault(require("multer"));
var multer_2 = __importDefault(require("./config/multer"));
var ItemsController_1 = __importDefault(require("./controllers/ItemsController"));
var itemsController = new ItemsController_1.default();
var PointsController_1 = __importDefault(require("./controllers/PointsController"));
var pointsController = new PointsController_1.default();
var routes = express_1.default.Router();
var upload = multer_1.default(multer_2.default);
routes.route('/')
    .get(function (req, res) {
    res.send('Server Online');
});
routes.route('/items')
    .get(itemsController.index);
routes.route('/points')
    .get(pointsController.index)
    .post(upload.single('image'), celebrate_1.celebrate({
    body: celebrate_1.Joi
        .object()
        .keys({
        name: celebrate_1.Joi.string().required(),
        email: celebrate_1.Joi.string().required(),
        whatsapp: celebrate_1.Joi.string().required(),
        latitude: celebrate_1.Joi.number().required(),
        longitude: celebrate_1.Joi.number().required(),
        uf: celebrate_1.Joi.string().required().min(2).max(2),
        city: celebrate_1.Joi.string().required().min(2),
        items: celebrate_1.Joi.string().required(),
    })
}, {
    abortEarly: false,
}), pointsController.create);
routes.route('/points/:id')
    .get(pointsController.show)
    .delete(pointsController.delete);
exports.default = routes;
