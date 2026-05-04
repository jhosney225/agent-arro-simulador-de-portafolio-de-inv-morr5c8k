
```javascript
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();

// Portfolio data structure
const portfolio = {
  assets: [
    { symbol: "AAPL", shares: 10, purchasePrice: 150, currentPrice: 180 },
    { symbol: "GOOGL", shares: 5, purchasePrice: 2500, currentPrice: 2800 },
    { symbol: "MSFT", shares: 8, purchasePrice: 300, currentPrice: 340 },
    { symbol: "TSLA", shares: 3, purchasePrice: 800, currentPrice: 920 },
    { symbol: "AMZN", shares: 2, purchasePrice: 3200, currentPrice: 3500 },
  ],
};

// Simple ASCII chart generator
function generateSimpleChart(title, data, width = 50, height = 10) {
  const maxValue = Math.max(...data.values);
  const minValue = Math.min(...data.values);
  const range = maxValue - minValue || 1;

  let chart = `\n${title}\n`;
  chart += "=".repeat(width) + "\n";

  // Create the chart from top to bottom
  for (let y = height - 1; y >= 0; y--) {
    let line = "";
    const threshold = minValue + (y / height) * range;

    for (let x = 0; x < data.values.length; x++) {
      if (data.values[x] >= threshold) {
        line += "█ ";
      } else {
        line += "  ";
      }
    }

    // Add Y-axis label
    if (y % Math.ceil(height / 3) === 0) {
      const label = (minValue + ((y + 1) / height) * range).toFixed(0);
      line += `| ${label}`;
    }
    chart += line + "\n";
  }

  chart += "-".repeat(width) + "\n";

  // X-axis labels
  let xLabels = "";
  for (let i = 0; i < data.labels.length; i++) {
    xLabels += (data.labels[i] || "").substring(0, 2) + " ";
  }
  chart += xLabels + "\n";

  return chart;
}

// Calculate portfolio metrics
function calculatePortfolioMetrics() {
  let totalValue = 0;
  let totalInvested = 0;
  const prices = [];
  const symbols = [];

  for (const asset of portfolio.assets) {
    const currentValue = asset.shares * asset.currentPrice;
    const investedValue = asset.shares * asset.purchasePrice;

    totalValue += currentValue;
    totalInvested += investedValue;
    prices.push(currentValue);
    symbols.push(asset.symbol);
  }

  const gain = totalValue - totalInvested;
  const gainPercent = ((gain / totalInvested) * 100).toFixed(2);

  return {
    totalValue: totalValue.toFixed(2),
    totalInvested: totalInvested.toFixed(2),
    gain: gain.toFixed(2),
    gainPercent,
    priceChart: { labels: symbols, values: prices },
    assets: portfolio.assets,
  };
}

// Format portfolio data for Claude
function formatPortfolioForClaude(metrics) {
  let text = "Current Portfolio Status:\n";
  text += `Total Portfolio Value: $${metrics.totalValue}\n`;
  text += `Total Invested: $${metrics.totalInvested}\n`;
  text += `Total Gain: $${metrics.gain} (${metrics.gainPercent}%)\n\n`;

  text += "Assets:\n";
  for (const asset of metrics.assets) {
    const currentValue = (asset.shares * asset.currentPrice).toFixed(2);
    const gain = ((asset.currentPrice - asset.purchasePrice) * asset.shares).toFixed(2);
    text += `${asset.symbol}: ${asset.shares} shares @ $${asset.currentPrice} = $${currentValue} (Gain: $${gain})\n`;
  }

  return text;
}

// Display portfolio with ASCII chart
function displayPortfolio() {
  const metrics = calculatePortfolioMetrics();

  console.clear();
  console.log("📊 INVESTMENT PORTFOLIO SIMULATOR 📊\n");
  console.log("=".repeat(60));

  // Display metrics
  console.log(`\nPortfolio Value: $${metrics.totalValue}`);
  console.log(`Total Invested: $${metrics.totalInvested}`);
  console.log(`Total Gain: $${metrics.gain} (${metrics.gainPercent}%)`);

  // Display ASCII chart
  console.log(generateSimpleChart("Asset Values Distribution", metrics.priceChart));

  console.log("\nAsset Details:");
  console.log("-".repeat(60));
  console.log("Symbol | Shares | Purchase Price | Current Price | Value");
  console.log("-".repeat(60));

  for (const asset of metrics.assets) {
    const value = (asset.shares * asset.currentPrice).toFixed(2);
    console.log(
      `${asset.symbol.padEnd(6)} | ${asset.shares.toString().padEnd(6)} | $${asset.purchasePrice
        .toString()
        .padEnd(14)} | $${asset.currentPrice.toString().padEnd(13)} | $${value}`
    );
  }

  console.log("\n" + "=".repeat(60));
  return metrics;
}

// Simulate price changes
function simulatePriceChange() {
  for (const asset of portfolio.assets) {
    const changePercent = (Math.random() - 0.5) * 20; // -10% to +10%
    const changeAmount = asset.currentPrice * (changePercent / 100);
    asset.currentPrice = Math