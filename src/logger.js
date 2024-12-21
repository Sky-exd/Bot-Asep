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
}

