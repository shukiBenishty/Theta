import moment from 'moment';

export default
class GroupData {
  name: String;
  symbol: String;
  capacity: Number;
  price: Number;
  openFrom: Number;
  openTill: Number;

  constructor(name: String,
              symbol: String,
              capacity: Number,
              price: Number,
              openFrom: Timestamp,
              openTill: Timestamp) {
    this.name = name;
    this.symbol = symbol;
    this.capacity = capacity;
    this.price = price;
    if( openFrom )
      this.openFrom = moment.unix(openFrom.seconds);
    if( openTill )
      this.openTill = moment.unix(openTill.seconds);
  }
}