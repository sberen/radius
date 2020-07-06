import firebase from 'firebase/app';
/**
 * This class represents a queue
 */
export class Queue {
  name : string;
  parties: Party[]; // where parties[0] is the front of the line
  end: Date | undefined;
  // uid : string;

  /**
   * @param {string} name Name of Queue
   * @param {Date} end End time
   * @param {Party[]} parties Optional field for initializing current queue,
   *    Default value is set to empty array
   */
  constructor(name?: string, end?: Date, parties?: Party[]) {
    this.name = name ||'';
    this.parties = parties ? parties : [];
    this.end = end;
    // this.uid = uid || "";
  }

  /**
   * Adds a party to the end of the queue
   * @param {string} name Name of the Party
   * @param {number} size Size of the party
   * @param {string} phoneNumber phoneNumber of the party
   * @param {number} quote The given estimated time to be called
   */
  addParty(name: string, size: number, phoneNumber: string, quote:number) {
    this.parties.push(new Party(name, size, phoneNumber, quote));
  }
}

/**
 * A party in the queue
 */
export class Party {
  name: string;
  checkIn : Date;
  size: number;
  phoneNumber: string;
  quote: number;
  // uid: string;

  /**
   * @param {string} name Name of the Party
   * @param {number} size Size of the party
   * @param {string} phoneNumber phoneNumber of the party
   * @param {number} quote The given estimated time to be called
   * @param {Date} checkIn Optional time when customer checked in.
   *    Default is set to now.
   */
  constructor(name: string, size: number, phoneNumber: string,
      quote:number, checkIn : Date= new Date()) {
    this.name = name;
    this.checkIn = checkIn;
    this.size = size;
    this.phoneNumber = phoneNumber;
    this.quote = quote;
    // this.uid = uid || "";
  }
  /**
  * @param party
  */
  static fromFirebase(party: any): Party {
    const partyPrams : [string, number, string, number, Date] = [
      party.name,
      party.size,
      party.phoneNumber,
      party.quote,
      party.checkIn.toDate(),
    ];
    return new Party(...partyPrams);
  }

  /**
    * @param party
    */
  static toFirebase(party: Party): any {
    return {
      name: party.name,
      size: party.size,
      phoneNumber: party.phoneNumber,
      quote: party.quote,
      checkIn: firebase.firestore.Timestamp.fromDate(party.checkIn!),
    };
  }
}

export const Q_COLUMNS : string[] = ['#', 'Name', 'Party Size', 'Quoted Time'];

// ** TODO: impliment uid once database up
export const queueConverter = {
  toFirestore: function(q: Queue) {
    return {
      name: q.name,
      parties: q.parties.map((e) => Party.toFirebase(e)),
      end: firebase.firestore.Timestamp.fromDate(q.end!),
    };
  },
  fromFirestore: function(snapshot: any, options: any) {
    const data = snapshot.data(options);
    return new Queue(
        data.name,
        data.end.toDate(),
        data.parties.map((party: any)=> Party.fromFirebase(party)),
    );
  },
};


