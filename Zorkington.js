let checkQuit = false;
const atBcaDoor = "182 Main St." +
    "You are standing on Main Street between Church and South Winooski.\n" +
    "There is a door here. A keypad sits on the handle. \n" +
    "On the door is a handwritten sign.\n"
const readBcaSign = "The sign says \"Welcome to Burlington Code Academy! Come on " +
    "up to the second floor. If the door is locked, use the code 8675309.\n"
const inTheFoyer = "You are in a foyer. Or maybe it's an antechamber. Or a " +
    "vestibule. Or an entryway. Or an atrium. Or a narthex." +
    "But let's forget all that fancy flatlander vocabulary," +
    "and just call it a foyer. In Vermont, this is pronounced \"FO-ee-yurr\"." +
    "A copy of Seven Days lies in a corner.\n";
let resp = atBcaDoor;//initial value
var inv = [];
let isInventoryAdd = "";

const readline = require('readline')
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
function stateInfo(input) {
    return new Promise((resolve, reject) => {
        readlineInterface.question(input, resolve);
    });
}
//check if in valid actions
function checkForAction(input, arr) {
    let index = -1;
    (arr).forEach((element, i) => {//might want to use the find method instead??
        if (element[0] == input.toLowerCase()) { index = i; }
    });
    return index;
}
function checkForInventoryAdd(req, arr) {
    let resp = "";
    if(req.toLowerCase()=="inv"|| req.toLowerCase()=="i")
    {
        return inv.join(", ")+ "\n";
    }
    (arr[0]).forEach((element) => {//might want to use the find method instead??
        if ("take " + element == req.toLowerCase())//&& arr[3] == true)
        {
            inv.push(arr[2]);
            console.log(req);
            console.log(element);
            console.log(arr[2]);
            resp = arr[1];
        }
        if ("drop " + element == req.toLowerCase())//&& arr[3] == true)
        {
            inv.splice(inv.indexOf(element), 1);
            resp = "You dropped " + arr[1];
        }
    });

    return resp;
}
function setEventAsOccurred(arr) {//take in object, modify object - this is used to define whether you can 'take puppy' before seeing puppy, stuff like that.
    arr[3] = true;
    return arr;
}

const state = {
    BCADoor: {
        location: atBcaDoor,
        actReact: [
            ["read sign", readBcaSign, [-1, ""], false]
            , ["open door", "The door is locked. There is a keypad on the door handle.\n", [-1, ""], false]//might want to change the boolean to be its own property.
            , ["take sign", "That would be selfish. How will other students find their way?\n", [-1, ""], false]
            , ["enter code 8675309", "Success! The door opens. You enter the foyer and the door shuts behind you.\n", [0, "inFoyer"], false]
            , ["yell", "AARRRGHH!! \n..\n...\n....\n Nearby bum asks you for a cigarette.\n", [-1, ""], false]
            , ["cry", "Stray puppy comes out of the alley near Esox, and waits at the door with you.\n", [-1, ""], false]
            //, ["take puppy", "Yay!\n", [-1, ""], false]
            , ["pet puppy", "Who's a good dog!\n", [-1, ""], false]
        ],
        inventory: [["puppy"], "The puppy is yours now!\n", "A nice puppy"]//, this.BCADoor.actReact[5][3]]//how do I check the value of an item in actReact??
    },
    inFoyer: {
        location: inTheFoyer,
        actReact: [
            ["take paper", "You pick up the paper and leaf through it looking for comics and ignoring the articles," +
                "just like everybody else does.\n", [-1, ""], false] //need to add verbiage functionality
            , ["yell", "arggghhhhh!!!!", [-1, ""], false]
            , ["take sign", "That would be selfish. How will other students find their way?\n", [-1, ""], false]
            , ["go upstairs", "You head upstairs and spend a few hours getting smarter.\n", [0, "existentialPurgatory"], false]
        ],
        inventory: [["paper", "seven days"],"..You have the paper.\n", "A copy of Seven Days, Vermont's Alt-Weekly"]//,this.inFoyer.actReact[0][1]]
    },
    existentialPurgatory: {
        location: "You thought you were going to class, but it turns out you ended up in purgatory. There is nothing here except for a laptop displaying a Javascript program. " +
            "You try to decide whether to close laptop or refactor the code.\n",
        actReact: [
            ["refactor code", "You're such a try-hard.\n", [-1, ""], false] //need to add verbiage functionality
            , ["close laptop", "You weren't in purgatory.. It was just a dream.. You fell asleep during class. Turns out you're sort of lazy in your dreams.\n", [-1, ""], false]
        ],
        inventory: [["laptop"], "A laptop"]//,this.inFoyer.actReact[0][1]]
    }
}

start();

let currentState = state.BCADoor//.location;

async function start() {

    await stateInfo("welcome to a game that's like Zork but not as good. Enter \"quit\" at any time to be a quitter. Enter \"i\" or \"inv\" to check your inventory. To start, press enter.");
    input = await stateInfo(currentState.location);

    if(input.trim().toLowerCase()=="quit"){process.exit();}

    while (!checkQuit) {
        if(input.trim().toLowerCase()=="quit"){checkQuit=1;}
        //check if input contains an action
        checkAns = checkForAction(input.trim(), currentState.actReact);
        
        //check to see if we need to add or drop inventory
        isInventoryAdd = checkForInventoryAdd(input.trim(), currentState.inventory);
        

        if (checkAns < 0 && isInventoryAdd == "") {
            badAns = input.trim();
            input = await stateInfo("I don't understand \"" + badAns + "\"\n");
            continue;
        }
        if (checkAns < 0 && isInventoryAdd != "") {
            
            input = await stateInfo(isInventoryAdd);
        }
        else {
            //get response, setAsOccurred, check inv.
            //get response
            resp = currentState.actReact[checkAns][1];

            ////log that event has occurred
            //currentState.actReact[checkAns][1] = setEventAsOccurred(currentState.actReact[checkAns]);
        
            //are we changing states?
            if (currentState.actReact[checkAns][2][0] == 0) { //0 is the magic number in the third arr element that will move you to another location
                nextState = currentState.actReact[checkAns][2][1];
                
                currentState = state[nextState];

                input = await stateInfo(currentState.location);

            }
            else {
                input = await stateInfo(resp);
            }
        }

    }
    process.exit();
}