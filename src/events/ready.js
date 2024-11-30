const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  run(client) {
    console.log(`bot ${client.user.tag} sudah ready bang  !`);
  },
};
