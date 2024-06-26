require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlDb = {};
let urlId =  1;
// Your first API endpoint
app.post("/api/shorturl", (req, res)=>{
  const {url} = req.body

  if(!isValidUrl(url)) {
    return res.json({ error: 'invalid url' });
  }

  const id = urlId++;
  urlDb[id] = url;

  res.json({
    "original_url": url,
    "short_url" : id
  })
})

app.get("/api/shorturl/:id", (req, res)=>{

    const shortUrlID = req.params.id;

    const url = urlDb[shortUrlID];
    console.log(req.params)
  if(!url){
    return res.status(404).json({ error: 'No short URL found for the given input' });
  }

  res.redirect(url);

})
//validating url
function isValidUrl(url) {
  const regex = /^(http|https):\/\/[^ "]+$/;
  return regex.test(url);
}
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
