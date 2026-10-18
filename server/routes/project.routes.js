import express from 'express'
import ctrl from '../controllers/project.controller.js'

const router = express.Router()

router.route('/api/projects')
  .get(ctrl.list)
  .post(ctrl.create)
  .delete(ctrl.removeAll)

router.param('projectId', ctrl.byID)

router.route('/api/projects/:projectId')
  .get(ctrl.read)
  .put(ctrl.update)
  .delete(ctrl.remove)

export default router