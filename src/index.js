const { Client, IntentsBitField, Collection, Events } = require("discord.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.commands = new Collection();

// when the bot is ready
client.once(Events.ClientReady, (c) => {
    console.log(`${c.user.tag} client is ready`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`ERROR: Command ${interaction.commandName} does not exist!!`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`ERROR: ${error}`);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "There was an error running the command :[", ephemeral: true });
        } else {
            await interaction.reply({ content: "There was an error running the command :[", ephemeral: true });
        }
    }
});

client.login(process.env["TOKEN"]);
