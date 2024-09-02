const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
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
        name: "",
        governmentType: "",
    }

    const startEmbed = new EmbedBuilder()
        .setTitle("Country Registration")
        .setDescription("Send any message within 3 minutes to begin. You will be given 3 minutes to answer each question. You can change your answers later with /nation config.")
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

    await channel.send({ embeds: [nameEmbed] });

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
    
    const governmentCategSelect = new StringSelectMenuBuilder()
        .setCustomId("government")
        .setPlaceholder("Choose a government type category")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Democratic")
                .setDescription("Where the power is exercised by the people")
                .setValue("democ")
                .setEmoji("1279000100248748104"),
            new StringSelectMenuOptionBuilder()
                .setLabel("Undemocratic")
                .setDescription("Where the power belongs to a few")
                .setValue("undemoc")
                .setEmoji("1279003115634298922")
        )
    
    const governmentCategRow = new ActionRowBuilder()
        .addComponents(governmentCategSelect);
    
    const governmentCategMsg = await channel.send({
        embeds: [governmentEmbed],
        components: [governmentCategRow]
    });

    const governmentCategCol = governmentCategMsg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 180_000})

    governmentCategCol.on("collect", async i => {
        governmentCategMsg.delete();
        const selection = i.values[0];
        if (selection === "democ") {
            const governmentDemocSelect = new StringSelectMenuBuilder()
            .setCustomId("governmentdemoc")
            .setPlaceholder("Choose a democratic government type")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Direct")
                    .setDescription("Where the people have a direct say in law making")
                    .setValue("dir-democ")
                    .setEmoji("1279016991155294271"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Representative")
                    .setDescription("Where the people elect rep.'s for law making")
                    .setValue("rep-democ")
                    .setEmoji("1279017005004886046")
            );

            const governmentDemocRow = new ActionRowBuilder()
                .addComponents(governmentDemocSelect);

            const governmentDemocMsg = await channel.send({
                content: "...",
                components: [governmentDemocRow]
            });

            const governmentDemocCol = governmentDemocMsg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 180_000})
        
            governmentDemocCol.on("collect", async i1 => {
                governmentDemocMsg.delete();
                const democSelection = i.values[0];
                registrationData.governmentType = democSelection;
            })
        } else if (selection === "undemoc") {
            const governmentDemocSelect = new StringSelectMenuBuilder()
            .setCustomId("governmentdemoc")
            .setPlaceholder("Choose a undemocratic government type")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Dictatorship")
                    .setDescription("The one leader has absolute power, and came to power by taking it")
                    .setValue("dict")
                    .setEmoji("1280141246962204703"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Monarchy")
                    .setDescription("The one leader has absolute power, and came to power by inheritance")
                    .setValue("mon")
                    .setEmoji("1280141257846558791"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Constitutional Monarchy")
                    .setDescription("Monarchy that follows a constitution")
                    .setValue("cons-mon")
                    .setEmoji("1280141283163111424"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Aristocracy")
                    .setDescription("Lead by the noble")
                    .setValue("aris")
                    .setEmoji("1280141294483669054"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Plutocracy")
                    .setDescription("Lead by the rich")
                    .setValue("pluto")
                    .setEmoji("1280141305539723385"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Stratocracy")
                    .setDescription("Lead by the military")
                    .setValue("strat")
                    .setEmoji("1280141320362659910"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Theocracy")
                    .setDescription("Lead by religious leaders")
                    .setValue("theo")
                    .setEmoji("1280141340310507541")
            );

            const governmentUndemocRow = new ActionRowBuilder()
                .addComponents(governmentDemocSelect);

            const governmentUndemocMsg = await channel.send({
                content: "...",
                components: [governmentUndemocRow]
            });

            const governmentUndemocCol = governmentUndemocMsg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 180_000})
        
            governmentUndemocCol.on("collect", async i1 => {
                governmentUndemocMsg.delete();
                const undemocSelection = i.values[0];
                registrationData.governmentType = undemocSelection;
            })
        }
    })
}

function noResponse(interaction, channel) {
    const noResponseEmbed = new EmbedBuilder()
        .setDescription("No response was given within 3 minutes. Registration will restart.")
        .setColor(ERROR_COLOR);
    channel.send({ embeds: [noResponseEmbed] })
    proceedWithRegistration(interaction, channel);
}