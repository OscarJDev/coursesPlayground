//  ####### TYPESCRIPT FUNDAMENTALS, V1 #######

/*
### 2. Types ###

  *** Why to add types? ***

    *  Sometimes JS does unintuitive things to convert primitive types.
    *  It will move runtime errors into compile time errors.
    *  Modern JS runtimes are written using typed languages.
    *  Great documentation for future developers managing/interacting with our code.
    
  *** Implicit Typing  ***

    ->The Typescript compiler can make good guesses at types, just through assignments. After assigning a value to a variable, you
      are allowed to change the type.

      *  JS however let us do this, but it's common a common cause of de-optimization in modern
      runtimes.

  *** Explicit Typimg ***

    ->Type annotation: rather that letting Typescript make a guess about a type, we can provide a type at variable declaration, which is called a
      type annotation. It can be used anywhere a variable is declared (and other places).
      let teacherAge: number = 34;
    ->Casting: sometimes we need to cast a type to a particular value with the "as" keyword.
      let input = document.querySelector('input#name_field') as HTMLInputElement;
      * An alternative way to do this (less popular after the popularization of React/JSX):
        let input = <HTMLInputElement>document.querySelector('input#name_field');
    ->Fuction parameters and return types.

      * Function declaration:
        function login(username: string, password: string): User {
          // Do something
        };

      * Arrow functions:
        const login = (username: string, password: string): User => {
          // Do something
        };
  *** Object Shapes ***

    ->When we talk about SHAPES, we are referring to the name of its properties and their values' types:

      let myCar: { make: string; model: string; year: number};
      myCar = { make: "abc", model: "abcd", year: 234};

      * If properties are missing or of the wrong type, the compiler will complain at us.

  *** Challenge 1: Color Functions ***
  
    export function hexToRgb(hex: string): {r: number; g: number; b: number;} {
      if (hex.length === 3) {
        let hr = hex[0];
        let hg = hex[1];
        let hb = hex[2];
        return hexToRgb(`${hr}${hr}${hg}${hg}${hb}${hb}`);
      }
      let [r, b, g] = [0, 2, 4]
        .map(offset => hex.substring(offset, offset + 2)) // ['ff', '00', '00']
        .map(hexCh => parseInt(hexCh, 16)); // [255, 0, 0]
      return {r, g, b};
    }

    hexToRgb('ffbbcc')

    export function rgbToHex(r: number, g: number, b:number): string {
      let rgb = [r,g,b];
      return rgb
      .map((rgbCh) => Math.max(0, Math.min(rgbCh, 255)).toString(16))
      .map((hexCh) => hexCh.length < 2 ? `0${hexCh}` : hexCh)
      .join(``);
    }
    rgbToHex(12,34,212)

  *** Interfaces and Excess Property Checking ***

		->Excess Property Checking: when working with object literals, shape is checked more
      strictly. Excess properties in this situations are regarded as posible bugs:  object
      literals may only specify known properties.

        let myCar: { make: string; model: string; year: number };
        myCar = {
          make: 'Honda',
          model: 'Accord',
          year: 1992,
          color: {r: 255, g: 0, b: 0} // ERROR due to the presence of the undeclared color property!
        }

        * An easy way (not the recommended in this particular case in modern Typescript) to
          deal with this is explicitly casting the type of the object to the appropiate type.

    ->Interfaces: allow us to declare a structure and refer to it by name.

      interface Car {
        make: string;
        model: string;
        year: number;
      }
      let myCar: Car {
        make: 'Honda',
        model: 'Accord',
        year: 1992
      }
      function carCageMatch (car1: Car, car2: Car) {
        //Do Something
      }

      * Interfaces only describe structure, they have no implementation.
      * They don't compile to any JS code.
      * DRY type definitions allows easy refactoring later.
      * Interfaces are "open" and can be extended later:
      
        interface Car {
          color: string
        }

        let lisasCar: Car {
          make: 'Honda',
          model: 'Accord',
          year: 1992,
          color: "#fff" // GOOD
        }

      * Interfaces can be think of as functions in the sense that they are hosted and
        exported/imported from modules as such.
      * They also can extend shapes from previously defined interfaces making use of the
        'extends' keyword.

  *** any & never Types ***

    ->The any type allows for a value of any kind (back to regular JS's way of treating mutable types).

      let age = 34;
      let myAge = age as any;
      myAge = '35';

      * Useful as we migrate code from JS to TS.
      * Start with making all anys explicit, and then squash as many as possible.
      * 
    ->There's also a "never" type, which is compatible with nothing!

  *** Challenge 2 - Account Manager ***
  
    interface User {
      email: string;
      password: string
    }
    interface ConfirmedUser extends User {
      isActive: true; // This is called a 'literal type'. Boolean could've be used aswell if false was
                         also allowed
    }
    interface Admin extends ConfirmedUser {
      adminSince: Date; // Any constructor can be used as type in addition to the primitive types.
    }

### 3. Classes ###

  *** JS Class Refresher ***

    ->JS classes allow us to define instance and public (static) fields; the former are equivalent
      to putting a property on an instance (inside the constructor's prototype object property); the latter are 
      equivalent to define properties inside the object "" of the constructor function:

        class Person {
          static _counter = 0; // shared across all instances of the Person class/constructor
          planet = 'Earth'; // equivalent to adding "this.planet = 'Earth'" inside the constructor

          constructor( name ) {
            this.name = name;
            this.id = Person._counter++;
          }
        }

    ->Inheritance: subclasses can be created by using the 'extends' keyword. The 'super' keyword
      can be used to call methods on the parent class.

        class Person {
          constructor( name ) {
            this.name = name;
          }
          toJSON() {
            return {
              name: this.name
            }
          }
        }
        class Employee extends Person {
          constructor(id, name) {
            super(name) // from parent constructor
            this._employeeId = id
          }
          toJSON() {
            return {
              ...super.toJSON(), // parent prototype method
              id: this._employeeId
            }
          };
        }
        let me = new Employee('123', 'Oscar'); // { name: 'Oscar', id: '123'}

    ->Species:  there's a special property on classes called Symbol.species that's used when building
      'derived objects':

      class MyArray extends Array {
        toString() {
          return '[PRIVATE]';
        }
      }

      let a = new MyArray(1,2,3);
      let filtered = a.filter((y) => y <= 2)

      console.log(`${a}`) // '[PRIVATE]'
      console.log(`${filtered}`) // '[PRIVATE]'

      * Using Symbol.species:

        class MyArray extends Array {
          toString() {
            return '[PRIVATE]';
          }
          static get [Symbol.species]() {
            return Array;
          }
        }
        console.log(`${a}`) // '[PRIVATE]'
        console.log(`${filtered}`) // '1,2'

        * Symbol.species represent a Symbol called species. We can treat it (Symbols in general)
          as a different type of string. After assigning the method to [Symbol.species] we could
          assign a new different method under the name species without worrying about property
          names colliding each other.

    ->Mixins: they are abstract classses or 'template for classes' (a pattern to define reusable class logic):

      const AsJSON = type => class extends type {
        asJSON() {
          return JSON.stringify(this)
        }
      };
      class Person extends AsJSON(Object) {
        constructor(name) {
          super();
          this.name = name;
        }
      }
      let me = new Person('Oscar'); // {"name": "Oscar"}

  *** Typescript Classes ***

    * Shape defined up front, like interfaces.

      class Car {
        // types of the properties for the object constructed
        make: string
        model: string
        year: number

        constructor(
          makeArg: string,
          modelArg: string,
          yearArg: number
        ) {
          this.make: makeArg;
          this.model: modelArg;
          this.year: yearArg;
        }
        startEngine() {
          return 'VROOOOM'
        }
      }
      let myCar = new Car('Honda', 'Accord', 2020)

  *** Enums ***

    * Used to define a type consisting of ordered members.
    * Each value is bound to a context (the enum provides the context)
    
        enum AcctType {
          Checking,
          Savings,
          MoneyMarket
        };
        type Acct = [number, AcctType]; // type alias Acct
        let account: Acct = [9142.14, AccType.Checking];

    * Each has a name and a value.
    * Often we don't care about the value beyond an equality check.
    
        enum Suit {
          Club,
          Diamond,
          Heart,
          Spade
        }
        * JS representation of this enum:
          var Suit;
          (function (Suit) {
            Suit['Club'] = 0
            Suit[0] = 'Club';
            Suit['Diamond'] = 1
            Suit[1] = 'Diamond';
            Suit["Heart"] = 2
            Suit[2] = 'Heart';
            Suit['Spade'] = 3
            Suit[3] = 'Spade';
          })(Suit || (Suit = {}));
          Object.keys(Suit).length / 2; // 4

  *** Arrays & Tuples ***

    ->Arrays:

      * By default, arrays work same as in JS.
      * Adding a type constraint helps us keep contents consistent.
      * When initializing class properties with empty arrays, provide a type to avoid type 'never'
        inferring.

        * Plain JS:
      
          let nums = [];
          nums.push(5);
          nums.push('not a number'); // Allowed in plain JS. Consistency is not kept.
        * TS:
          let numsTS: number[] = nums; // ERROR. nums is an array of numbers and strings!
          class ShoppingCart {
            items = []; // array of nevers, nothing can exist in this array.
            // items: number[] = []; would be the correct way in TS.
            constructor() {
              this.items.push(5); // ERROR
            }
          }

    ->Tuples:

      * Arrays of fixed length.
      * Typically represent values that are related in some way.
      * Shines when consumers need to know about order and with destructured assigment.
      
        let dependency: [string, number];
        dependency = ['react', 16];

        let dependencies: [string, number][] = [];

        dependencies.push(dependency); // GOOD
        dependencies.push([ 'webpack', 3 ]); // GOOD
        dependencies.push([ 'typescript', '2.5' ]); // ERROR
        
  *** Type Aliases ***

    * Sometimes an interface isn't the best way to describe a structure.
    * We can use the type keyword to define a type alias
      type Color = [number, number, number];
      let red: Color = [255, 0, 0]; // GOOD
    * You can export types and interfaces, so you can consume them in other modules. However, type aliases are not hoisted like interfaces.













    // ####### TYPESCRIPT FUNDAMENTALS, V2 #######
// class Student {
//   fullname: string;
//   constructor(public firstName: string, public middleInitial: string, public lastName: string) {
//     this.fullname = `${this.firstName} ${this.middleInitial} ${this.lastName}`
//   }
// }
// interface Person {
//   firstName: string;
//   lastName: string;
// }
// function greeter({ firstName, lastName }: Person) {
//   return `Hello ${firstName} ${lastName}`
// }
// let student = new Student("Oscar", "E", "Jauregui")
// document.body.textContent = greeter(student)
// /**
//  *
//  * -------------------------------------------
//  */

