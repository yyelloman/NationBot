const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require("discord.js");

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
        if (interaction.options.getSubcommand() === "testsubcommand") {
            await interaction.reply("PONG!!!!!!!!!!!!!!!!!!!!!!!!!")
        } else {
            await interaction.reply("pong")
        }
    }
}