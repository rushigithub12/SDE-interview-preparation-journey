const prices = [7, 1, 5, 3, 6, 4];
const prices1 = [7, 6, 4, 3, 1];

function stockBuyAndSell(prices) {
  let maxProfit = 0;

  for (let i = 0; i < prices.length - 1; i++) {
    let diff = 0;
    for (let j = i + 1; j < prices.length; j++) {
      diff = prices[j] - prices[i];
      maxProfit = Math.max(diff, maxProfit);
    }
  }
  return maxProfit;
}

console.log(stockBuyAndSell(prices));
console.log(stockBuyAndSell(prices1));

//optimal approach

function stockBuyAndSell1(prices) {
  let maxProfit = 0;
  let minPrice = Infinity;

  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    } else {
      maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
  }
  return maxProfit;
}

console.log(stockBuyAndSell1(prices));