// interface hasEmail {
//   name: string;
//   email: string;
// }

// interface hasPhoneNumber {
//   name: string;
//   phone: number;
// }

// interface ContactMessenger1 {
//   (contact: hasEmail | hasPhoneNumber, message: string): void;
// }

// type ContactMessenger2 = (contact: hasEmail | hasPhoneNumber, message: string) => void;

// let contactMessenger1: ContactMessenger1;

// contactMessenger1 = function (name, messenger) {
//   return true;
// }
// const contactMessenger2: ContactMessenger2 = (name, message) => {
//   return true;
// }

// contactMessenger1({ name: `Oscar`, phone: 1234 }, `hello`)

// /*
// **
// **
// *********************************
// **
// **
// */

// // interface contactConstructor {
// //   new (contact: hasEmail | hasPhoneNumber, message: string): hasEmail | hasPhoneNumber;
// // }

// type numVal = 1 | 2 | 3 | numVal[];
// // type arrVal = numVal[];

// let x: numVal = [[1, 2, 3], 3]

// interface PhoneNumberDict {
//   [numberName: string]: undefined | {
//     areaCode: number;
//     num: number;
//   };
// }

// let obj: PhoneNumberDict = {}
// if (typeof obj.abc === "string") {
//   obj.abc
// }

// /*
// **
// **
// *********************************
// **
// **
// */

