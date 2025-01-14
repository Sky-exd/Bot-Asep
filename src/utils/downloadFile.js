import axios from "axios";
import { createWriteStream } from "fs";

const downloadFile = async (urlVideo, dest) => {
  let file = createWriteStream(dest);
  let resp = await axios({
    method: "GET",
    url: urlVideo,
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    var responseSent = false;
    resp.data.pipe(file);
    file.on("finish", () => {
      file.on("error", (err) => {
        reject(err);
      });
      file.on("close", () => {
        if (responseSent) return;
        responseSent = true;
        resolve();
      });
    });
  });
};

export default downloadFile;
