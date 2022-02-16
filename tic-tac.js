const mainGame = document.querySelector('.game')
const playB = document.querySelector('#start')
const playersScore = document.querySelectorAll('.score>span')
console.log(playersScore)
class Game {
    #playerTurn = 0;
    #score = {
            player1: 0,
        player2: 0,
        draw: 0
    }
    #field = [];
    #cells = [];
    #haveWiner = false
    #click = 0;
    constructor(dimension) {
        
        this.dimension = dimension;
       
    }
    
    #createGameField() {
        for (let i = 0; i < this.dimension; i++) {
        
            this.#field[i] = []
            
            for (let j = 0; j < this.dimension; j++) {
                this.#field[i][j] = ' ';
                const tmpDiv = document.createElement('div')                
                tmpDiv.className = 'cell'
                tmpDiv.dataset.row = i
                tmpDiv.dataset.col = j
                this.#cells.push(tmpDiv)
                mainGame.append(tmpDiv)                
            }
        }
    }
    #createWinBlock(player) {
        this.#haveWiner =true;
        const winBlock = document.createElement('div')
        winBlock.style.display = 'block'
        winBlock.className = 'win'
        winBlock.innerHTML = `${player}`
        mainGame.append(winBlock)
        setTimeout(() => { winBlock.classList.toggle('vis') }, 500)
        setTimeout(() => { winBlock.classList.toggle('vis') }, 4000)
        setTimeout(() => { winBlock.style.display = 'none' },4000);
    }
    #checkOnWin = (x, y) => {
        const stateArray = [['X', 0], ['O', 0], [' ', 0]]
        const rowMap = new Map(stateArray)
        const colMap = new Map(stateArray)
        for (let i = 0; i < this.dimension; i++) {
            
            rowMap.set(this.#field[x][i], rowMap.get(this.#field[x][i]) + 1)
            colMap.set(this.#field[i][y], colMap.get(this.#field[i][y]) + 1)
            
        }
        if (rowMap.get(this.#field[x][y]) == this.dimension || colMap.get(this.#field[x][y]) == this.dimension)   
            return (this.#field[x][y] == 'X') ? 'X' : 'O' 
       

        if (x == y || ((x == this.dimension - 1 - y) && (y == this.dimension - 1 - x)))
        {
            const diagonalMapR = new Map(stateArray)
            const diagonalMapL = new Map(stateArray)
            for (let i = 0; i < this.dimension; i++) {
            
                diagonalMapL.set(this.#field[i][i], diagonalMapL.get(this.#field[i][i]) + 1)
                diagonalMapR.set(this.#field[i][this.dimension-1-i], diagonalMapR.get(this.#field[i][this.dimension-1-i]) + 1)
                
            }
            if (diagonalMapL.get(this.#field[x][y]) == this.dimension || diagonalMapR.get(this.#field[x][y]) == this.dimension)   
                return (this.#field[x][y] == 'X') ? 'X' : 'O'  
        }

        
        return 'n';
    }
    #addListenerOnField() {
        
        for (const el of this.#cells) {
            el.addEventListener('click', (e) => {
                
                if (e.target.childNodes.length === 0 && !this.#haveWiner) {
                    this.#click++;
                    const tmpSpan = document.createElement('span')
                    tmpSpan.className = 'span-mark'
                    if (this.#playerTurn == 0) {
                        tmpSpan.innerHTML = 'X'
                        this.#field[+e.target.dataset.row][+e.target.dataset.col] = 'X'
                        this.#playerTurn++;
                    }
                    else {
                        tmpSpan.innerHTML = 'O'
                        this.#field[+e.target.dataset.row][+e.target.dataset.col] = 'O'
                        this.#playerTurn--;
                    }
                    e.target.append(tmpSpan)
                    let whoWin;
                    if (this.#click >= this.dimension * 2 - 1)
                        whoWin = this.#checkOnWin(+e.target.dataset.row, +e.target.dataset.col)      
                    if (whoWin == 'X') {
                        this.#score.player1++
                        
                        this.#createWinBlock('Игрок 1 победил')
                        this.#setScore('X')
                        
                    }
                    else if (whoWin == 'O') {
                        this.#score.player2++;
                        this.#createWinBlock('Игрок 2 победил')
                        this.#setScore('O')
                    }
                    else if (this.#click == Math.pow(this.dimension, 2)) {
                        this.#score.draw++;
                        this.#setScore('N')
                        this.#createWinBlock('Ничья')
                        
                    }
                    
                }
            })
        }
        playB.addEventListener('click', (e) => {
            
            this.#stopGame();
            
            this.#haveWiner = false;
        })
    }
    #stopGame() {
        for (let i = 0; i < this.dimension; i++) {
                          
            for (let j = 0; j < this.dimension; j++) {
                this.#field[i][j] = ' ';
            }
        }
        this.#cells.forEach(el => {
            if (el.firstChild != undefined)
                el.firstChild.remove()
        })
        this.#click = 0;
        
    }
    #setScore(winer) {
        switch (winer) {
            case 'X':
                playersScore[0].innerHTML = ` ${this.#score.player1}`
                break;
            case 'O':
                playersScore[1].innerHTML = ` ${this.#score.player2}`
                break;
            case 'N':
                playersScore[2].innerHTML = ` ${this.#score.draw}`
                break
            default:
                break;
        }
    }
    play() {
        this.#createGameField()
        this.#addListenerOnField()
    }
}


const game = new Game(3) // other values ​​do not work yet


game.play()

