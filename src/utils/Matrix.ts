import { randomGaussian, randomNumberBetween } from ".";

export type Grid = number[][]; 

export default class Matrix {
    rows: number 
    cols: number
    matrix: Grid

    constructor(row: number, col: number, matrix?: Grid) {
        this.rows = row 
        this.cols = col
        this.matrix = matrix ? matrix : (() => {
            return new Array(row).fill(undefined).map(() => new Array(col))
        })()
    }

    static fromGrid(matrix: Grid) {
        return new Matrix(matrix.length, matrix[0].length, matrix);
    }

    output() {
        this.matrix.forEach(row => {
            row.forEach(col => {
                console.log(col + " ")
            })
            console.log("\n")
        })
        console.log("\n")
    }

    dot(m: Matrix): Matrix {
        const newMatrix = new Matrix(this.rows, m.cols)

        if(this.cols === m.rows) {
            for(let i = 0; i < this.rows; i++) {
                for(let j = 0; j < m.cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < this.cols; k++) {
                        sum += this.matrix[i][k] * (m.matrix[k][j])
                    }
                    newMatrix.matrix[i][j] = sum
                }
            }
        }
        return newMatrix
    }

    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                (this.matrix as Grid)[i][j] = Math.random() * 2 - 1
            }
        }
    }

    static singleColumnMatrixFromArray(arr: number[]) {
        const m = new Matrix(arr.length, 1)
        m.matrix = []
        arr.forEach((num) => {
            m.matrix.push([num]);
        })
        return m 
    }

    toArray() {
        let arr = []

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                arr.push(this.matrix[i][j])
            }
        }

        return arr 
    }

    addBias(): Matrix {
        const m = new Matrix(this.rows + 1, 1, [])

        for(let i = 0; i < this.rows; i++) {
            m.matrix.push([this.matrix[i][0]]) 
        }
        // bias = 1
        m.matrix.push([1])  
        return m as Matrix
    }

    activate() {
        const m = new Matrix(this.rows, this.cols)

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.rows; j++) {
                m.matrix[i][j] = this.relu(this.matrix[i][j] as number)
            }
        }
        return m
    }

    relu(n: number) {
        return n <= 0 ? 0 : n
    }


    clone() {
        const m = new Matrix(this.rows, this.cols)

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                m.matrix[i][j] = this.matrix[i][j]
            }
        }
        return m
    }

    // void mutate(float mutationRate) {
    //     for(int i = 0; i < rows; i++) {
    //        for(int j = 0; j < cols; j++) {
    //           float rand = random(1);
    //           if(rand<mutationRate) {
    //              matrix[i][j] += randomGaussian()/5;
                 
    //              if(matrix[i][j] > 1) {
    //                 matrix[i][j] = 1;
    //              }
    //              if(matrix[i][j] <-1) {
    //                matrix[i][j] = -1;
    //              }
    //           }
    //        }
    //     }
    // }
     
    mutate(mutationRate: number) {
        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                const rand = randomNumberBetween(0, 1)
                if(rand < mutationRate) {
                    (this.matrix[i][j] as number) += randomGaussian(0,0)/5

                    if ((this.matrix[i][j] as number) > 1) {
                        (this.matrix[i][j] as number) = 1
                    }
                    if ((this.matrix[i][j] as number) < -1) {
                        (this.matrix[i][j] as number) = -1
                    }
                }
            }
        } 
    }

    crossover(partner: Matrix) {
        const child = new Matrix(this.rows,this.cols)

        const randC = Math.floor(randomNumberBetween(0, this.cols))
        const randR = Math.floor(randomNumberBetween(0, this.rows))

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                if((i < randR) || (i == randR && j <= randC)) {
                    child.matrix[i][j] = this.matrix[i][j] as number
                } else {
                    child.matrix[i][j] = partner.matrix[i][j]
                }
            }
        }
        return child
    }

}