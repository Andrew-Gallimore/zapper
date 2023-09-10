// Loading the markdown editor when the library loads
// document.getElementById("simplemde").addEventListener("load", event => {
// })
// const easymde = new EasyMDE({
//     element: document.getElementById('editor'),
//     placeholder: "Add your first question here (in markdown)...",
//     sideBySideFullscreen: false
// });
const easymdeVIEW = new EasyMDE({
    element: document.getElementById('editor'),
    placeholder: "If you see this, there is a problem, contact admin or create support ticket",
    spellChecker: false,
    status: false,
    renderingConfig: {
        codeSyntaxHighlighting: true,
    },
    // previewRender: (plainText, preview) => { // Async method
    //     setTimeout(() => {
    //         console.log(plainText)
    //         if(easymdeVIEW.isPreviewActive()) {
    //             console.log(plainText)
    //         }
    //     }, 0);

    //     // If you return null, the innerHTML of the preview will not
    //     // be overwritten. Useful if you control the preview node's content via
    //     // vdom diffing.
    //     // return null;

    //     return;
    // },
});
easymdeVIEW.value('# Header test \n Consider the beginning of the check-expect expression: \n ```scheme \n ;This is a darn cool comment \n (check-expect (image-height 10 "String") \n``` \n How should this check-expect expression be **Ended**, to result in a **Passing** test? \n \n \n {% answers %} \n ### A. \n ```scheme \n 10 ) \n``` \n this should be a comment right below the 10 ');

// Adding event listener for when preview is clicked/visible
easymdeVIEW.toolbarElements.preview.addEventListener("click", e => {
    console.log("CLIKERD")
    processAnswersMDE();
        hljs.highlightAll();
});
easymdeVIEW.toolbarElements["side-by-side"].addEventListener("click", e => {
    console.log("CLIKERD 2")
    setTimeout(() => {
        processAnswersMDE();
        hljs.highlightAll();
    }, 0);
});
easymdeVIEW.toolbarElements.preview.click();

easymdeVIEW.codemirror.on("change", () => {
    setTimeout(() => {
        processAnswersMDE();
        hljs.highlightAll();
    }, 0);
});

function processAnswersMDE() {
    console.log("called")
    var temp = undefined;
    var placedLabel = false;
    if(easymdeVIEW.isSideBySideActive()) {
        var list = document.querySelectorAll(".editor-preview")[1].querySelectorAll(":scope > *");
    }else {
        var list = document.querySelectorAll(".editor-preview")[0].querySelectorAll(":scope > *");
    }

    for (let i = 0; i < list.length; i++) {
        element = list[i];

        if(element.innerHTML === " {% answers %} ") {
            // Setting temp variable to be a div, and placing it after {% answer %}
            temp = document.createElement("div");
            temp.classList.add("answer");
            element.parentNode.insertBefore(temp, element.nextSibling);
            element.remove();

            placedLabel = false;
            tempChild = null;
        }else if(temp) {
            // Putting a class on the first header element, which is likely a "1." or "A." for the answer option
            if(!placedLabel) {
                if(element.tagName === "H1" || element.tagName === "H2" || element.tagName === "H3") {
                    // Making current element the answer label, and then appending it
                    placedLabel = true;
                    element.classList.add("answer-label");
                    temp.appendChild(element.cloneNode("true"));
                    element.remove();

                    // Making a child div for all other children of answer to go into
                    tempChild = document.createElement("div");
                    tempChild.classList.add("answer-child");
                    temp.appendChild(tempChild)
                }
            }else {
                // Putting children into the created div inside variable 'temp'.
                temp.querySelector(".answer-child").appendChild(element.cloneNode("true"));
                element.remove();
            }

        }
    }
    // list.forEach(element => {
    //     if(element.innerHTML === " {% answers %} ") {
    //         // Setting temp variable to be a div, and placing it after {% answer %}
    //         temp = document.createElement("div");
    //         temp.classList.add("answer");
    //         element.parentNode.insertBefore(temp, element.nextSibling);
    //         element.remove();

    //         placedLabel = false;
    //         tempChild = null;
    //     }else if(temp) {
    //         // Putting a class on the first header element, which is likely a "1." or "A." for the answer option
    //         if(!placedLabel) {
    //             if(element.tagName === "H1" || element.tagName === "H2" || element.tagName === "H3") {
    //                 // Making current element the answer label, and then appending it
    //                 placedLabel = true;
    //                 element.classList.add("answer-label");
    //                 temp.appendChild(element.cloneNode("true"));
    //                 element.remove();

    //                 // Making a child div for all other children of answer to go into
    //                 tempChild = document.createElement("div");
    //                 tempChild.classList.add("answer-child");
    //                 temp.appendChild(tempChild)
    //             }
    //         }else {
    //             // Putting children into the created div inside variable 'temp'.
    //             temp.querySelector(".answer-child").appendChild(element.cloneNode("true"));
    //             element.remove();
    //         }

    //     }
    // },);
}
// processAnswersMDE()


if(!DetectRTC.isWebRTCSupported) {
    console.warn("Browser doesn't support WebRTC")
}

// Getitng URL params (and adding any required ones)
var URLparams = (new URL(document.location)).searchParams;
if(!URLparams.get("c")) {
    // Creating a C value
    console.log("Creating new C value")
    createNewC();
}

// Trying to get the values of the C value
try {
    var fields = atob(URLparams.get("c")).split('--d');
    if(fields.length === 2) {
        // We have a good c value
        object = {
            c: fields[0],
            p: fields[1]
        }
        // Loading the session through portal
        console.log(object)
        loadPortal(object)

        // Making QR Code now that we have C value
        new QRCode(document.getElementById("qrcode"), {
            text: "https://andrew-gallimore.github.io/zapper/guest.html?c=" + URLparams.get("c"),
            colorLight: getComputedStyle(document.body).getPropertyValue('--color-primary-light')
        });
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
    return
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