# parse-phone-example
This is --'s code for parsing phone numbers. It is used within our API Server codebase, and it is designed to take inputs containing phone numbers and convert them to ---specific objects for storage or formatting.

The -- phone number object generated by this code will contain as many of the following properties as we can pull from the input given the -- field's format and the input given:

- `ext` : phone number extension
- `full` : full phone number, including country code, area code, and extension
- `country` : country code
- `area` : area code
- `number` : phone number after area code

This code is relatively well-tested, with tests under the `test` directory. The tests can be run via `npm test`

Some things to consider as you review the code:
- Is there anything you find problematic about this code?
- What do you find hard to read about it?
- Is there anything that could be done better?
