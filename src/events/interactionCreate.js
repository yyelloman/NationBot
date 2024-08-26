const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`ERROR: Command ${interaction.commandName} does not exist!!!`);
            await interaction.reply(`The console just errored: \`\`\`ERROR: Command ${interaction.commandName} does not exist!!\`\`\``);
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
    }
}