function convert() {

  var fromcurrency = document.getElementById('from').value;
  var tocurrency = document.getElementById('to').value;
  localStorage.setItem('fromcurrency', fromcurrency);
  localStorage.setItem('tocurrency', tocurrency);
  var request = require('request');
  setInterval(function() {
    var content=localStorage.getItem('fromcurrency') + localStorage.getItem('tocurrency');
    request("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22" + content + "%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", function(error, response, body) {
      if (!error && response.statusCode == 200) {
        body  = JSON.parse(body);
        newRate(body);
      }
    });

  }, 1800);

  var lastPrice;
  function newRate(content) {
    currentRate = content.query.results.rate.Rate;
    currencyfrom = content.query.results.rate.Name.substring(0,3);
    currencyto = content.query.results.rate.Name.substring(4,7);
    document.getElementById("currencyrate").innerHTML = "Current Rate: " + currentRate;
    document.getElementById("currency").innerHTML = "1 " + currencyfrom + " to " + currencyto;

    var history = document.getElementById("priceHistory");
    if(lastPrice<currentRate) {
      var newElText = "▲";
      var wrap = document.createElement("span");
      wrap.className = "up";
    } else if(lastPrice==currentRate) {
      var newElText = "◼︎";
      var wrap = document.createElement("span");
      wrap.className = "noChange";
    } else {
      var newElText = "▼";
      var wrap = document.createElement("span");
      wrap.className = "down";
    }
    history.appendChild(wrap);
    var textNode = document.createTextNode(newElText);
    wrap.appendChild(textNode);

    var nodeList = history.getElementsByTagName("SPAN").length;
    if(nodeList==25) {
      history.children[0].remove();
    }

    lastPrice = currentRate;
  }


}
