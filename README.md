# DiagnoseAndDiscover

CS567 Team 2 Final Project

**Type**: Interface with System(A)

**Team Members**:

SriLekha Kodavati (sk121)

Sindhu Vydana (svydana2)

Ruthwik Pala (ruthwik2)

Vishnu Deep Mandava(vm28)

# Game Overview

1.**Structure**: The game consists of 5 rounds with roles reversing each round.

2. **Role**s: Each round features one player as the clue giver and the other as the guesser.
3. **Clue Giving**:
   A 'taboo' card displays words the clue giver cannot use.
   The clue giver provides a single-word clue within 90 seconds.
4. **Guessing**:
   The guesser tries to guess the word within 90 seconds.
   A correct first guess earns 5 points.
5. **Second Clue**:
   If the first guess is incorrect, the clue giver offers a second clue.
   A correct guess after the second clue earns 3 points.
6. **Discussion**:
   After each question, the answer and the source are revealed.
   Players can discuss about the question and strategize for the next rounds.

# Game URL

Currently we are hosting our game using Replit. The game can be accessed using the URL - https://sockets.vydanasindhu.repl.co/

# Running the game locally

1) Clone the repository using the command - git clone https://github.com/vydanasindhu/Sockets.git
2) To run the code locally, the websocket URL has to be changed.
    change the line const newWs = new WebSocket('wss://sockets.vydanasindhu.repl.co/') to const newWs = new WebSocket('ws://localhost:8080').
     In the ../Sockets/client/src/Components folder make the changes in the following files:
   1) Chat.js
   2) Discussion.js
   3) GameContentClue.js
   4) GameContentGuess.js
   5) GameDiscussion.js
3) Go to the Sockets folder now and run - npm install
5) Node.js should be initialized for Backend. So run the command in the socket folder - npm  init
6) Go to the clients folder(cd client) and - npm install
7) To create a build directory with a production build of the app run the following comamnd in the client folder - npm run build
8) In the client terminal run the command to start the react app - npm start
10) The app would be running locally and can be accessed via the URL - http://localhost:3000/

# Common Issues

If you are facing any errors install the following and the app would run as required.
 Run the following commands to install modules:
   - npm install react-scripts --save
   - npm install web-vitals
   - npm install express socket.io
   - npm install socket.io-client

