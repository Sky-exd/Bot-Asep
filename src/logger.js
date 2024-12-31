import { Chalk } from 'chalk';

const warna = new Chalk({ level: 3 });

export default class Logger {
  static info(message) {
    console.log(`${warna.blue.bold('[INFO]')} ${warna.whiteBright.bold(message)}`);
  }
  static error(message) {
    console.log(`${warna.red.bold('[ERROR]')} ${warna.whiteBright.bold(message)}`);
  }
  static success(message) {
    console.log(`${warna.green.bold('[SUCCESS]')} ${warna.whiteBright.bold(message)}`);
  }
  static warn(message) {
    console.log(`${warna.yellow.bold('[WARNING]')} ${warna.whiteBright.bold(message)}`);
  }
  static debug(message) {
    console.log(`${warna.magenta.bold('[DEBUG]')} ${warna.whiteBright.bold(message)}`);
  }
  static default(message) {
    console.log(`${warna.white.bold('[DEFAULT]')} ${warna.whiteBright.bold(message)}`);
  }
}
