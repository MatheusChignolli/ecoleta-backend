"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var routes_1 = __importDefault(require("./routes"));
var celebrate_1 = require("celebrate");
var app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(routes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '..', 'uploads')));
app.use(celebrate_1.errors());
var port = process.env.PORT ? process.env.PORT : "3333";
app.listen(port, function () {
    console.log("Serve ON\nhttp://localhost:" + port + "/");
});
