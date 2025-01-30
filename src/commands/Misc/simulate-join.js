import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  MessageFlags,
} from "discord.js";

/** @type {import('commandkit').CommandData} */
export const data = {
  name: "simulate-join",
  description: "Simulasi Join Member ketika masuk guild",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "join",
      description: "Simulasi Join Guild",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Pilih siapa user yang mau diuji coba",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "out",
      description: "Simulasi keluar Guild",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Pilih siapa user yang mau diuji coba",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
  ],
};

/**
 * @param {import('commandkit').SlashCommandProps} param0
 */
export async function run({ interaction, client }) {
  if (!interaction.deferred && !interaction.replied)
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });
  const targetUser = interaction.options.getUser("user");
  const subcommand = interaction.options.getSubcommand();
  let member;
  if (targetUser) {
    member =
      interaction.guild.members.cache.get(targetUser.id) ||
      (await interaction.guild.members.fetch(targetUser.id));
  } else {
    member = interaction.member;
  }
  switch (subcommand) {
    case "join": {
      client.emit("guildMemberAdd", member);
      await interaction.editReply({
        content: `Simulasi Join Member  User ${member}`,
        flags: MessageFlags.Ephemeral,
      });
      break;
    }
    case "out": {
      client.emit("guildMemberRemove", member);
      await interaction.editReply({
        content: `Simulasi Keluar Member User ${member}`,
        flags: MessageFlags.Ephemeral,
      });
      break;
    }
  }
}
