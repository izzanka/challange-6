const express = require('express')
const app     = express()
const {createImage, getImage, getImageById, editImage, deleteImage} = require('./imageController')

require('dotenv').config()
const port    = process.env.PORT || 3000

app.use(express.json({strict: false}))
app.use('/api/v1')


app.post('/images', createImage)
app.get('/images', getImage)
app.get('/images/{imageId}', getImageById)
app.put('/images/{imageId}', editImage)
app.delete('/images/{imageId}', deleteImage)

app.listen(port, () => {
    console.log(`Server is running at PORT ${port}`)
})