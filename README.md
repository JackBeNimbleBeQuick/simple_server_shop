
# Simple Server Shop

>Providing a simple frame out of MVC express without frameworks
>> This is more a framing repo than an implementation where many of the goals will be explored with a good attempt to use best practices
- Motivation: In these times of changing js paradigms I see many partial implementations between old and new. The idea here is to explore real es6+ patterns without frameworks / starter kits and the use of libraries that best meet our needs.
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
    - where something like react can get server fast template renders and webworker updates without interruption within an Agile / Release based process

## Assuming
- node 8.9.4 (+)
- express 4+

### Get started
- git clone simple_server_shop
- cd simple_server_shop/src
- npm install
- npm dev

### This is a work in process and does not offer any real implementations as of yet !!! |8^)
#### And it is hardly complete ....


#### TODO

- Finish initial Mongo Form / Schema frame-out
- Provide Session / Login Support
- Create simple permission based access
- Provide route error handling and ensure single channel of access
- Provide client delivery / web-worker support
- Reiterate through those parts that need to accommodate RDBMS support

  - Review progress and revise goals from the discoveries from above initial steps
