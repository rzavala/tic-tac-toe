import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Square } from './components/Square'
import { TURNS } from './constants'
import { checkWinnerFrom, checkEndGame } from './logic/board'
import { WinnerModal } from './components/WinnerModal'
import { saveGameToStorage, resetGameStorage } from './logic/storage/index'
import './App.css'


function App() {
  console.log('render')
  //no podemos leer el local sotare y condicionar el estado inicial
  //los hooks sonn lo primero que reconoce react asi no podemos inmutarlo
  //lo que podemos ahcer es dentro del use state usar una funciona anomima
  //y que esta haga la evaluacion que necesitamos para saber si usaremos el localStorage
  //o el estado defaul inicial (vacio)
  const [board, setBoard] = useState(() => {
    console.log('inicializar el etado del board')
    //si sacamops este boardFromStorage del useState en cada render leera el localStorage y esto es LENTO
    const boardFromStorage = window.localStorage.getItem('board')

    if(boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)

    //check if is null or undefined using ternary operator
    //return boardFromStorage? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  /* useState(['x','x','x','o','o','x','x','o','o']) */

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })
  console.log(board)

  //null no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    resetGameStorage()
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

    //guardar aqui partida 
    saveGameToStorage({
      board : newBoard, 
      turn: newTurn
    })

    const newWinner = checkWinnerFrom(newBoard)
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
      <h1>tic tac toe AKA El Gato</h1>
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
      <WinnerModal winner={winner} resetGame={resetGame}/>
    </main>
  )
}

export default App
