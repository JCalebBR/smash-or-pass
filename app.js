const Logging = require("./util/log");
const Log = new Logging();

const Voting = require("./util/vote");
const Vote = new Voting();

require('dotenv').config();

const tmi = require('tmi.js');

const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: `${process.env.TWITCH_USERNAME}`,
        password: `oauth:${process.env.TWITCH_OAUTH}`
    },
    channels: [`${process.env.TWITCH_CHANNEL}`]
});

client.connect().catch(Log.error);

client.on('message', async (channel, tags, message, self) => {
    if (self) return;
    try {
        let messageLC = message.toLowerCase();

        if (messageLC.includes("smash") || messageLC.includes("niknoc1smash"))
            Vote.addSmash();

        if (messageLC.includes("pass") || messageLC.includes("niknoc1pass"))
            Vote.addPass();

        if (tags.mod || tags.username === "niknocturnal") {
            if (messageLC === "!results") {
                client.say(channel, `${Vote.results()}`);
                setTimeout(() => Vote.reset(), 15000);
            }
            if (messageLC === "!clear" || messageLC === "!reset")
                client.say(channel, `${Vote.reset()}`);

            if (messageLC === "!ping") {
                client.say(channel, `pong!`);
                Log.log(`${message}`);
            }
        }
    } catch (error) {
        Log.error(error);
    }
});