// interface ContactConstructor {
//   (contact: hasEmail | hasPhoneNumber, message: string): hasEmail | hasPhoneNumber;
// }

// class Contact1 implements hasPhoneNumber {
//   name: string;
//   phone: number;
//   constructor(contact: hasPhoneNumber, message: string) {
//     this.name = contact.name;
//     this.phone = contact.phone;
//   }
// }

// class Contact2 implements hasPhoneNumber {
//   constructor(public name: string, public phone: number) {

//   }
// }


// class OtherContact implements hasEmail, hasPhoneNumber {
//   protected age = 0;
//   private passwordVal!: string;
//   constructor(
//     public name: string,
//     public email: string,
//     public phone: number
//   ) {
//     this.age = 35
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

// // class OtherContact {
// //   constructor(
// //     name,
// //     email,
// //     phone
// //   ) {
// //     this.name = name;
// //     this.email = email;
// //     this.phone = phone;
// //   }


// //   get password() {
// //     if (!this.passwordVal) {
// //       this.passwordVal = `hellopassword`
// //     }
// //     return this.passwordVal;
// //   }

// //   async init() {
// //     this.password
// //   }
// // }


// /*
// **
// **
// ***************GENERICS******************
// **
// **
// */

// // interfaces can have parameters (which make them generics!) just as a function does with its arguments
// interface FilterFunction<T = any> {
//   (val: T): boolean;
// }

