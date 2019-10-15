import { app, remote } from 'electron';
import path from 'path';
import * as fs from 'fs';

function parseDataFile(filePath: any, defaults: any) {
  // We'll try/catch it in case the file doesn't exist yet, which will be the case
  // on the first application run.
  // `fs.readFileSync` will return a JSON string which we then parse into a Javascript
  // object.
  try {
    const content: string = fs.readFileSync(filePath, {encoding: 'utf-8'});
    return JSON.parse(content);
  } catch (error) {
    // if there was some kind of error, return the passed in defaults instead.
    return defaults;
  }
}

export interface StoreOptions {
  configName: string;
  defaults?: any;
}

export class Store {
  private path: any;
  private data: any;
  constructor(opts: StoreOptions) {
    const userDataPath = (app || remote.app).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults);
  }

  // Get a stored value from the specified file.
  public get(key: string) {
    return this.data[key];
  }

  // Store a value to the data object in memory and allows you to commit the change
  // immediatly to the specified file.
  public set(key: string, val: any, commit?: boolean) {
    this.data[key] = val;
    if (commit) {
      this.commit();
    }
  }

  public commit() {
    // This method will reflect the state of the data into the configuration file
    // if this method is not called after set a value in the data the change will
    // not be stored and is going to be available only during the current running
    // session.
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}
