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
   
   The clue giver provides a single-word clue
5. **Guessing**:
   The guesser tries to guess the word.
   
   A correct first guess earns 3 points.
6. **Second Clue**:
   If the first guess is incorrect, the clue giver offers a second clue.
   
   A correct guess after the second clue earns 2 points.
   
   Any correct guesses after 3 or more clues will earn 1 point.
   
8. Each round is for 60 seconds and the players should try to get the word right within that time to earn points for that round.
9. **Discussion**:
   After each question, the answer and the source are revealed.
   Players can discuss about the question and strategize for the next rounds.

# Game URL

Currently we are hosting our game using Replit. The game can be accessed using the link - https://sockets.vydanasindhu.repl.co/

# Running the game locally

1) Clone the repository using the command - 
   - git clone https://github.com/vydanasindhu/Sockets.git
2) To run the code locally, the websocket URL has to be changed. Change the following line:
   - const newWs = new WebSocket('wss://sockets.vydanasindhu.repl.co/');to 
   - const newWs = new WebSocket('ws://localhost:8080');

    In the ../Sockets/client/src/Components folder make the changes in the following files:
   -  Chat.js
   -  Discussion.js
   -  GameContentClue.js
   -  GameContentGuess.js
   -  GameDiscussion.js
         
3) Go to the Sockets folder now and run - npm install and npm install firebase
4) Node.js should be initialized for Backend. So run the command in the socket folder - npm init
5) Go to the clients folder(cd client) and - npm install
6) To create a build directory with a production build of the app run the following command in the client folder - npm run build
7) Open two terminals, let one terminal be in Sockets folder and the other in client (cd client from root(Sockets))
8) In the Sockets terminal run the command to start the server - npm start
9) In the client terminal run the command to start the react app - npm start
10) The app would be running locally and can be accessed via the link - http://localhost:3000/
11) Use the same link to open two tabs, one for player 1 and the other for player 2. 

# Common Issues

1.  If you are facing any errors install the following and the app would run as required. Run the following commands to install modules:
   - npm install react-scripts --save
   - npm install web-vitals
   - npm install express socket.io
   - npm install socket.io-client
  
2.  To run the app on a different port than the default 3000 use the following commands (Change the port number as required):

   MacOS/Linux
   - PORT=5000 npm start

   Windows
   - set PORT=5000 && npm start


