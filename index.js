const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6072048649:AAEk1qjOv3oBsFQzz6aZt486ystqnwW1r0I';
const webAppUrl = 'https://joyful-mochi-eb8dfa.netlify.app/';
const bot = new TelegramBot(token, {polling: true});
const app = express();


app.use(express.json());
app.use(cors());


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Привет! Это 7sky и у меня можно купить самаый лучсший шмот!', {
      reply_markup: {
        inline_keyboard: [
            [{text: 'Стать лучше!', web_app:{url: webAppUrl}}]
        ]
      }
    })
  }
});

app.post('./web_data', async (req, res) => {
  const {queryId, products, totalPrice} = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Теперь вы стали лучше!',
      imput_message_content: {message_text: 'Спасибо за покупку! Вы потратили: ' + totalPrice}
    })
    return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Вы не стали лучше(!',
      input_message_content: {message_text: 'Вы не стали лучше('}
    })
    return res.status(500).json({})
  }
})
const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))