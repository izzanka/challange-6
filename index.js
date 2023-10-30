const express = require('express')
const app     = express()
const port    = 5000
const multer  = require('multer')()
const cors    = require('cors')

const {createImage, getAllImages, getImageById, editImage, deleteImage} = require('./imageController')

app.use(express.json({strict: false}))
app.use(cors())

app.post('/api/v1/images', multer.single('image'), createImage)
app.get('/api/v1/images', getAllImages)
app.get('/api/v1/images/:imageId', getImageById)
app.put('/api/v1/images/:imageId', editImage)
app.delete('/api/v1/images/:imageId', deleteImage)

app.listen(port, () => {
    console.log(`Server is running at PORT ${port}`)
})