const express = require('express')
const fs = require('fs')
const getvideodata = require('./getvideodata')
const app = express()

fs.appendFileSync('log.txt', '-------------------------------------------------------------------------------------------------------------------------------\n')

app.all('*', (req, res, next) => {
  res.setHeader('x-powered-by', 'The Unus Annus Archive')
  try {
    const msg = `${new Date().toTimeString()}\nPath: ${req.originalUrl}\nIP: ${req.ip}\nUA: ${req.get('user-agent')}\n\n`
    //If you're running through a proxy and would like logs with actual IPs, set the line above to:
    //const msg = `${new Date().toTimeString()}\nPath: ${req.originalUrl}\nIP: ${req.get('X-Forwarded-For').split(', ')[0]}\nUA: ${req.get('user-agent')}\n\n`
    console.log(msg)
    fs.appendFileSync('log.txt', msg)
  } catch {
    console.log('An error occurred trying to log.\n\n')
    fs.appendFileSync('log.txt', 'An error occurred trying to log.\n\n')
  }
  next()
})

app.use('/', express.static('static'))

//API
app.get('/api/getvideodata/*', (req, res) => {
  const str = req.originalUrl.replace('/api/getvideodata/', '')
  getvideodata.episode(str, (metadata) => {
    res.send(metadata)
  })
})

app.get('/api/getallmetadata*', (req, res) => {
  getvideodata.all((metadata) => {
    res.send(metadata)
  })
})

app.get('/api/gets00metadata*', (req, res) => {
  getvideodata.s00((metadata) => {
    res.send(metadata)
  })
})

app.get('/api/gets01metadata*', (req, res) => {
  getvideodata.s01((metadata) => {
    res.send(metadata)
  })
})

app.get('*', (req, res) => {
  res.status(404).send(fs.readFileSync('errors/404.html', 'utf-8'))
})

app.listen(1024)