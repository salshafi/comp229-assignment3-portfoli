import express from 'express'
import ctrl from '../controllers/project.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()
const adminOnly = [authCtrl.requireSignin, authCtrl.isAdmin]

// Anyone can VIEW (portfolio is public). Only admin can change data.
router.route('/api/projects')
  .get(ctrl.list)
  .post(adminOnly, ctrl.create)
  .delete(adminOnly, ctrl.removeAll)

router.param('projectId', ctrl.byID)

router.route('/api/projects/:projectId')
  .get(ctrl.read)
  .put(adminOnly, ctrl.update)
  .delete(adminOnly, ctrl.remove)

export default router
