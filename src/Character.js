import { AnimationMixer } from 'three'

class Character {
  animations = {}
  inMove = false
  target = null

  constructor(speed, gltfLoader, scene) {
    this.speed = speed
    this.load(gltfLoader, scene)
  }

  load(gltfLoader, scene) {
    const url = 'assets/models/character.gltf'
    gltfLoader.load(url, gltf => {
      const root = gltf.scene
      for (let clip of gltf.animations) {
        this.animations[clip.name] = clip
      }
      this.mesh = root.getObjectByName('Character')
      this.mesh.position.setY(-3)
      scene.add(this.mesh)
      this.mixer = new AnimationMixer(this.mesh)
      this.walk = this.mixer.clipAction(this.animations.Walk)
    })
  }

  update(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime)
    }
    if (this.inMove) {
      this.moveTo(deltaTime)
    }
  }

  startMove(point) {
    this.target = point
    const vector2D = this.calculateVector()
    const angle = Math.atan2(vector2D.y, vector2D.x) + Math.PI / 2
    this.mesh.rotation.z = angle
    this.inMove = true
    this.walk.play()
  }

  endMove() {
    this.target = null
    this.inMove = false
    this.walk.stop()
  }

  moveTo(deltaTime) {
    const vector2D = this.calculateVector()

    const distance = Math.sqrt(
      vector2D.x * vector2D.x + vector2D.y * vector2D.y
    )

    if (distance <= this.speed * deltaTime) {
      this.mesh.position.set(this.target.x, this.target.y, this.mesh.position.z)
      this.endMove()
      return
    }

    const framesCount = distance / this.speed / deltaTime

    const velocity3D = {
      x: vector2D.x / framesCount,
      y: vector2D.y / framesCount,
      z: 0,
    }

    this.mesh.position.add(velocity3D)
  }

  calculateVector() {
    return {
      x: this.target.x - this.mesh.position.x,
      y: this.target.y - this.mesh.position.y,
    }
  }
}

export default Character
