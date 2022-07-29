import { useState } from "react";

export type Value = '✘' | 'O' | null; // Значения нашего поля 

export type BoardState = Value[];
const createBoardState = () => Array<Value>(9).fill(null); // ЗанУлляем поле для начала (состояние поля). У нас 9 элементов по номерам

function calculateWinner(boardState: BoardState) { // Функция сравнения типа Value на доске с выигрышной комбинацией
    const winningCombinations = [ // Перечень выигрышных комбинций
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Сравнить три элемента поля по индексу с расположением каждой выигрышной комбинации
    for (let i = 0; i < winningCombinations.length; i++) { 
        const [a,b,c] = winningCombinations[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) { // Первая проверка - не является ли Value.null
            return boardState[a]; // Вернуть победителя (Х или О, null не вернётся)
        }
    }
    return null;
}

export type GameState = {  // Набор состояний игрового поля (история игры) и номер шага
    history: BoardState[],
    step: number,
}

export function useGameState() {
    const [gameState, setGameState] = useState<GameState>({
        history: [createBoardState()],
        step: 0,
    });

    const current = gameState.history[gameState.step];
    const nextPlayer = (gameState.step % 2) === 0;
    const winner = calculateWinner(current);

    function handleClick(square: number) {
        const history = gameState.history.slice(0,gameState.step + 1);
        const boardState = history[history.length - 1];
        if (calculateWinner(boardState) || boardState[square]) {
            return;
        }
        const newBoardState = boardState.slice();
        newBoardState[square] = (gameState.step % 2) === 0? '✘' : 'O';
        history.push(newBoardState);
        setGameState({
            history: history,
            step: history.length - 1,
        });
    }

    function jumpTo(step: number) {
        setGameState({
            history: gameState.history,
            step,
        });
    }

    return {  // Все необходимые параметры, которые собирает эта функция для игры
        gameState,    // Состояние поля
        current,      // Текущее состояние
        nextPlayer,   // Кто делает следующий ход? X or O
        winner,       // Есть ли победитель на этом шаге?
        handleClick,  // Обновить состояние игры с добавлением шага
        jumpTo,       // Вернуть игру в состояние на шаге 
    };
}