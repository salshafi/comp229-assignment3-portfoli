import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/api/users')
  .get(authCtrl.requireSignin, authCtrl.isAdmin, userCtrl.list)
  .post(userCtrl.create)                                          // public signup
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, userCtrl.removeAll)

router.param('userId', userCtrl.byID)

router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

export default router
