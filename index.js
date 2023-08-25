const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});


let userStreaks = {};

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});



client.on('messageCreate', async message => {
    if (message.author.bot) return;
  
    const prefix = '!'; // Change this to your desired command prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
  
    if (command === 'relapse') {
      const userId = message.author.id;
  
      if (!userStreaks[userId]) {
        userStreaks[userId] = {
          days: 0,
          hours: 0,
          minutes: 0,
          lastRelapse: Date.now(), // Store the timestamp of the last relapse command
        };
      } else {
        userStreaks[userId].days = 0;
        userStreaks[userId].hours = 0;
        userStreaks[userId].minutes = 0;
        userStreaks[userId].lastRelapse = Date.now(); // Update the lastRelapse time when resetting the streak
      }
  
      message.author.send('Your streak has been reset.');
  
    } else if (command === 'update') {
        const userId = message.author.id;
        
        if (userStreaks[userId]) {
          const days = userStreaks[userId].days;
          const hours = userStreaks[userId].hours;
          const minutes = userStreaks[userId].minutes;
          
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
      
         
          
            message.reply(`Your streak is ${durationString} long.`);
        } else {
          message.reply('You do not have a streak yet.');
        }
      } else if (command === 'set') {
        const userId = message.author.id;
        const daysToSet = parseInt(args[0]);
        const hoursToSet = parseInt(args[1]);
      
        if (!userStreaks[userId]) {
          userStreaks[userId] = {
            days: 0,
            hours: 0,
            minutes: 0,
            lastRelapse: null,
          };
        }
      
        if (!isNaN(daysToSet)) {
          userStreaks[userId].days = daysToSet;
        }
      
        if (!isNaN(hoursToSet)) {
          userStreaks[userId].hours = hoursToSet;
        }
      
        message.reply('Streak set successfully.');
    }
  });
  
  // Replace 'YOUR_BOT_TOKEN' with your actual bot token
  client.login('MTE0NDQwNDkwODM2MDA3NzM3Mg.GCAQJe.EtmD2dVqQ91VoWVspfVj5of1WGxMelR3wnXhm4');
  
