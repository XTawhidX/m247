const DisTube = require('distube').default;
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { Client, GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const { TOKEN, CHANNEL, SERVER, playlistUrl, Volume, STATUS } = require("./config.json");


const client = new Client({
    shards: "auto",
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: true
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ],
});

client.distube = new DisTube(client, {
    leaveOnEmpty: false,
    nsfw: true,
    leaveOnFinish: false,
    leaveOnStop: false,
    emitNewSongOnly: false,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new YtDlpPlugin(),
    ],
});

client.on('ready', async (c) => {
    console.log(`${c.user.username} is ready to use!`)

    client.user?.setPresence({
        activities: [
            {
                name: STATUS,
                type: ActivityType.Playing,
            },
        ],
        status: "dnd",
    });

    const vc = await client.channels.fetch(CHANNEL)

    await client.distube.play(vc, playlistUrl, {
        textChannel: vc,
    });

    setTimeout(async () => {

        const server = await client.guilds.fetch(SERVER)

        client.distube.setVolume(server, Volume)

        let mode = client.distube.setRepeatMode(server)
        console.log(mode ? mode === 2 ? "Repeat Queue" : "Repeat Song" : "Off");
        mode = client.distube.setRepeatMode(server)
        console.log(mode ? mode === 2 ? "Repeat Queue" : "Repeat Song" : "Off");

    }, 5000)

})

client.login(TOKEN)