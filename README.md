## Visit https://jayc809-aphelion.herokuapp.com/ for the game

### setting up locally (run server on heroku, no controll server-side)

1. '''cd frontend''' -> `npm install` -> `npm run build`
2. '''cd ..''' -> `npm install` -> '''npm run dev''

### setting up locally (run server on localhost, full controll)

1. go to `AnalyzerView.js` in `frontend` and change `const socket = socketIOClient("https://jayc809-aphelion.herokuapp.com")` to `const socket = socketIOClient("http://localhost:5000/")`
2. '''cd frontend''' -> `npm install` -> `npm run build`
3. '''cd ..''' -> `npm install` -> '''npm run dev'''
