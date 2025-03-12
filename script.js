const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function getTopGainers() {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');

        const topGainers = response.data
            .filter(coin => coin.symbol.endsWith('USDT')) // Only USDT trading pairs
            .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
            .slice(0, 5);

        let message = '📈 *Top 5 Crypto Gainers (24h):*\n';
        topGainers.forEach((coin, index) => {
            message += `\n${index + 1}. *${coin.symbol.replace('USDT', '')}* \n💰 Price: $${parseFloat(coin.lastPrice).toFixed(2)}\n📈 Change: ${parseFloat(coin.priceChangePercent).toFixed(2)}%\n`;
        });

        console.log(message);
        await sendTelegramMessage(message);
    } catch (error) {
        console.error('Error fetching top gainers:', error.message);
    }
}

async function sendTelegramMessage(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,  // Now using the environment variable
            text: message,
            parse_mode: "HTML"  // Try "HTML" instead of "Markdown"
        });

        console.log("Message sent successfully:", response.data);
    } catch (error) {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
    }
}

// Run the function immediately
getTopGainers();
setInterval(getTopGainers, 5 * 60 * 60 * 1000);
