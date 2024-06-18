import { parseArgs } from 'util';
import {
    Client,
    Events,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from 'discord.js';

const { positionals } = parseArgs({
    args: Bun.argv.slice(2),
    allowPositionals: true
});

const [username, discordBotToken, discordUserId] = positionals;

if (!username || !discordBotToken || !discordUserId) {
    console.error('Usage: auth <username> <discord_bot_token> <discord_user_id>');
    process.exit(1);
}

console.log(`Requesting login for ${username}`);

const client = new Client({ intents: [] });

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Bot logged in as ${readyClient.user.tag}`);
});

await client.login(discordBotToken);

const approve = new ButtonBuilder()
    .setCustomId('approve')
    .setLabel('Approve')
    .setStyle(ButtonStyle.Success);

const decline = new ButtonBuilder()
    .setCustomId('decline')
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger);

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    approve,
    decline
);

const message = await client.users.send(discordUserId, {
    content: `Login request for ${username}`,
    components: [row]
});

console.log('Login request sent');

let loginApproved = false;

try {
    const interaction = await message.awaitMessageComponent({
        time: 30_000
    });

    if (interaction.customId === 'approve') {
        console.log('Login request approved');

        await interaction.update({
            content: `Login request for ${username} approved`,
            components: []
        });

        loginApproved = true;
    } else if (interaction.customId === 'decline') {
        console.log('Login request declined');

        await interaction.update({
            content: `Login request for ${username} declined`,
            components: []
        });
    }
} catch (error) {
    console.log('Login request timed out');

    await message.edit({
        content: `Login request for ${username} timed out`,
        components: []
    });
}

client.destroy();

process.exit(loginApproved ? 0 : 1);
