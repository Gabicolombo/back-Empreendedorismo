const express = require('express');
const controller = require('../controllers/user');
const auth = require('../middleware/auth');

const routes = express.Router();

const baseUrl = '/user';

routes.get(`${baseUrl}/myuser`, auth, controller.getUser);
routes.post(`${baseUrl}/register`, controller.register);
routes.post(`${baseUrl}/login`, controller.login);

module.exports = routes;