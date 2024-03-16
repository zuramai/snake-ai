import Game from './Game'
import './style.css'


let game: Game 

const canvas = document.getElementById('canvas') as HTMLCanvasElement

const setup = () => {
  game = new Game(2000, canvas)
  game.render()
}

setup()