const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.use('/output', express.static(path.join(__dirname, 'output')));

app.get('/favicon.ico', (req, res) => res.status(204));

app.post('/upload', upload.single('song'), (req, res) => {
    const file = req.file;
    const inputDir = path.join(__dirname, 'input');
    const outputDir = path.join(__dirname, 'output');
    const fileName = file.originalname;

    if (!fs.existsSync(inputDir)) {
        fs.mkdirSync(inputDir);
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const inputFilePath = path.join(inputDir, fileName);
    const outputFilePath = path.join(outputDir, fileName.replace('.mp3', ''));

    fs.copyFile(file.path, inputFilePath, (err) => {
        if (err) {
            console.error(`File copy error: ${err}`);
            return res.status(500).send('Error processing file');
        }

        fs.unlink(file.path, (err) => {
            if (err) {
                console.error(`File delete error: ${err}`);
                return res.status(500).send('Error processing file');
            }


            const command = `docker run -v ${outputDir}:/output -v ${inputDir}:/input researchdeezer/spleeter separate -p spleeter:4stems -i /input/${fileName} -o /output`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    return res.status(500).send(`Error processing song: ${stderr}`);
                }

                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);

                const outputSubDir = path.join(outputDir, fileName.replace('.mp3', ''));
                const accompanimentPath = path.join(outputSubDir, 'accompaniment.wav');
                const vocalsPath = path.join(outputSubDir, 'vocals.wav');

                if (!fs.existsSync(accompanimentPath) || !fs.existsSync(vocalsPath)) {
                    console.error('Output files not found');
                    return res.status(500).send('Error processing song: Output files not found');
                }
                
                const convertToMp3 = (wavPath, mp3Path, callback) => {
                    const ffmpegCommand = `ffmpeg -y -i "${wavPath}" "${mp3Path}"`;
                    exec(ffmpegCommand, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`ffmpeg error: ${error}`);
                            console.error(`stderr: ${stderr}`);
                            return callback(error);
                        }
                        console.log(`stdout: ${stdout}`);
                        console.log(`stderr: ${stderr}`);
                        callback(null);
                    });
                };

                const accompanimentMp3Path = accompanimentPath.replace('.wav', '.mp3');
                const vocalsMp3Path = vocalsPath.replace('.wav', '.mp3');

                convertToMp3(accompanimentPath, accompanimentMp3Path, (err) => {
                    if (err) return res.status(500).send('Error converting accompaniment to MP3');
                    convertToMp3(vocalsPath, vocalsMp3Path, (err) => {
                        if (err) return res.status(500).send('Error converting vocals to MP3');

                        const result = {
                            beat_path: `/output/${fileName.replace('.mp3', '')}/accompaniment.mp3`,
                            vocals_path: `/output/${fileName.replace('.mp3', '')}/vocals.mp3`
                        };

                        if (!result.beat_path || !result.vocals_path) {
                            console.error('Result paths are undefined');
                            return res.status(500).send('Error processing song: Result paths are undefined');
                        }

                        res.json(result);
                    });
                });
            });
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});