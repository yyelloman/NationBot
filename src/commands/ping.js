const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { ACCENT_COLOR } = require("..");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("desc"),
    async execute(interaction) {
        const embed = new EmbedBuilder().setDescription(`Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms.`).setColor(ACCENT_COLOR);
        await interaction.reply({ embeds: [embed] });
    }
}