window.onload = function () {
    function getUrlParams(url) {
        let urlStr = url.split('?')[1];
        if (!urlStr) return {};
        const urlSearchParams = new URLSearchParams(urlStr);
        const result = Object.fromEntries(urlSearchParams.entries());
        return result;
    }

    const roomID = getUrlParams(window.location.href)['roomID'] || (Math.floor(Math.random() * 10000) + "");
    const userID = Math.floor(Math.random() * 10000) + "";
    const userName = getUrlParams(window.location.href)['username'] || "username" + userID;
    const appID = 891064744;
    const serverSecret = "04726e53896d9b4560c7f5c33132e42b";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
        container: document.querySelector("#root"),
        sharedLinks: [{
            name: 'RoomID',
            url: window.location.href
        }],
        scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: false,
        showScreenSharingButton: false,
        showTextChat: true,
        showUserList: false,
        maxUsers: 30,
        layout: "Grid",
        showLayoutButton: true,
        onJoinRoom: () => {
            console.log(`User ${userName} has joined the room with ID ${roomID}`);
        }
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'ko-KR';

    recognition.onresult = (event) => {
        let transcript = event.results[event.results.length - 1][0].transcript.trim();
        console.log(`Recognized Text: ${transcript}`);

        if (roomID && typeof roomID === 'string' && transcript) {
            zp.sendInRoomMessage({
                category: 'chat',
                message: transcript,
            }).then(() => {
                console.log('Message sent successfully');
            }).catch((error) => {
                console.error('Message sending failed', error);
                console.error(`Error Code: ${error.errorCode}, Error Message: ${error.message}`);
            });
        } else {
            console.error('Invalid parameters:', { roomID, message: transcript });
        }
    };

    recognition.onerror = (event) => {
        console.error(`Speech Recognition Error: ${event.error}`);
    };

    recognition.onend = () => {
        console.log('Speech recognition service disconnected');
        recognition.start();
    };

    recognition.start();
};
