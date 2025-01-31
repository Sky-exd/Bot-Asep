import { EmbedBuilder } from "discord.js";

class EmbedBase extends EmbedBuilder {
  constructor(options) {
    super();

    if (!options.client || !options.client.user)
      throw new Error("Client harus diberikan!");

    if (options.message) this.setDescription(options.message);
    if (options.title) this.setTitle(options.title);
    this.setType(options.type)
      .setTimestamp()
      .setAuthor({
        name: options.client.user.username,
        iconURL: options.client.user.displayAvatarURL(),
      })
      .setFooter({
        text: `${options.client.user.username} Bot System `,
        iconURL: options.client.user.displayAvatarURL(),
      });
  }
  setType(type = "info") {
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
