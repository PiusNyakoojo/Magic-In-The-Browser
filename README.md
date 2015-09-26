# Magic-In-The-Browser
Play Magic the Gathering with friends online

Try it here: secret-garden-3353.herokuapp.com

This Project started as a "hack" during a 36 or so hour hackathon in Missouri ( WUHACK ).
I've pushed it to github incase others would like to continue it.

Here's an intro on how to use it thus far:
1. Enter Username. You'll be placed in a lobby with others.
2. If no one else is in the lobby, open another tab and repeat step 1
3. In either tab, click on the name of the player you want to play with.
4. Click play. They will get a request to play magic. They can accept or reject it.
5. If they accept, the fun begins!

I didn't have time to implement the logic of the game i.e. you need this many lands (or resource cards) to play this creature or spell card. So instead, you can play any land and creature card regardless of cost.

Magic, The Gathering has 4 phases per turn: Main, Combat, Secondary, and End. Hence the 4 squares next to the user photo. The timer is the yellow bar that goes down. Each phase is timed so neither player is stalling or something like this. If the timer is counting down on the player photo on the bottom left, it's your turn. You can only play a card during main and secondary phase.

If you can't read the card, scroll over it (using mouse or mouse pad)-- sorry mobile users.. I recommend you play this on a laptop or desktop computer and in the chrome browser ( sorry, I didn't test FF, Safari, IE, or Opera yet..)

Sort of a hack within a hack, I had fun adding a few "secret commands":
1. Hold left mouse button + press j when it's your turn. See what happens tongue emoticon
2. Hold left mouse button + press h. You should be put in a sort of orbital perspective. You can click and drag the mouse around to rotate the camera around the mat. You can also pan but i don't recommend that since I didn't set a nice and slow pan speed. Zoom in and out using the mouse wheel if you'd like.

I think that's pretty much it.. Like I said the game play sucks since I didn't have time to implement the rules of the game.. The timer isn't even synchronized between players so that sucks. In addition, the timer is so fast.. If you were playing the actual game, it would not be this way. Each player usually has 1-2 minutes per phase, but during the demo I had to make it fast so people didn't fall asleep or something like this..