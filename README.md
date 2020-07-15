# microbit-vrobot
An example of how to build a virtual robot with Micro:bit, Three.js, serialport and Electron.

**Clone and run for a quick way to see Electron, Serialport, Three.js in action.**

The basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.


## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/akosblazsik/microbit-vrobot.git
# Go into the repository
cd microbit-vrobot
# Install dependencies
npm install
# Make sure that usb/serial port is read/writable, for example on Linux: 
sudo chmod 666 /dev/ttyACM0
# Run the app
npm start
```

## The micro:bit snippets and blocks for the project
- The receiver: https://github.com/akosblazsik/microbit-vrobot-receiver
- The remote control: https://github.com/akosblazsik/microbit-vrobot-remote-control

## Learn More
- Electron [documentation](https://electron.atom.io/docs/)
- Serialport [documentation](https://serialport.io/docs/)
- Three.js [documentation](https://threejs.org/docs/)

#### License [CC0 1.0 (Public Domain)](LICENSE.md)
