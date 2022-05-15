const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const elementData = require('./data/elementData');
const storage = require('node-persist');

const app = express();

const ads = [
    { title: 'Hello, this is server(again)!' }
];

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use(morgan('combined'));

storage.init({ dir: './data/elementData' }, () => {
    console.log('Storage initialized');
}
);

app.get('/', (req, res) => {
    res.send(ads);
});

app.get('/elements', (req, res) => {
    res.send(elementData);
})

app.get('/elements/:position', (req, res) => {
    const element = elementData.find(element => element.position === parseInt(req.params.position));
    if (!element) {
        res.status(404).send('The element with the given POSITION was not found.');
    } else {
        res.send(element);
    }
}, (err, req, res, next) => {
    res.status(500).send('Something failed.');
});

app.post('/elements', (req, res) => {
    const newElement = req.body;
    elementData.push(newElement);
    res.send(newElement);
    if (newElement.position) {
        storage.setItem(newElement.position, newElement);
    } else {
        storage.setItem(elementData.length, newElement);
    }
    if (elementData.length > 10) {
        elementData.shift();
    }
})

app.put('/elements/:position', (req, res) => {
    const { position } = req.params;
    const { title } = req.body;
    const index = elementData.findIndex(element => element.position === position);
    elementData[index].title = title;
    res.send(elementData[index]);
})

app.patch('/elements/:position', (req, res) => {
    const { position } = req.params;
    const { title } = req.body;
    const index = elementData.findIndex(element => element.position === position);
    elementData[index].title = title;
    res.send(elementData[index]);
})

//delete element by position with no splice
app.delete('/elements/:position', (req, res) => {
    const { position } = req.params;
    const index = elementData.findIndex(element => { return element.position == position });
    elementData.splice(index, 1);
    res.send(elementData[index]);
}
)


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Server started on port ' + port + ' 🔥🔥🔥🔥');
});