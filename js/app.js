import axios from 'axios';
import Valute from './valute';

let valutes = {}
const req = axios.get('https://www.cbr-xml-daily.ru/daily_json.js');

const res = await req;

for(let valute in res.data.Valute){
    //document.body.innerHTML += res.data.Valute[valute].Name + '<br>';
}

// Переменные в которых юудут хранится 2 валюты

let firstValute = document.querySelector('.first-valute'),
    secondValute = document.querySelector('.second-valute');


