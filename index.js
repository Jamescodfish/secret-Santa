const { Client, Intents } = require('discord.js');
const moment = require('moment-timezone');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES] });

const secretSantaChannelId = 'YOUR_CHANNEL_ID'; // The channel where users will join Secret Santa
const participants = []; // List to store participants
const secretSantaDate = moment.tz('2024-12-05 19:00', 'America/New_York'); // Date and time for pairing (5/12/24 7 PM EST)

client.on('messageCreate', async (message) => {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // Command for joining Secret Santa
    if (message.content.toLowerCase() === '!join') {
        if (!participants.includes(message.author.id)) {
            participants.push(message.author.id);
            message.reply('You have successfully joined the Secret Santa!');
        } else {
            message.reply('You are already in the Secret Santa!');
        }
    }

    // Command for checking who is in Secret Santa (for admins)
    if (message.content.toLowerCase() === '!participants') {
        if (message.author.id === 'ADMIN_USER_ID') {
            message.reply('Current participants: ' + participants.map(id => `<@${id}>`).join(', '));
        }
    }

    // Check time and send pairings
    if (moment().isAfter(secretSantaDate)) {
        if (message.content.toLowerCase() === '!pairing' && participants.length > 1) {
            shuffleArray(participants); // Randomly shuffle participants
            for (let i = 0; i < participants.length; i++) {
                const participant = await client.users.fetch(participants[i]);
                const recipient = await client.users.fetch(participants[(i + 1) % participants.length]); // Next participant or first if last
                recipient.send(`Your Secret Santa recipient is: ${participant.username}`);
                participant.send(`Your Secret Santa recipient is: ${recipient.username}`);
            }
            message.reply('The pairings have been sent! Check your DMs.');
        } else if (message.content.toLowerCase() === '!pairing') {
            message.reply('Not enough participants to pair yet!');
        }
    }
});

// Helper function to shuffle participants
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

client.login('YOUR_BOT_TOKEN');
