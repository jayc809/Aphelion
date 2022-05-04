const express = require("express")
const app = express()
const fs = require('fs')
const path = require("path")
const readline = require('readline')
const ytdl = require('ytdl-core')
const webAudioApi = require("web-audio-api")
const MusicTempo = require("music-tempo")
const fft = require('fft-js').fft
const fftUtil = require('fft-js').util
const videoID = "https://www.youtube.com/watch?v=IKKar5SS29E"

app.get("/api", (req, res) => {
    res.json({"users": ["Alvin", "Ben", "Charlie"]})
    console.log("sent")
})

app.get('/audio', (req, res) => { 

    // var videoUrl = req.query.videoUrl;   
    // var destDir = req.query.destDir; 
    const filePath = path.resolve(__dirname, 'audio.mp3')
    const audio = ytdl(videoID, { filter: 'audioonly'})
    audio.pipe(fs.createWriteStream(filePath))
    
    audio.on('end', () => {
        console.log("done")
        res.download(filePath)
    });  
    
 });

app.get("/serveVideo", (req, res) => {
    const filePath = path.resolve(__dirname, 'video.mp4')
    res.sendFile(filePath)
})

app.get("/video", (req, res) => {
    const filePath = path.resolve(__dirname, 'video.mp4')
    const video = ytdl(videoID);
    let starttime;
    video.pipe(fs.createWriteStream(filePath));
    video.once('response', () => {
        starttime = Date.now();
    });
    video.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
        const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
        process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
        process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
        process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `);
        readline.moveCursor(process.stdout, 0, -1);
    });
    video.on('end', () => {
        process.stdout.write('\n\n');
    });
})

app.get("/bpm", (req, res) => {
    const filePath = path.resolve(__dirname, 'video.mp4')
    const data = fs.readFileSync(filePath)
    const buffer = data.buffer
    const audioCtx = new webAudioApi.AudioContext()
    audioCtx.decodeAudioData(buffer, calcTempo)
})

app.get("/videoBPM", (req, res) => {

    const filePath = path.resolve(__dirname, 'video.mp4')
    const video = ytdl(videoID)

    //download the video
    let starttime
    video.pipe(fs.createWriteStream(filePath))
    video.once('response', () => {
        starttime = Date.now()
    })
    video.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60
        const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes
        readline.cursorTo(process.stdout, 0)
        process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded`)
        process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`)
        process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`)
        process.stdout.write(`, estimated time left: ${estimatedDownloadTime.toFixed(2)}minutes `)
        readline.moveCursor(process.stdout, 0, -1)
    })

    //analyze audio
    video.on('end', () => {
        process.stdout.write('\n\n')
        const data = fs.readFileSync(filePath)
        const buffer = data.buffer
        const audioCtx = new webAudioApi.AudioContext()
        audioCtx.decodeAudioData(buffer, analyzeAudio)
    })
    const getAudioData = (buffer) => {
        const audioData = []
        if (buffer.numberOfChannels == 2) {
            const channel1Data = buffer.getChannelData(0)
            const channel2Data = buffer.getChannelData(1)
            const length = channel1Data.length;
            for (let i = 0; i < length; i += 1) {
                audioData[i] = (channel1Data[i] + channel2Data[i]) / 2
            }
        } else {
            audioData = buffer.getChannelData(0)
        }
        return audioData
    }
    const getAudioStartIndex = (audioData) => {
        for (let i = 0; i < audioData.length; i += 1) {
            if (audioData[i] != 0) {
                return i
            }
        }
    }
    const getBPM = (audioData) => {
        const mt = new MusicTempo(audioData)
        return mt.tempo
    } 
    const getBeatTime = (audioData, buffer, startIndex, bpm) => {
        const beats = []
        for (let sample = startIndex; sample < audioData.length - 2048; sample += parseInt(buffer.sampleRate * 60 / bpm)) {
            beats.push(sample / 44100)
        }
        return beats
    }
    const getFFTMap = (audioData, buffer, startIndex, bpm) => {
        const fftMap = []
        for (let sample = startIndex; sample < audioData.length - 2048; sample += parseInt(buffer.sampleRate * 60 / bpm)) {
            const interval = audioData.slice(sample, sample + 2048)
            const phasors= fft(interval)
            const frequencies = fftUtil.fftFreq(phasors, buffer.sampleRate)
            const magnitudes = fftUtil.fftMag(phasors)
            let meta = frequencies.map((f, i) => {
                return {frequency: f, magnitude: magnitudes[i]}
            })
            const metaSorted = meta.sort((a, b) => b.magnitude - a.magnitude)
            fftMap.push(metaSorted.slice(0, 4))
        }
        return fftMap 
    }
    const getBeatmap = (fftMap, beatTime) => {
        const frequencies = []
        for (let i = 0; i < fftMap.length; i += 1) {
            for (let j = 0; j < fftMap[i].length; j += 1) {
                frequencies.push(fftMap[i][j].frequency)
            }
        }
        const frequenciesSorted = frequencies.sort((a, b) => a - b)
        const quartiles = [
            frequenciesSorted[parseInt(frequenciesSorted.length * 0.25)],
            frequenciesSorted[parseInt(frequenciesSorted.length * 0.5)],
            frequenciesSorted[parseInt(frequenciesSorted.length * 0.75)]
        ]
        const beatmap = []
        for (let i = 0; i < fftMap.length; i += 1) {
            const time = beatTime[i]
            const top4 = fftMap[i]
            let type = null
            if (top4[0].frequency <= quartiles[0]) {
                type = "left"
            } else if (top4[0].frequency <= quartiles[1]) {
                type = "middle-left"
            } else if (top4[0].frequency <= quartiles[2]) {
                type = "middle-right"
            } else {
                type = "right"
            } 
            beatmap.push({
                time: time, 
                type: type
            })
        }
        return beatmap
    }
    const analyzeAudio = (buffer) => {
        const audioData = getAudioData(buffer)
        const startIndex = getAudioStartIndex(audioData)
        const startTime = startIndex / buffer.sampleRate
        const bpm = getBPM(audioData)
        const beatTime = getBeatTime(audioData, buffer, startIndex, bpm)
        const fftMap= getFFTMap(audioData, buffer, startIndex, bpm) 
        const beatmap = getBeatmap(fftMap, beatTime)
        res.json({
            bpm: bpm,
            startTime: startTime,
            // beatTime: beatTime,
            beatmap: beatmap
        })
    }
})
 
app.listen(5000, () => {console.log("server running on port 5000")})