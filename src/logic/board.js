import { WINNER_COMBOS } from "../constants"

export const checkWinnerFrom = (boardToCheck) => {
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


  export const checkEndGame = (newBoard) => {
    //revisar si hay empate, si no hay mas espacios vacios en el tablero
    return newBoard.every((square) => square !== null)
  }