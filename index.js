const linebot = require('linebot') // 引用linebot
const express = require('express') // 引用express

// 辨識Line Channel的資訊
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// create Express app
const app = express(bot)
const linebotParser = bot.parser()

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/linewebhook', linebotParser);

// 當有人傳送訊息給Bot時
bot.on('message', (event) => {
  console.log('get msg: ', event)
  switch (event.message.type) {
    case 'text':
      event.reply('回聲蟲： ' + event.message.text);
      break;
    case 'image':
      event.message.content().then(function (data) {
        const s = data.toString('hex').substring(0, 32);
        return event.reply('Nice picture! ' + s);
      }).catch(function (err) {
        return event.reply(err.toString());
      });
      break;
    case 'sticker':
      // 貼圖可參考 https://developers.line.biz/media/messaging-api/sticker_list.pdf
      event.reply({
        type: 'sticker',
        packageId: 11537,
        stickerId: 52002752
      });
      break;
    default:
      event.reply('Unknow message: ' + JSON.stringify(event));
      break;
  }
})

// listen on port
app.listen(process.env.PORT || 3000, function () {
  console.log('LineBot is start.');
});