// const newFunction: FilterFunction<string> = (val) => typeof val === "number";

// newFunction("abc")

// /* type Parameters with constraints ---> T must be assignable (extends from) to an object with at least the following shape: {id: string, ...}*/
// function arrayToDict<T extends { id: string }>(array: T[]): { [k: string]: T } {
//   const out: { [k: string]: T } = {};
//   array.forEach((val) => {
//     out[val.id] = val;
//     // the line above is what requires T to have the specified shape at the beginning
//     // T must be an object with at least a property "id" on it!
//   });
//   return out;
// }

// const myDict = arrayToDict([
//   { id: "1", value: "first", lisa: "HUang" },
//   { id: "2", value: "second" }
// ])

// /*
//   function with type parameters that uses a generic type
// */

// /*
// ****** implementation in plain JS ===> input = { key: value, key1: value1, ...} --- output = { key: valueModified, key1: valueModified1, ...}

// function mapDict(
//   dict, 
//   fn
// ) {
//   const output = {}
//   Object.keys(dict).forEach((val, idx) =>{
//     output[val] = fn(dict[val], idx)
//   })
//   return output
// }

// mapDict(
//   {favNum: 2, luckyNum: 20},
//   (num) => ({ val: num })
// )

// */

// type Dict<T> = {
//   [anythingWeWant: string]: T | undefined;
// }

// function mapDict<T, S>(
//   dict: Dict<T>,
//   fn: (val: T, idx: number) => S
// ): Dict<S> {
//   const output: Dict<S> = {}
//   Object.keys(dict).forEach((dkey, idx) => {
//     const thisKeyVal = dict[dkey];
//     if(typeof thisKeyVal !== 'undefined'){
//       output[dkey] = fn(thisKeyVal, idx)
//     }
//   })
//   return output
// }

// /*
// * Type params T and S will be defined on the go during the function creation
// */

// mapDict(
//   { favNum: 2, luckyNum: 20 },
//   (num) => ({ val: num })
// )