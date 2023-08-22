
let fetch;

import('node-fetch').then(module => {
    fetch = module.default;
});

const fs= require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const { getWaveBlob, WavRecorder, downloadWav } = require("webm-to-wav-converter");

const PORT = 3000;

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('audio'), (req, res) => {
    console.log('call received', req);

    //downloadWav(req.body.data , false);

    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Save the received audio file temporarily
    const tempAudioPath = 'hhh.wav';
    fs.writeFileSync(tempAudioPath, req.file.buffer);
    // Convert the saved audio to PCM using ffmpeg
    const pcmFilePath = 'converted_audio.wav';
    const ffmpegProcess = exec(`ffmpeg -hide_banner -y -i ${tempAudioPath} -f s16le -ac 1 -ar 16000 ${pcmFilePath}`, {
        stdout: true,
        stderr: true
    });

    ffmpegProcess.stderr.on('data', (data) => {
        console.log('Errorrrr')
        console.error(`ffmpeg stderr: ${data}`);
    });

    ffmpegProcess.on('close', async (code) => {
        console.log(`FFmpeg process completed with code: ${code}`);

        if (code !== 0) {
            console.error("Error during conversion:", code);
            res.status(500).send('Error during conversion');
            return;
        }

        const audioBytes = fs.readFileSync(pcmFilePath).toString('base64');

        const requestPayload = {
            audio: {
                content: audioBytes
            },
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 16000,
                languageCode: 'en-US',
            }
        };

         try {
            const response = await fetch('https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyDx7DmF4zy2DMDYVTurz5ykWgmw00ROII0', {
                method: 'POST',
                body: JSON.stringify(requestPayload),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log("Google Cloud Response:", data);

            if (data.error) {
                console.error(data.error);
                res.status(500).send('Error processing audio');
                return;
            }

            const transcription = data.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');

            console.log(transcription);

            res.json({ firebase: transcription });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error processing audio');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});