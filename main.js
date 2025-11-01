let activities = [];

// add activity
document.getElementById("addActivity").onclick = () => {
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

// submit activities
document.getElementById("submitActivities").onclick = () => {
    if (activities.length) {
        let players = [];

        // display sign up page
        document.getElementsByTagName("MAIN")[0].innerHTML = `<label for="name">Name:</label>
        <input type="text" id="name">
        <label for="password">Password:</label>
        <input type="text" id="password">
        <input type="button" id="signUp" value="Sign Up">
        <p id="error"></p>
        <ul id="players"></ul>
        <input type="button" id="everyoneIn" value="Everyone's in!">`;

        // sign up players
        document.getElementById("signUp").onclick = () => {
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
                        if (this.activityMatches.includes(playerName)) this.activityMatches[activities.indexOf(activity)].splice(activity.indexOf(playerName), 1);
                        else this.activityMatches[activities.indexOf(activity)].push(playerName);
                    }
                });
                document.getElementById("players").innerHTML += `<li>${name}</li>`;

                // clear sign up inputs
                document.getElementById("name").value = "";
                document.getElementById("password").value = "";
            }
        }

        // everyone's in
        document.getElementById("everyoneIn").onclick = () => {
            if (players.length < 2) document.getElementById("error").innerHTML = "Must have at least 2 players";
            else {                
                // display sign in
                const displaySignIn = () => {
                    document.getElementsByTagName("MAIN")[0].innerHTML = `<label for="name">Name:</label>
                    <input type="text" id="name">
                    <label for="password">Password:</label>
                    <input type="text" id="password">
                    <input type="button" id="signIn" value="Sign In">
                    <p id="error"></p>`;
                    document.getElementById("signIn").onclick = () => {
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
                                <ul id="${currActivity}">
                                    ${otherPlayers.filter(player => {return player !== activePlayer;}).reduce((prevPlayer, currPlayer) => {
                                        return prevPlayer + `<li>
                                            <input type="checkbox" id="${currActivity}_${currPlayer.name}">
                                            <label for="${currActivity}_${currPlayer.name}">${currPlayer.name}?</label>
                                        </li>
                                        `;
                                    }, "")}
                                </ul>`;
                            }, "")}
                            <input type="button" id="doneChoosing" value="I'm done choosing!">`;

                            // checking a player adds them to potential matches for that activity
                            activities.forEach(activity => {
                                otherPlayers.forEach(player => {
                                    document.getElementById(`${activity}_${player.name}`).onchange = () => {
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
                                for (let j = 0; j < activePlayer.activityMatches[i].length; j++) {
                                    if (!players[players.map(player => {return player.name;}).indexOf(activePlayer.activityMatches[i][j])].activityMatches[i].includes(activePlayer.name)) activePlayer.activityMatches[i].splice(j, 1);
                                };
                            };

                            // see matches on second sign in
                            document.getElementsByTagName("MAIN")[0].innerHTML = `${activePlayer.activityMatches.filter(matchArr => {return matchArr.length;}).length ? activePlayer.activityMatches.reduce((prevMatchArr, currMatchArr) => {return prevMatchArr + currMatchArr.length ? `<p>You can ${activities[activePlayer.activityMatches.indexOf(currMatchArr)]}...</p>
                                <ul>
                                    ${currMatchArr.reduce((prevMatch, currMatch) => {
                                        return prevMatch + `<li>${currMatch}</li>`;
                                    }, "")}
                                </ul>` : "";
                            }, "") : "<p>NO MATCHES</p>"}
                            <input type="button" id="backToSignIn" value="Back to Sign In">`;

                            // back to sign in after reviewing matches
                            document.getElementById("backToSignIn").onclick = displaySignIn;
                        }
                    }
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