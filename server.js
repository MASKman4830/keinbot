const http = require("http");
const querystring = require("querystring");
const discord = require("discord.js");
const client = new discord.Client();

http
  .createServer(function(req, res) {
    if (req.method == "POST") {
      var data = "";
      req.on("data", function(chunk) {
        data += chunk;
      });
      req.on("end", function() {
        if (!data) {
          res.end("No post data");
          return;
        }
        var dataObject = querystring.parse(data);
        console.log("post:" + dataObject.type);
        if (dataObject.type == "wake") {
          console.log("Woke up in post");
          res.end();
          return;
        }
        res.end();
      });
    } else if (req.method == "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Discord Bot is active now\n");
    }
  })
  .listen(3000);



//ログ
client.on("ready", message => {
  console.log("Bot準備完了～");
  client.user.setPresence({ game: { name: "AmongUs" } });
});





//ミュート ミュート解除
client.on('message', (message) => {
    const channel = message.channel
    const members = channel.members
    if (message.content.startsWith("/muteall")) {
        members.forEach(member => {
            member.voice.setMute(true)
            member.voice.setDeaf(true)
        });
        message.channel.send('Server muted');
    } else if (message.content.startsWith("/unmuteall")) {
        members.forEach(member => {
            member.voice.setMute(false)
            member.voice.setDeaf(false)
        });
        message.channel.send('Server unmuted');
    }
});




//募集コード
client.on("message", msg => {
  if (msg.content === "/アマアス募集") {
    msg.channel.send("アマングアスする人いますか@everyone？");
  }
});

//risaの紹介
client.on("message", msg => {
  if (msg.content === "keinの紹介") {
    msg.channel.send(
      "ただいま試験運用中です、誤作動や過激な発言、エラーなどよく起きると思いますがご了承ください"
    );
  }
});


//サーバー　検索
client.on("message", msg => {
  if (msg.content === "招待コード") {
    msg.channel.send("https://discord.gg/PrdeNXebv2");
  }
});


client.on("message", msg => {
  if (msg.content === "ピクトセンス") {
    msg.channel.send("https://pictsense.com/#!/1613479062405_143");
  }
});


//コインゲーム
client.on('message', message => {
if(message.content === '！コインゲーム'){
var array = [":dvd:omote", ":cd:ura"];
message.channel.send(array[Math.floor(Math.random() * array.length)]);
console.log(array[Math.floor(Math.random() * array.length)]);
}
})



//いじらない
if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.log("DISCORD_BOT_TOKENが設定されていません。");
  process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);

function sendReply(message, text) {
  message
    .reply(text)
    .then(console.log("リプライ送信: " + text))
    .catch(console.error);
}

function sendMsg(channelId, text, option = {}) {
  client.channels
    .get(channelId)
    .send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error);
}
