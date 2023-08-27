const { Client, GatewayIntentBits } = require('discord.js')
const dotenv = require('dotenv')
const User = require('./models/user.js')
const { sqlClient } = require('./db.js')
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
    console.log(userQuery, 'USERQUERY')
    if (!userQuery) {
      console.log(`USER DOESN'T EXIST`)
      const user = {
        id: userId,
        lastRelapseTimestamp: Date.now().toString()
      }
      await User.create({ ...user })
    } else {
      await User.update(
        { lastRelapseTimestamp: Date.now().toString() },
        { where: { id: userId } }
      ) // Set lastRelapse to 1 second ago
    }

    message.author.send('Your streak has been reset.');
    message.delete();
  } else if (command === 'update') {
    const userId = message.author.id
    const userQuery = await User.findOne({ where: { id: userId } })
    if (userQuery) {
      const currentTime = Date.now()
      const userData = userQuery.dataValues
      const lastRelapse = userData.lastRelapseTimestamp
      // TODO
      // CHANGE TO LAST RELAPSE
      const timeDifference = currentTime - lastRelapse
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

      message.author.send(`Your streak is ${durationString} since last relapse.`);
       message.delete();
    } else {
      message.reply('You do not have a streak yet.')
    }
  } else if (command === 'set') {
    const userId = message.author.id
    const daysToSet = parseInt(args[0])
    const hoursToSet = parseInt(args[1])
    let setTimestamp = Date.now()

    if (!isNaN(daysToSet)) {
      setTimestamp -= daysToSet * 1000 * 60 * 60 * 24
    }

    if (!isNaN(hoursToSet)) {
      setTimestamp -= hoursToSet * 1000 * 60 * 60
    }
    const userQuery = await User.findOne({ where: { id: userId } })
    if (userQuery) {
      await User.update(
        { lastRelapseTimestamp: setTimestamp },
        { where: { id: userId } }
      )
    } else {
      const user = {
        id: userId,
        lastRelapseTimestamp: setTimestamp
      }
      await User.create({ ...user })
    }

    message.author.send('Streak set successfully since last relapse.');
    message.delete();
  }
})
async function start () {
  console.log('START')
  await sqlClient.sync({})
  client.login(process.env.TOKEN ?? '')
}
start()
