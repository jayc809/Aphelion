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
const io = require("socket.io")(5000, {
    cors: {origin: ["http://localhost:3000"]}
})

io.on("connect", socket => {
    console.log(`client ${socket.id} has connected`)
    socket.emit("connected-to-server", "connected to server")

    socket.on("request-beatmap", (videoUrl) => {
        const filePath = path.resolve(__dirname, 'video.mp4')
        const video = ytdl(videoUrl)

        //download the video
        let starttime
        video.pipe(fs.createWriteStream(filePath))
        video.once('response', () => {
            starttime = Date.now()
        })
        socket.emit("progress-update", "downloading video")
        console.log("downloading video")
        video.on('progress', (chunkLength, downloaded, total) => {
            const percent = downloaded / total
            readline.cursorTo(process.stdout, 0)
            process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded`)
            process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`)
            readline.moveCursor(process.stdout, 0, -1)
        })

        //analyze audio
        video.on('end', () => {
            process.stdout.write('\n')
            const data = fs.readFileSync(filePath)
            const buffer = data.buffer
            const audioCtx = new webAudioApi.AudioContext()
            socket.emit("progress-update", "decoding audio data")
            console.log("decoding audio data")
            audioCtx.decodeAudioData(buffer, analyzeAudio)
        })

        const analyzeAudio = (buffer) => {
            socket.emit("progress-update", "generating beatmap")

            console.log("calculating BPM")
            const audioData = getAudioData(buffer)
            const startIndex = getAudioStartIndex(audioData, buffer)
            const startTime = startIndex / buffer.sampleRate
            const bpm = getBPM(audioData)

            console.log("analyzing audio using FFT")
            const beatTime = getBeatTime(audioData, buffer, startIndex, bpm)
            const fftMap= getFFTMap(audioData, buffer, startIndex, bpm) 

            console.log("generating beatmap")
            const beatmap = getBeatmap(fftMap, beatTime)
            const beatmapObj = {
                videoUrl: videoUrl,
                bpm: bpm,
                startTime: startTime,
                beatTime: beatTime,
                beatmap: beatmap
            }

            socket.emit("progress-update", "process completed")
            console.log("process completed")
            socket.emit("respond-beatmap", beatmapObj)
        }
    })

    socket.on("disconnect", () => {
        console.log(`client ${socket.id} has disconnected\n\n`)
    })
})


//tests
app.listen(4000, () => {console.log("server running on port 4000")})

app.get("/getBeatmap", (req, res) => {

    const filePath = path.resolve(__dirname, 'video.mp4')
    const video = ytdl(req.query.videoUrl)

    //download the video
    let starttime
    video.pipe(fs.createWriteStream(filePath))
    video.once('response', () => {
        starttime = Date.now()
    })

    console.log("downloading video")
    video.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total
        // const downloadedMinutes = (Date.now() - starttime) / 1000 / 60
        // const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes
        readline.cursorTo(process.stdout, 0)
        process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded`)
        process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`)
        readline.moveCursor(process.stdout, 0, -1)
    })

    //analyze audio
    video.on('end', () => {
        process.stdout.write('\n\n')
        const data = fs.readFileSync(filePath)
        const buffer = data.buffer
        const audioCtx = new webAudioApi.AudioContext()
        console.log("decoding audio data")
        audioCtx.decodeAudioData(buffer, analyzeAudio)
    })
    
    const analyzeAudio = (buffer) => {
        console.log("calculating BPM")
        const audioData = getAudioData(buffer)

        const startIndex = getAudioStartIndex(audioData, buffer)
        const startTime = startIndex / buffer.sampleRate
        const bpm = getBPM(audioData)

        console.log("analyzing audio using FFT")
        const beatTime = getBeatTime(audioData, buffer, startIndex, bpm)
        const fftMap= getFFTMap(audioData, buffer, startIndex, bpm) 

        console.log("generating beatmap")
        const beatmap = getBeatmap(fftMap, beatTime)
        const beatmapObj = {
            fftMap: fftMap
        }
        console.log("process completed")
        res.json(beatmapObj)
    }
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
const getAudioStartIndex = (audioData, buffer) => {
    let pcmStartTime = null
    for (let i = 0; i < audioData.length / 20; i += 1) {
        if (audioData[i] != 0) {
            pcmStartTime = i
            break
        }
    }

    let fftStartTime = null
    const sampleRate = 1024
    for (let i = 0; i < audioData.length / 20; i += sampleRate) {
        const interval = audioData.slice(i, i + sampleRate)
        const phasors= fft(interval)
        const frequencies = fftUtil.fftFreq(phasors, buffer.sampleRate)
        const magnitudes = fftUtil.fftMag(phasors)
        let meta = frequencies.map((f, i) => {
            return {frequency: f, magnitude: magnitudes[i]}
        })
        const metaSorted = meta.sort((a, b) => b.magnitude - a.magnitude)
        if (metaSorted[0].magnitude > 0.0001 && metaSorted[0].frequency < 10000) {
            fftStartTime = i
            break
        }
    }
    
    console.log(pcmStartTime - fftStartTime)
    if (Math.abs(pcmStartTime - fftStartTime) < sampleRate) {
        return fftStartTime
    } else {
        return pcmStartTime
    }
}
const getBPM = (audioData) => {
    const mt = new MusicTempo(audioData)
    return parseFloat(mt.tempo)
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
            beatNumber: i + 1, 
            type: type,
            state: 1,
            id: i + 1
        })
    }
    return beatmap
}
