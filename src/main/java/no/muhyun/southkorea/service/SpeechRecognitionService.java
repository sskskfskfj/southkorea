package no.muhyun.southkorea.service;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class SpeechRecognitionService {
    public String recognizeSpeech(String audioFilePath) throws Exception {
        try (SpeechClient speechClient = SpeechClient.create()) {
            Path path = Paths.get(audioFilePath);
            byte[] data = Files.readAllBytes(path);
            ByteString audioBytes = ByteString.copyFrom(data);

            RecognitionConfig config = RecognitionConfig.newBuilder()
                    .setEncoding(RecognitionConfig.AudioEncoding.LINEAR16)
                    .setSampleRateHertz(16000)
                    .setLanguageCode("ko-KR")
                    .build();

            RecognitionAudio audio = RecognitionAudio.newBuilder()
                    .setContent(audioBytes)
                    .build();

            RecognizeResponse response = speechClient.recognize(config, audio);
            StringBuilder transcript = new StringBuilder();
            for (SpeechRecognitionResult result : response.getResultsList()) {
                SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
                transcript.append(alternative.getTranscript());
            }

            return transcript.toString();
        }
    }
}
