const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});           

client.on('ready', (context) => {
    console.log(`${context.user.tag} is online`);
});

client.on('messageCreate', (message) => {
    console.log(message.content);
});

client.login(process.env['TOKEN']);
