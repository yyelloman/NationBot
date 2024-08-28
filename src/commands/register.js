const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
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
                    `**A channel has been created for your registration: <#${registrationChannel.id}>. Please go there to begin.**`
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
    let registrationData = {
        ok: true,
        name: ""
    }
    const startEmbed = new EmbedBuilder()
        .setTitle("Country Registration")
        .setDescription("Send any message within 3 minutes to begin. You will be given 3 minutes to answer each question. You can change your answers later with /settings.")
        .setColor(ACCENT_COLOR);
    await channel.send({ content: `<@${interaction.user.id}>`, embeds: [startEmbed] });
    
    await channel.awaitMessages({ max: 1, time: 180_000, errors: ["time"] })
        .catch(collected => {
            channel.delete(
                `${interaction.user.username} (${interaction.user.username}) did not give a response in time (registration)`
            )
                .then(() => console.log(
                    `${interaction.user.username} (${interaction.user.username}) did not give a response in time (registration)`
                ))
                .catch(console.error);
            registrationData.ok = false;
        });

    if (registrationData.ok === false) {
        return;
    }

    const nameEmbed = new EmbedBuilder()
        .setDescription("**What's the name of your country?** e.g. Canada, Russia, Germany. The full name will be automatically adjusted to the government you choose.")
        .setColor(ACCENT_COLOR);

    await channel.send({ embeds: embed });

    await channel.awaitMessages({ max: 1, time: 180_000, errors: ["time"] })
        .catch(collected => {
            noResponse(interaction, channel);
            registrationData.ok = false;
        });

    if (registrationData.ok === false) {
        return;
    }

    const governmentEmbed = new EmbedBuilder()
        .setDescription("**Choose a government type**")
        .setColor(ACCENT_COLOR);
    
    const governmentSelect = new StringSelectMenuBuilder()
        .setCustomId("government")
        .setPlaceholder("Choose a government type category")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(":1278346684283359233: Democratic")
                .setDescription("Any form of government where the power is exercised by the people")
                .setValue("democ"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Undemocratic")
                .setDescription("Any form of government where power belongs to the ")
                .setValue("undmc")
        )
}

function noResponse(interaction, channel) {
    const noResponseEmbed = new EmbedBuilder()
        .setDescription("No response was given within 3 minutes. Registration will restart.")
        .setColor(ERROR_COLOR);
    channel.send({ embeds: [noResponseEmbed] })
    proceedWithRegistration(interaction, channel);
}