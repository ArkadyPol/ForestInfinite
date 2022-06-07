import Game from './Game'
import './index.css'
import loadAssets from './utils/loadAssets'

const urls = {
  house: 'assets/models/house.gltf',
  arrow: 'assets/models/arrow.gltf',
  character: 'assets/models/character.gltf',
}

const { models, animations, manager } = loadAssets(urls)

manager.onLoad = () => {
  const game = new Game(models, animations)
  game.start()

  function animate(time: number) {
    game.render(time)
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}
