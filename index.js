require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()



let persons = [
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
    ]

    
const morganTiny = morgan((tokens, req, res) => {
                               
                                if(tokens.method(req, res) === 'POST') {
                                    return [
                                        tokens.method(req, res),
                                        tokens.url(req, res),
                                        tokens.status(req, res),
                                        tokens.res(req, res, 'content-length'), '-',
                                        tokens['response-time'](req, res), 'ms',
                                        JSON.stringify(req.body)              
                                        ].join(' ')
                                } else {
                                    return [
                                        tokens.method(req, res),
                                        tokens.url(req, res),
                                        tokens.status(req, res),
                                        tokens.res(req, res, 'content-length'), '-',
                                        tokens['response-time'](req, res), 'ms'            
                                        ].join(' ')
                                }

                            })  
                            



app.use(express.json())
app.use(cors())
app.use(morganTiny)
app.use(express.static('build'))

app.get('/api/persons', (req , res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts)
    })
})

app.get('/info', (req, res) => {
    const info = {contacts : persons.length, reqTime : Date()}

    res.json(info)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    
    Contact.findById(id).then(contact => {
        res.json(contact)
    })

})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    
    Contact.findByIdAndRemove(id).then(result => {
        res.status(204).end()
    })
})

app.post('/api/persons', (req, res) => {

    if(!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const newContact = new Contact({
        name: req.body.name,
        number: req.body.number
    })

    console.log(newContact)

    Contact.create(newContact).then(result => {
        res.json(result)
    })

})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})