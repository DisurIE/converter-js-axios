import axios from 'axios';
export default class Valute{
    valute = {}

    setValutes(){
        axios.get('https://www.cbr-xml-daily.ru/daily_json.js').then(res => {
            this.valute = res.data;
        });
    }
    print(){
        console.log(this.valute);
    }
}
    
