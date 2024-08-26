const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hey')
        .setDescription('replies with hey'),
    async execute(interaction) {
        await interaction.reply("Hey!");
    }
}