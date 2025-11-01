// display activites to choose from
const displayActivities = activities => {
    document.getElementsByTagName("MAIN")[0].innerHTML = `<ul id="activities">
        ${activities.reduce((prevActivity, currActivity) => {return prevActivity + `<li>${currActivity}</li>`}, "")}
    </ul>
    <input type="text" id="newActivity">
    <input type="button" id="addActivity" value="Add Activity">
    <input type="button" id="submitActivities" value="Go to Sign Up">
    <p id="error"></p>`;

    // add activity
    const addActivity = () => {
        const errorElem = document.getElementById("error");
        errorElem.innerHTML = "";
        const newActivity = document.getElementById("newActivity").value.trim();
        if (!newActivity) errorElem.innerHTML = "Cannot be blank";
        else if (activities.includes(newActivity)) errorElem.innerHTML = "Already an activity";
        else {
            activities.push(newActivity);
            document.getElementById("activities").innerHTML += `<li>${newActivity}</li>`;
        }
        document.getElementById("newActivity").value = "";
    }
    document.getElementById("addActivity").onclick = addActivity;
    document.getElementById("newActivity").addEventListener("keydown", key => {if (key.key === "Enter") addActivity();});

    // submit activities
    document.getElementById("submitActivities").onclick = () => {
        if (activities.length) {
            let players = [];

            // display sign up page
            document.getElementsByTagName("MAIN")[0].innerHTML = `<label for="name">Name:</label>
            <input type="text" id="name" autofocus>
            <label for="password">Password:</label>
            <input type="text" id="password">
            <input type="button" id="signUp" value="Sign Up">
            <p id="error"></p>
            <ul id="players"></ul>
            <input type="button" id="everyoneIn" value="Everyone's in!">`;

            // sign up players
            const signUp = () => {
                const errorElem = document.getElementById("error");
                errorElem.innerHTML = "";
                const name = document.getElementById("name").value.trim();
                const password = document.getElementById("password").value.trim();

                // add player
                if (!name) errorElem.innerHTML = "Name cannot be blank";
                else if (!password) errorElem.innerHTML = "Password cannot be blank";
                else if (players.map(player => {return player.name;}).includes(name)) errorElem.innerHTML = "Player already exists";
                else {
                    players.push({
                        _name: name,
                        _password: password,
                        _firstPass: true,
                        _activityMatches: activities.map(activity => {return [];}),

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
                            this._firstPass = firstPass;
                        },
                        get activityMatches() {
                            return this._activityMatches;
                        },

                        togglePlayerByActivity(playerName, activity) {
                            let matchArr = this.activityMatches[activities.indexOf(activity)];
                            if (matchArr.includes(playerName)) matchArr.splice(activity.indexOf(playerName), 1);
                            else matchArr.push(playerName);
                        }
                    });
                    document.getElementById("players").innerHTML += `<li>${name}</li>`;

                    // clear sign up inputs
                    document.getElementById("name").value = "";
                    document.getElementById("password").value = "";
                }
            }
            document.getElementById("signUp").onclick = signUp;
            document.getElementById("name").addEventListener("keydown", key => {if (key.key === "Enter") signUp();});
            document.getElementById("password").addEventListener("keydown", key => {if (key.key === "Enter") signUp();});

            // everyone's in
            document.getElementById("everyoneIn").onclick = () => {
                if (players.length < 2) document.getElementById("error").innerHTML = "Must have at least 2 players";
                else {                
                    // display sign in
                    const displaySignIn = () => {
                        document.getElementsByTagName("MAIN")[0].innerHTML = `<label for="name">Name:</label>
                        <input type="text" id="name" autofocus>
                        <label for="password">Password:</label>
                        <input type="text" id="password">
                        <input type="button" id="signIn" value="Sign In">
                        <p id="error"></p>`;
                        const signIn = () => {
                            const errorElem = document.getElementById("error");
                            errorElem.innerHTML = "";
                            const name = document.getElementById("name").value.trim();
                            const password = document.getElementById("password").value.trim();

                            // sign in to choose matches by activity
                            const activePlayer = players[players.map(player => {return player.name;}).indexOf(name)];
                            const otherPlayers = players.filter(player => {return player !== activePlayer});
                            if (!name) errorElem.innerHTML = "Name cannot be blank";
                            else if (!password) errorElem.innerHTML = "Password cannot be blank";
                            else if (!players.map(player => {return player.name;}).includes(name)) errorElem.innerHTML = "Player not found";
                            else if (players[players.map(player => {return player.name;}).indexOf(name)].password !== password) errorElem.innerHTML = "Wrong password";
                            else if (activePlayer.firstPass) {
                                // choose other players for each activity
                                document.getElementsByTagName("MAIN")[0].innerHTML = `${activities.reduce((prevActivity, currActivity) => {
                                    return prevActivity + `<p>Would you like to ${currActivity}...</p>
                                    <ul id="activity${activities.indexOf(currActivity)}">
                                        ${otherPlayers.filter(player => {return player !== activePlayer;}).reduce((prevPlayer, currPlayer) => {
                                            return prevPlayer + `<li>
                                                <input type="checkbox" id="activity${activities.indexOf(currActivity)}_${currPlayer.name}">
                                                <label for="activity${activities.indexOf(currActivity)}_${currPlayer.name}">${currPlayer.name}?</label>
                                            </li>
                                            `;
                                        }, "")}
                                    </ul>`;
                                }, "")}
                                <input type="button" id="doneChoosing" value="I'm done choosing!">`;

                                // checking a player adds them to potential matches for that activity
                                activities.forEach(activity => {
                                    otherPlayers.forEach(player => {
                                        document.getElementById(`activity${activities.indexOf(activity)}_${player.name}`).onchange = () => {
                                            activePlayer.togglePlayerByActivity(player.name, activity);
                                        };
                                    });
                                });

                                // back to sign in after choosing
                                document.getElementById("doneChoosing").onclick = () => {
                                    activePlayer.firstPass = false;
                                    displaySignIn();
                                }
                            }
                            else {
                                // remove non-matches
                                for (let i = 0; i < activePlayer.activityMatches.length; i++) {
                                    activePlayer.activityMatches[i] = activePlayer.activityMatches[i].filter(playerName => {return players[players.map(player => {return player.name;}).indexOf(playerName)].activityMatches[i].includes(activePlayer.name)});
                                };

                                // see matches on second sign in
                                document.getElementsByTagName("MAIN")[0].innerHTML = `${activePlayer.activityMatches.filter(matchArr => {return matchArr.length;}).length ? activePlayer.activityMatches.reduce((prevMatchArr, currMatchArr) => {return prevMatchArr + (currMatchArr.length ? `<p>You can ${activities[activePlayer.activityMatches.indexOf(currMatchArr)]}...</p>
                                    <ul>
                                        ${currMatchArr.reduce((prevMatch, currMatch) => {
                                            return prevMatch + `<li>${currMatch}</li>`;
                                        }, "")}
                                    </ul>` : "");
                                }, "") : "<p>NO MATCHES</p>"}
                                <input type="button" id="backToSignIn" value="Back to Sign In">`;

                                // back to sign in after reviewing matches
                                document.getElementById("backToSignIn").onclick = displaySignIn;
                            }
                        }
                        document.getElementById("signIn").onclick = signIn;
                        document.getElementById("name").addEventListener("keydown", key => {if (key.key === "Enter") signIn();});
                        document.getElementById("password").addEventListener("keydown", key => {if (key.key === "Enter") signIn();});
                    }
                    displaySignIn();
                }
            }
        }

        // no activities
        else {
            document.getElementById("error").innerHTML = "Need at least one activity";
            document.getElementById("newActivity").value = "";
        }
    }
}

// choose a pack to start
document.getElementById("datePack").onclick = () => {displayActivities(["watch Chicago", "watch Dimension 20", "watch a Dropout show", "write", "have sex", "listen to The Judgies", "play HPHB", "research local activities", "play Lego HP", "write music", "Legos", "play a board game", "watch Sex Education", "cook", "Pok&eacute;mon Go", "plan a wedding", "organize art supplies", "go through fabric box", "read", "make art"].map(option => {return `${option} with`;}));};
document.getElementById("foodPack").onclick = () => {displayActivities(["Salad and Go", "Subway", "Chinese", "Chipotle", "Mexican", "breakfast/diner food", "Italian", "burgers", "pizza", "frozen pizza"].map(option => {return `eat ${option} with`;}));};
document.getElementById("customPack").onclick = () => {displayActivities([]);};