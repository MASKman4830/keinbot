onst http = require("http");
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

//help
client.on("message", msg => {
  if (msg.content === "k!help") {
    const embed = new discord.MessageEmbed()
      .setTitle("kein:ヘルプメッセージへようこそ")
      .addField("keinは2021/01/14から活動を始めています", "試作段階です")
      .setColor("RANDOM")
      .setTimestamp()
      .addField("ヘルプメッセージ", "k!help")
      .addField("計算", "k!add")
      .addField("投票、選択", "k!poll")
      .addField("メッセージ削除", "k!purge")
      .addField("pingの表示", "k!ping")
      .addField("リンク", "k!links")
      .addField("mute/unmute", "k!muteall/k!unmuteall")
      .addField("コインゲーム", "k!コインゲーム");
    msg.channel.send(embed);
  }
});

//ログ
client.on("ready", message => {
  console.log("Bot準備完了");
});

client.on("ready", message => {
  console.log("準備完了");
});

//反応
client.on("message", async message => {
  if (message.content === "よろしくお願いします") {
    const reply = await message.channel.send("hi!");
    reply.react("👋");
  }
});

client.on("message", message => {
  if (message.mentions.users.has(client.user.id)) {
    message.reply("どうしました？");
  }
});

//メッセージ削除
client.on("message", async message => {
  // !purge コマンドが実行されたら
  if (message.content === "k!purge") {
    // コマンドが送信されたチャンネルから直近100件(上限)メッセージを取得する
    const messages = await message.channel.messages.fetch({ limit: 100 });
    // ボット以外が送信したメッセージを抽出
    const filtered = messages.filter(message => !message.author.bot);
    // それらのメッセージを一括削除
    message.channel.bulkDelete(filtered);
  }
});

//poll
const prefix = "k!";

client.on("message", async message => {
  if (!message.content.startsWith(prefix)) return;
  const [command, ...args] = message.content.slice(prefix.length).split(" ");
  if (command === "poll") {
    const [title, ...choices] = args;
    if (!title) return message.channel.send("タイトルを指定してください");
    const emojis = ["🇦", "🇧", "🇨", "🇩"];
    if (choices.length < 2 || choices.length > emojis.length)
      return message.channel.send(
        `選択肢は2から${emojis.length}つを指定してください`
      );
    const poll = await message.channel.send({
      embed: {
        title: title,
        description: choices.map((c, i) => `${emojis[i]} ${c}`).join("\n")
      }
    });
    emojis.slice(0, choices.length).forEach(emoji => poll.react(emoji));
  }
});

//通話

//キック
client.on("message", async message => {
  if (message.content.startsWith("!kick") && message.guild) {
    if (message.mentions.members.size !== 1)
      return message.channel.send("キックするメンバーを1人指定してください");
    const member = message.mentions.members.first();
    if (!member.kickable)
      return message.channel.send("このユーザーをキックすることができません");

    await member.kick();

    message.channel.send(`${member.user.tag}をキックしました`);
  }
});

//ミュート ミュート解除
client.on("message", message => {
  const channel = message.channel;
  const members = channel.members;

  if (message.content.startsWith("k!muteall")) {
    members.forEach(member => {
      member.voice.setMute(true);
    });
    message.channel.send("Server muted");
  } else if (message.content.startsWith("k!unmuteall")) {
    members.forEach(member => {
      member.voice.setMute(false);
    });
    message.channel.send("Server unmuted");
  }
});

//リンク
client.on("message", msg => {
  if (msg.content === "k!links") {
    const embed = new discord.MessageEmbed()
      .setTitle("リンク集")
      .setColor("RANDOM")
      .setTimestamp()
      .setDescription(
        `メッセージのリンクは [こちら](${msg.url}) をクリックしてください。`
      )
      .addField(
        "Google",
        "Googleのリンクは [こちら](https://google.com) をクリックしてください。"
      )
      .addField(
        "Yahoo",
        "Yahooのリンクは [こちら](https://www.yahoo.co.jp/) をクリックしてください。"
      )
      .addField(
        "Bing",
        "Bingのリンクは [こちら](https://www.bing.com/) をクリックしてください。"
      )
      .addField(
        "ピクトセンス",
        "ピクトセンスのリンクは [こちら](https://pictsense.com/#!/1613479062405_143) をクリックしてください。"
      );
    msg.channel.send(embed);
  }
});

//pimg
client.on("message", message => {
  if (message.content === "k!ping") {
    const embed = new discord.MessageEmbed()
      .addField("ping", client.ws.ping)
      .setColor("RANDOM")
      .setTimestamp();
    message.channel.send(embed);
  }
});

//グローバルチャット
 client.on('message', message =>
 {
     if (message.channel.name === 'グローバルチャット')
     {
         if (message.author.bot) return;
         if (message.attachments.size <= 0)
         {
             message.delete()
         }
         client.channels.cache.forEach(channel =>
         {
             if (message.attachments.size <= 0)
             {
                 const embed = new discord.MessageEmbed()
                     .setAuthor(message.author.tag, message.author.avatarURL())
                     .setDescription(message.content)
                     .setColor(0x2C2F33)
                     .setFooter(message.guild.name, message.guild.iconURL())
                     .setTimestamp()
                 if (channel.name === 'グローバルチャット')
                 {
                     channel.send(embed)
                     return;
                 }
                 return;
             }
             if (!message.attachments.forEach(attachment =>
             {
                 const embed = new discord.MessageEmbed()
                     .setAuthor(message.author.tag, message.author.avatarURL())
                     .setImage(attachment.url)
                     .setDescription(attachment.url)
                     .setColor(0x2C2F33)
                     .setFooter(message.guild.name, message.guild.iconURL())
                     .setTimestamp()
                 if (channel.name === 'グローバルチャット')
                 {
                     channel.send(embed)
                     return;
                 }
                 return;
             }));
             return;
         });
     }
 })
//スプレットシート
client.on("message", message => {
  if (message.content === "k!Amongus") {
    const embed = new discord.MessageEmbed()
      .addField("Amongus", "参加できますか？", "21時30分からです")
      .setColor("RANDOM")
      .setTimestamp();
    message.channel.send(embed);
  }
});

//計算
client.on("message", async message => {
  if (!message.content.startsWith(prefix)) return;
  const [command, ...args] = message.content.slice(prefix.length).split(" ");
  if (command === "add") {
    const [a, b] = args.map(str => Number(str));
    message.channel.send(`${a} + ${b} = ${a + b}`);
  }
});

//サーバー　検索
client.on("message", msg => {
  if (msg.content === "招待コード") {
    msg.channel.send("https://discord.gg/PrdeNXebv2");
  }
});

//コインゲーム
client.on("message", message => {
  if (message.content === "k!コインゲーム") {
    var array = [":dvd:", ":cd:"];
    message.channel.send(array[Math.floor(Math.random() * array.length)]);
    console.log(array[Math.floor(Math.random() * array.length)]);
  }
});

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
