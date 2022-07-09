const express = require("express")
const fs = require('fs')
const path = require("path")
const readline = require('readline')
const ytdl = require('ytdl-core')
const webAudioApi = require("web-audio-api")
const MusicTempo = require("music-tempo")
const fft = require('fft-js').fft
const fftUtil = require('fft-js').util
const mongoose = require("mongoose") 
const cors = require('cors');

const port = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.static("./frontend/build"))
// app.use(express.static("./public"))

// app.get("/", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"))
//     // res.sendFile(path.resolve(__dirname, "./index.html"))
// })

app.get("/animation", (req, res) => {
    res.setHeader('Cache-Control', "public, max-age=7200")
    res.sendFile(path.resolve(__dirname, `./public/animations/${req.query.dirName}/${req.query.dirName}-${String(req.query.index).padStart(2, "0")}.png`))
})

app.get("/image", (req, res) => {
    res.setHeader('Cache-Control', "public, max-age=7200")
    res.sendFile(path.resolve(__dirname, `./public/images/${req.query.fileName}.png`))
})

//"mongodb+srv://user:chiehyin123@aphelion.rimg6.mongodb.net/?retryWrites=true&w=majority" //
mongoose.connect("mongodb+srv://user:chiehyin123@aphelion.rimg6.mongodb.net/?retryWrites=true&w=majority" //process.env.NODE_ENV == "production" ? process.env.DATABASE_URL : "mongodb+srv://user:chiehyin123@aphelion.rimg6.mongodb.net/?retryWrites=true&w=majority"
, {useNewUrlParser: true})
const db = mongoose.connection
const User = require("./models-mongo/user")
const HighScore = require("./models-mongo/highScore")
db.on("error", (err) => {console.log(err)})
db.once("open", () => {console.log("connected to mongoose")})
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.post("/register-user", async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        const user = User({
            _id: username,
            username: username,
            password: password
        })
        try {
            try {
                const exisitngUsers = await User.find({ username: username }).exec()
                if (exisitngUsers.length == 0) {
                    user.save()

                    const highScore = HighScore({
                        _id: username,
                        username: username,
                        highScores: {
                            "default": {
                                "score": 0,
                                "tier": "a"
                            }
                        }
                    })
                    await HighScore.replaceOne({ username: username }, highScore, { upsert: true }, (err, results) => {}).clone()
                    
                    res.status(201).send({
                        success: true,
                        message: "User Registered, Please Login"
                    })
                } else {
                    res.status(500).send({
                        success: false,
                        message: "User Already Exists"
                    })
                }
            } catch {
                res.status(500).send({
                    success: false,
                    message: "An Error Occured (code: 3)"
                })
            }
        } catch {
            res.status(500).send({
                success: false,
                message: "An Error Occured (code: 2)"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: "An Error Occured (code: 1)"
        })
    }
})

app.post("/login-user", async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        try {
            const exisitngUser = await User.findOne({ username: username }).exec()
            if (exisitngUser) {
                exisitngUser.comparePassword(password, (err, matches) => {
                    if (err) {
                        res.status(500).send({
                            success: false,
                            message: "An Error Occured (code: 4)"
                        })
                    } 
                    if (matches) {
                        res.status(201).send({
                            success: true,
                            message: `User ${username} Logged In`,
                            username: username
                        })
                    } else {
                        res.status(500).send({
                            success: false,
                            message: "Password Incorrect"
                        })
                    }
                })
            } else {
                res.status(500).send({
                    success: false,
                    message: "User Does Not Exist"
                })
            }
        } catch {
            res.status(500).send({
                success: false,
                message: "An Error Occured (code: 2)"
            })
        }
    } catch {
        res.status(500).send({
            success: false,
            message: "An Error Occured (code: 1)"
        })
    }
})

app.post("/get-high-scores-user", async (req, res) => {
    try {
        const username = req.body.username
        const highScoreObj = await HighScore.findOne({ username: username }).exec()
        res.status(201).send({
            success: true,
            highScoreObj: highScoreObj.highScores
        }) 
    } catch {
        res.status(500).send({
            success: false,
            highScoreObj: {}
        })
    }
})

