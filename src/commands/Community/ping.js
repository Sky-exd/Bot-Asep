/** @type {import('commandkit').CommandData} */
export const data = {
  name: "ping",
  description: "Say Hai To Bot !"
}

/** @param {import('commandkit').SlashCommandProps} param0 */
export const run = async ({ interaction, handler }) => {
  await interaction.deferReply();
  await handler.reloadCommands()
  interaction.followUp("Terimkasih telah menghubungi asep ... !");
};

/** @type {import('commandkit').CommandOptions} */
// export const options = {};
