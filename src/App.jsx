import { useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'

const TURNS = {
  X: 'x',
  O: 'o'
}



const Square = ({children, isSelected, updateBoard, index}) => {
  const className  = `square ${isSelected ? 'is-selected' : ''}`

  const handleClick = () => {
    updateBoard(index)
  }

  return (
     <div onClick={handleClick} className={className}>
      {children}
     </div>
  )
}

const WINNER_COMBOS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  /* useState(['x','x','x','o','o','x','x','o','o']) */

  const [turn, setTurn] = useState(TURNS.X)
  console.log(board)

  //null no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)

  const checkWinner = (boardToCheck) => {
    for(const combo of WINNER_COMBOS){
      const [a, b, c] = combo

      /* en la primer iteracion seria 0 --> x u o si es null ya no cumple y sale
        despues se revisa si el valor del primera posicion del combo es igual al segundo
        y por ultimo si la primera posicion es igual al tercero
      */
      if(
        boardToCheck[a] && 
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a] // devolveria x u o
      }
    }

    // si no hay ganador
    return null
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {

    if(board[index]) return //no actualiza si ya tiene algo en la posicion
    //actualizar el tablero
    const newBoard = [... board]
    //spread y rest operator es fundamental aprenderlo
    /*
      esta mal modificar directamente el board por eso se hace un 
      nuevo array con los elementos de board y conn ese se actualiza el estado
      es por que las props son inmutables 
      structuredClone() crea una copia profunda del array, en este caso no es necesario
      y esta bien con el spread operator que hace una copia superficial
      los estados son inmutables, es decir de en lugar de modificar directamente board
      board[index] = turn
      podrias ocasionar problemas en el renderizado
     */
    newBoard[index] = turn
    setBoard(newBoard)
    //cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    const newWinner = checkWinner(newBoard)
    if(newWinner) {
      confetti()
      setWinner(newWinner)
      //este alert aparece antes de que se marque la tercecr casilla 
      //por que la actualizacion del estado es asincrona 
      //alert(`El ganarador es ${newWinner}`)
    } else if(checkEndGame(newBoard)) {
      setWinner(false) //empate
    }

  }

  return (
    <main className='board'>
      <h1>tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
                >
                  {square}
              </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>
      {
        winner !== null && (
          <section className='winner'>
            <div className='text'>
              <h2>
                {
                  winner === false ? 'Empate' : 'Gano:'
                }
              </h2>

              <header className='win'>
                {winner && <Square>{winner}</Square>}
              </header>

              <footer>
                <button onClick={resetGame}>Empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )
      }
    </main>
  )
}

export default App
