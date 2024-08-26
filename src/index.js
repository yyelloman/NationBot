const { Client, IntentsBitField } = require("discord.js");
//require("./register-comands");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("ready", (c) => {
    console.log(`${c.user.tag} is online`);
});

client.on("interactionCreate", (interaction) => {
    if (interaction.isChatInputCommand()) return;

    if (interaction.commandName === "hey") {
        console.log("did");
        interaction.reply("hey");
    }
});

client.login(process.env["TOKEN"]);
