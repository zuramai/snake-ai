import Matrix from "../utils/Matrix"

export default class NeuralNet {
    iNodes: number
    hNodes: number
    oNodes: number
    hLayers: number

    weights: Matrix[] = [];

    constructor(input: number, hidden: number, output: number, hiddenLayers: number) {
        this.iNodes = input 
        this.hNodes = hidden 
        this.oNodes = output 
        this.hLayers = hiddenLayers

        this.weights = new Array(hiddenLayers+1)
        this.weights[0] = new Matrix(this.hNodes, this.iNodes+1)

        for(let i = 1; i < this.hLayers; i++) {
            this.weights[i] = new Matrix(this.hNodes, this.hNodes+1)
        }

        this.weights[this.weights.length-1] = new Matrix(this.oNodes, this.hNodes+1)

        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i].randomize()
        }
    }
    
    mutate(mr: number) {
        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i].mutate(mr)
        }
    }

    output(inputsArr: number[]) {
        // Create new matrix with size [24, 1]
        const inputs = Matrix.singleColumnMatrixFromArray(inputsArr) as Matrix

        // Add the 25th row as 1
        let currLayerWithBias = inputs.addBias()
        
        for(let i = 0; i < this.hLayers; i++) {
            const hidden_ip = this.weights[i].dot(currLayerWithBias) 
            const hidden_op = hidden_ip.activate()
            currLayerWithBias = hidden_op.addBias()
        }

        const output_ip = this.weights[this.weights.length - 1].dot(currLayerWithBias)
        const output = output_ip.activate()

        return output.toArray()
    }

    draw(ctx: CanvasRenderingContext2D, decision: number[], vision: number[]) {
        const arcSize = 15
        const marginY = 25
        const layerXs: number[][] = [[]]
        const layerYs: number[][] = [[]]
        // Draw input layer nodes
        for (let i = 0; i < this.iNodes; i++) {
            const x =  arcSize
            const y =  (arcSize) * i + (marginY * i) + 50
            ctx.beginPath();
            ctx.arc(x, y, arcSize, 0, Math.PI * 2)
            ctx.fillStyle = vision[i] > 0.0 ? '#25fa77' : "white"
            ctx.strokeStyle = vision[i] != 0 ? 'black' : "white"
            ctx.stroke()
            ctx.fill()
            ctx.closePath()
            layerXs[0].push(x)
            layerYs[0].push(y)
        }

        // Draw hidden layers nodes
        const gapHorizontal = 150
        for (let i = 0; i < this.hLayers; i++) {
            const layerX = []
            const layerY = []
            for (let j = 0; j < this.hNodes; j++) {
                const x = gapHorizontal * (i+1)
                const y = (arcSize) * j + (marginY * j) + 250
                layerX.push(x)
                layerY.push(y)
                ctx.beginPath();
                ctx.arc(x, y, arcSize, 0, Math.PI * 2)
                ctx.fillStyle = "white"
                ctx.strokeStyle = "black"
                ctx.stroke()
                ctx.fill()
                ctx.closePath()
            }
            layerXs.push(layerX)
            layerYs.push(layerY)
        }

        // Draw output layers nodes
        let max = 0
        let maxIndex = 0
        decision.forEach((d,i) => {
            if(d > max) {
                maxIndex = i
                max = d
            }
        })

        const layerX = []
        const layerY = []
        const outputLabels = ['Up', 'Down', 'Left', 'Right']
        for (let i = 0; i < this.oNodes; i++) {
            const x = gapHorizontal * (this.hLayers + 1) - arcSize
            const y = (arcSize) * i + (marginY * i) + 450 + arcSize
            ctx.beginPath();
            ctx.arc(x, y , arcSize, 0, Math.PI * 2)
            ctx.font = "16px Arial"
            ctx.fillStyle = maxIndex === i ? "#25fa77" : "white" 
            ctx.fillText(outputLabels[i], x + arcSize, y )
            ctx.strokeStyle = "black"
            ctx.stroke()
            ctx.fill()
            ctx.closePath()
            layerX.push(x)
            layerY.push(y)
        }
        layerXs.push(layerX)
        layerYs.push(layerY)

        // Draw lines
        for(let i = 0; i < layerXs.length-1; i++) {
            const layer1 = {x: layerXs[i], y: layerYs[i]}
            const layer2 = {x: layerXs[i+1], y: layerYs[i+1]}

            for(let j = 0; j < layer1.x.length; j++) {
                for(let k = 0; k < layer2.x.length; k++) {
                    ctx.beginPath()
                    ctx.strokeStyle = k % 2 === 1 ? '#fc6084' : '#6068fc'
                    ctx.lineWidth = 0.8
                    ctx.moveTo(layer1.x[j] + arcSize, layer1.y[j])
                    ctx.lineTo(layer2.x[k] - arcSize, layer2.y[k])
                    ctx.stroke()
                    ctx.closePath()
                }
            }
        }
    }

    crossover(partner: NeuralNet) {
        const child = new NeuralNet(this.iNodes, this.hNodes, this.oNodes, this.hLayers)
        for (let i = 0; i < this.weights.length; i++) {
            child.weights[i] = this.weights[i].crossover(partner.weights[i])
        }
        return child
    }

    clone() {
        const clone = new NeuralNet(this.iNodes,this.hNodes,this.oNodes,this.hLayers)
        for(let i = 0; i < this.weights.length; i++) {
            clone.weights[i] = this.weights[i].clone()
        }
        return clone
    }
    
    load(weights: Matrix[]) {
        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i] = weights[i]
        }
    }

    pull() {
        const model = this.weights
        return model
    }
}