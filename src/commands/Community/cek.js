import { SlashCommandBuilder, roleMention, bold } from "discord.js";
import { commandsBot } from "../../config.js";
import embedBase from "../../utils/embeds.js";

export const data = new SlashCommandBuilder()
  .setName("cek")
  .setDescription("apa yang mau di cek ?")
  .addSubcommand((subcommand) =>
    subcommand.setName("perintah").setDescription("cek perintah"),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("role")
      .setDescription("cek role")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("user yang mau dicek role")
          .setRequired(true),
      ),
  );

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction }) => {
  if (!interaction.replied && !interaction.deferred)
    await interaction.deferReply();
  const subcommand = interaction.options.getSubcommand();
  switch (subcommand) {
    case "perintah": {
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
