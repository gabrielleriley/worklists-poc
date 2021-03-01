const express = require('express')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var cors = require('cors')
const app = express()
const port = 3000
const nationality = require('./nationalities');
const peopleJson = require('./people');

app.use(cors())

let people = JSON.parse(peopleJson).results;

function filterSortPeople(request) {
    const getSortProp = (person, sortCol) => {
        switch(sortCol) {
            case 'email':
                return person.email;
            case 'firstName':
                return person.name.first;
            case 'lastName':
                return person.name.last;
        }
    }
    return people
        .filter(p => (request.genders).length === 0 || request.genders.some((g) => g === p.gender))
        .filter(p => (request.nationalities).length === 0 || request.nationalities.some((nat) => p.nat === nat))
        .filter(p => p.name.last.toUpperCase().startsWith((request.lastName).toUpperCase()))
        .sort((p1, p2) => {
            if (request.sortColumn && (request.order == 'asc' || request.order == 'desc')) {
                const p1Prop = getSortProp(p1, request.sortColumn);
                const p2Prop = getSortProp(p2, request.sortColumn);
                return request.order === 'asc' ?
                    (p1Prop > p2Prop ? 1 : -1)
                    : (p1Prop > p2Prop ? -1 : 1)
            } else {
                return 0;
            }
        });
}


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/user', function (req, res) {
    const genders = req.query.genders ? req.query.genders.split(',') : [];
    const nationalities = req.query.nationalities ? req.query.nationalities.split(',') : [];
    const lastName = req.query.lastName ? req.query.lastName : '';
    const sortColumn = req.query.sortColumn;
    const order = req.query.order;
    const page = req.query.page ? +req.query.page : 0;
    const size = req.query.size ? +req.query.size : 12;
    const peeps = filterSortPeople({ genders, nationalities, lastName, sortColumn, order }).map((person) => ({
        id: person.login.uuid,
        gender: person.gender,
        name: person.name,
        dob: person.dob.date,
        email: person.email,
        nationality: person.nat
    }));    
    setTimeout(() => {
        res.json({ data: peeps.slice(page * size, page * size + size) });
    }, Math.random() * 750)
})

app.get('/user/:userId', function (req, res) {
    if (people.some(p => p.login.uuid === req.params.userId)) {
        let person = people.find(p => p.login.uuid === req.params.userId);
        person = {
            id: person.login.uuid,
            gender: person.gender,
            name: person.name,
            dob: person.dob.date,
            email: person.email,
            nationality: person.nat
        };
        setTimeout(() => {
            res.json({ data: person });
        }, Math.random() * 500);
    } else {
        setTimeout(() => {
            res.status(404);
            res.json({ errorMessage: 'Not Found!' });
        }, Math.random() * 500);
    }
})

app.get('/user/count', function (req, res) {
    const genders = req.query.genders ? req.query.genders.split(',') : [];
    const nationalities = req.query.nationalities ? req.query.nationalities.split(',') : [];
    const lastName = req.query.lastName ? req.query.lastName : '';
    const sortColumn = req.query.sortColumn;
    const order = req.query.order;
    const peeps = filterSortPeople({ genders, nationalities, lastName, sortColumn, order });  
    setTimeout(() => {
        res.json(peeps.length);
    }, Math.random() * 750)
})

app.delete('/user/:userId', function (req, res) {
    if (people.some(p => p.login.uuid === req.params.userId)) {
        people = people.filter((p) => p.login.uuid !== req.params.userId);
        setTimeout(() => {
            res.json(undefined);
        }, Math.random() * 500)

    } else {
        setTimeout(() => {
            res.status(404);
            res.json({ errorMessage: 'Not Found!' });
        }, Math.random() * 500);
    }
})

app.put('/user/:userId', jsonParser, function(req, res) {
    if (people.some(p => p.login.uuid === req.params.userId)) {
        people = people.map((p) => {
            if (p.login.uuid === req.params.userId) {
                const newPerson = { ...p, ...req.body, dob: { date: req.body.dob } };
                return newPerson;
            } else {
                return p;
            }
        });
        setTimeout(() => {
            res.json(undefined);
        }, Math.random() * 500);
    } else {
        setTimeout(() => {
            res.status(404);
            res.json({ errorMessage: 'Not Found!' });
        }, Math.random() * 500);
    }
});

app.get('/nationality', function (req, res) {
    setTimeout(() => {
        res.json({ data: nationality })
    }, Math.random() * 1000);
})

