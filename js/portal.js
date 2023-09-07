console.log("Portal running")


var Portal = {
    iframe: undefined,
    cashe: {
        events: {},
        sentFirstMessage: false,
        password: "",
        isCreator: false,
        creatorUUID: "",
        peers: {}
    },
    io: {
        iframeID: "portaliframe"
    },
    db: {
        questions: {},
        activeQ: undefined,
        UID: undefined
    },
    onMessage: (message) => {
        // console.log(message)
        if("dataReceived" in message){ // user-transferred data.  Other data is available, such as connection info.

            // Type check
            if(typeof message.dataReceived === "object")

            // I check if the person is authorized inside each message option
            if(message.dataReceived.action === "helloWorld" && Portal.cashe.isCreator) {
                var authed;

                // Trying to send a message now
                if(message.dataReceived.password === Portal.cashe.password) {
                    // Responding with success status
                    console.log("Sent success authed responce")
                    document.getElementById(Portal.io.iframeID).contentWindow.postMessage({"sendData":{
                        action: "authedResponce",
                        status: true
                    }, "UUID": message.UUID}, '*');
                    authed = true;
                }else {
                    document.getElementById(Portal.io.iframeID).contentWindow.postMessage({"sendData":{
                        action: "authedResponce",
                        status: false
                    }, "UUID": message.UUID}, '*');
                    authed = false;
                }
                if(!Portal.cashe.peers[message.UUID]) {
                    // Adding user to peers list WITH a todo to respond
                    if(authed) {
                        Portal.cashe.peers[message.UUID] = {
                            todos: [{
                                action: "authedResponce",
                                status: authed
                            }]
                        }
                    }else {
                        Portal.cashe.peers[message.UUID] = {
                            todos: [{
                                action: "authedResponce",
                                status: authed
                            }]
                        }
                    }
                }
            }else if(message.dataReceived.action === "authedResponce") {
                // Saying if we are authed or not
                if(message.dataReceived.status === true) {
                    Portal.dispatch("authed")
                }else {
                    Portal.dispatch("failed-auth")
                }

                // The Creator should be the only one responding with authed responce, so mark the sender of authedResponce as creator
                if(Portal.cashe.creatorUUID === "") Portal.cashe.creatorUUID = message.UUID;
            }else if(message.dataReceived.action === "newQuestion") {
                if(message.dataReceived.password === Portal.cashe.password) {
                    console.log("Added question to list")
                    console.log(message.dataReceived.value)

                    // Adding question to db
                    Portal.db.activeQ = message.dataReceived.value.name;
                    Portal.db.questions[message.dataReceived.value.name] = {
                        questionText: message.dataReceived.value.questionText
                    }
                    Portal.dispatch("new-question", message.dataReceived.value)
                }
            }else if(message.dataReceived.action === "Qanswer") {
                if(message.dataReceived.password === Portal.cashe.password) {
                    console.log("Recived an answer from" + message.dataReceived.UID)
                    console.log(message.dataReceived)

                    
                }
            }
        }else if("guest-connected" === message.action) {
            if(!Portal.cashe.peers[message.UUID]) {
                // Adding user to peers list
                Portal.cashe.peers[message.UUID] = {}
            }else {
                // There must be some todo's
                if(Portal.cashe.peers[message.UUID].todos)

                Portal.cashe.peers[message.UUID].todos.forEach(obj => {
                    // Now sending a success status to authing
                    console.log("Sent success authed responce")
                    document.getElementById(Portal.io.iframeID).contentWindow.postMessage({"sendData": obj, "UUID": message.UUID}, '*');
                });
            }
            if(!Portal.cashe.sentFirstMessage) {
                // Sending first message out to the group to establish auth
                console.log("sent hello World")
                
                document.getElementById(Portal.io.iframeID).contentWindow.postMessage({"sendData":{
                    action: "helloWorld",
                    password: Portal.cashe.password
                }, "type": "pcs"}, '*');
                
                Portal.cashe.sentFirstMessage = true;
                Portal.dispatch("found-peer")
            }
            Portal.dispatch("add-guest", message.UUID);
        }else if("end-view-connection" === message.action) {
            if(Portal.cashe.peers[message.UUID]) {
                // Removing user from peers list
                delete Portal.cashe.peers[message.UUID];
            }
            Portal.dispatch("remove-guest", message.UUID);
        }else if("joined-room-complete" === message.action) {
            setTimeout(() => {
                if(Object.keys(Portal.cashe.peers).length < 1) {
                    Portal.dispatch("channel-empty")
                }
            }, 2000);
            // 1000 is too short in a few cases
        }
    },
    loadPrimaryChannel: (isCreator, object) => {
        // Setting if we are the primary authority for stored values
        Portal.cashe.isCreator = isCreator;
        Portal.cashe.password = object.p;

        // Loading the iframe
        var iframe = document.createElement("iframe");
        iframe.src = "https://vdo.ninja/alpha/?room="+object.c+"&vd=0&ad=0&autostart&cleanoutput"; // See the info at docs.vdo.ninja for options
        iframe.id = Portal.io.iframeID;
        document.body.appendChild(iframe);

        // Adding it to Portal object (used so we can filter messages)
        Portal.iframe = iframe;
    },
    setUID: (UID) => {
        Portal.db.UID = UID;
    },
    sendAnswer: (answer) => {
        if(Portal.cashe.isCreator || !Portal.db.activeQ || !Portal.db.UID) return;

        console.log("Sending answer in for question: " + Portal.db.activeQ)
        
        // Sending update to the peer (which should only be the creator, if they are an authed guest)
        document.getElementById(Portal.io.iframeID).contentWindow.postMessage({"sendData":{
            action: "Qanswer",
            password: Portal.cashe.password,
            UID: Portal.db.UID,
            value: answer
        }, "UUID": Portal.cashe.creatorUUID}, '*');
    },
    sendQuestion: (data) => {
        // Expected input
        // data = {
        //     name: "testing1",
        //     questionText: "What is 1 + 1"
        // }

        if(!Portal.cashe.isCreator) return;

        console.log("Sending question " + data.name + " to people")

        Portal.db.questions[data.name] = {
            responces: [],
            questionText: data.questionText
        }
        
        // Sending update to all other peers
        document.getElementById(Portal.io.iframeID).contentWindow.postMessage({"sendData":{
            action: "newQuestion",
            password: Portal.cashe.password,
            value: {
                name: data.name,
                questionText: data.questionText
            }
        }, "type": "pcs"}, '*');
    },

    // Custom event system
    DispatcherEvent: class {
        constructor(eventName) {
            this.eventName = eventName;
            this.callbacks = [];
        }
    
        registerCallback(callback) {
            this.callbacks.push(callback);
        }
    
        unregisterCallback(callback) {
            const index = this.callbacks.indexOf(callback);
            if (index > -1) {
                this.callbacks.splice(index, 1);
            }
        }
    
        fire(data) {
            const callbacks = this.callbacks.slice(0);
            callbacks.forEach((callback) => {
                callback(data);
            });
        }
    },
    // Dispatches custom event
    dispatch(eventName, data="") {
        const event = Portal.cashe.events[eventName];
        if (event) {
            event.fire(data);
        }
    },

    // Lissens to custom events that are dispatched
    on(eventName, callback) {
        let event = Portal.cashe.events[eventName];
        if (!event) {
            event = new Portal.DispatcherEvent(eventName);
            Portal.cashe.events[eventName] = event;
        }
        event.registerCallback(callback);
    },

    // Removes the lissener to the custom events
    off(eventName, callback) {
        const event = Portal.cashe.events[eventName]
        if (event && event.callbacks.indexOf(callback) > -1) {
            event.unregisterCallback(callback);
            if (event.callbacks.length === 0) {
                delete this.events[eventName];
            }
        }
    }
}