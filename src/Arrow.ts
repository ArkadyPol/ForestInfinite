import * as THREE from 'three'

class Arrow {
  shouldDeleted = false
  mesh: THREE.Mesh
  mixer: THREE.AnimationMixer
  action: THREE.AnimationAction

  constructor(
    mesh: THREE.Mesh,
    animationClip: THREE.AnimationClip,
    point: THREE.Vector3
  ) {
    this.mesh = mesh.clone()
    this.mesh.position.set(point.x, point.y, point.z)
    this.mixer = new THREE.AnimationMixer(this.mesh)
    this.action = this.mixer.clipAction(animationClip)
    this.action.play()
  }

  update(deltaTime: number) {
    if (this.mixer.time > 0.5) {
      this.shouldDeleted = true
    }
    this.mixer.update(deltaTime)
  }

  delete() {
    this.mesh.geometry.dispose()
    ;(<THREE.Material>this.mesh.material).dispose()
  }
}

export default Arrow
