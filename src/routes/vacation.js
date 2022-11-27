const express = require('express');
const controller = require('../controllers/vacation');
const auth = require('../middleware/auth');

const routes = express.Router();

const baseUrl = '/vacation';

routes.post(`${baseUrl}/register`, auth, controller.registerVacation);
routes.get(`${baseUrl}/mytravels`, auth, controller.getVacation);
routes.get(`${baseUrl}/mytravels/:id`, auth, controller.myTravel);
routes.get(`${baseUrl}/get-budget/:id`, auth, controller.getBudget);
//routes.put(`${baseUrl}/edit/:id`, auth, controller.updateVacation);
routes.delete(`${baseUrl}/delete/:id`, auth, controller.deleteVacation);

module.exports = routes;