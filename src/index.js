import Game from './Game'
import './index.css'

const game = new Game()
game.start()

function animate(time) {
  game.render(time)
  requestAnimationFrame(animate)
}

animate()
