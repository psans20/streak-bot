const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Load existing data from the JSON file
let userStreaks = {};
try {
  const data = fs.readFileSync('streaks.json', 'utf8');
  userStreaks = JSON.parse(data);
} catch (err) {
  console.error('Error reading streaks.json:', err);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefix = '!';
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'relapse') {
    const userId = message.author.id;

    if (!userStreaks[userId]) {
      userStreaks[userId] = {
        accumulatedTime: 0,
        lastRelapse: Date.now(),
      };
    } else {
      userStreaks[userId].accumulatedTime = 0;
      userStreaks[userId].lastRelapse = Date.now();
    }

    saveStreaksToFile();
    message.author.send('Your streak has been reset.');

  } else if (command === 'update') {
    const userId = message.author.id;

    if (userStreaks[userId]) {
      const currentTime = Date.now();
      const timeDifference = currentTime - userStreaks[userId].lastRelapse + userStreaks[userId].accumulatedTime;
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

      let durationString = '';
      if (days > 0) {
        durationString += `${days} day(s) `;
      }
      if (hours > 0) {
        durationString += `${hours} hour(s) `;
      }
      if (minutes > 0) {
        durationString += `${minutes} minute(s)`;
      }

      if (durationString.trim() === '') {
        message.reply('You do not have a streak yet.');
      } else {
        message.reply(`Your streak is ${durationString} since last relapse.`);
      }
    } else {
      message.reply('You do not have a streak yet.');
    }

  } else if (command === 'set') {
    const userId = message.author.id;
    const daysToSet = parseInt(args[0]);
    const hoursToSet = parseInt(args[1]);

    if (!userStreaks[userId]) {
      userStreaks[userId] = {
        accumulatedTime: 0,
        lastRelapse: null,
      };
    }

    if (!isNaN(daysToSet) && daysToSet > 0) {
      userStreaks[userId].accumulatedTime += daysToSet * 24 * 60 * 60 * 1000;
      userStreaks[userId].lastRelapse = Date.now();
    }

    if (!isNaN(hoursToSet) && hoursToSet > 0) {
      userStreaks[userId].accumulatedTime += hoursToSet * 60 * 60 * 1000;
      userStreaks[userId].lastRelapse = Date.now();
    }

    saveStreaksToFile();
    message.reply('Streak set successfully since last relapse.');
  }
});

// Function to save userStreaks to the JSON file
function saveStreaksToFile() {
  fs.writeFileSync('streaks.json', JSON.stringify(userStreaks, null, 2), 'utf8');
}

  client.login('YOUR-BOT-TOKEN');
  
