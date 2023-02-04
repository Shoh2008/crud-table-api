const express = require('express')
const cors = require("cors")
const fs = require('fs')
const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
require('./config.js')

app.use(express.json())

app.use("/api/users", require('./routes/users'))

app.use((error, req, res, next) => {
    if (error.name == 'ValidationError') {
        return res.status(error.status).json({
            status: error.status,
            message: error.message.details[0].message,
            errorName: error.name,
            error: true,
        })
    }
    if (error.name == 'AuthorizationError') {
        return res.status(error.status).json({
            status: error.status,
            message: error.message,
            errorName: error.name,
            error: true,
        })
    }
    if (error.status != 500) {
        return res.status(error.status).json({
            status: error.status,
            message: error.message,
            errorName: error.name,
            error: true,
        })
    }
    fs.appendFileSync('./log.txt', `${req.url}__${req.method}__${Date.now()}__${error.name}__${error.message}\n`)
    return res.status(error.status).json({
        status: error.status,
        message: 'Internal Server Error',
        errorName: error.name,
        error: true,
    })
})

app.listen(PORT, () => console.log('server is ready at http://localhost:' + PORT))