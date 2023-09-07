// Loading the markdown editor when the library loads
// document.getElementById("simplemde").addEventListener("load", event => {
// })
const easymde = new EasyMDE({
    element: document.getElementById('editor'),
    placeholder: "Add your first question here (in markdown)...",
    sideBySideFullscreen: false
});


if(!DetectRTC.isWebRTCSupported) {
    console.warn("Browser doesn't support WebRTC")
}

var URLparams = (new URL(document.location)).searchParams;
if(!URLparams.get("c")) {
    // Creating a C value
    console.log("Creating new C value")
    createNewC();
}

// Loading the session through portal
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

// Used in startup for the URL C values
function createNewC() {
    var rand = Math.floor(Math.random() * 100000000000000).toString(36);
    rand.replace("--d", "ifykyk") //replacing the deliniator with random str so that it doesn't randomly break the c-value

    var rand2 = Math.floor(Math.random() * 100000000000000).toString(36);
    rand2.replace("--d", "ifykyk") //replacing the deliniator with random str so that it doesn't randomly break the c-value

    addURLParameter("c", btoa(rand + '--d' + rand2));
}

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

    // Portal guests joining/leaving
    Portal.on('add-guest', () => {
        console.log("> New Guest")
        // alert.searchingForDirector.setProgressBar(0.8);
        // alert.searchingForDirector.setProgressMessage("Getting config...");
    })
    Portal.on('remove-guest', () => {
        console.log("> Guest Left")
        // alert.searchingForDirector.setProgressBar(0.8);
        // alert.searchingForDirector.setProgressMessage("Getting config...");
    })

    // Now loading the portal (either as creator or not)
    Portal.loadPrimaryChannel(true, {
        c: "testingVIDLIUM",
        p: "testing"
    })
}