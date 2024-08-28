const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { ACCENT_COLOR } = require("..");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register your country"),
    async execute(interaction) {
        const embed = new EmbedBuilder().setDescription(`**Alright, please wait :]**`).setColor(ACCENT_COLOR);
        await interaction.reply({ embeds: [embed] });
        
        const registrationChannel = interaction.guild.channels.create({
            name: `${interaction.user.username}-registration`,
            type: ChannelType.GuildText,
            reason: `${interaction.user.username} (${interaction.user.id}) wanted to register a country`,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel]    
                },
                {
                    id: interaction.client.user.id,
                    allow: [PermissionFlagsBits.ViewChannel]
                }
            ]
        }).then(channel => channel.send("hi")).catch(console.error);

        const channel = interaction.client.channels.cache.find(channel => channel.name === registrationChannel.name)
    }
}