var URLparams = (new URL(document.location)).searchParams;
if(URLparams.get("c")) {
    // Loading a previously already loaded session
    try {
        var fields = atob(URLparams.get("c")).split('--d');
        if(fields.length === 2) {
            // We have a good c value
            object = {
                c: fields[0],
                p: fields[1]
            }
            console.log(object)
            loadPortal(object)
        }else {
            console.warn("Bad Link. Incorrect C value")
        }
    }catch (error) {
        console.warn("Unexpected error in C value")
        console.error(error)
    }
}else {
    // They didn't open a good link
    console.warn("Bad Link. There isn't a C value present")
}
if(URLparams.get("u")) {
    Portal.setUID(URLparams.get("u"))
}

// Sets up portal event listeners and opens connection
function loadPortal(object) {
    // Portal loading error States
    Portal.on('channel-empty', () => {
        console.log("> Coms Empty")
        // alert.searchingForDirector.setProgressMessage("No other Directors found.");
        // alert.searchingForDirector.setState("error")
    })
    Portal.on('failed-auth', () => {
        console.log("> Failed Auth")
        // alert.searchingForDirector.setProgressMessage("Password incorrect. Double check your link.");
        // alert.searchingForDirector.setState("error")
    })

    // portal loading success states
    Portal.on('found-peer', () => {
        console.log("> Found a Peer")
        // alert.searchingForDirector.setProgressBar(0.55);
        // alert.searchingForDirector.setProgressMessage("Checking credentials...");
    })
    Portal.on('authed', () => {
        console.log("> We Authed")
        // alert.searchingForDirector.setProgressBar(0.8);
        // alert.searchingForDirector.setProgressMessage("Getting config...");
    })

    // Question related events
    Portal.on('new-question', questionData => {
        displayQuestion(questionData);
    })

    // Now loading the portal (either as creator or not)
    Portal.loadPrimaryChannel(false, {
        c: "testingVIDLIUM",
        p: "testing"
    })
}

// Hides previous question (if there is one) and then displays current one based on data
function displayQuestion(data) {
    hideQuestion();
    
    var location = document.querySelector(".question-area");

    var temp;
    temp = document.createElement('h1');
    temp.innerHTML = data.name;
    location.appendChild(temp)

    temp = document.createElement('p');
    temp.innerHTML = data.questionText;
    location.appendChild(temp)
}

// Hides currently displayed question content
function hideQuestion() {
    var locationQuery = ".question-area";
    document.querySelectorAll(locationQuery + " *").forEach(element => {
        element.remove();
    })
}