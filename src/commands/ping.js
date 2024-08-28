const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("desc"),
    async execute(interaction) {
        const embed = new EmbedBuilder().setDescription(`Pong! Latency is ${Math.round(bot.ws.ping)}.`).setColor(0x3479d5);
        await interaction.reply({ embeds: embed });
    }
}