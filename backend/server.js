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
        const filePath = path.resolve(__dirname, 'video.mkv')
        const video = ytdl(videoUrl, { filter: "audio" })

        //download the video
        let starttime
        video.pipe(fs.createWriteStream(filePath))
        video.once('response', () => {
            starttime = Date.now()
        })
        socket.emit("progress-update", "Downloading Video")
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
            if (checkADTSValidity(buffer)) {  
                const audioCtx = new webAudioApi.AudioContext()
                socket.emit("progress-update", "Decoding Audio Data")
                console.log("decoding audio data")
                audioCtx.decodeAudioData(buffer, analyzeAudio)
            } else {
                socket.emit("progress-update", "ERROR: Decoding Audio Data Failed")
            }
        })

        const analyzeAudio = (buffer) => {
            socket.emit("progress-update", "Generating Beatmap")
            console.log("calculating BPM")
            const audioData = getAudioData(buffer)
            const startIndex = getAudioStartIndex(audioData, buffer)
            const startTime = startIndex / buffer.sampleRate
            const bpm = getBPM(audioData)

            console.log("analyzing audio using FFT")
            const beatTime = getBeatTime(audioData, buffer, startIndex, bpm)
            const fftMap= getFFTMap(audioData, buffer, startIndex, bpm) 

            console.log("generating beatmap")
            const response = getBeatmap(fftMap, beatTime, bpm)
            const beatmap = response[0]
            const maxCombo = response[1]

            const beatmapObj = {
                videoUrl: videoUrl,
                bpm: bpm,
                startTime: startTime,
                totalTime: audioData.length / buffer.sampleRate,
                beatmap: beatmap,
                maxCombo: maxCombo
            }

            socket.emit("progress-update", "Process Completed")
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

app.get("/getAudio", (req, res) => {
    const filePath = path.resolve(__dirname, 'test.mkv')
    const video = ytdl(req.query.videoUrl, { filter: "audio"})

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
        if (checkADTSValidity(buffer)) {  
            const audioCtx = new webAudioApi.AudioContext()
            console.log("decoding audio data")
            audioCtx.decodeAudioData(buffer, analyzeAudio, (e) => {console.log(e)})
        } else {
            res.json({ res: "bad" })
        }
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
        const response = getBeatmap(fftMap, beatTime, bpm)
        const beatmap = response[0]
        const maxCombo = response[1]
        const beatmapObj = {
            beatmap: beatmap
        }
        console.log("process completed")
        res.json(beatmapObj)
    }
})

app.get("/getBeatmap", (req, res) => {

    const filePath = path.resolve(__dirname, 'video.mp3')
    const video = ytdl(req.query.videoUrl, {filter: "audio"})

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
        audioCtx.decodeAudioData(buffer, analyzeAudio, (e) => {console.log(e)})
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
        const response = getBeatmap(fftMap, beatTime, bpm)
        const beatmap = response[0]
        const maxCombo = response[1]
        const beatmapObj = {
            beatmap: beatmap
        }
        console.log("process completed")
        res.json(beatmapObj)
    }
})

