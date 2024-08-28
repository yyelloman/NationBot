const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("desc")
        .addSubcommand(subcommand =>
            subcommand
                .setName("testsubcommand")
                .setDescription("test")
        ),
    async execute(interaction) {
        await interaction.reply("pong");
    }
}