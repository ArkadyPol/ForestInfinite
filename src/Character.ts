import * as THREE from 'three'

class Character {
  animations = {} as { [key: string]: THREE.AnimationClip }
  inMove = false
  target = null as THREE.Vector3 | null
  speed: number
  mesh: THREE.Mesh
  mixer: THREE.AnimationMixer
  walk: THREE.AnimationAction

  constructor(
    speed: number,
    mesh: THREE.Mesh,
    animationClip: THREE.AnimationClip
  ) {
    this.speed = speed
    this.mesh = mesh
    this.mesh.position.setY(-3)
    this.mixer = new THREE.AnimationMixer(this.mesh)
    this.walk = this.mixer.clipAction(animationClip)
    Character.character = this
  }

  update(deltaTime: number) {
    this.mixer.update(deltaTime)
    if (this.inMove) {
      this.moveTo(deltaTime)
    }
  }

  startMove(point: THREE.Vector3) {
    this.target = point
    const vector2D = this.calculateVector()
    if (!vector2D) return
    const angle = Math.atan2(vector2D.y, vector2D.x) + Math.PI / 2
    this.mesh.rotation.z = angle
    this.inMove = true
    this.walk.play()
  }

  endMove() {
    this.target = null
    this.inMove = false
    if (this.walk) {
      this.walk.stop()
    }
  }

  moveTo(deltaTime: number) {
    const vector2D = this.calculateVector()
    if (!vector2D || !this.target) return
    const distance = Math.sqrt(
      vector2D.x * vector2D.x + vector2D.y * vector2D.y
    )

    if (distance <= this.speed * deltaTime) {
      this.mesh.position.set(this.target.x, this.target.y, this.mesh.position.z)
      this.endMove()
      return
    }

    const framesCount = distance / this.speed / deltaTime

    const velocity3D = new THREE.Vector3(
      vector2D.x / framesCount,
      vector2D.y / framesCount,
      0
    )

    this.mesh.position.add(velocity3D)
  }

  calculateVector() {
    if (!this.target) return
    return {
      x: this.target.x - this.mesh.position.x,
      y: this.target.y - this.mesh.position.y,
    }
  }

  static character: Character
}

export default Character
