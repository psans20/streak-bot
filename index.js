const { Client, GatewayIntentBits } = require('discord.js')
const dotenv = require('dotenv')
dotenv.config()
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
})

let userStreaks = {}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', async message => {
  if (message.author.bot) return

  const prefix = '!' // Change this to your desired command prefix
  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const command = args.shift().toLowerCase()

  if (command === 'relapse') {
    const userId = message.author.id

    if (!userStreaks[userId]) {
      userStreaks[userId] = {
        days: 0,
        hours: 0,
        minutes: 0,
        lastRelapse: Date.now() // Set lastRelapse to 1 second ago
      }
    } else {
      userStreaks[userId].days = 0
      userStreaks[userId].hours = 0
      userStreaks[userId].minutes = 0
      userStreaks[userId].lastRelapse = Date.now() // Set lastRelapse to 1 second ago
    }

    message.author.send('Your streak has been reset.')
  } else if (command === 'update') {
    const userId = message.author.id

    if (userStreaks[userId] && userStreaks[userId].lastRelapse) {
      const currentTime = Date.now()
      const timeDifference = currentTime - userStreaks[userId].lastRelapse
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      )

      let durationString = ''
      if (days > 0) {
        durationString += `${days} day(s) `
      }
      if (hours > 0) {
        durationString += `${hours} hour(s) `
      }
      if (minutes > 0) {
        durationString += `${minutes} minute(s)`
      }

      if (durationString.trim() === '') {
        message.reply('You do not have a streak yet.')
      } else {
        message.reply(`Your streak is ${durationString} since last relapse.`)
      }
    } else {
      message.reply('You do not have a streak yet.')
    }
  } else if (command === 'set') {
    const userId = message.author.id
    const daysToSet = parseInt(args[0])
    const hoursToSet = parseInt(args[1])

    if (!userStreaks[userId]) {
      userStreaks[userId] = {
        lastRelapse: Date.now()
      }
    }

    if (!isNaN(daysToSet)) {
      userStreaks[userId].lastRelapse -= daysToSet * 1000 * 60 * 60 * 24
    }

    if (!isNaN(hoursToSet)) {
      userStreaks[userId].lastRelapse -= hoursToSet * 1000 * 60 * 60
    }

    message.reply('Streak set successfully since last relapse.')
  }
})

client.login(process.env.TOKEN)
