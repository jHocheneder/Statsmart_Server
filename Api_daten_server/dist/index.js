"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
console.log('Project setup correctly!');
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
const axios_1 = __importDefault(require("axios"));
const link_1 = require("./class/link");
const cheerio = require('cheerio');
const $ = cheerio.load('<h2 class="title">Hello world</h2>');
const url = 'https://www.data.gv.at/suche/?sort=abc'; // URL we're scraping
const AxiosInstance = axios_1.default.create(); // Create a new Axios Instance
let links = [];
let dl = "";
let download = [];
// Send an async HTTP Get request to the url
var server = express_1.default();
server.use(express_1.default.json());
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
const port = 8080;
server.listen(port, function () {
    console.log('API is listening on port ' + port);
});
AxiosInstance.get(url)
    .then(response => {
    const html = response.data;
    const selector = cheerio.load(html);
    const searchResults = selector("body").find(".data-item > .mb-1");
    searchResults.each((i, elem) => {
        //if(i < 100){
        var link = new link_1.Link();
        link.id = i;
        link.title = $(elem).text().split(" (", 2).join(" ");
        link.link = $(elem).find('a').attr('href');
        links.push(link);
        //}
    });
    console.log("Ready!");
})
    .catch(console.error);
server.get('/api/getLinks', (req, res) => {
    res.send(links);
});
let a;
server.get('/api/downloadLinks/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resUrl = 'https://www.data.gv.at' + links[req.params.id].link;
    AxiosInstance.get(resUrl)
        .then(response => {
        const html2 = response.data;
        const selector2 = cheerio.load(html2);
        const searchResults2 = selector2("body").find(".resource-list > .resource-item");
        download = [];
        searchResults2.each((i, elem) => {
            var link = new link_1.Link();
            link.id = i;
            link.link = $(elem).find('a').attr('href');
            link.title = $(elem).find('a').attr('title');
            download.push(link);
        });
        res.send(download);
        console.log(download);
    })
        .catch(console.error);
}));
server.get('/api/download/', (req, res) => {
    const resUrl = 'https://www.data.gv.at' + req.body.link;
    console.log(resUrl);
    AxiosInstance.get(resUrl)
        .then(response => {
        const html2 = response.data;
        const selector2 = cheerio.load(html2);
        const searchResults2 = selector2("body").find(".clearfix > .muted");
        searchResults2.each((i, elem) => {
            download = $(elem).find('a').attr('href');
        });
        res.send(download);
        console.log(download);
    })
        .catch(console.error);
});
//# sourceMappingURL=index.js.map