import { hover } from '@testing-library/user-event/dist/hover';
import * as React from 'react';
import styled from 'styled-components';
import { BoardState, useGameState, Value } from './gameState';


type LayoutProps = {
    gap: number,
}

const Row = styled.div<LayoutProps>`
    display: flex;
    flex-direction: row;
    gap: ${(props) => props.gap}px;
`;

const Column = styled.div<LayoutProps>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.gap}px;
`;



function Game() {
    const {
        gameState,
        current,
        nextPlayer,
        winner,
        handleClick,
        jumpTo,
    } = useGameState();

    return (
        <Row gap ={10}>
            <Column gap={10}>
                <div >
                    <h1 className='pulse'>
                    {
                    winner
                        ? `Победил игрок ${winner}`
                        : `Ходит игрок  ${nextPlayer ? '✘' : 'O'}`
                        
                }
                    </h1>
                </div>
                <Board board={current} onClick={handleClick}/>
            </Column>
            <Log history = {gameState.history} jumpTo={jumpTo}/>
        </Row>
    );
}

type SquareProps = {
    value: Value,
    onClick: () => void,
}

type BoardProps = {
    board: BoardState,
    onClick: (square: number) => void;
}

function Board({ board, onClick }: BoardProps) {
    const createProps = (square: number): SquareProps => {
        return {
            value: board[square],
            onClick: () => onClick(square),
        }
    };
    return (
        <Column gap={0}>
            <Row gap={0}>
                <Square {...createProps(0)}/>
                <Square {...createProps(1)}/>
                <Square {...createProps(2)}/>
            </Row>
            <Row gap={0}>
                <Square {...createProps(3)}/>
                <Square {...createProps(4)}/>
                <Square {...createProps(5)}/>
            </Row>
            <Row gap={0}>
                <Square {...createProps(6)}/>
                <Square {...createProps(7)}/>
                <Square {...createProps(8)}/>
            </Row>
        </Column>
    );
}

// Свой объект "игровой стилизованый квадратик" и назначение ему роли кнопки
const StyledSquare = styled.button`
    width: 96px;
    height: 96px;
    border: 6px solid;
    padding: 0;
    font-size: 72px;
    font-weight: bold;
    border-radius: 50% 20% / 10% 40%;
    background: #a232;
`;   


// 
function Square(props: SquareProps) {
    return (
        <StyledSquare onClick={props.onClick}>
        {props.value}
        </StyledSquare>
    );
}

type LogProps = {
    history: BoardState[],
    jumpTo: (step: number) => void,
}

function Log(props: LogProps) {
    return (
        <ol>
            {props.history.map((_, index) => {
                return (
                    <li>
                        <button className='raise' onClick={() => props.jumpTo(index)}>
                            {index === 0 ? 'Новая игра' : `Шаг ${index}`}
                        </button>
                    </li>
                );
            })}
        </ol>
    );
}

export default Game;