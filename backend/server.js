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
            const beatmap = getBeatmap(fftMap, beatTime, bpm)
            const beatmapObj = {
                videoUrl: videoUrl,
                bpm: bpm,
                startTime: startTime,
                totalTime: audioData.length / buffer.sampleRate,
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
        const beatmap = getBeatmap(fftMap, beatTime, bpm)
        const beatmapObj = {
            beatmap: fftMap
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
    for (let i = 0; i < audioData.length; i += 1) {
        if (audioData[i] != 0) {
            pcmStartTime = i
            break
        }
    }

    let fftStartTime = null
    const sampleRate = 512
    for (let i = 0; i < audioData.length; i += sampleRate) {
        const interval = audioData.slice(i, i + sampleRate)
        const phasors= fft(interval)
        const frequencies = fftUtil.fftFreq(phasors, buffer.sampleRate)
        const magnitudes = fftUtil.fftMag(phasors)
        let meta = frequencies.map((f, i) => {
            return {frequency: f, magnitude: magnitudes[i]}
        })
        const metaSorted = meta.sort((a, b) => b.magnitude - a.magnitude)
        // console.log(metaSorted[0])
        if (metaSorted[0].magnitude > 1 && metaSorted[0].frequency < 10000) {
            fftStartTime = i
            break
        }
    }
    
    if (Math.abs(pcmStartTime - fftStartTime) < sampleRate) {
        return pcmStartTime
    } else {
        return fftStartTime
    }
}
const getBPM = (audioData) => {
    const mt = new MusicTempo(audioData)
    return parseFloat(mt.tempo)
} 
const getBeatTime = (audioData, buffer, startIndex, bpm) => {
    const beats = []
    for (let sample = startIndex; sample < audioData.length - 2048; sample += parseInt(buffer.sampleRate * 60 / bpm)) {
        beats.push(sample / buffer.sampleRate)
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
        fftMap.push({time: sample / buffer.sampleRate, meta: metaSorted.slice(0, 4)})
    }
    return fftMap 
}
// const getBeatmap = (fftMap, beatTime, bpm) => {
//     const frequencies = []
//     for (let i = 0; i < fftMap.length; i += 1) {
//         for (let j = 0; j < fftMap[i].length; j += 1) {
//             frequencies.push(fftMap[i][j].frequency)
//         }
//     }
//     const frequenciesSorted = frequencies.sort((a, b) => a - b)
//     const quartiles = [
//         frequenciesSorted[parseInt(frequenciesSorted.length * 0.25)],
//         frequenciesSorted[parseInt(frequenciesSorted.length * 0.5)],
//         frequenciesSorted[parseInt(frequenciesSorted.length * 0.75)]
//     ]
//     let beatmap = []
//     for (let i = 0; i < fftMap.length; i += 1) {
//         const top4 = fftMap[i]
//         let leftPresent = false
//         let middleLeftPresent = false
//         let middleRightPresent = false
//         let rightPresent = false
//         for (let j = 0; j < 4; j += 1) {
//             const fft = top4[j]
//             if (fft.frequency <= quartiles[0] && (fft.magnitude > 0.5 || i < 5)) {
//                 leftPresent = true
//             } else if (fft.frequency <= quartiles[1] && (fft.magnitude > 0.5 || i < 5)) {
//                 middleLeftPresent = true
//             } else if (fft.frequency <= quartiles[2] && (fft.magnitude > 0.5 || i < 5)) {
//                 middleRightPresent = true
//             } else if (fft.frequency <= quartiles[3] && (fft.magnitude > 0.5 || i < 5)) {
//                 rightPresent = true
//             } 
//         }
//         if (leftPresent) {
//             beatmap.push({
//                 beatNumber: i + 1, 
//                 class: "tap",
//                 type: "left",
//                 id: i * 4
//             })
//         }
//         if (middleLeftPresent) {
//             beatmap.push({
//                 beatNumber: i + 1, 
//                 class: "tap",
//                 type: "middle-left",
//                 id: (i * 4) + 1
//             })
//         }
//         if (middleRightPresent) {
//             beatmap.push({
//                 beatNumber: i + 1, 
//                 class: "tap",
//                 type: "middle-right",
//                 id: (i * 4) + 2
//             })
//         }
//         if (rightPresent) {
//             beatmap.push({
//                 beatNumber: i + 1, 
//                 class: "tap",
//                 type: "right",
//                 id: (i * 4) + 3
//             })
//         }
//     }
//     let currBeatmapIndex = 0
//     let leftChain = []
//     let prevBeatNumberLeft = 0
//     let middleLeftChain = 0
//     let middleRightChain = 0
//     let rightChain = 0

//     for (let i = 0; i < beatmap.length; i += 1) {
//         const tile = beatmap[i]
//         if (tile.type == "left") {
//             if (tile.beatNumber == prevBeatNumberLeft + 1) {
//                 leftChain.push(tile)
//                 if (leftChain.length == 8) {
//                     leftChain[0].class = "hold"
//                     leftChain[0].elapsedBeat = leftChain.length
//                     leftChain[0].elapsedTime = 60 / bpm * leftChain.length
//                     for (let j = 1; j < leftChain.length; j += 1) {
//                         leftChain[j].class = "blank"
//                     }
//                     leftChain = []
//                 }
//             } else if (tile.beatNumber > prevBeatNumberLeft + 1) {
//                 if (leftChain.length >= 4 && leftChain.length <= 8) {
//                     leftChain[0].class = "hold"
//                     leftChain[0].elapsedBeat = leftChain.length
//                     leftChain[0].elapsedTime = 60 / bpm * leftChain.length
//                     for (let j = 1; j < leftChain.length; j += 1) {
//                         leftChain[j].class = "blank"
//                     }
//                 }
//                 leftChain = []
//             } else {
//                 console.log("some weird shit happened")
//             }
//             prevBeatNumberLeft = tile.beatNumber
//         }
//         // else if (tile.type == "middle-left") {

//         // } else if (tile.type == "middle-right") {

//         // } else if (tile.type == "right") {

//         // }
//     }
//     beatmap = beatmap.filter((tile) => {return tile.class != "blank"})

//     return beatmap
// }

const getBeatmap = (fftMap, beatTime, bpm) => {
    const frequencies = []
    for (let i = 0; i < fftMap.length; i += 1) {
        for (let j = 0; j < fftMap[i].meta.length; j += 1) {
            frequencies.push(fftMap[i].meta[j].frequency)
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
        const top4 = fftMap[i].meta
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
            time: fftMap[i].time,
            tiles: [
                {
                    targetTime: fftMap[i].time,
                    class: "tap",
                    type: type,
                    id: i + 1
                }
            ]
        })
    }
    return beatmap
}