const { Client, GatewayIntentBits } = require('discord.js')
const dotenv = require('dotenv')
const User = require('./models/user.js')
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
    const userQuery = await User.findOne({ where: { id: userId } })
    // TODO
    // CHANGE to userQuery
    if (!userStreaks[userId]) {
      console.log(`USER DOESN'T EXIST`)
      const user = {
        id: userId,
        lastRelapseTimestamp: Date.now().toString()
      }
      await User.create({ ...user })

      userStreaks[userId] = {
        days: 0,
        hours: 0,
        minutes: 0,
        lastRelapse: Date.now() // Set lastRelapse to 1 second ago
      }
    } else {
      await User.update(
        { lastRelapseTimestamp: Date.now().toString() },
        { where: { id: userId } }
      )
      userStreaks[userId].days = 0
      userStreaks[userId].hours = 0
      userStreaks[userId].minutes = 0
      userStreaks[userId].lastRelapse = Date.now() // Set lastRelapse to 1 second ago
      await User.update
    }

    message.author.send('Your streak has been reset.')
  } else if (command === 'update') {
    const userId = message.author.id
    const userQuery = await User.findOne({ where: { id: userId } })
    if (userStreaks[userId] && userStreaks[userId].lastRelapse) {
      const currentTime = Date.now()
      const userData = userQuery.dataValues
      const lastRelapse = userData.lastRelapseTimestamp
      // TODO
      // CHANGE TO LAST RELAPSE
      const timeDifference = currentTime - userStreaks[userId].lastRelapse
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      )

      let durationString = ''

      durationString += `${days} day(s) `

      durationString += `${hours} hour(s) `

      durationString += `${minutes} minute(s)`

      console.log(durationString, 'DURATION STRING')
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
    let setTimestamp = Date.now()
    if (!userStreaks[userId]) {
      userStreaks[userId] = {
        lastRelapse: Date.now()
      }
    }

    if (!isNaN(daysToSet)) {
      userStreaks[userId].lastRelapse -= daysToSet * 1000 * 60 * 60 * 24
      setTimestamp -= daysToSet * 1000 * 60 * 60 * 24
    }

    if (!isNaN(hoursToSet)) {
      userStreaks[userId].lastRelapse -= hoursToSet * 1000 * 60 * 60
      setTimestamp -= hoursToSet * 1000 * 60 * 60
    }
    const userQuery = await User.findOne({ where: { id: userId } })
    if (userQuery) {
      await User.update({ lastRelapseTimestamp }, { where: { id: userId } })
    } else {
      const user = {
        id: userId,
        lastRelapseTimestamp: setTimestamp
      }
      await User.create({ ...user })
    }

    message.reply('Streak set successfully since last relapse.')
  }
})

client.login(process.env.TOKEN ?? '')
