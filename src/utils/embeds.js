const userProfile =
  "https://cdn.discordapp.com/avatars/1315204083996692614/68842a9875a8a6161df490244ed64d7a.webp";

function EmbedObject({ type, message, title, options }) {
  const EmbedObject = {
    author: {
      name: "Asep AI",
      icon_url: userProfile,
    },
    timestamp: new Date().toISOString(),
    footer: {
      text: "Asep AI Bot System",
      icon_url: userProfile,
    },
  };
  switch (type.toLowerCase()) {
    case "success":
      EmbedObject.color = 0x6ec207; // #6ec207
      break;
    case "info":
      EmbedObject.color = 0x00b0f4; //#00b0f4
      break;
    case "error":
      EmbedObject.color = 0xf72c5b; //#f72c5b
      break;
    case "warning":
      EmbedObject.color = 0xfcc737; //#fcc737
      break;
    case "secondary":
      EmbedObject.color = 0x89a8b2; //#89a8b2
      break;
    default:
      throw Error("Error Tipe Gada di data");
  }
  if (title) EmbedObject.title = title;
  if (message) EmbedObject.description = message;

  if (typeof options === "object" && options !== null) {
    Object.assign(EmbedObject, options);
  }
  return EmbedObject;
}

export { EmbedObject };
export default EmbedObject;
