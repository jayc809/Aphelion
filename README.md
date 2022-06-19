# visit https://jayc809-aphelion.com/ for the game


## setting up locally (run server on heroku, no controll server-side)

### frontend 
1. make new terminal
2. `cd frontend`
3. `npm install` 
4. `npm run build`

### backend
1. make new terminal
2. `npm install`
3. `npm run dev`

### visit http://localhost:3000


## setting up locally (run server on localhost, full controll)

### frontend
1. go to `AnalyzerView.js` in `frontend` and change `const socket = socketIOClient("https://jayc809-aphelion.com")` to `const socket = socketIOClient("http://localhost:5000")`
2. add `http://localhost:5000` in front of every `fetch` in `frontend` 
3. make new terminal
4. `cd frontend`
5. `npm install`
6. `npm run build`

### backend
1. make new terminal
2. `npm install`
3. `npm run dev`

### visit http://localhost:5000
