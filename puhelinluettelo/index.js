const express = require('express')
const morgan = require('morgan')

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
                                console.log(typeof(tokens.method(req, res)))
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

app.use(morganTiny)

app.get('/api/persons', (req , res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const info = {contacts : persons.length, reqTime : Date()}

    res.json(info)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if(person) {
        persons = persons.filter(person => person.id !== id)
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {

    const person = {...req.body, id : Math.floor(Math.random() * 10000) }
    const check = persons.find((person) => person.name === req.body.name)
    if(!req.body.name || !req.body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    } else {
        if(check){
            return res.status(400).json({
                error : 'name must be unique'
            })
        } else {
            persons = persons.concat(person)
            res.json(person)
        }

    }

})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})