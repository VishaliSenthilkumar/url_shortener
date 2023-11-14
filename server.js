const express = require('express')
const mongoose = require('mongoose')
const shortUrls = require('./models/shortUrls')
const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res)=>{
    const shortUrl = await shortUrls.find()
    res.render('index', { shortUrls: shortUrl })
}) 

app.post('/shortUrls', async (req,res) => {
    await shortUrls.create({ full: req.body.url })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res)=>{
    const shortUrl = await shortUrls.findOne({ short: req.params.shortUrl })
    if(shortUrl==null) return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()
    res.redirect('/')
})

app.listen(process.env.PORT || 5000);