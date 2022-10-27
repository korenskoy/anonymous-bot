const dotenv = require("dotenv")
const botgram = require("botgram")

dotenv.config()

const adminIds = process.env.ADMIN_IDS.split(',').map(Number);

if (!adminIds.length) {
    console.error('NO ADMINS FOUND');
    process.exit(1);
}

const bot = botgram(process.env.BOT_TOKEN)

bot.command("start", "help", (msg, reply) => {
    reply.text("To send anonymous message, just write it below");
})

bot.message(function (msg, reply, next) {
    const {from: _, ...anonymousMsg } = msg;

    try {
        for (let i = 0; i < adminIds.length; i++) {
            reply.to(adminIds[i]).message(anonymousMsg);
        }
        reply.text("Your message has been sent to the administration.");
    } catch (err) {
        reply.text("Couldn't resend that.");

        for (let i = 0; i < adminIds.length; i++) {
            if ('stack' in err) {
                reply.to(adminIds[i]).text(err.stack);
            } else {
                reply.to(Number(adminIds[i])).text(`${err.name}: ${err.message}`);
            }
        }
    }
});

bot.command((msg, reply) => {
    reply.text("Invalid command.");
});

