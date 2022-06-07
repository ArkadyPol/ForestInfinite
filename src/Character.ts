import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class Character {
  animations = {} as { [key: string]: THREE.AnimationClip }
  inMove = false
  target = null as THREE.Vector3 | null
  mesh = null as THREE.Mesh | null
  mixer = null as THREE.AnimationMixer | null
  walk = null as THREE.AnimationAction | null
  speed: number

  constructor(speed: number, gltfLoader: GLTFLoader, scene: THREE.Scene) {
    this.speed = speed
    this.load(gltfLoader, scene)
  }

  load(gltfLoader: GLTFLoader, scene: THREE.Scene) {
    const url = 'assets/models/character.gltf'
    gltfLoader.load(url, gltf => {
      const root = gltf.scene
      for (let clip of gltf.animations) {
        this.animations[clip.name] = clip
      }
      this.mesh = root.getObjectByName('Character') as THREE.Mesh
      this.mesh.position.setY(-3)
      scene.add(this.mesh)
      this.mixer = new THREE.AnimationMixer(this.mesh)
      this.walk = this.mixer.clipAction(this.animations.Walk)
    })
  }

  update(deltaTime: number) {
    if (this.mixer) {
      this.mixer.update(deltaTime)
    }
    if (this.inMove) {
      this.moveTo(deltaTime)
    }
  }

  startMove(point: THREE.Vector3) {
    this.target = point
    const vector2D = this.calculateVector()
    if (!vector2D) return
    const angle = Math.atan2(vector2D.y, vector2D.x) + Math.PI / 2
    if (this.mesh) {
      this.mesh.rotation.z = angle
    }
    this.inMove = true
    if (this.walk) {
      this.walk.play()
    }
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
    if (!vector2D || !this.target || !this.mesh) return
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
    if (!this.target || !this.mesh) return
    return {
      x: this.target.x - this.mesh.position.x,
      y: this.target.y - this.mesh.position.y,
    }
  }
}

export default Character
