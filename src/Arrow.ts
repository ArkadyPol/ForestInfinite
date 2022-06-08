import * as THREE from 'three'

class Arrow {
  mesh: THREE.Mesh
  mixer: THREE.AnimationMixer
  action: THREE.AnimationAction

  constructor(point: THREE.Vector3) {
    this.mesh = Arrow.meshSample.clone()
    this.mesh.position.set(point.x, point.y, point.z)
    this.mixer = new THREE.AnimationMixer(this.mesh)
    this.action = this.mixer.clipAction(Arrow.animationClip)
    this.action.play()
    Arrow.arrows.push(this)
  }

  update(deltaTime: number) {
    if (this.mixer.time > 0.5) {
      Arrow.delete(this.mesh.id)
      return
    }
    this.mixer.update(deltaTime)
  }

  delete() {
    this.mesh.geometry.dispose()
    ;(<THREE.Material>this.mesh.material).dispose()
  }

  static animationClip: THREE.AnimationClip

  static meshSample: THREE.Mesh

  static arrows = [] as Arrow[]

  static delete(id: number) {
    this.arrows = this.arrows.filter(arrow => {
      if (arrow.mesh.id === id) {
        arrow.delete()
        arrow.mesh.parent?.remove(arrow.mesh)
        return false
      }
      return true
    })
  }
}

export default Arrow
