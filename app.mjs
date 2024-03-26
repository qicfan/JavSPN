import express from 'express'

const app = express()
const port = 3000

app.use('/', express.static('dist'))

app.get('/h', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
