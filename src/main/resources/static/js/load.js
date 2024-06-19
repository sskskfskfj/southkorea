window.onload = function () {
    function getUrlParams(url) {
        let urlStr = url.split('?')[1];
        if (!urlStr) return {};
        const urlSearchParams = new URLSearchParams(urlStr);
        return Object.fromEntries(urlSearchParams.entries());
    }

    const roomID = getUrlParams(window.location.href)['roomID'] || (Math.floor(Math.random() * 10000) + "");
    const userID = Math.floor(Math.random() * 10000) + "";
    const userName = getUrlParams(window.location.href)['username'] || "username" + userID;
    const appID = 891064744;
    const serverSecret = "04726e53896d9b4560c7f5c33132e42b";

    // 라이브러리 로드 확인
    console.log('ZegoUIKitPrebuilt:', ZegoUIKitPrebuilt);
    console.log('ZIM:', ZIM);

    // 미디어 장치 초기화
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            console.log('로컬 미디어 스트림이 초기화되었습니다.');
            initializeZego(stream);
        })
        .catch(error => {
            console.error('미디어 장치 접근 오류:', error);
        });

    function initializeZego(stream) {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // ZIM 초기화
        const zimInstance = ZIM.create({ appID: appID, serverSecret: serverSecret });
        console.log('zimInstance:', zimInstance);

        zp.addPlugins({ ZIM: ZIM });

        const containerElement = document.querySelector("#root");

        zp.joinRoom({
            container: containerElement,
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
                console.log(`사용자 ${userName}가 ID ${roomID} 방에 입장했습니다.`);
            },
            onTextMessageReceived: (messages) => {
                console.warn("onTextMessageReceived", messages);
            },
        });

        const sendMessageWithZIM = (messageText) => {
            const message = {
                type: 'text',
                message: messageText
            };

            if (zimInstance && ZIM.enums && ZIM.enums.ConversationType) {
                zimInstance.sendMessage(
                    message,
                    roomID,
                    {
                        conversationType: ZIM.enums.ConversationType.Group,
                        priority: 'high'
                    }
                ).then(res => {
                    console.log('메시지가 성공적으로 전송되었습니다', res);
                }).catch(err => {
                    console.error('메시지 전송 실패', err);
                });
            } else {
                console.error('ZIM enums 또는 ConversationType이 정의되지 않았습니다.');
            }
        };

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'ko-KR';

        recognition.onresult = (event) => {
            let transcript = event.results[event.results.length - 1][0].transcript.trim();
            console.log(`인식된 텍스트: ${transcript}`);
            sendMessageWithZIM(transcript);
        };

        recognition.start();
    }
};
