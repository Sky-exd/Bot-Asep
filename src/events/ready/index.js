export default function (client) {
  console.log(`Bot ${client.user.tag} sudah ready bang !`);
  console.log(
    `Bot ini menggunakan ${client.guilds.cache.size} server dan ${client.users.cache.size} pengguna.`,
  );
}
