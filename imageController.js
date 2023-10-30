const {PrismaClient} = require('@prisma/client')
const prisma       = new PrismaClient()
const imagekit     = require('./imageKit')

module.exports = {

    createImage: async (req, res) => {
        
        try {

            const {title, description} = req.body
            const image = req.file

            if(!title || !description || typeof image === 'undefined'){
                return res.status(400).json({
                    error: true,
                    message: 'all fields is required.'
                })
            }

            const stringFile = req.file.buffer.toString('base64')
            const uploadFile = await imagekit.upload({
                fileName: req.file.originalname,
                file: stringFile
            })

            const data = await prisma.images.create({
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    url: uploadFile.url
                }
            })

            return res.status(200).json({
                error: false,
                message: 'create image success.',
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            })
        }
    },

    getAllImages: async (req, res) => {

        try {

            const data = await prisma.images.findMany()

            return res.status(200).json({
                error: false,
                message: 'get all images success.',
                data: data
            })
            
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            })
        }

    },

    getImageById: async (req, res) => {

        try {

            const imageId = parseInt(req.params.imageId)

            const data = await prisma.images.findUnique({
                where: {
                    id: imageId,
                }
            })

            if(!data) {
                return res.status(404).json({
                    error: true,
                    message: `image with id ${imageId} not found.`
                })
            }
            
            const url = data.url;
            const name = url.split("challange/")[1]

            const image = await imagekit.listFiles({
                searchQuery: `name = ${name}`
            })

            data.detail = image[0]

            return res.status(200).json({
                error: false,
                message: `get image with id ${imageId} success.`,
                data: data
            })
            
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            })
        }

    },

    editImage: async (req, res) => {

        try {
            
            const {title, description} = req.body

            if(!title || !description){
                return res.status(400).json({
                    error: true,
                    message: 'all fields is required.'
                })
            }

            const imageId = parseInt(req.params.imageId)

            const checkData = await prisma.images.findUnique({
                where: {
                    id: imageId,
                }
            })

            if(!checkData) {
                return res.status(404).json({
                    error: true,
                    message: `image with id ${imageId} not found.`
                })
            }

            const data = await prisma.images.update({
                where: {
                    id: imageId,
                },
                data: {
                    title: req.body.title,
                    description: req.body.description,
                },
            })

            return res.status(200).json({
                error: false,
                message: `edit image with id ${imageId} success.`,
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            })
        }
    },
    
    deleteImage: async (req, res) => {
        try {

            const imageId = parseInt(req.params.imageId)

            const data = await prisma.images.findUnique({
                where: {
                    id: imageId,
                }
            })

            if(!data) {
                return res.status(404).json({
                    error: true,
                    message: `image with id ${imageId} not found.`
                })
            }
         
            const url = data.url;
            const name = url.split("challange/")[1]

            const image = await imagekit.listFiles({
                searchQuery: `name = ${name}`
            })

            await imagekit.deleteFile(image[0].fileId)
            await prisma.images.delete({
                where: {
                    id: imageId
                }
            })

            return res.status(200).json({
                error: false,
                message: `delete image with id ${imageId} success.`,
            })

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message
            })
        }
    },
}