app.post("/update-high-scores-user", async (req, res) => {
    try {
        const username = req.body.username
        const videoId = req.body.videoId
        const score = req.body.score
        const tier = req.body.tier
        const highScoreObj = await HighScore.findOne({ username: username }).exec()
        try {
            const temp = JSON.parse(JSON.stringify(highScoreObj))
            temp.highScores[videoId] = {
                score: score,
                tier: tier
            }
            await HighScore.replaceOne({ username: username }, temp, { upsert: true }, (err, results) => {}).clone()
        } catch {
            res.status(500).send({
                success: false,
                highScoreObj: {}
            })
        }
        res.status(201).send({
            success: true
        }) 
    } catch {
        res.status(500).send({
            success: false
        })
    }
})

const server = app.listen(port, (err) => {
    if (err) return console.log(err)
    console.log("app running on port: " + port)
})

const io = require("socket.io")(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"]
    }
  })
io.on("connect", socket => {
    console.log(`client ${socket.id} has connected`)
    socket.emit("connected-to-server", "connected to server")

    socket.on("request-beatmap", (requestObj) => {
        const filePath = path.resolve(__dirname, `video${socket.id}.mkv`)
        const videoUrl = requestObj.videoUrl
        const video = ytdl(videoUrl, { filter: "audio" })

        //download the video
        let starttime
        video.pipe(fs.createWriteStream(filePath))
        video.once('response', () => {
            starttime = Date.now()
        })
        socket.emit("progress-update", "Downloading Video")
        console.log("downloading video")
        
        //analyze audio
        video.on('end', () => {
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
            const [bpm, startIndex, startTime] = getBPM(audioData, buffer, requestObj.settingsObj.musicStartTime)

            console.log("analyzing audio using FFT")
            const fftMap = getFFTMap(audioData, buffer, startIndex, bpm) 

            console.log("generating beatmap")
            let beatmap
            let maxCombo
            switch (requestObj.settingsObj.difficulty) {
                case "Easy":
                    [beatmap, maxCombo] = getBeatmapEasy(fftMap, bpm, requestObj.settingsObj.tileSpeed)
                    break
                case "Medium": 
                    [beatmap, maxCombo] = getBeatmapMedium(fftMap, bpm, requestObj.settingsObj.tileSpeed)
                    break
                case "Hard":
                    [beatmap, maxCombo] = getBeatmapHard(fftMap, bpm, requestObj.settingsObj.tileSpeed)
                    break
                case "Extreme":
                    [beatmap, maxCombo] = getBeatmapExtreme(fftMap, bpm, requestObj.settingsObj.tileSpeed)
                    break
            }

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
            fs.unlink(filePath, () => {
                console.log("video deleted")
            })
        }
    })

    socket.on("disconnect", () => {
        const filePath = path.resolve(__dirname, `video${socket.id}.mkv`)
        fs.unlink(filePath, () => {
            console.log("video deleted")
        })
        console.log(`client ${socket.id} has disconnected\n\n`)
    })
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
const getBPM = (audioData, buffer, startTime) => {

    const mt = new MusicTempo(audioData)
    const bpm = parseFloat(mt.tempo)
    const beats = mt.beats
    beats.forEach((val, index) => {
        beats[index] = val - Math.round((1024 / buffer.sampleRate) * 100) / 100
    })

    let start = 0
    if (parseFloat(startTime) > 0) {
       start = parseInt(parseFloat(startTime) * buffer.sampleRate)
    }

    let pcmStartIndex = null
    for (let i = start; i < audioData.length; i += 1) {
        if (audioData[i] != 0) {
            pcmStartIndex = i
            break
        }
    }
    let fftStartIndex = null
    const sampleRate = 512
    for (let i = start; i < audioData.length; i += sampleRate) {
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
            fftStartIndex = i
            break
        }
    }

    if ((fftStartIndex == null && pcmStartIndex == null) || !beats) {
        return [bpm, 0, 0]
    }
    
    let bestStartIndex = null
    if (Math.abs(pcmStartIndex - fftStartIndex) < sampleRate) {
        bestStartIndex = pcmStartIndex
    } else {
        bestStartIndex = fftStartIndex
    }

    const bestStartTime = bestStartIndex / buffer.sampleRate
    let mtStartTime = null
    if (startTime > 0) {
        for (let i = 0; i < beats.length; i += 1) {
            if (beats[i] > startTime) {
                mtStartTime = beats[i]
                break
            }
        }
    } else {
        mtStartTime = beats[0]
    }
    if (bestStartTime > mtStartTime) {
        return [bpm, parseInt(mtStartTime * buffer.sampleRate), mtStartTime]
    } else {
        const toAdd = (mtStartTime - bestStartTime) % (60 / bpm)
        const nextStartTime = bestStartTime + toAdd
        const prevStartTime = nextStartTime - (60 / bpm)
        if (prevStartTime >= 0 && (Math.abs(prevStartTime - bestStartTime) < Math.abs(nextStartTime - bestStartTime))) {
            return [bpm, parseInt(prevStartTime * buffer.sampleRate), prevStartTime]
        } else {
            return [bpm, parseInt(nextStartTime * buffer.sampleRate), nextStartTime]
        }
    }

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
const getFFTMapHalf = (audioData, buffer, startIndex, bpm) => {
    const fftMap = []
    for (let sample = startIndex + parseInt(buffer.sampleRate * 30 / bpm); sample < audioData.length - 2048; sample += parseInt(buffer.sampleRate * 60 / bpm)) {
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
const getBeatmapEasy = (fftMap, bpm, tileSpeed) => {
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
        for (let j = 0; j < 2; j += 1) {
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

    const beatsPerTile = tileSpeed / (60 / bpm)
    const minimumDistance = Number.isInteger(beatsPerTile) ? parseInt(beatsPerTile) :  parseInt(beatsPerTile) + 1
    
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
            if (chain.length >= minimumDistance && chain.length <= limit) {
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

    let leftChain = []
    let leftPrevIndex = [-1]
    let rightChain = []
    let rightPrevIndex = [-1]
    for (let i = 0; i < beatmap.length; i += 1) {
        const tiles = beatmap[i].tiles
        for (let j = 0; j < tiles.length; j += 1) {
            const tile = tiles[j]
            if (tile.type == "left") {
                tranformHoldTiles(tile, i, leftChain, leftPrevIndex, 8)
            }
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
const getBeatmapMedium = (fftMap, bpm, tileSpeed) => {
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

    const beatsPerTile = tileSpeed / (60 / bpm)
    const minimumDistance = Number.isInteger(beatsPerTile) ? parseInt(beatsPerTile) :  parseInt(beatsPerTile) + 1
    
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
            if (chain.length >= minimumDistance && chain.length <= limit) {
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

    let leftChain = []
    let leftPrevIndex = [-1]
    let rightChain = []
    let rightPrevIndex = [-1]
    for (let i = 0; i < beatmap.length; i += 1) {
        const tiles = beatmap[i].tiles
        for (let j = 0; j < tiles.length; j += 1) {
            const tile = tiles[j]
            if (tile.type == "left") {
                tranformHoldTiles(tile, i, leftChain, leftPrevIndex, 8)
            }
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
const getBeatmapHard = (fftMap, bpm, tileSpeed) => {
    const fftMapHalf = getFFTMapHalf(audioData, buffer, startIndex, bpm)
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

    const magnitudes = []
    for (let i = 0; i < fftMap.length; i += 1) {
        for (let j = 0; j < fftMap[i].meta.length; j += 1) {
            magnitudes.push(fftMap[i].meta[j].magnitude)
        }
    }
    const magnitudesSorted = magnitudes.sort((a, b) => a - b)
    let magnitudeCutOff
    if (bpm <= 100) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.35)]
    } else if (bpm <= 110) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.4)]
    } else if (bpm <= 120) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.45)]
    } else if (bpm <= 130) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.5)]
    } else if (bpm <= 140) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.55)]
    } else if (bpm <= 150) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.6)]
    } else if (bpm <= 160) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.65)]
    } else if (bpm <= 170) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.7)]
    } else if (bpm <= 180) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.75)]
    } else {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.8)]
    }
    
    let maxCombo = 0
    const beatmap = []
    for (let i = 0; i < fftMap.length; i += 1) {
        const top4 = fftMap[i].meta
        let leftPresent = false
        let middleLeftPresent = false
        let middleRightPresent = false
        let rightPresent = false
        let leftHalfPresent = false
        let rightHalfPresent = false
        for (let j = 0; j < 4; j += 1) {
            const fft = top4[j]
            if (fft.frequency <= quartiles[0] && (fft.magnitude > 1)) {
                leftPresent = true
            } else if (fft.frequency <= quartiles[1] && (fft.magnitude > 1)) {
                middleLeftPresent = true
                if (fftMapHalf[i].meta[j].magnitude >= magnitudeCutOff && fftMapHalf[i].meta[j].frequency <= quartiles[1]) {
                    leftHalfPresent = true
                }
            } else if (fft.frequency <= quartiles[2] && (fft.magnitude > 1)) {
                middleRightPresent = true
                if (fftMapHalf[i].meta[j].magnitude >= magnitudeCutOff && fftMapHalf[i].meta[j].frequency > quartiles[1]) {
                    rightHalfPresent = true
                }
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
                id: i * 8
            })
        }
        if (middleLeftPresent) {
            tiles.push({
                targetTime: fftMap[i].time, 
                class: "tap",
                type: "middle-left",
                id: (i * 8) + 1
            })
        }
        if (middleRightPresent) {
            tiles.push({
                targetTime: fftMap[i].time,
                class: "tap",
                type: "middle-right",
                id: (i * 8) + 2
            })
        }
        if (rightPresent) {
            tiles.push({
                targetTime: fftMap[i].time,
                class: "tap",
                type: "right",
                id: (i * 8) + 3
            })
        }
        if (leftHalfPresent) {
            tiles.push({
                targetTime: fftMapHalf[i].time,
                class: "half",
                type: "middle-left",
                id: (i * 8) + 4
            })
        }
        if (rightHalfPresent) {
            tiles.push({
                targetTime: fftMapHalf[i].time,
                class: "half",
                type: "middle-right",
                id: (i * 8) + 5
            })
        }
        beatmap.push({
            time: fftMap[i].time,
            tiles: tiles
        })
        maxCombo += tiles.length
    }

    const beatsPerTile = tileSpeed / (60 / bpm)
    const minimumDistance = Number.isInteger(beatsPerTile) ? parseInt(beatsPerTile) :  parseInt(beatsPerTile) + 1

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
            if (chain.length >= minimumDistance && chain.length <= limit) {
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

    let leftChain = []
    let leftPrevIndex = [-1]
    let rightChain = []
    let rightPrevIndex = [-1]
    for (let i = 0; i < beatmap.length; i += 1) {
        const tiles = beatmap[i].tiles
        for (let j = 0; j < tiles.length; j += 1) {
            const tile = tiles[j]
            if (tile.type == "left") {
                tranformHoldTiles(tile, i, leftChain, leftPrevIndex, 8)
            } 
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
const getBeatmapExtreme = (fftMap, bpm, tileSpeed) => {
    const fftMapHalf = getFFTMapHalf(audioData, buffer, startIndex, bpm)
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

    const magnitudes = []
    for (let i = 0; i < fftMap.length; i += 1) {
        for (let j = 0; j < fftMap[i].meta.length; j += 1) {
            magnitudes.push(fftMap[i].meta[j].magnitude)
        }
    }
    const magnitudesSorted = magnitudes.sort((a, b) => a - b)
    let magnitudeCutOff
    if (bpm <= 100) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.35)]
    } else if (bpm <= 110) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.4)]
    } else if (bpm <= 120) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.45)]
    } else if (bpm <= 130) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.5)]
    } else if (bpm <= 140) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.55)]
    } else if (bpm <= 150) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.6)]
    } else if (bpm <= 160) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.65)]
    } else if (bpm <= 170) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.7)]
    } else if (bpm <= 180) {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.75)]
    } else {
        magnitudeCutOff = magnitudesSorted[parseInt(magnitudesSorted.length * 0.8)]
    }
    
    let maxCombo = 0
    const beatmap = []
    for (let i = 0; i < fftMap.length; i += 1) {
        const top4 = fftMap[i].meta
        let leftPresent = false
        let middleLeftPresent = false
        let middleRightPresent = false
        let rightPresent = false
        let leftHalfPresent = false
        let rightHalfPresent = false
        let leftCirclePresent = false
        let rightCirclePresent = false
        for (let j = 0; j < 4; j += 1) {
            const fft = top4[j]
            if (fft.frequency <= quartiles[0] && (fft.magnitude > 1)) {
                leftPresent = true
                if (fft.magnitude >= magnitudeCutOff) {
                    leftCirclePresent = true
                }
            } else if (fft.frequency <= quartiles[1] && (fft.magnitude > 1)) {
                middleLeftPresent = true
                if (fftMapHalf[i].meta[j].magnitude >= magnitudeCutOff && fftMapHalf[i].meta[j].frequency <= quartiles[1]) {
                    leftHalfPresent = true
                }
                if (fft.magnitude >= magnitudeCutOff) {
                    leftCirclePresent = true
                }
            } else if (fft.frequency <= quartiles[2] && (fft.magnitude > 1)) {
                middleRightPresent = true
                if (fftMapHalf[i].meta[j].magnitude >= magnitudeCutOff && fftMapHalf[i].meta[j].frequency > quartiles[1]) {
                    rightHalfPresent = true
                }
                if (fft.magnitude >= magnitudeCutOff) {
                    rightCirclePresent = true
                }
            } else if (fft.frequency <= quartiles[3] && (fft.magnitude > 1)) {
                rightPresent = true
                if (fft.magnitude >= magnitudeCutOff) {
                    rightCirclePresent = true
                }
            } 

        }

        const tiles = []
        if (leftPresent) {
            tiles.push({
                targetTime: fftMap[i].time,
                class: "tap",
                type: "left",
                id: i * 8
            })
        }
        if (middleLeftPresent) {
            tiles.push({
                targetTime: fftMap[i].time, 
                class: "tap",
                type: "middle-left",
                id: (i * 8) + 1
            })
        }
        if (middleRightPresent) {
            tiles.push({
                targetTime: fftMap[i].time,
                class: "tap",
                type: "middle-right",
                id: (i * 8) + 2
            })
        }
        if (rightPresent) {
            tiles.push({
                targetTime: fftMap[i].time,
                class: "tap",
                type: "right",
                id: (i * 8) + 3
            })
        }
        if (leftHalfPresent) {
            tiles.push({
                targetTime: fftMapHalf[i].time,
                class: "half",
                type: "middle-left",
                id: (i * 8) + 4
            })
        }
        if (rightHalfPresent) {
            tiles.push({
                targetTime: fftMapHalf[i].time,
                class: "half",
                type: "middle-right",
                id: (i * 8) + 5
            })
        }
        if (leftCirclePresent) {
            tiles.push({
                targetTime: fftMap[i].time,
                class: "circle",
                type: "left-circle",
                id: (i * 8) + 6
            })
        }
        if (rightCirclePresent) {
            tiles.push({
                targetTime: fftMap[i].time,
                class: "circle",
                type: "right-circle",
                id: (i * 8) + 7
            })
        }
        beatmap.push({
            time: fftMap[i].time,
            tiles: tiles
        })
        maxCombo += tiles.length
    }

    const beatsPerTile = tileSpeed / (60 / bpm)
    const minimumDistance = Number.isInteger(beatsPerTile) ? parseInt(beatsPerTile) :  parseInt(beatsPerTile) + 1

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
            if (chain.length >= minimumDistance && chain.length <= limit) {
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

    let leftChain = []
    let leftPrevIndex = [-1]
    let rightChain = []
    let rightPrevIndex = [-1]
    for (let i = 0; i < beatmap.length; i += 1) {
        const tiles = beatmap[i].tiles
        for (let j = 0; j < tiles.length; j += 1) {
            const tile = tiles[j]
            if (tile.type == "left") {
                tranformHoldTiles(tile, i, leftChain, leftPrevIndex, 8)
            } 
            else if (tile.type == "right") {
                tranformHoldTiles(tile, i, rightChain, rightPrevIndex, 8)
            }
        }
    }

    const cleanCircleTiles = (tile, beat, prevIndex) => {
        if (beat < prevIndex[0] + minimumDistance - 1) {
            tile.class = "blank"
        }
        prevIndex[0] = beat
    }

    let leftCirclePrevIndex = [-100]
    let rightCirclePrevIndex = [-100]
    for (let i = 0; i < beatmap.length; i += 1) {
        const tiles = beatmap[i].tiles
        for (let j = 0; j < tiles.length; j += 1) {
            const tile = tiles[j]
            if (tile.type == "left-circle") {
                cleanCircleTiles(tile, i, leftCirclePrevIndex)
            } else if (tile.type == "right-circle") {
                cleanCircleTiles(tile, i, rightCirclePrevIndex)
            }
        }
    }

    beatmap.forEach((meta) => {
        meta.tiles = meta.tiles.filter((tile) => {return tile.class != "blank"})
    })

    return [beatmap, maxCombo]
}



