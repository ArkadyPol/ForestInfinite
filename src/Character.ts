import * as THREE from 'three'

class Character {
  animations = {} as { [key: string]: THREE.AnimationClip }
  camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100)
  inMove = false
  target = null as THREE.Vector3 | null
  speed: number
  container: THREE.Group
  mesh: THREE.Object3D
  mixer: THREE.AnimationMixer
  cameraOptions: { radius: number; height: number }
  walk: THREE.AnimationAction

  constructor(
    speed: number,
    mesh: THREE.Object3D,
    animationClip: THREE.AnimationClip,
    cameraOptions = { radius: 9, height: 7 }
  ) {
    this.speed = speed
    this.container = new THREE.Group()
    this.mesh = mesh
    this.container.add(this.camera)
    this.container.add(this.mesh)
    this.cameraOptions = cameraOptions
    this.camera.position.set(0, -cameraOptions.radius, cameraOptions.height)
    this.camera.lookAt(this.mesh.position)
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
    this.mesh.rotation.z = vector2D.angle() + Math.PI / 2
    this.inMove = true
    this.walk.play()
  }

  endMove() {
    this.target = null
    this.inMove = false
    this.walk.stop()
  }

  moveTo(deltaTime: number) {
    const vector2D = this.calculateVector()
    if (!vector2D || !this.target) return

    if (vector2D.length() <= this.speed * deltaTime) {
      this.container.position.set(this.target.x, this.target.y, 0)
      this.endMove()
      return
    }

    const velocity2D = vector2D
      .normalize()
      .multiplyScalar(this.speed * deltaTime)
    const velocity3D = new THREE.Vector3(velocity2D.x, velocity2D.y, 0)

    this.container.position.add(velocity3D)
  }

  calculateVector() {
    if (!this.target) return
    return new THREE.Vector2(
      this.target.x - this.container.position.x,
      this.target.y - this.container.position.y
    )
  }

  static character: Character
}

export default Character
