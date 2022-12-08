# fkclient.js
A wrapper library for [Foxtan](https://github.com/BakaSolutions/foxtan) API.

## Installation
Note: `pnpm` can be substituted by `npm`, `yarn` or any package manager you choose.
```bash
pnpm add @bakaso/fkclient
```

## Usage
Most of the API calls go through a websocket connection and are asynchronous. The general workflow is:
```javascript
// Import the library
import FKClient from "@bakaso/fkclient"

// Initialise the API client with the API endpoint address
const client = new FKClient("http://127.0.0.1:6749")

// Subscribe to the message types you wish to handle
client.addInMessageListener(
	// Filter function
	msg => "boards" === msg.what.request,
	// Handler
	msg => console.log("Received a reply message regarding some boards:", msg.data)
)

// Make your requests
client.board.requestMany()
```

For more usage examples, see the example app.

## Running the example app
```bash
# Clone this repository
git clone https://github.com/BakaSolutions/fkclient.js.git
cd fkclient.js

# Install the dependencies
pnpm install

# Run the example app
pnpm dev
```
