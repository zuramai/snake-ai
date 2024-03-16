export type Grid<T> = T[][]; 

export default class Matrix<T> {
    rows: number 
    cols: number
    matrix: Grid<T>

    constructor(row: number, col: number, matrix?: Grid<T>) {
        this.rows = row 
        this.cols = col
        this.matrix = matrix ? matrix : new Array(row).fill(new Array(col))
    }

    static fromGrid<T>(matrix: Grid<T>) {
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

    dot(m: Matrix<T>): Matrix<number> {
        const newMatrix = new Matrix<number>(this.rows, m.cols)

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                let sum = 0;
                for (let k = 0; k < this.cols; k++) {
                    sum += this.matrix[i][k] as number * (m.matrix[k][j] as number)
                }

                newMatrix.matrix[i][j] = sum
            }
        }

        return newMatrix
    }

    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.rows; j++) {
                (this.matrix as Grid<number>)[i][j] = Math.random() * 2 - 1
            }
        }
    }

    singleColumnMatrixFromArray(arr: number[]) {
        const m = new Matrix(arr.length, 1)

        for(let i = 0; i < arr.length; i++) {
            m.matrix[i][0] = arr[i];
        }

        return m 
    }

    toArray(): T[] {
        let arr: T[] = []

        for(let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.cols; j++) {
                arr.push(this.matrix[i][j])
            }
        }

        return arr 
    }

    addBias() {
        const m = new Matrix(this.rows + 1, 1)
        for(let i = 0; i < this.rows; i++) {
            m.matrix[i][0] = this.matrix[i][0]
        }
        m.matrix[this.rows][0] = 1  
        return m
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
            for(let j = 0; j < this.rows; j++) {
                m.matrix[i][j] = this.matrix[i][j]
            }
        }
        return m
    }
}