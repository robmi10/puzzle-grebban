"use client"
import React, { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const GRID_SIZE = 5
const puzzleItem = [{ value: 1 }, { value: 2 },
{ value: 3 }, { value: 4 },
{ value: 5 }, { value: 6 },
{ value: 7 }, { value: 8 },
{ value: 9 }, { value: 10 },
{ value: 11 }, { value: 12 },
{ value: 13 }, { value: 14 },
{ value: false }]


interface PuzzleItem {
    value: number | boolean,
    x?: number,
    y?: number
}

interface props {
    puzzleList: PuzzleItem[],
    handlePosition: (index: number) => void
}

const Board = (props: props) => {
    const { puzzleList, handlePosition } = props
    if (!puzzleList) return false;
    return <>
        {
            puzzleList.map((column, i) => {
                return (
                    <div key={i} className='relative'>
                        <div onClick={() => {
                            handlePosition(i)
                        }} className={twMerge('border hover:bg-blue-600 transition-colors duration-200 absolute h-full w-full cursor-pointer bg-blue-400 rounded-xl flex justify-center items-center font-bold text-2xl',
                            !column.value && 'hidden'
                        )}>
                            {column.value}
                        </div>

                    </div>
                )
            })
        }
    </>
}

const Puzzle = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [puzzleList, setPuzzleList] = useState<PuzzleItem[]>(puzzleItem);

    const shuffleList = () => {
        let shuffleArray = [...puzzleList]
        shuffleArray.sort(() => Math.random() - 0.5)
        setPuzzleList(shuffleArray)
    }

    const handlePosition = (index: number) => {
        puzzleList.map((cell, index) => {
            const col = index % GRID_SIZE
            const row = Math.floor(index / GRID_SIZE)
            cell.x = col
            cell.y = row
        })

        let newPuzzleArr = [...puzzleList]
        const emptyCellIndex = newPuzzleArr.findIndex((cell) => !cell.value)
        const emptyCell = newPuzzleArr[emptyCellIndex]
        const currentCell = newPuzzleArr[index]

        const isSameXposition = emptyCell.x === currentCell.x
        const isSameYposition = emptyCell.y === currentCell.y

        const isTheEmptyCellBesideOurCurrentCell = currentCell.x && emptyCell.x && currentCell.y && emptyCell.y && (isSameYposition ? Math.abs(currentCell.x - emptyCell.x) === 1 : Math.abs(currentCell.y - emptyCell.y) === 1)
        const isTheEmptyInTheSameXOrY = isSameYposition || isSameXposition

        if (!isTheEmptyCellBesideOurCurrentCell && isTheEmptyInTheSameXOrY) {
            const checkAllCellsInBetween = isSameYposition ? newPuzzleArr.filter((cell) => cell.y === currentCell.y) : newPuzzleArr.filter((cell) => cell.x === currentCell.x)

            const emptyCellIndex = checkAllCellsInBetween.indexOf(emptyCell)
            const currentCellIndex = checkAllCellsInBetween.indexOf(currentCell)

            const isEmptyCellBigger = emptyCellIndex > currentCellIndex
            const inRangeArray = isEmptyCellBigger ? checkAllCellsInBetween.slice(currentCellIndex, emptyCellIndex + 1) : checkAllCellsInBetween.slice(emptyCellIndex, currentCellIndex + 1)

            if (!isEmptyCellBigger) {
                for (let i = 0; i < inRangeArray.length - 1; i++) {
                    inRangeArray[i].value = inRangeArray[i + 1]?.value;
                }
                inRangeArray[inRangeArray.length - 1].value = false

            } else if (isEmptyCellBigger) {
                for (let i = inRangeArray.length - 1; i > 0; i--) {
                    inRangeArray[i].value = inRangeArray[i - 1]?.value;
                }
                inRangeArray[0].value = false
            }

        } else if (isTheEmptyCellBesideOurCurrentCell && isTheEmptyInTheSameXOrY) {
            [newPuzzleArr[index], newPuzzleArr[emptyCellIndex]] = [newPuzzleArr[emptyCellIndex], newPuzzleArr[index]]
        }
        setPuzzleList(newPuzzleArr)
    }


    return (
        <div className='w-full h-full flex justify-center items-center flex-col space-y-12'>
            <div ref={containerRef} className='w-full h-2/4 border border-black rounded-md md:w-2/4 md:h-2/4 grid grid-cols-5'>
                <Board puzzleList={puzzleList} handlePosition={handlePosition} />
            </div >
            <button className='border border-black h-12 w-24 md:w-56 md:h-24 rounded-full hover:bg-gray-800 transition-colors duration-200 ease-in-out bg-gray-600 text-white md:text-2xl' onClick={() => { shuffleList() }}>Slumpa</button>
        </div>
    )
}

export default Puzzle

