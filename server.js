const fs = require('fs');
const express = require('express');
const path = require('path');

const notes = require('./db/db.json');
const { process_params } = require('express/lib/router');
const app = express();

const PORT = process.env.PORT || 3009;


app.use(express.static('public'));

//parse data
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Api routes-----------


app.get('/api/notes', (req, res) => {
    res.json(notes);
})

function saveNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        //using path to join the folders directory name with the db file
        path.join(__dirname, './db/db.json'),
        //the null and 2 arguments format the data to be more readable
        JSON.stringify(notesArray, null, 2)
    );
    return note;
}



app.post('/api/notes', (req, res) => {

    req.body.id = notes.length.toString();
 
    const note = saveNote(req.body, notes);
    res.json(note);
   
})


app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    const noteIndex = notes.findIndex(p => p.id == id);

    notes.splice(noteIndex, 1);

    fs.writeFileSync(
        //using path to join the folders directory name with the db file
        path.join(__dirname, './db/db.json'),
        //the null and 2 arguments format the data to be more readable
        JSON.stringify({notes: notes}, null, 2)
    );

    res.json(notes)

})





//------HTML routes-------
app.get('/notes', (req, res) => {
    //returns the notes.html file
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/', (req, res) => {
    //returns the index.html file
    res.sendFile(path.join(__dirname, './public/index.html'));
})

//(wildcard)
app.get('*', (req, res) => {
    //returns the index file when nonexistent route is requested
    res.sendFile(path.join(__dirname, './public/index.html'));
})

//making server listen to port 3007
app.listen(PORT, () => {
    console.log(`API server now on ${PORT}`);
});


