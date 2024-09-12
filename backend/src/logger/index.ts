import chalk from "chalk";
const log = console.log;
const date = new Date().toLocaleString();
export class Logger {
  public log(text: unknown) {
    console.log(`${date} :`, chalk.white(text));
}

public success(text:unknown){
      console.log(`${date} :`, chalk.bgHex("#0e241c").hex("#78fa78")(text));

  }
  public warn(text: unknown) {
    console.log(`${date} :`, chalk.bgHex("#2e1b0c").hex("#ffa861")(text));
  }
}
