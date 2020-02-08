class Student {
  fullname: string;
  constructor(public firstName: string, public middleInitial: string, public lastName: string) {
    this.fullname = `${this.firstName} ${this.middleInitial} ${this.lastName}`
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter({ firstName, lastName }: Person) {
  return `Hello ${firstName} ${lastName}`
}

let student = new Student("Oscar", "E", "Jauregui")

document.body.textContent = greeter(student)

/**
 * 
 * -------------------------------------------
 */

interface hasEmail {
  name: string;
  email: string;
}

interface hasPhoneNumber {
  name: string;
  phone: number;
}

interface ContactMessenger1 {
  (contact: hasEmail | hasPhoneNumber, message: string): void;
}

type ContactMessenger2 = (contact: hasEmail | hasPhoneNumber, message: string) => void;

let contactMessenger1: ContactMessenger1;

contactMessenger1 = function (name, messenger) {
  return true;
}
const contactMessenger2: ContactMessenger2 = (name, message) => {
  return true;
}

contactMessenger1({ name: `Oscar`, phone: 1234 }, `hello`)

/*
**
**
*********************************
**
**
*/

// interface contactConstructor {
//   new (contact: hasEmail | hasPhoneNumber, message: string): hasEmail | hasPhoneNumber;
// }

type numVal = 1 | 2 | 3 | numVal[];
// type arrVal = numVal[];

let x: numVal = [[1, 2, 3], 3]

interface PhoneNumberDict {
  [numberName: string]: undefined | {
    areaCode: number;
    num: number;
  };
}

let obj: PhoneNumberDict = {}
if (typeof obj.abc === "string") {
  obj.abc
}

/*
**
**
*********************************
**
**
*/

interface ContactConstructor {
  (contact: hasEmail | hasPhoneNumber, message: string): hasEmail | hasPhoneNumber;
}

class Contact1 implements hasPhoneNumber {
  name: string;
  phone: number;
  constructor(contact: hasPhoneNumber, message: string) {
    this.name = contact.name;
    this.phone = contact.phone;
  }
}

class Contact2 implements hasPhoneNumber {
  constructor(public name: string, public phone: number) {

  }
}


class OtherContact implements hasEmail, hasPhoneNumber {
  protected age = 0;
  private passwordVal!: string;
  constructor(
    public name: string,
    public email: string,
    public phone: number
  ) {
    this.age = 35
  }


  get password() {
    if (!this.passwordVal) {
      this.passwordVal = `hellopassword`
    }
    return this.passwordVal;
  }

  async init() {
    this.password
  }
}

// class OtherContact {
//   constructor(
//     name,
//     email,
//     phone
//   ) {
//     this.name = name;
//     this.email = email;
//     this.phone = phone;
//   }


//   get password() {
//     if (!this.passwordVal) {
//       this.passwordVal = `hellopassword`
//     }
//     return this.passwordVal;
//   }

//   async init() {
//     this.password
//   }
// }


/*
**
**
***************GENERICS******************
**
**
*/

// interfaces can have parameters (which make them generics!) just as a function does with its arguments
interface FilterFunction<T = any> {
  (val: T): boolean;
}

const newFunction: FilterFunction<string> = (val) => typeof val === "number";

newFunction("abc")

/* type Parameters with constraints ---> T must be assignable (extends from) to an object with at least the following shape: {id: string, ...}*/
function arrayToDict<T extends { id: string }>(array: T[]): { [k: string]: T } {
  const out: { [k: string]: T } = {};
  array.forEach((val) => {
    out[val.id] = val;
    // the line above is what requires T to have the specified shape at the beginning
    // T must be an object with at least a property "id" on it!
  });
  return out;
}

const myDict = arrayToDict([
  { id: "1", value: "first", lisa: "HUang" },
  { id: "2", value: "second" }
])

/*
  function with type parameters that uses a generic type
*/

/*
****** implementation in plain JS ===> input = { key: value, key1: value1, ...} --- output = { key: valueModified, key1: valueModified1, ...}

function mapDict(
  dict, 
  fn
) {
  const output = {}
  Object.keys(dict).forEach((val, idx) =>{
    output[val] = fn(dict[val], idx)
  })
  return output
}

mapDict(
  {favNum: 2, luckyNum: 20},
  (num) => ({ val: num })
)

*/

type Dict<T> = {
  [anythingWeWant: string]: T | undefined;
}

function mapDict<T, S>(
  dict: Dict<T>,
  fn: (val: T, idx: number) => S
): Dict<S> {
  const output: Dict<S> = {}
  Object.keys(dict).forEach((dkey, idx) => {
    const thisKeyVal = dict[dkey];
    if(typeof thisKeyVal !== 'undefined'){
      output[dkey] = fn(thisKeyVal, idx)
    }
  })
  return output
}

/*
* Type params T and S will be defined on the go during the function creation
*/

mapDict(
  { favNum: 2, luckyNum: 20 },
  (num) => ({ val: num })
)




