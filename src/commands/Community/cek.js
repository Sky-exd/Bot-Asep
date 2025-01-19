import {
  roleMention,
  bold,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} from "discord.js";
import { commandsBot } from "../../config.js";
import embedBase from "../../utils/embeds.js";
import { logger } from "../../logger.js";

/** @type {import('commandkit').CommandData} */
export const data = {
  name: "cek",
  description: "Mengecek Hal",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "perintah",
      description: "Cek Perintah yang ada pada bot!",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "role",
      description: "Cek Role Apa yang ada di User",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "User yang mau di cek",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
  ],
};

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction }) => {
  if (!interaction.replied && !interaction.deferred)
    await interaction.deferReply();
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case "perintah": {
      logger.info(`${interaction.user.username} mengecek perintah bantu`);
      await interaction.editReply({
        embeds: [
          embedBase({
            type: "info",
            title: "**Daftar Perintah yang Didukung oleh Bot:**",
            message: commandsBot,
          }),
        ],
      });
      break;
    }
    case "role": {
      const user = interaction.options.getUser("user");
      logger.info(
        `${interaction.user.username} mengecek role ${user.username}`,
      );
      if (!user) {
        await interaction.editReply({
          embeds: [
            embedBase({
              type: "error",
              title: "Error",
              message: "Tolong tag pengguna yang ingin dicek rolenya.",
            }),
          ],
        });
        return;
      }
      const memberGuild = interaction.guild.members.cache.get(user.id);
      const role = memberGuild.roles.cache
        .filter((role) => role.name !== "@everyone")
        .map((role) => roleMention(role.id))
        .join(" - ");
      await interaction.editReply({
        embeds: [
          embedBase({
            type: "info",
            title: `Role untuk ${bold(user.displayName)}`,
            message: `${role}`,
            options: {
              author: {
                name: `${user.username}`,
                icon_url: user.displayAvatarURL({ dynamic: true }),
              },
            },
          }),
        ],
      });
      break;
    }
  }
};

/** @type {import('commandkit').CommandOptions} */
// export const options = {};
