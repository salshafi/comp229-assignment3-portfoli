import express from 'express'
import ctrl from '../controllers/qualification.controller.js'

const router = express.Router()

router.route('/api/qualifications')
  .get(ctrl.list)
  .post(ctrl.create)
  .delete(ctrl.removeAll)

router.param('qualificationId', ctrl.byID)

router.route('/api/qualifications/:qualificationId')
  .get(ctrl.read)
  .put(ctrl.update)
  .delete(ctrl.remove)

export default router