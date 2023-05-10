import Fuse from 'fuse.js'

/** Phone book entry with first & last name plus phone nunber */

export type PhonebookEntry = {
  firstName: string,
  lastName: string,
  phoneNumber: string
};


/** Interface for phone books allowing for fast search */

export interface PhonebookInterface {

  /** Determines a set of best matches for a search term */
  match(term: string): PhonebookEntry[];

}

/** Phone book implementation serving as reference */

export class PhonebookReferenceImplementation implements PhonebookInterface {

  /** Constructor ingesting a set of entries */
  constructor(entries: PhonebookEntry[]) {

    /* Add all entries */
    for (const entry of entries)
      for (const o of this.o(entry.lastName)) {

        /*              */
        const mre = this.mr.get(o[0]);
        if (mre)
          mre.push([entry, o[1]]);
        else
          this.mr.set(o[0], [[entry, o[1]]]);

      }

  }

  /** Implements the match interface */
  match(term: string): PhonebookEntry[] {
  
    /*              */
    const m = new Map<PhonebookEntry, number>();

    /*              */
    for (const o of this.o(term))
      for (const mre of this.mr.get(o[0]) || []) {

        /*              */
        const sc = o[1] * mre[1];

        /*              */
        const me = m.get(mre[0]);
        if (!me || me < sc)
          m.set(mre[0], sc);

      }

    /*              */
    const s = [...m.entries()].sort((a, b) => { return b[1] - a[1]; });

    /*              */
    return s.map((e) => { return e[0]; });

  }


  /**                */
  private o(name: string) {

    /*              */
    name = name.toLowerCase();

    /*              */
    const res: [string, number][] = [[name, 1]];

    /*              */
    for (let i = 0; i < name.length; i++)
      res.push([name.substring(0, i) + name.substring(i + 1), 0.8]);

    return res;

  }

  /**                */
  private mr = new Map<string, [PhonebookEntry, number][]>();

};


export class FusePhonebook implements PhonebookInterface {
  private fuse: Fuse<PhonebookEntry>;;

  constructor(entries: PhonebookEntry[]) {
    this.fuse = new Fuse(entries, {
        keys: ["firstName", "lastName", "phoneNumber"],
        includeScore: true,
        threshold: 0.3,
    });
  }

  match(term: string): PhonebookEntry[] {
    // todo: limit ??
    return this.fuse.search(term, {limit: 5}).map((result) => result.item);
  }
}
