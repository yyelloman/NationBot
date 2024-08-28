const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { ACCENT_COLOR, ERROR_COLOR } = require("..");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register your country"),
    async execute(interaction) {
        register(interaction);
    }
}

async function register(interaction) {
    const embed = new EmbedBuilder()
        .setDescription(`**Alright, please wait :]**`)
        .setColor(ACCENT_COLOR);
    await interaction.reply({ embeds: [embed] });

    try {
        const registrationChannel = await interaction.guild.channels.create({
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
        });

        if (registrationChannel) {
            console.log(`Registration channel #${registrationChannel.name} has been created`);
            
            const followUpEmbed = new EmbedBuilder()
                .setDescription(
                    `**A channel has been created for your registration: <#${registrationChannel.id}>. Please go there to begin.`
                )
                .setColor(ACCENT_COLOR);

            interaction.followUp({ embeds: [followUpEmbed] });
            proceedWithRegistration(interaction, registrationChannel);
        } else {
            const errorEmbed = new EmbedBuilder().setDescription(`**Error creating registration channel :[**`).setColor(ERROR_COLOR);
            await interaction.followUp({ embeds: [errorEmbed] });
        }
    } catch (error) {
        const errorEmbed = new EmbedBuilder()
            .setDescription(
                `**Error creating registration channel :[**\n\`\`\`${error}\`\`\``
            )
            .setColor(ERROR_COLOR);
        await interaction.followUp({ embeds: [errorEmbed] });
    }
}

async function proceedWithRegistration(interaction, channel) {
    const startEmbed = new EmbedBuilder()
        .setTitle("Beginning registration...")
        .setColor(ACCENT_COLOR);
    await channel.send({ content: `<@${interaction.user.id}>`, embeds: [startEmbed] });
}