const checkADTSValidity = (buffer) => {
    const temp = new Uint8Array(buffer)
    if (temp[0] == 0 && temp[1] == 0 && temp[2] == 0) {
        return true
    } else {
        return false
    }
}
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
        frequenciesSorted[parseInt(frequenciesSorted.length * 0.75)],
        frequenciesSorted[frequenciesSorted.length - 1]
    ]
    
    let maxCombo = 0
    const beatmap = []
    for (let i = 0; i < fftMap.length; i += 1) {
        const top4 = fftMap[i].meta
        let leftPresent = false
        let middleLeftPresent = false
        let middleRightPresent = false
        let rightPresent = false
        for (let j = 0; j < 4; j += 1) {
            const fft = top4[j]
            if (fft.frequency <= quartiles[0] && (fft.magnitude > 1)) {
                leftPresent = true
            } else if (fft.frequency <= quartiles[1] && (fft.magnitude > 1)) {
                middleLeftPresent = true
            } else if (fft.frequency <= quartiles[2] && (fft.magnitude > 1)) {
                middleRightPresent = true
            } else if (fft.frequency <= quartiles[3] && (fft.magnitude > 1)) {
                rightPresent = true
            } 
        }
        const tiles = []
        if (leftPresent) {
            tiles.push({
                targetTime: fftMap[i].time,
                class: "tap",
                type: "left",
                id: i * 4
            })
        }
        if (middleLeftPresent) {
            tiles.push({
                targetTime: fftMap[i].time, 
                class: "tap",
                type: "middle-left",
                id: (i * 4) + 1
            })
        }
        if (middleRightPresent) {
            tiles.push({
                targetTime: fftMap[i].time,
                class: "tap",
                type: "middle-right",
                id: (i * 4) + 2
            })
        }
        if (rightPresent) {
            tiles.push({
                targetTime: fftMap[i].time,
                class: "tap",
                type: "right",
                id: (i * 4) + 3
            })
        }
        beatmap.push({
            time: fftMap[i].time,
            tiles: tiles
        })
        maxCombo += tiles.length
    }
    let leftChain = []
    let leftPrevIndex = [0]
    let middleLeftChain = []
    let middleLeftPrevIndex = [0]
    let middleRightChain = []
    let middleRightPrevIndex = [0]
    let rightChain = [0]
    let rightPrevIndex = [0]
    
    const tranformHoldTiles = (tile, beat, chain, prevIndex, limit) => {
        if (beat == prevIndex[0] + 1) {
            chain.push(tile)
            if (chain.length == limit) {
                chain[0].class = "hold"
                chain[0].elapseBeatCount = chain.length - 1
                chain[0].elapseTime = 60 / bpm * (chain.length - 1)
                for (let k = 1; k < chain.length; k += 1) {
                    chain[k].class = "blank"
                }
                chain.length = 0
                maxCombo -= 1
            }
        } else if (beat > prevIndex[0] + 1) {
            if (chain.length >= 4 && chain.length <= limit) {
                chain[0].class = "hold"
                chain[0].elapseBeatCount = chain.length
                chain[0].elapseTime = 60 / bpm * chain.length
                for (let k = 1; k < chain.length; k += 1) {
                    chain[k].class = "blank"
                }
            }
            chain.length = 0
            chain.push(tile)
        }
        prevIndex[0] = beat
    }

    for (let i = 0; i < beatmap.length; i += 1) {
        const tiles = beatmap[i].tiles
        for (let j = 0; j < tiles.length; j += 1) {
            const tile = tiles[j]
            if (tile.type == "left") {
                tranformHoldTiles(tile, i, leftChain, leftPrevIndex, 8)
            } 
            // else if (tile.type == "middle-left") {
            //     // tranformHoldTiles(tile, i, middleLeftChain, middleLeftPrevIndex, 4)
            // } else if (tile.type == "middle-right") {
            //     // tranformHoldTiles(tile, i, middleRightChain, middleRightPrevIndex, 4)
            // } 
            else if (tile.type == "right") {
                tranformHoldTiles(tile, i, rightChain, rightPrevIndex, 8)
            }
        }
    }
    
    beatmap.forEach((meta) => {
        meta.tiles = meta.tiles.filter((tile) => {return tile.class != "blank"})
    })

    return [beatmap, maxCombo]
}

// const getBeatmap = (fftMap, beatTime, bpm) => {
//     const frequencies = []
//     for (let i = 0; i < fftMap.length; i += 1) {
//         for (let j = 0; j < fftMap[i].meta.length; j += 1) {
//             frequencies.push(fftMap[i].meta[j].frequency)
//         }
//     }
//     const frequenciesSorted = frequencies.sort((a, b) => a - b)
//     const quartiles = [
//         frequenciesSorted[parseInt(frequenciesSorted.length * 0.25)],
//         frequenciesSorted[parseInt(frequenciesSorted.length * 0.5)],
//         frequenciesSorted[parseInt(frequenciesSorted.length * 0.75)]
//     ]
//     const beatmap = []
//     for (let i = 0; i < fftMap.length; i += 1) {
//         const top4 = fftMap[i].meta
//         let type = null
//         if (top4[0].frequency <= quartiles[0]) {
//             type = "left"
//         } else if (top4[0].frequency <= quartiles[1]) {
//             type = "middle-left"
//         } else if (top4[0].frequency <= quartiles[2]) {
//             type = "middle-right"
//         } else {
//             type = "right"
//         } 
//         beatmap.push({
//             time: fftMap[i].time,
//             tiles: [
//                 {
//                     targetTime: fftMap[i].time,
//                     class: "tap",
//                     type: type,
//                     id: i + 1
//                 }
//             ]
//         })
//     }
//     return beatmap
// }