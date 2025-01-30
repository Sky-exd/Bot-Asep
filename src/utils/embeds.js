import { EmbedBuilder } from "discord.js";

class EmbedBase extends EmbedBuilder {
  constructor(client, type = "info", message, title) {
    super();
    if (!client || !client.user) throw new Error("Client harus diberikan!");

    if (message) this.setDescription(message);
    if (title) this.setTitle(title);
    this.setType(type)
      .setTimestamp()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      })
      .setFooter({
        text: `${client.user.username} Bot System `,
        iconURL: client.user.displayAvatarURL(),
      });
  }
  setType(type) {
    switch (type) {
      case "info":
        this.setColor(0x00b0f4);
        break;
      case "success":
        this.setColor(0x6ec207);
        break;
      case "error":
        this.setColor(0xf72c5b);
        break;
      case "warning":
        this.setColor(0xfcc737);
        break;
      case "secondary":
        this.setColor(0x89a8b2);
        break;
      default:
        this.setColor("Default");
        break;
    }
    return this;
  }
}

export { EmbedBase };
export default EmbedBase;
