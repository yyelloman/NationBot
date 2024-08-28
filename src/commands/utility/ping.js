const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("desc")
        .addSubcommand({
            input: new SlashCommandSubcommandBuilder()
                .setName("test")
                .setDescription("testttt")
        }),
    async execute(interaction) {
        await interaction.reply("pong");
    }
}