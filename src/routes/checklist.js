const express = require('express');
const controller = require('../controllers/checklist');
const auth = require('../middleware/auth');

const routes = express.Router();

const baseUrl = '/checklist';

routes.get(`${baseUrl}/check?`, auth, controller.getChecklist);
routes.put(`${baseUrl}/:id`, auth, controller.putChecklist);
routes.post(`${baseUrl}/`, auth, controller.postChecklist);

module.exports = routes;