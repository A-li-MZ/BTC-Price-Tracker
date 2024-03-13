let tickers = JSON.parse(localStorage.getItem("tickers")) || [];
let lastPrices = {};
let counter = 15;

function startUpdateCycle() {
  updatePrices();
  setInterval(function () {
    counter--;
    $("#counter").text(counter);
    if (counter <= 0) {
      updatePrices();
      counter = 15;
    }
  }, 1000);
}

$(document).ready(function () {
  tickers.forEach(function (ticker) {
    addTickerToGrid(ticker);
  });

  updatePrices();

  $("#add-ticker-form").submit(function (e) {
    e.preventDefault();
    let newTicker = $("#new-ticker").val().toUpperCase();
    if (!tickers.includes(newTicker)) {
      tickers.push(newTicker);
      localStorage.setItem("tickers", JSON.stringify(tickers));
      addTickerToGrid(newTicker);
    }

    $("new-ticker").val("");
    updatePrices();
  });

  $("#tickers-grid").on("click", ".remove-btn", function () {
    let tickerToRemove = $(this).data("ticker");
    tickers = tickers.filter((t) => t !== tickerToRemove);
    localStorage.setItem("tickers", JSON.stringify(tickers));
    $(`#${tickerToRemove}`).remove();
  });

  startUpdateCycle();
});

function addTickerToGrid(ticker) {
  $("#tickers-grid").append(`
    <div id="${ticker}" class="stock-box"> 
      <h2>${ticker}</h2>
      <p id="${ticker}-price"></p>
      <p id="${ticker}-pct"></p>
      <button class="remove-btn" data-ticker="${ticker}">Remove</button>
    </div>
  `);
}

// function updatePrices() {
//   tickers.forEach(function(ticker) {
//     $.ajax({
//       url: '/get_stock_data',
//       type: 'POST',
//       data: JSON.stringify({'ticker': ticker}),
//       contentType: 'application/json; charset=utf-8',
//       dataType: 'json',
//       success: function(data) {
//         let changPercent = ((data.currentPrice - data.openPrice) / data.openPrice) * 100
//         let colorClass
//         if (changPercent <= -2) {
//           colorClass = 'dark-red'
//         } else if (changPercent < 0) {
//           colorClass = 'red'
//         } else if (changPercent == 0) {
//           colorClass = 'gray'
//         } else if (changPercent <= 2) {
//           colorClass = 'green'
//         } else {
//           colorClass = 'dark-green'
//         }

//         $(`#${ticker}-price`).text(`$${data.currentPrice.toFixed(2)}`)
//         $(`#${ticker}-pct`).text(`${changPercent.toFixed(2)}%`)
//         $(`#${ticker}-price`).removeClass(`dark-red red gray green dark-green`).addClass(colorClass)
//         $(`#${ticker}-pct`).removeClass(`dark-red red gray green dark-green`).addClass(colorClass)

//         let flashClass;
//         if (lastPrices[ticker] > data.currentPrice) {
//           flashClass = 'red-flash'
//         } else if (lastPrices[ticker] < data.currentPrice) {
//           flashClass = 'green-flash'
//         } else {
//           flashClass = 'gray-flash'
//         }
//         lastPrices[ticker] = data.currentPrice

//         $(`#${ticker}`).addClass(flashClass)
//         setTimeout(function() {
//           $(`#${ticker}`).removeClass(flashClass)
//         }, 1000)
//       }
//     })
//   })
// }

async function updatePrices() {
  // const tickers = JSON.parse(localStorage.getItem('tickers')) || []
  // const lastPrices = {}

  for (const ticker of tickers) {
    const response = await fetch(`/get_stock_data`, {
      method: "POST",
      body: JSON.stringify({ ticker }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const changPercent =
        ((data.currentPrice - data.openPrice) / data.openPrice) * 100;
      let colorClass;
      if (changPercent <= -2) {
        colorClass = "dark-red";
      } else if (changPercent < 0) {
        colorClass = "red";
      } else if (changPercent == 0) {
        colorClass = "gray";
      } else if (changPercent <= 2) {
        colorClass = "green";
      } else {
        colorClass = "dark-green";
      }

      $(`#${ticker}-price`).text(`$${data.currentPrice.toFixed(2)}`);
      $(`#${ticker}-pct`).text(`${changPercent.toFixed(2)}%`);
      $(`#${ticker}-price`)
        .removeClass(`dark-red red gray green dark-green`)
        .addClass(colorClass);
      $(`#${ticker}-pct`)
        .removeClass(`dark-red red gray green dark-green`)
        .addClass(colorClass);

      let flashClass;
      if (lastPrices[ticker] > data.currentPrice) {
        flashClass = "red-flash";
      } else if (lastPrices[ticker] < data.currentPrice) {
        flashClass = "green-flash";
      } else {
        flashClass = "gray-flash";
      }
      lastPrices[ticker] = data.currentPrice;

      $(`#${ticker}`).addClass(flashClass);
      setTimeout(function () {
        $(`#${ticker}`).removeClass(flashClass);
      }, 1000);
    }
  }
}
