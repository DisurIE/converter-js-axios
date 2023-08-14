import axios from 'axios';
import Valute from './valute';

// https://cbu.uz/ru/arkhiv-kursov-valyut/json/ банк Узбекистана
// https://www.cbr-xml-daily.ru/daily_json.js Валюты на сегодня
// https://cbu.uz/ru/arkhiv-kursov-valyut/json/RUB/ Рубль на сегодня

const req = axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
const res = await req;
let Value = 'Value';

//console.log(res.data);

const DAYSINWEEK = 7;
const DAYSINMONTH = 31;
const DAYSINYEAR = 200;
const MILLISECONDSINDAY = 86400000;

const firstValute = document.querySelector('.first-valute'),
      secondValute = document.querySelector('.second-valute'),
      firstInput = document.querySelector('.first__value'),
      secondInput = document.querySelector('.second__value'),
      flipper = document.querySelector('.flipper');

    const ctx = document.getElementById('myChart');

    let valuteOne = res.data.Valute['USD'],
        valuteTwo = res.data.Valute['USD'];

    function addValutesInSelect(valutes, elem){
        for(let valute in valutes){
            elem.innerHTML += `<option value="${valute}" >${valutes[valute].Name}</option>`;
        }
    }

    addValutesInSelect(res.data.Valute, firstValute)
    addValutesInSelect(res.data.Valute, secondValute)

    // Навешиваем событие на первый select
    firstValute.addEventListener('change', (e) => {
            valuteOne = res.data.Valute[e.target.value];
            changeNum()
            //console.log(valuteOne.Value);
    });

    // Навешиваем событие на второй select
    secondValute.addEventListener('change', (e) => {
        valuteTwo = res.data.Valute[e.target.value];
        changeNum()
        //console.log(valuteTwo.Value);
    });

    // Навешиваем событие на первый input
    firstInput.addEventListener('input', (e) => {
        changeNum();
    });

    // Навешиваем событие на второй input
    secondInput.addEventListener('input', (e) => {
        changeNumTwo();
    });

    // Событие клика для смены местами валют
    flipper.addEventListener('click', () => {
        let curr = valuteOne.CharCode
        valuteOne = res.data.Valute[valuteTwo.CharCode];
        valuteTwo = res.data.Valute[curr];
        firstValute.value = valuteOne.CharCode;
        secondValute.value = valuteTwo.CharCode; 
        changeNum();
    });

    // пересчитываем значение во втором input
    function changeNum(){
        secondInput.value = (firstInput.value * ((valuteOne[Value]/valuteOne.Nominal) / (valuteTwo[Value]/valuteTwo.Nominal))).toFixed(4);
    }

    // пересчитываем значение во первом input
    function changeNumTwo(){
        firstInput.value = (secondInput.value * ((valuteTwo[Value]/valuteTwo.Nominal) / (valuteOne[Value]/valuteOne.Nominal) )).toFixed(4);
    }

    /*
      Работаем с датами ================================================================
    */

    // Получаем сегодняшнюю дату
    const date = new Date();
    
    // функция для получения массива дат за определенное количество дней
    function getDates(date, daysLength){
      let currMilliseconds = date.getTime();
      let arr = [];
      for(let i = 0; i < daysLength; i++){
        arr.unshift(getFormateDate(date));
        currMilliseconds -= MILLISECONDSINDAY;
        date = new Date(currMilliseconds);
        //console.log(date)
      }
      return arr;
    }

    /*
      асинхронная функция возвращает массив с массивами значений валют
      за неделю месяц и год
    */

    async function getValueByDates(arr){
      let values = [];
      let v2 = [];
      let arrYear = [];
      for(let i = 0; i < arr.length; i++){
        const req = axios.get(`https://cbu.uz/ru/arkhiv-kursov-valyut/json/RUB/${arr[i]}/`);
        values.push(req);
        //console.log(res.data[0].Rate);
      }
      v2 = Promise.all(values);
      const res = await v2;
      for(let i = 0; i < res.length; i++){
        arrYear.push(res[i].data[0].Rate)
      }
      let arrWeek = [];
      let arrMonth = [];
      if(res.length >= DAYSINWEEK){
        for(let i = 0; i < DAYSINWEEK; i++){
          arrWeek.push(arrYear[i])
        }
      }
      if(res.length >= DAYSINMONTH){
        for(let i = 0; i < DAYSINMONTH; i++){
          arrMonth.push(arrYear[i])
        }
      }
      console.log(res);
      return [arrYear, arrMonth, arrWeek];
    }
    
    function getFormateDate(date){
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }

    
    let arr = await getValueByDates(getDates(date, DAYSINYEAR));

    let valuesForYear = arr[0];
    let valuesForMonth = arr[1];
    let valuesForWeek = arr[2];

    // Вывод графика изменения стоимости валюты 
    let chart = createChart(getDates(date, DAYSINWEEK), valuesForWeek);
    function createChart(labels, values){
      return new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Стоимость',
            data: values,
            borderWidth: 3
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    }
    
    const weekChart = document.querySelector('.chart-for-week'),
          monthChart = document.querySelector('.chart-for-month'),
          yearChart = document.querySelector('.chart-for-year');

    weekChart.addEventListener('click', (e) => {
      chart.destroy();
      e.preventDefault();
      chart = createChart(getDates(date, DAYSINWEEK), valuesForWeek);
    });

    monthChart.addEventListener('click', (e) => {
      chart.destroy();
      e.preventDefault();
      chart = createChart(getDates(date, DAYSINMONTH), valuesForMonth);
    });

    yearChart.addEventListener('click', (e) => {
      chart.destroy();
      e.preventDefault();
      chart = createChart(getDates(date, DAYSINYEAR), valuesForYear);
    });

    //addEventSelect(firstValute,valuteOne);
    //addEventSelect(secondValute, valuteTwo);
    /*for(let valute in res.data.Valute){
        firstValute.innerHTML += `<option value="${valute}" >${res.data.Valute[valute].Name}</option>`;
    }*/

    
