
# Simple Server Shop ~8^] (maybe this is a misnomer)

>Providing a simple frame out of MVC express without frameworks
>> This is more a framing repo than an implementation where many of the goals will be explored with a good attempt to use best practices
- Motivation: In these times of changing js paradigms I see many partial implementations between old and new. The idea here is to explore real es6+ patterns without the use of frameworks or starter kits, and to use the libraries that best meet our needs.
 - Frameworks and Starter Kits definitely have there place, but once we start to architect true working implementations they also tend to get in the way, getting us stuck in places that can result in bad practices...  

## Some Goals ( all may change often as I am just framing out an idea here)
- clean fully encapsulated instantiation of express
- separation of concerns where:
  - Routes route logic / access in in routes
  - Controllers: view instantiations and process controls in controllers
  - Data Layer: ORM base data base layers for:
    _ document noneSQL
    _ RDBMS

  - Forms: form implementations that make use of db schema and context
    _ where base validators and filters will always provide those that are needed, while support ways to extend these to meet any specific context of the use case at hand

  - BL: business logic as reusable components

  - Client deployment support
    - where something like react can get server side fast template renders, and service-worker updates can be pushed without interruption within an Agile / Release based process
    - **explorations into how to best provide service workers for multiple clients using any number of libraries and frameworks**

## Assuming
- node 8.9.4 (+)
- mongo installed, configured locally, and running with mogod started
- we use Google Canary so we can have separate Chrome instance for insecure runtime support ... **not using Chrome Canary** will require change to start.sh where you need remove the \ Canary part of that call


### Get started
- git clone simple_server_shop
- cd simple_server_shop/src
- npm install
- chmod 755 \*.sh   
- ./install_globals.sh **we are not using Gulp here** some packages may be missed you will know when they do not work. (we will do clean installs to catch the misses as well... but may miss in between things 8^)
- cd server/config & ./pemmer.sh **you need to have your own .pem files**
- in server/config/connect.cnf.ts ssl.passphrase = "your_passphrase"
- ./build_local_db_image_support.sh **we have many async things here so run it a few times**
- open server/clients/shop_sw.js to make sure the cacheObject is attached and do not remove '___CACHE_INSERT___' from clients/show_sw.js
  - run `ts-node create_cache.ts` to get that build to work

- almost there ....
- ./start.sh **once all is setup up this should be all you need to do work**

- `https://localhost:6040/shop` to see first service worker for react / redux / io.socket implementation

#### Once you get things working
- we are not using gulp for this project so you will see shell scripts and global installs for the base runtime command line operations
- use `ps` to make sure processes are clean between sets
- use `killall node node-sass` to clean most things up
- once everything is setup ./start.sh should provide all that you need with auto builds for sass webpack and servers
- if you are adding things to be cached run `ts-node create_cache.ts` to update cache object in service worker: show_sw.js is first implementation of that.

### To see things in mongo and to check on things
>> A word on use case for mongo:
   at this point I view mongo as useful for distributing RDBMS results and collection of distributed lite weight computing... my view may change on this as this is my first deep dive into its use... 8^)

• to access the db do the following
- : mongo
- > show dbs
- > use simpleStore
- > show collections (**you should see session and products collections**)
- > db.products.find() (**you will see this db stuff from the initial json setup**)
- > db.session.find() (**you will see results once login services are implemented**)

### This is a work in process and does not offer any real implementations as of yet !!! |8^)
#### And it is hardly complete ....

#### TODO

- √ Provide Service Worker Support
- √ Provide Mongo DB Support for first React / Redux client
- √ io.socket server/client implementation for ajax alt / push services .. chat
- Implement simple login services **this will be part Form / Schema Implementations**
- Finish initial Mongo Form / Schema frame-out
- Provide Session / Login Support **session support built in: sessions/local though in first example client**
- Create simple permission based access
- Provide route error handling and ensure single channel of access
- Implement RDBMS  

  - Review progress and revise goals from the discoveries from above initial steps

- **Workbox has now been kicked out of build**
- **react-flux has now been kicked out of build**
