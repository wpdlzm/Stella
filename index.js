const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.argv.length == 2 ? process.env.token : "";
const welcomeChannelName = "환영합니다";
const welcomeChannelComment = "스텔라 공식몰에 오신것을 환영합니다!";

client.on('ready', () => {
  console.log('켰다.');
  client.user.setPresence({ game: { name: '모든문의는 KADE#1004' }, status: 'online' })
});

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  const deleteUser = member.user;
  const byeChannel = guild.channels.find(channel => channel.name == byeChannelName);

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`);
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content == 'ping') {
    return message.reply('pong');
  }

  if(message.content == '!파일') {
    let img = 'https://cdn.discordapp.com/attachments/764417429333737482/764453271611113472/Stella.png';
    let embed = new Discord.RichEmbed()
      .setTitle('스텔라 파일')
      .setURL('https://mega.nz/file/h0hkEQqT#0Lk1yRABvLjhFbPFULmNH4BaAWi1-M2slUliI6nycx8')
      .setColor('#00dcff')
      .setTimestamp()
      .setFooter('Made by KADE', img)

    message.channel.send(embed)
  } else if(message.content == '!원격') {
    let img = 'https://cdn.discordapp.com/attachments/764417429333737482/764453271611113472/Stella.png';
    let embed = new Discord.RichEmbed()
      .setTitle('원격요청')
      .setColor('#00dcff')
      .addField('팀뷰어를 깔고 관리자나 직원에게 문의해주세요', 'https://www.teamviewer.com/')
      .setTimestamp()
      .setFooter('Made by KADE', img)

    message.channel.send(embed)

  } else if(message.content == '!패치') {
      let img = 'https://cdn.discordapp.com/attachments/764417429333737482/764453271611113472/Stella.png';
      let embed = new Discord.RichEmbed()
        .setTitle('2020.10.11 패치노트')
        .setColor('#00dcff')
        .addField('1. UI 수정\n2. 겐지 질풍 수정')
        .setTimestamp()
        .setFooter('Made by KADE', img)
  
      message.channel.send(embed)
  }
  else if(message.content == '!도움') {
    let img = 'https://cdn.discordapp.com/attachments/764417429333737482/764453271611113472/Stella.png';
    let embed = new Discord.RichEmbed()
      .setTitle('백신 및 뱅가드 종료')
      .setColor('#00dcff')
      .addField('아래 자신이 해당하거나 필요한 것들을 다운 받은 후 실행시켜주세요')
      .addField('1. 뱅가드 자동종료', 'https://mega.nz/file/F1BSxDBY#AYHLZjf684XXrNP5CZW7eLx5wz_MwRLTm_bcLFILcis')
      .addField('2. 백신제거', 'https://mega.nz/file/x1AyQBiA#F3X5bS8yqJM-6j6D4szWLgAA7xIhAw2ASV1MZvme9Lg')
      .addField('3. 디펜더 끄기', 'https://mega.nz/file/Q1JgzZTY#5H9g8_xqVwLc-yFljjlGvHknwLzZVZHQs4s7-F2WW-g')
      .setTimestamp()
      .setFooter('Made by KADE', img)
  
  } else if(message.content.startsWith('!공지')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('!공지'.length);
      let embed = new Discord.RichEmbed()
        .setAuthor('공지 of Stella BOT')
        .setColor('#00dcff')
        .setFooter(`Stella BOT ❤️`)
        .setTimestamp()
  
      embed.addField(contents);
  
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(embed)
      });
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  } else if(message.content.startsWith('!전체공지')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('!전체공지'.length);
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(`<@${message.author.id}> ${contents}`);
      });
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  } else if(message.content.startsWith('!청소')) {
    if(message.channel.type == 'dm') {
      return message.reply('dm에서 사용할 수 없는 명령어 입니다.');
    }
    
    if(message.channel.type != 'dm' && checkPermission(message)) return

    var clearLine = message.content.slice('!청소 '.length);
    var isNum = !isNaN(clearLine)

    if(isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return;
    } else if(!isNum) { // c @나긋해 3
      if(message.content.split('<@').length == 2) {
        if(isNaN(message.content.split(' ')[2])) return;

        var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
        var count = parseInt(message.content.split(' ')[2])+1;
        let _cnt = 0;

        message.channel.fetchMessages().then(collected => {
          collected.every(msg => {
            if(msg.author.id == user) {
              msg.delete();
              ++_cnt;
            }
            return !(_cnt == count);
          });
        });
      }
    } else {
      message.channel.bulkDelete(parseInt(clearLine)+1)
        .then(() => {
          AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
        })
        .catch(console.error)
    }
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

async function AutoMsgDelete(message, str, delay = 3000) {
  let msg = await message.channel.send(str);

  setTimeout(() => {
    msg.delete();
  }, delay);
}


client.login(token);