// initializes activities
const datePack = ["watch Chicago", "watch Dimension 20", "watch a Dropout show", "watch Invincible", "watch Superstore", "watch Zombies", "write", "sex", "listen to The Judgies", "play HPHB", "research local activities", "play Lego HP", "write music", "Legos", "play a board game", "watch Sex Education", "cook", "Pok&eacute;mon Go"];
const kickbackPack = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l"];
const partyPack = ["say hi to", "say bye to"];
let packPick = [];
let currentActivities = [];

let player;
let players = [];

// initializes panes
const packPane = `<h1>Packs</h1>
<table>
  <tr>
    <td><input id=\"datePackButton\" type=\"button\" value=\"Date Pack\"></td>
  </tr>
  <tr>
    <td><input id=\"partyPackButton\" type=\"button\" value=\"Party Pack\"></td>
  </tr>
  <tr>
    <td><input id=\"kickbackPackButton\" type=\"button\" value=\"Kickback Pack\"></td>
  </tr>
  <tr>
    <td><input id=\"customPackButton\" type=\"button\" value=\"Custom Pack\"></td>
  </tr>
</table>`;
const signUpPane = error => `<h1 id=\"signUpHeader\">Sign Up</h1><div id="signUpNamePane"><label for=\"signUpName\">Name: </label><input type=\"text\" id=\"signUpName\" name=\"signUpName\"></div><div id="signUpPasswordPane"><label for=\"signUpPassword\">Password: </label><input type=\"text\" id=\"signUpPassword\" name=\"signUpPassword\"></div><input type=\"button\" id=\"submitSignUp\" value=\"Sign Up\"><div id=\"signUpErrorLabel\">${error}</div><h2 id=\"playersAddedLabel\">Players Added:</h2><input type=\"button\" id=\"everybodysInButton\" value=\"Everybody's In!\">`;
const signInPane = errorText => `<h1 id=\"signInHeader\">Sign In</h1><label for=\"signInName\">Name: </label><input type=\"text\" id=\"signInName\" name=\"signInName\"><label for=\"signInPassword\">Password: </label><input type=\"text\" id=\"signInPassword\" name=\"signInPassword\"><input type=\"button\" id=\"submitSignIn\" value=\"Sign In\"><div id=\"signInErrorLabel\">${errorText}</div>`;
const questionsPane = questions => `<p id=\"questionsInstructionsLabel\">Select every person you would want to do the activity with:</p><div id=\"questionsPane\">${questions}</div><input type=\"button\" id=\"submitQuestions\" value=\"Submit\">`;
const resultsPane = results => `<h1 id=\"resultsLabel\">Results</h1><div id=\"listResultsPane\">${results}</div><input type=\"button\" id=\"leaveResults\" value=\"Back to Sign In\">`;
const settingsPane = settings => `<h1>Settings</h1><p id=\"settingsLabel\">Select all activities you want in the game.</p><ul id=\"settingsScrollPane\">${settings}</ul><label for=\"addActivityField\">Add your own: <\label><input type=\"text\" id=\"addActivityField\" name=\"addActivityField\"><input type=\"button\" id=\"addActivityButton\" value=\"Add Activity\"><input type=\"button\" id=\"toSignUp\" value=\"Go to Sign Up\">`;
// creates checkboxes for activities
const pickPack = pack => {

  // resets currentActivities and packPick
  currentActivities = [];
  packPick = [];

  // initializes currentActivities and packPick
  pack.forEach(activity => {
    currentActivities.push(activity);
    packPick.push(activity);
  });

  // settings
  let settings = "";
  packPick.forEach(activity => {
    settings = settings.concat(`<li><input type="checkbox" id="${activity}" name="${activity}" value="${activity}"${currentActivities.includes(activity) ? " checked=\"true\"" : ""}><label for="${activity}">${activity}</label></li>`);
  });
  document.getElementById("changeable").innerHTML = settingsPane(settings);
  
  // sets onclick for settings
  packPick.forEach(activity => {
  let source = document.getElementById(activity);
  	source.onclick = () => {
      if (source.checked)
        currentActivities.push(activity);
      else
        currentActivities = currentActivities.filter(keep => keep !== activity);
    }
  });

  // handles Go to Sign Up button
  const toSignUp = () => {
    document.getElementById("changeable").innerHTML = signUpPane("");

    // sign up button
    document.getElementById("submitSignUp").onclick = () => {
      let playerProceed = true;

      // name is empty
      if (playerProceed && !document.getElementById("signUpName").value.trim()) {
        document.getElementById("signUpErrorLabel").innerHTML = "Name can\'t be empty";
        playerProceed = false;
      }

      // password is empty
      if (playerProceed && !document.getElementById("signUpPassword").value.trim()) {
        document.getElementById("signUpErrorLabel").innerHTML = "Password can\'t be empty";
        playerProceed = false;
      }

      // name already exists
      if (playerProceed) {
        players.forEach(other => {
          if (playerProceed && other.name === document.getElementById("signUpName").value) {
            document.getElementById("signUpErrorLabel").innerHTML = `${document.getElementById("signUpName").value} already exists`;
            playerProceed = false;
          }
        });
      }

      // adds new player to the game
      if (playerProceed) {
        player = {
          _name: document.getElementById("signUpName").value,
          _password: document.getElementById("signUpPassword").value,
          playersPerActivity: packPick.map(activity => []),
          matchesPerActivity: packPick.map(activity => []),
          _firstPass: true,

          get name() {
            return this._name;
          },
          get password() {
            return this._password;
          },
          get firstPass() {
            return this._firstPass;
          },
          set firstPass(firstPass) {
            if (typeof firstPass === 'boolean')
              this._firstPass = firstPass;
          },

          addPlayerByActivity: function(activityIndex, player) {
            if (activityIndex > this.playersPerActivity.length - 1 && activityIndex <= packPick.length - 1)
              this.playersPerActivity.push([]);
            try {
              this.playersPerActivity[activityIndex].push(player);
            } catch (e) {
              console.log(Error(`${packPick[activityIndex]} is not a valid activity`));
            }
          },
          removePlayerByActivity: function(activityIndex, player) {
            try {
              this.playersPerActivity = this.playersPerActivity[activityIndex].filter(stays => stays != player);
            } catch (e) {
              console.log(Error(`${packPick[activityIndex]} is not a valid activity`));
            }
          },
          addMatchByActivity: function(activityIndex, player) {
            if (activityIndex > this.matchesPerActivity.length - 1 && activityIndex <= packPick.length - 1)
              this.matchesPerActivity.push([]);
            try {
              if (!this.matchesPerActivity[activityIndex].includes(player))
                this.matchesPerActivity[activityIndex].push(player);
            } catch (e) {
              console.log(Error(`${packPick[activityIndex]} is not a valid activity`));
            }
          }
        };
        players.push(player);
        document.getElementById("signUpErrorLabel").innerHTML = `${player.name} added!`;
        document.getElementById("playersAddedLabel").innerHTML = `${document.getElementById("playersAddedLabel").innerHTML}<br>${player.name}`;

        // erases name and password from sign in page
        document.getElementById("signUpName").value = "";
        document.getElementById("signUpPassword").value = "";
      }

      // everybody's in button
      document.getElementById("everybodysInButton").onclick = () => {
        if (players.length < 2)
          document.getElementById("signUpErrorLabel").innerHTML = "Must have at least 2 players to start";
        else {
          document.getElementById("changeable").innerHTML = signInPane("");

          const submitSignIn = () => {
            document.getElementById("signInErrorLabel").innerHTML = "";
            let playerProceed = true;
          
            // name is empty
            if (!document.getElementById("signInName").value.trim())
              document.getElementById("signInErrorLabel").innerHTML = "Name can\'t be empty";
            // password is empty
            else if (!document.getElementById("signInPassword").value.trim())
              document.getElementById("signInErrorLabel").innerHTML = "Password can\'t be empty";
            // player not found
            else if (!searchPlayers(document.getElementById("signInName").value))
              document.getElementById("signInErrorLabel").innerHTML = `\"${document.getElementById("signInName").value}\" not found`;
            // incorrect password
            else if (searchPlayers(document.getElementById("signInName").value).password !== document.getElementById("signInPassword").value)
              document.getElementById("signInErrorLabel").innerHTML = "Incorrect password";
            // name and password are correct
            else {
          
              // sets the player object
              try {
                player = searchPlayers(document.getElementById("signInName").value);
              } catch (e) {
                player = null;
                console.log(Error("Player not found. player object cannot be assigned"));
              }
          
              // player answers questions about other players
              if (player.firstPass) {
                let questions = "";
          
                // adds questions and other players to questionsScrollPane
                currentActivities.forEach(activity => {
                  questions = questions.concat(`Would you like to ${activity}...<br>`);
                  players.forEach(otherPlayer => {
                    if (otherPlayer !== player) {
                      questions = questions.concat(`<input type="checkbox" id="${activity}_${otherPlayer}" name="${activity}_${otherPlayer}" value="${activity}_${otherPlayer}"><label for="${activity}_${otherPlayer}">${otherPlayer.name}?</label><br>`);
                    }
                  });
                });
          
                // avoids running questions again
                player.firstPass = false;
          
                // sets questions scene
                document.getElementById("changeable").innerHTML = questionsPane(questions);
          
                // sets onclick for checkboxes
                currentActivities.forEach(activity => {
                  players.forEach(otherPlayer => {
                    if (otherPlayer !== player) {
                      document.getElementById(`${activity}_${otherPlayer}`).onclick = () => {
                        if (document.getElementById(`${activity}_${otherPlayer}`).checked === true) {
                          player.addPlayerByActivity(packPick.indexOf(activity), otherPlayer.name);
                        } else {
                          player.removePlayerByActivity(packPick.indexOf(activity), otherPlayer.name);
                        }
                      };
                    }
                  });
                });
          
                // submit questions button
                document.getElementById("submitQuestions").onclick = () => {
          
                  // returns to sign in screen
                  document.getElementById("changeable").innerHTML = signInPane("");
          
                  // erases error label
                  document.getElementById("signInErrorLabel").innerHTML = "";
          
                  // deselects player
                  player = null;
          
                  // erases name and password from sign in screen
                  document.getElementById("signInName").value = "";
                  document.getElementById("signInPassword").value = "";
          
                  // sets onclick for submitSignIn
                  document.getElementById("submitSignIn").onclick = submitSignIn;
                };
              }
          
              // player views matches with other players
              else {
          
                // match players
                for (let i = 0; i < packPick.length; i++) { // for every activity
                  players.forEach(other => {
                    if (other !== player // for every other player
                      &&
                      other.playersPerActivity[i].includes(player.name) // if they want you
                      &&
                      player.playersPerActivity[i].includes(other.name)) { // and you want them
                      player.addMatchByActivity(i, other.name); // add them to your matches
                    }
                  });
                }
          
                // lists the results
                let noMatches = true;
                let results = "";
                for (let i = 0; i < packPick.length; i++) {
                  if (player.matchesPerActivity[i].length) {
                    noMatches = false;
                    results = results.concat(`${packPick[i]}:<ul>`);
                    player.matchesPerActivity[i].forEach(name => {
                      results = results.concat(`<li>${name}</li>`);
                    });
                    results = results.concat("</ul>");
                  }
                }
                if (noMatches)
                  results = results.concat("<p>NO MATCHES</p>");
          
                // set scene to results
                document.getElementById("changeable").innerHTML = resultsPane(results);
          
                // go back to sign in after results
                document.getElementById("leaveResults").onclick = () => {
          
                  // goes back to sign in screen
                  document.getElementById("changeable").innerHTML = signInPane("");
                  document.getElementById("signInName").value = "";
                  document.getElementById("signInPassword").value = "";
                  document.getElementById("submitSignIn").onclick = submitSignIn;
                };
              }
            }
          };

          // sign in button
          document.getElementById("submitSignIn").onclick = submitSignIn;
        }
      }
    };
  };

  // handles add activity button
  const addActivityButton = () => {
    let newActivity = document.getElementById("addActivityField").value.trim();
    
    // valid activity
    if (newActivity.length > 0 && !packPick.includes(newActivity)) {
      currentActivities.push(newActivity);
      packPick.push(newActivity);
      settings = settings.concat(`<li><input type="checkbox" id="${newActivity}" name="${newActivity}" value="${newActivity}" checked="true"><label for="${newActivity}">${newActivity}</label></li>`);
      document.getElementById("addActivityField").value = "";
      for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players.length; j++) {
          if (i != j)
            players[i].addPlayerByActivity(packPick.length - 1, players[j].name);
        }
      }
      document.getElementById("changeable").innerHTML = settingsPane(settings);
      document.getElementById("addActivityButton").onclick = addActivityButton;
      document.getElementById("toSignUp").onclick = toSignUp;
    }
    
    // activity is already added
    else if (packPick.includes(newActivity)) {
    	document.getElementById("addActivityField").value = "";
    }
  };
  document.getElementById("addActivityButton").onclick = addActivityButton;
  document.getElementById("toSignUp").onclick = toSignUp;
}

// welcome button
document.getElementById("welcomeButton").onclick = () => {
  document.getElementById("changeable").innerHTML = packPane;

  // packPane buttons
  document.getElementById("datePackButton").onclick = () => {
    pickPack(datePack);
  };
  document.getElementById("partyPackButton").onclick = () => {
    pickPack(partyPack);
  };
  document.getElementById("kickbackPackButton").onclick = () => {
    pickPack(kickbackPack);
  };
  document.getElementById("customPackButton").onclick = () => {
    pickPack([]);
  };
};

const searchPlayers = (playerName) => {
  let playerNames = [];
  players.forEach(p => playerNames.push(p.name));
  return players[playerNames.indexOf(playerName)];
}
