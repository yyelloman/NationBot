const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { ACCENT_COLOR } = require("..");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register your country"),
    async execute(interaction) {
        const embed = new EmbedBuilder().setDescription(`**Alright, please wait :]**`).setColor(ACCENT_COLOR);
        await interaction.reply({ embeds: [embed] });
        
        const modal = new ModalBuilder()
            .setCustomId("nameRegistration")
            .setTitle("Register country: name");

        const nickname = new TextInputBuilder()
            .setCustomId("nrNickname")
            .setLabel("Name of country (e.g. Russia)")
            .setStyle(TextInputStyle.Short);
        
        const actionRow = new ActionRowBuilder().addComponents(nickname);

        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
}