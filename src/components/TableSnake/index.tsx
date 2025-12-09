"use client";
import styles from "./styles.module.css";
import { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
];
const INITIAL_FOOD = { x: 5, y: 5 };
const INITIAL_DIRECTION = "right";
const GAME_SPEED = 150;

export default function TableSnake() {
    const [food, setFood] = useState(INITIAL_FOOD);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [isRunning, setIsRunning] = useState(false);

    const generateFood = useCallback(() => {
        let newFood: { x: number; y: number };
        while (true) {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            };
            // Check if food is on snake
            const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
            if (!isOnSnake) break;
        }
        setFood(newFood);
    }, [snake]);

    const moveSnake = useCallback(() => {
        if (gameOver || !isRunning) return;

        setSnake((prevSnake) => {
            const head = prevSnake[0];
            const newHead = { ...head };

            switch (direction) {
                case "up":
                    newHead.y -= 1;
                    break;
                case "down":
                    newHead.y += 1;
                    break;
                case "left":
                    newHead.x -= 1;
                    break;
                case "right":
                    newHead.x += 1;
                    break;
            }

            // Check collision with walls
            if (
                newHead.x < 0 ||
                newHead.x >= GRID_SIZE ||
                newHead.y < 0 ||
                newHead.y >= GRID_SIZE
            ) {
                setGameOver(true);
                setIsRunning(false);
                return prevSnake;
            }

            // Check collision with self
            if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
                setGameOver(true);
                setIsRunning(false);
                return prevSnake;
            }

            const newSnake = [newHead, ...prevSnake];

            // Check collision with food
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore((prev) => prev + 1);
                generateFood();
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [direction, food, gameOver, isRunning, generateFood]);

    useEffect(() => {
        const interval = setInterval(moveSnake, GAME_SPEED);
        return () => clearInterval(interval);
    }, [moveSnake]);

    // Handle key press for controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowUp":
                    if (direction !== "down") setDirection("up");
                    break;
                case "ArrowDown":
                    if (direction !== "up") setDirection("down");
                    break;
                case "ArrowLeft":
                    if (direction !== "right") setDirection("left");
                    break;
                case "ArrowRight":
                    if (direction !== "left") setDirection("right");
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [direction]);

    const handleStart = () => {
        if (!gameOver) setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setSnake(INITIAL_SNAKE);
        setFood(INITIAL_FOOD);
        setDirection(INITIAL_DIRECTION);
        setGameOver(false);
        setScore(0);
        setIsRunning(false);
    };

    // Render the grid
    const renderGrid = () => {
        const grid = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            const row = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                let className = "";
                const isSnake = snake.some((s) => s.x === x && s.y === y);
                const isFood = food.x === x && food.y === y;

                if (isSnake) className = styles.snake;
                if (isFood) className = styles.food;
                if (gameOver && isSnake) className = styles.gameOver;

                row.push(<td key={`${x}-${y}`} className={className}></td>);
            }
            grid.push(<tr key={y}>{row}</tr>);
        }
        return grid;
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <button onClick={handleStart} disabled={isRunning || gameOver}>Start</button>
                <button onClick={handlePause} disabled={!isRunning}>Pause</button>
                <button onClick={handleReset}>Reset</button>
            </div>
            <div className={styles.score}>
                Score: {score}
            </div>
            {gameOver && <div className={styles.message}>Game Over!</div>}
            <table className={styles.table}>
                <tbody>{renderGrid()}</tbody>
            </table>

            <div className={styles.controlsMobile}>
                <button onClick={() => direction !== "down" && setDirection("up")}>Up</button>
                <div>
                    <button onClick={() => direction !== "right" && setDirection("left")}>Left</button>
                    <button onClick={() => direction !== "left" && setDirection("right")}>Right</button>
                </div>
                <button onClick={() => direction !== "up" && setDirection("down")}>Down</button>
            </div>
        </div>
    );
}