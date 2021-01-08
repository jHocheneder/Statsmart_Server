import express from 'express';
import * as mariadb from 'mariadb';

console.log('Project setup correctly!')

/*import axios from 'axios';

const url = 'https://www.data.gv.at/suche/?sort=abc'; // URL we're scraping
const AxiosInstance = axios.create(); // Create a new Axios Instance

// Send an async HTTP Get request to the url
AxiosInstance.get(url)
  .then( // Once we have data returned ...
    response => {
      const html = response.data; // Get the HTML from the HTTP request
      console.log(html);
    }
  )
  .catch(console.error);*/

import axios from 'axios';
import { Link } from './class/link';
import { DownloadLink } from './class/downloadLink';
const cheerio = require('cheerio')
const $ = cheerio.load('<h2 class="title">Hello world</h2>')

const url = 'https://www.data.gv.at/suche/?sort=abc'; // URL we're scraping
const AxiosInstance = axios.create(); // Create a new Axios Instance
const csv = require('csv-parser');
const fs = require('fs');
const http = require('http')

var Papa = require('papaparse');

const results = [];

const csvurl = 'http://data.linz.gv.at/katalog/gesundheit/akh_herkunft/AKHHER.csv'

/*console.log(Papa.parse(csvurl, {
	download: false,
	step: function(row) {
    console.log("Row:", row.data);
  },
  complete: function() {
      console.log("All done!");
  }
}))*/

/*fs.createReadStream(http.get('https://www.cdc.gov/coronavirus/2019-ncov/map-data-cases.csv', res => res.pipe(fs.createWriteStream('some.csv')))
)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
  });*/

let links: Link[] = [];

let dl = ""

let download: Link[] = [];

// Send an async HTTP Get request to the url

const pool: mariadb.Pool = mariadb.createPool({
  host: '195.128.100.64',
  user: 'statsmart',
  password: 'Statsmart_01',
  database: 'statsmart',
  connectionLimit: 15
});
var server = express();

server.use(express.json());
var cors = require('cors')
server.use(cors())

const port = 8080;

server.listen(port, function(){
  console.log('API is listening on port '+port);
});

AxiosInstance.get(url)
.then(
  response => {
      const html = response.data;
      const selector = cheerio.load(html);
      const searchResults = selector("body").find(".data-item > .mb-1")
          
      searchResults.each((i, elem) => {
        //if(i < 100){
          var link = new Link();
          link.id = i;
          link.title = $(elem).text().split(" (", 2).join(" ");
          link.link = $(elem).find('a').attr('href')
          links.push(link)
        //}
      })
      console.log("Ready!")
  }
)
.catch(console.error);

server.get('/api/getLinks', (req, res) =>{
  res.send(links)
});

server.post('/api/saveStatistic', async (req, res) => {
  try {
    let x = await pool.query("INSERT INTO Statistik VALUE (?, ?, ?, ?, ?, ?, ?)",
      [null, req.body.title, req.body.chartType, req.body.errorRate, req.body.xTitle, req.body.description, req.body.userId])
    
    res.send(x)
  } catch (ex) {
    res.send("error in saveStatistic \n" + ex)
  }
});

server.get('/api/findAllStatistic', async (req, res) => {
  try {
    let x = await pool.query("select * from Statistik")

    res.send(x)
  } catch (ex) {
    res.send("error in findAllStatistic \n" + ex)
  }
})

server.get('/api/downloadLinks/:id', async (req, res) =>{
  const resUrl = 'https://www.data.gv.at'+links[req.params.id].link

  AxiosInstance.get(resUrl)
  .then(
    response => {
        const html2 = response.data;
        const selector2 = cheerio.load(html2)
        const searchResults2 = selector2("body").find(".resource-list > .resource-item")

        download = [];

        searchResults2.each((i, elem) => {
            var link = new DownloadLink();
            link.id = i;
            link.link = $(elem).find('a').attr('href')
            link.title = $(elem).find('a').attr('title')
            link.type = $(elem).find('span').html()
            download.push(link)
        })
        
        res.send(download)
        
    }
  )
  .catch(console.error);
});


server.post('/api/download/', (req, res) =>{
  const resUrl = 'https://www.data.gv.at'+req.body.link
  AxiosInstance.get(resUrl)
  .then( 
    response => {
        const html2 = response.data;
        const selector2 = cheerio.load(html2)
        
        const searchResults2 = selector2("body").find(".clearfix > .muted")

            
        searchResults2.each((i, elem) => {
            download = $(elem).find('a').attr('href')
        })
        
        res.send(download)
        
    }
  )
  .catch(console.error);
})

server.post('/api/downloadcsv/', (req, res) =>{
  const csvlink = req.body.link
  AxiosInstance.get(csvlink)
  .then( 
    response => {
        const html2 = response.data;
        const headers = []

        const parsecsv = Papa.parse(html2)
        for(let i = 0; i < parsecsv.data.length; i++){
          headers.push(parsecsv.data[i])
        }
        res.send(headers)
    }
  )
  .catch(console.error);
})
server.post('/api/insertstatistic/', (req, res) =>{

})

