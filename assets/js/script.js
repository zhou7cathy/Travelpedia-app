//--- exchange rates keys ---//
var mauxiKey = '1cd51d26035378cfa296c442';
var yanfangKey = '913440a5293f2012406cc25c';
var shKey = '9467838ba1d2eed66723ca50';

//--- marketAUX details ---//
var marketKey = 'PBOJWpVm2AVpXBog3MjMLnkCiqqiw3XMXKxXcv3h';

//--- declared variables ---//
var sourceCountryCode = '';
var destinationCountryCode = '';
var targetExchange = '';

var dateContainer = document.querySelector('#date-container');
var resultsContainer = document.querySelector('#results-container');
var sourceCountry = document.querySelector('#source-country');
var destinationCountry = document.querySelector('#destination-country');
var inputField = document.querySelector('#input-field');
var submitBtn = document.querySelector('#submit-btn');
var historyContainer = document.querySelector('#history-container');
var historyList = document.querySelector('#history-list');
var newsContainer = document.querySelector('#news-container');
var articleContainer = document.querySelector('#article-container');
var rotatingImage1 = document.querySelector('#rotating-image1');
var rotatingImage2 = document.querySelector('#rotating-image2');
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

var historyArray = JSON.parse(localStorage.getItem("historyArray")) || [];

var options = [
    {country: "Australia", code: "au", currency: "AUD", exchange: "ASX" },
    {country: "Brazil", code: "br", currency: "BRL", exchange: "BVMF" },
    {country: "Canada", code: "ca", currency: "CAD", exchange: "TSX" },
    {country: "China", code: "cn", currency: "CNY", exchange: "SSE" },
    {country: "European Union", code: "eu", currency: "EUR", exchange: "ENX" },
    {country: "Hong Kong", code: "hk", currency: "HKD", exchange: "HKEX" },
    {country: "India", code: "in", currency: "INR", exchange: "NSE" },
    {country: "Japan", code: "jp", currency: "JPY", exchange: "TYO" },
    {country: "Mexico", code: "mx", currency: "MXN", exchange: "BMV" },
    {country: "New Zealand", code: "nz", currency: "NZD", exchange: "NZX" },
    {country: "Phillipines", code: "ph", currency: "PHP", exchange: "PHS" },
    {country: "South Africa", code: "za", currency: "ZAR", exchange: "JSE" },
    {country: "Switzerland", code: "ch", currency: "CHF", exchange: "SWX" },
    {country: "United Kingdom", code: "gb", currency: "GBP", exchange: "LSE" },
    {country: "United States", code: "us", currency: "USD", exchange: "NYSE" },
];


$(document).ready(function(){
  $('.parallax').parallax();
});

//--- random selection of background image ---//
function showImage() {
    var theImages = [
    "./assets/img/background/1.png",
    "./assets/img/background/2.png",
    "./assets/img/background/3.png",
    "./assets/img/background/4.png",
    "./assets/img/background/5.png",
    "./assets/img/background/6.png",
  ]

  var whichImage = Math.round(Math.random() * 5);
  console.log(whichImage);

  rotatingImage1.setAttribute('src', theImages[whichImage]);
  rotatingImage2.setAttribute('src', theImages[whichImage]);
}


// --- loads country options into the dropdown menus ---//
var getList = function () { 
    for (var i = 0; i < options.length; i++) {
        var sourceCountryCode = document.createElement('option');
        sourceCountryCode.textContent = options[i].country + " - " + options[i].currency;
        sourceCountryCode.setAttribute('value', options[i].currency + '-' + options[i].code);
        sourceCountry.append(sourceCountryCode);

        var destinationCountryCode = document.createElement('option');
        destinationCountryCode.textContent = options[i].country + " - " + options[i].currency;
        destinationCountryCode.setAttribute('value', options[i].currency + '-' + options[i].exchange);
        destinationCountry.append(destinationCountryCode);
    };
  //--- loads current date and time to page ---//
  var now = dayjs().format('dddd D MMM, YYYY');
  dateContainer.textContent = now;
};


