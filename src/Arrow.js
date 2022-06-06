import { AnimationMixer } from 'three'

class Arrow {
  shouldDeleted = false
  constructor(mesh, animationClip, point) {
    this.mesh = mesh.clone()
    this.mesh.position.set(point.x, point.y, point.z)
    this.mixer = new AnimationMixer(this.mesh)
    this.action = this.mixer.clipAction(animationClip)
    this.action.play()
  }

  update(deltaTime) {
    if (this.mixer.time > 0.5) {
      this.shouldDeleted = true
    }
    this.mixer.update(deltaTime)
  }

  delete() {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }
}

export default Arrow
