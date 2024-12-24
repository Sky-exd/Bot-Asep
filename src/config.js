import dotenv from "dotenv";
dotenv.config();

const { TOKEN_DISCORD, CLIENT_ID, GUILD_ID, GEMINI_API_KEY, MONGODB_URI } = process.env;

export const config = {
  token: TOKEN_DISCORD,
  clientID: CLIENT_ID,
  guildID: GUILD_ID,
  geminiAPIKey: GEMINI_API_KEY,
  mongodbURI: MONGODB_URI
};

export const responses = [
  "Jaga bicara, ya!",
  "Kata-kata seperti itu tidak baik.",
  "Ayo bicara dengan sopan.",
  "Kurangi kata kasar, ok?",
];

export const commandsBot = `
 **/cek role @user**: Menampilkan role pengguna yang ditandai
 **/cek perintah**: Menampilkan daftar perintah yang didukung oleh bot
 **/kirimtiktok <url>**: untuk mengirim video tiktok
 **/translate <teks> <negara>**: untuk menejermahkan bahasa alien yang ada di guild
 **/tanyaasep <pertanyaan>**: untuk bertanya kepada asep
`;

export const listISOCountry = {
  ab: "Abkhaz",
  ace: "Acehnese",
  ach: "Acholi",
  aa: "Afar",
  af: "Afrikaans",
  sq: "Albanian",
  alz: "Alur",
  am: "Amharic",
  ar: "Arabic",
  hy: "Armenian",
  as: "Assamese",
  av: "Avar",
  awa: "Awadhi",
  ay: "Aymara",
  az: "Azerbaijani",
  ban: "Balinese",
  bal: "Baluchi",
  bm: "Bambara",
  bci: "Baoulé",
  ba: "Bashkir",
  eu: "Basque",
  btx: "Batak Karo",
  bts: "Batak Simalungun",
  bbc: "Batak Toba",
  be: "Belarusian",
  bem: "Bemba",
  bn: "Bengali",
  bew: "Betawi",
  bho: "Bhojpuri",
  bik: "Bikol",
  bs: "Bosnian",
  br: "Breton",
  bg: "Bulgarian",
  bua: "Buryat",
  yue: "Cantonese",
  ca: "Catalan",
  ceb: "Cebuano",
  ch: "Chamorro",
  ce: "Chechen",
  ny: "Chichewa",
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  chk: "Chuukese",
  cv: "Chuvash",
  co: "Corsican",
  crh: "Crimean Tatar",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  "fa-AF": "Dari",
  dv: "Dhivehi",
  din: "Dinka",
  doi: "Dogri",
  dov: "Dombe",
  nl: "Dutch",
  dyu: "Dyula",
  dz: "Dzongkha",
  en: "English",
  eo: "Esperanto",
  et: "Estonian",
  ee: "Ewe",
  fo: "Faroese",
  fj: "Fijian",
  tl: "Filipino",
  fi: "Finnish",
  fon: "Fon",
  fr: "French",
  fy: "Frisian",
  fur: "Friulian",
  ff: "Fulani",
  gaa: "Ga",
  gl: "Galician",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gn: "Guarani",
  gu: "Gujarati",
  ht: "Haitian Creole",
  cnh: "Hakha Chin",
  ha: "Hausa",
  haw: "Hawaiian",
  iw: "Hebrew",
  hil: "Hiligaynon",
  hi: "Hindi",
  hmn: "Hmong",
  hu: "Hungarian",
  hrx: "Hunsrik",
  iba: "Iban",
  is: "Icelandic",
  ig: "Igbo",
  ilo: "Ilocano",
  id: "Indonesian",
  ga: "Irish",
  it: "Italian",
  jam: "Jamaican Patois",
  ja: "Japanese",
  jw: "Javanese",
  kac: "Jingpo",
  kl: "Kalaallisut",
  kn: "Kannada",
  kr: "Kanuri",
  pam: "Kapampangan",
  kk: "Kazakh",
  kha: "Khasi",
  km: "Khmer",
  cgg: "Kiga",
  kg: "Kikongo",
  rw: "Kinyarwanda",
  ktu: "Kituba",
  trp: "Kokborok",
  kv: "Komi",
  gom: "Konkani",
  ko: "Korean",
  kri: "Krio",
  ku: "Kurdish (Kurmanji)",
  ckb: "Kurdish (Sorani)",
  ky: "Kyrgyz",
  lo: "Lao",
  ltg: "Latgalian",
  la: "Latin",
  lv: "Latvian",
  lij: "Ligurian",
  li: "Limburgish",
  ln: "Lingala",
  lt: "Lithuanian",
  lmo: "Lombard",
  lg: "Luganda",
  luo: "Luo",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mad: "Madurese",
  mai: "Maithili",
  mak: "Makassar",
  mg: "Malagasy",
  ms: "Malay",
  "ms-Arab": "Malay (Jawi)",
  ml: "Malayalam",
  mt: "Maltese",
  mam: "Mam",
  gv: "Manx",
  mi: "Maori",
  mr: "Marathi",
  mh: "Marshallese",
  mwr: "Marwadi",
  mfe: "Mauritian Creole",
  chm: "Meadow Mari",
  "mni-Mtei": "Meiteilon (Manipuri)",
  min: "Minang",
  lus: "Mizo",
  mn: "Mongolian",
  my: "Myanmar (Burmese)",
  nhe: "Nahuatl (Eastern Huasteca)",
  "ndc-ZW": "Ndau",
  nr: "Ndebele (South)",
  new: "Nepalbhasa (Newari)",
  ne: "Nepali",
  "bm-Nkoo": "NKo",
  no: "Norwegian",
  nus: "Nuer",
  oc: "Occitan",
  or: "Odia (Oriya)",
  om: "Oromo",
  os: "Ossetian",
  pag: "Pangasinan",
  pap: "Papiamento",
  ps: "Pashto",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese (Brazil)",
  "pt-PT": "Portuguese (Portugal)",
  pa: "Punjabi (Gurmukhi)",
  "pa-Arab": "Punjabi (Shahmukhi)",
  qu: "Quechua",
  kek: "Qʼeqchiʼ",
  rom: "Romani",
  ro: "Romanian",
  rn: "Rundi",
  ru: "Russian",
  se: "Sami (North)",
  sm: "Samoan",
  sg: "Sango",
  sa: "Sanskrit",
  "sat-Latn": "Santali",
  gd: "Scots Gaelic",
  nso: "Sepedi",
  sr: "Serbian",
  st: "Sesotho",
  crs: "Seychellois Creole",
  shn: "Shan",
  sn: "Shona",
  scn: "Sicilian",
  szl: "Silesian",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  es: "Spanish",
  su: "Sundanese",
  sus: "Susu",
  sw: "Swahili",
  ss: "Swati",
  sv: "Swedish",
  ty: "Tahitian",
  tg: "Tajik",
  "ber-Latn": "Tamazight",
  ber: "Tamazight (Tifinagh)",
  ta: "Tamil",
  tt: "Tatar",
  te: "Telugu",
  tet: "Tetum",
  th: "Thai",
  bo: "Tibetan",
  ti: "Tigrinya",
  tiv: "Tiv",
  tpi: "Tok Pisin",
  to: "Tongan",
  ts: "Tsonga",
  tn: "Tswana",
  tcy: "Tulu",
  tum: "Tumbuka",
  tr: "Turkish",
  tk: "Turkmen",
  tyv: "Tuvan",
  ak: "Twi",
  udm: "Udmurt",
  uk: "Ukrainian",
  ur: "Urdu",
  ug: "Uyghur",
  uz: "Uzbek",
  ve: "Venda",
  vec: "Venetian",
  vi: "Vietnamese",
  war: "Waray",
  cy: "Welsh",
  wo: "Wolof",
  xh: "Xhosa",
  sah: "Yakut",
  yi: "Yiddish",
  yo: "Yoruba",
  yua: "Yucatec Maya",
  zap: "Zapotec",
  zu: "Zulu",
};