//--- creates a list with the recent searches ---//
var loadHistory = function () {
  historyList.innerHTML= '';  
  
  for (var i = 0; i < historyArray.length; i++) {
        var liEl = document.createElement('li');
        // liEl.textContent = historyArray[i].conversion + " - " + historyArray[i].rate;
        liEl.textContent = historyArray[i].value;

        historyList.appendChild(liEl);
    }
  };


//--- CONVERT button events ---//
function handleButtonClick(event){
  
    sourceCountryCode = sourceCountry.value.split('-')[0];
    destinationCountryCode = destinationCountry.value.split('-')[0];
    targetExchange = destinationCountry.value.split('-')[1];

    // --- modal will appear if input field is empy ---//
    if (!inputField.value) {
      modal.style.display = "block";
      
      span.onclick = function() {
        modal.style.display = "none";
      }
      return;
    } else {

    //--- API to fetch results for exchange rates ---//
    var exchangeURL = 'https://v6.exchangerate-api.com/v6/'+ mauxiKey +'/pair/' + sourceCountryCode +'/'+ destinationCountryCode +'';
    
    fetch(exchangeURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        resultsContainer.innerHTML= '';
        var inputValueResult = document.createElement('p');
        var inputValue =inputField.value;
        var inputResult =inputValue*data.conversion_rate;
        inputValueResult.textContent = inputValue + ' ' + sourceCountryCode +' = ' + inputResult + " " + destinationCountryCode;
        resultsContainer.append(inputValueResult);
       
        var dollarResult = document.createElement('p');
        dollarResult.textContent = '1 '+ sourceCountryCode +' = ' + data.conversion_rate + " " + destinationCountryCode;
        resultsContainer.append(dollarResult);

        //--- saves the latest 5 results to the local storage ---//
        var history = {
          value: '1 '+ sourceCountryCode +' = ' + data.conversion_rate + " " + destinationCountryCode,
          // conversion: sourceCountryCode +' to '+ destinationCountryCode,
          // rate: data.conversion_rate,
        };
          
        if (historyArray.length < 5) {
          historyArray.push(history);
        } else {
      historyArray.push(history);
      historyArray.shift();
        }
      localStorage.setItem("historyArray", JSON.stringify(historyArray));
      })
    .then(function(){loadHistory()}) 

    };

    
    var marketNewsURL = 'https://api.marketaux.com/v1/news/all?exchanges=' + targetExchange + '&filter_entities=true&language=en&limit=3&published_after=2022-12-29T02:24&api_token=' + marketKey;

    //--- API to fetch results for financial news ---//
    fetch(marketNewsURL)
    .then(function (newsResponse) {
      if (newsResponse.ok) {
        newsResponse.json().then(function(data) {

          console.log(marketNewsURL);
          console.log(data);
          articleContainer.innerHTML= '';

          // --- populates the news container with 'title', 'snippet' and [url] that takes you to the article ---//
          for (var i = 0; i < data.data.length; i++) {
            var articleTitle = document.createElement('h5');
            articleTitle.setAttribute('id', 'news-style');
            articleTitle.textContent = data.data[i].title;
            articleTitle.style = 'font-weight: bold';
            articleContainer.append(articleTitle);

            var articleSnippet = document.createElement('p');
            articleSnippet.textContent = data.data[i].snippet;
            articleSnippet.style = 'font-weight: normal';
            articleTitle.appendChild(articleSnippet);

            var articleURL = document.createElement('a');
            articleURL.textContent = 'Read more...';
            articleURL.setAttribute('href', data.data[i].url);
            articleURL.setAttribute('target', '_blank');
            articleTitle.appendChild(articleURL);
          }
        })
      }
     })
    };

submitBtn.addEventListener('click', handleButtonClick);

//--- onLoad functions ---//
getList();
loadHistory();
showImage();