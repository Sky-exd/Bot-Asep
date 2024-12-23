import { Chalk } from 'chalk';

const warna = new Chalk({ level: 3 });

export default class Logger {
  static info(message) {
    console.log(`${warna.blue.bold('[INFO]')} ${message}`);
  }
  static error(message) {
    console.log(`${warna.red.bold('[ERROR]')} ${message}`);
  }
  static success(message) {
    console.log(`${warna.green.bold('[SUCCESS]')} ${message}`);
  }
  static warn(message) {
    console.log(`${warna.yellow.bold('[WARNING]')} ${message}`);
  }
  static debug(message) {
    console.log(`${warna.magenta.bold('[DEBUG]')} ${message}`);
  }
  static default(message) {
    console.log(`${warna.white.bold('[DEFAULT]')} ${message}`);
  }
}

