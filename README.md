# Magic-In-The-Browser
Play Magic the Gathering with friends online

###Demo: http://secret-garden-3353.herokuapp.com

This Project started as a "hack" during a 36 or so hour hackathon in Missouri ( WUHACK ).
I've pushed it to github incase others would like to continue it.

#Intro:
1. Enter Username. You'll be placed in a lobby with others.  
2. If no one else is in the lobby, open another tab and repeat step 1  
3. In either tab, click on the name of the player you want to play with.  
4. Click play. They will get a request to play magic. They can accept or reject it.  
5. If they accept, the fun begins!  

I didn't have time to implement the logic of the game i.e. you need this many lands (or resource cards) to play this creature or spell card. So instead, you can play any land and creature card regardless of cost.

Magic, The Gathering has 4 phases per turn: Main, Combat, Secondary, and End. Hence the 4 squares next to the user photo. The timer is the yellow bar that goes down. Each phase is timed so neither player is stalling or something like this. If the timer is counting down on the player photo on the bottom left, it's your turn. You can only play a card during main and secondary phase.

If you can't read the card, scroll over it (using mouse or mouse pad)-- sorry mobile users.. I recommend you play this on a laptop or desktop computer and in the chrome browser ( sorry, I didn't test FF, Safari, IE, or Opera yet..)

#Secret Commands: 
1. Hold left mouse button + press j when it's your turn. See what happens tongue emoticon  
2. Hold left mouse button + press h. You should be put in a sort of orbital perspective. You can click and drag the mouse around to rotate the camera around the mat. You can also pan but i don't recommend that since I didn't set a nice and slow pan speed. Zoom in and out using the mouse wheel if you'd like.

I think that's pretty much it.. Like I said the game play sucks since I didn't have time to implement the rules of the game.. The timer isn't even synchronized between players so that sucks. In addition, the timer is so fast.. If you were playing the actual game, it would not be this way. Each player usually has 1-2 minutes per phase, but during the demo I had to make it fast so people didn't fall asleep or something like this..

# Configuration Files

The *Godeps* folder contains dependency management files for deploying to Heroku.

*Procfile* is a configuration file for deploying to Herkou.

If you deploy to Google App Engine you'll have to add an *app.yaml* file and delete the aforementioned config files.

The *.project* file enables you to open this project in Eclipse ( make sure you have the Goclipse plugin ). Otherwise, it's yet another config file. You can delete it if you'd like.

# Run Locally - Terminal

0) Have Go installed: https://golang.org

1) Set the GOPATH environment variable to the root directory of this project. Of course if you have other GOPATH routes just add

```
;C:\Users\YourName\Desktop\golang_multiplayer_template
```

to the end of the value. Of course this is if you clone this repository to your Desktop :)

2) Open git bash terminal and change directory to be root of the project

```
cd Desktop/golang_multiplayer_template
```

3) In the same terminal enter the command:

```
go run src/server/server.go
```

The application should be running and listening to port 8081

If you are deploying the application, change the websocket address/port in the *html/client.html* file.

# Deploy - Heroku

0) Have a heroku account (don't worry, it's free for your first few applications): https://heroku.com/

1) If this is your firt time using Heroku, get the toolbelt: https://toolbelt.heroku.com/ and after installation, open the git bash terminal and enter the following commands:

```
heroku login
```

Enter your information and continue to the next step.

2) Enter the following commands while in the root directory of the project:

```
git init
git add -A .
git commit -m "initial commit"
heroku create -b https://github.com/kr/heroku-buildpack-go.git
```

3) Change the pubAddr variable in *html/client.html* and comment out and replace the addr variable.

```javascript
// var addr = "localhost:8081"
var pubAddr = document.domain;

var conn = new Websocket("wss://" +  pubAddr + "/ws");
```

4) In the *html/client.html* file there is a section of code that's commented out.. Go ahead and uncomment that.

5) Finally deploy!! In the git bash terminal enter the following commands:

```
git add -A .
git commit -m "changed websocket address"
git push heroku master
```

To open, just go to the URL provided -or- enter the command:
```
heroku open
```

Enjoy!
