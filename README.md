# fkclient.js

A wrapper library for [Foxtan](https://github.com/BakaSolutions/foxtan) API.

## Installation

With Yarn:

```bash
yarn add @bakaso/fkclient
```

With NPM:

```bash
npm install @bakaso/fkclient
```

## Usage

Most of the API calls go through a websocket connection and are asynchronous. The general workflow is:

1. Import the library.

```javascript
import FKClient from "@bakaso/fkclient"
```

1. Initialise the API client with the API endpoint address.

```javascript
const client = new FKClient("http://127.0.0.1:6749")
```

3. Subscribe to the message types you wish to handle.

```javascript
client.addListener(
	// Filter
	message => message.what?.request === "boards",
	// Handler
	message => console.log("Received a reply message regarding some boards:", message.data))
)
```

4. Make your requests.

```javascript
client.readManyBoards()
```

You can find a more detailed documentation [here](docs/README.md).

## Running the example app

```bash
# Clone this repository
git clone https://github.com/BakaSolutions/fkclient.js.git
cd fkclient.js

# Install the dependencies and manually build the library
yarn install
yarn build

# Install the dependencies for the example app
yarn install:example

# Run the example app
yarn serve:example
```
