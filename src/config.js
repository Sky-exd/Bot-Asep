import dotenv from "dotenv";
dotenv.config();

export const badWords = [
  "Anjing",
  "iclik",
  "babi",
  "memek",
  "kontol",
  "ANJING",
  "4NJING",
  "4nj",
];

export const responses = [
  "Jaga bicara, ya!",
  "Kata-kata seperti itu tidak baik.",
  "Ayo bicara dengan sopan.",
  "Kurangi kata kasar, ok?",
];

export const commandsBot = `
**Daftar Perintah yang Didukung oleh Bot:**

1. **Hallo sep**: Balasan: 'Hallo Juga bang'
2. **sepi banget nih sep**: Balasan: 'iya nih bang pada kemana ya?'
3. **p login**: Balasan: 'Gass ken bang gua juga login nih(dalam mimpi)'
4. **iclik**: Balasan: 'Dilarang berkata kasar, karena admin melihat'
5. **halo**: Balasan: 'halo juga'
6. **ingpokan le**: Balasan: 'ingpokan juga bang belajar coding bareng'
7. **hallo**: Balasan: 'hallo juga, salam kenal gua asep. bot paling ramah disini'
8. **ingpo mint**: Balasan: 'admint sedang turu, biar gua saja yang menggantikannya'
9. **ayo coding guys**: Balasan: 'ayo bang gua juga mau ikut'
10. **asep pake bahasa pemograman apa?**: Balasan: 'mau tau apa mau tau banget nih bang???. malas ah kasih taunya'
11. **asep on 24jam kah?**: Balasan: 'ya enggak dong, orang pc yang buat asep aja gak 24 jam nyala bagaimana asep mau nyala'
12. **p**: Balasan: 'singkat sekali.p'
13. **cek role @user**: Menampilkan role pengguna yang ditandai
14. **cek gambar <URL>**: Menampilkan gambar dari URL yang diberikan
15. **cek perintah**: Menampilkan daftar perintah yang didukung oleh bot
`;

export const balesPesan = [
  {
    pesan: "Hallo sep",
    balesan: "hallo juga bang",
  },
  {
    pesan: "sepi banget nih sep",
    balesan: "iya nih bang pada kemana ya?",
  },
  {
    pesan: "p login",
    balesan: "gass ken bang gua juga login nih(dalam mimpi)",
  },
  {
    pesan: "halo",
    balesan: "halo juga",
  },
  {
    pesan: "ingpokan le",
    balesan: "ingpokan juga bang belajar coding bareng",
  },
  {
    pesan: "hallo",
    balesan: "hallo juga, salam kenal gua asep. bot paling ramah disini",
  },
  {
    pesan: "ingpo mint",
    balesan: "admint sedang turu, biar gua saja yang menggantikannya",
  },
  {
    pesan: "ayo coding guys",
    balesan: "ayo bang gua juga mau ikut",
  },
  {
    pesan: "asep pake bahasa pemograman apa?",
    balesan: "mau tau apa mau tau banget nih bang???. malas ah kasih taunya",
  },
  {
    pesan: "asep on 24jam kah?",
    balesan:
      "ya enggak dong, orang pc yang buat asep aja gak 24 jam nyala bagaimana asep mau nyala",
  },
  {
    pesan: "p",
    balesan: "singkat sekali p doang",
  },
];
export const config = {
  token: process.env.TOKEN_DISCORD,
  clientID: process.env.CLIENT_ID,
  guildID: process.env.GUILD_ID,
};

export const listBahasa = [
  {
    name: "Inggris",
    value: "en",
  },
  {
    name: "Jerman",
    value: "de",
  },
  {
    name: "Jepang",
    value: "ja",
  },
  {
    name: "Korea",
    value: "ko",
  },
  {
    name: "Vietnam",
    value: "vi",
  },
  {
    name: "Sunda",
    value: "su",
  },
  {
    name: "Rusia",
    value: "ru",
  },
];

// module.exports = {
//   badWords,
//   balesPesan,
//   responses,
//   commandsBot,
//   config,
//   listBahasa,
// };
