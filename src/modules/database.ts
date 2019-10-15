import Nedb from 'nedb';

class Database {
  public instance: Nedb;
  constructor() {
    this.instance = new Nedb({ filename: './storage/vigger.db'});
    this.instance.loadDatabase((err) => {
      // Handle possible error
    });
  }
}

export default new Database();
