package no.com.southkorea.controller;

import no.com.southkorea.service.SpeechRecognitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/api/speech")
public class SpeechRecognitionController {
    @Autowired
    private SpeechRecognitionService speechRecognitionService;

    @PostMapping("/recognize")
    public String recognizeSpeech(@RequestParam("file") MultipartFile file) throws Exception {
        // Save the file to a temporary location
        File tempFile = File.createTempFile("speech-", ".wav");
        file.transferTo(tempFile);

        // Perform speech recognition
        String transcript = speechRecognitionService.recognizeSpeech(tempFile.getAbsolutePath());

        // Delete the temporary file
        tempFile.delete();

        return transcript;
    }
}
