const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { ACCENT_COLOR, ERROR_COLOR } = require("..");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register your country"),
    async execute(interaction) {
        const embed = new EmbedBuilder().setDescription(`**Alright, please wait :]**`).setColor(ACCENT_COLOR);
        await interaction.reply({ embeds: [embed] });

        try {
            // Create the registration channel
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

            // Check if the channel was created successfully
            if (registrationChannel) {
                console.log(`Channel created: ${registrationChannel.name}`); // Log the channel name for debugging

                // Send a message to the newly created channel
                await registrationChannel.send("hi");
            } else {
                const errorEmbed = new EmbedBuilder().setDescription(`**Error creating registration channel :[**`).setColor(ERROR_COLOR);
                await interaction.followUp({ embeds: [errorEmbed] });
            }
        } catch (error) {
            const errorEmbed = new EmbedBuilder().setDescription(`**Error creating registration channel :[**\n\`\`\`${error}\`\`\``).setColor(ERROR_COLOR);
            await interaction.followUp({ embeds: [errorEmbed] });
        }
    }
}
