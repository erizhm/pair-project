const express = require('express')
const router = express.Router()
const upload = require('../middlewares/multer')
const PopController = require('../controllers/popController.js')

router.get('/add', PopController.formAddPop)
router.post('/add', upload.single('picture'), PopController.postAddPop)
router.get('/:id/edit', PopController.editPopForm)
router.post('/:id/edit', upload.single('picture'), PopController.updatePop)
router.get('/:id/delete', PopController.deletePop)

module.exports = router