const express = require('express');
const controller = require('../controllers/vacation');
const auth = require('../middleware/auth');

const routes = express.Router();

const baseUrl = '/vacation';

routes.post(`${baseUrl}/register`, auth, controller.registerVacation);
routes.get(`${baseUrl}/:id`, auth, controller.getVacation);
routes.put(`${baseUrl}/:id`, auth, controller.updateVacation);

module.exports = routes;