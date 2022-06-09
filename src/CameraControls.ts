import { Cylindrical, Vector3 } from 'three'
import Character from './Character'

class CameraControls {
  angle = 0
  eventX = 0
  isWheelPressed = false

  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousedown', this.onWheelDownClick.bind(this))
    canvas.addEventListener('mouseup', this.onWheelUpClick.bind(this))
    canvas.addEventListener('mousemove', this.onWheelMove.bind(this))
  }

  onWheelDownClick(e: MouseEvent) {
    if (e.button !== 1) return
    this.isWheelPressed = true
    this.eventX = e.clientX
    const cameraPos = Character.character.camera.position
    const newCylindrical = new Cylindrical().setFromCartesianCoords(
      cameraPos.x,
      cameraPos.z,
      cameraPos.y
    )
    this.angle = newCylindrical.theta
  }

  onWheelUpClick(e: MouseEvent) {
    if (e.button !== 1) return
    this.isWheelPressed = false
  }

  onWheelMove(e: MouseEvent) {
    if (!this.isWheelPressed) return

    const diffX = e.clientX - this.eventX

    const newPos = new Vector3().setFromCylindricalCoords(
      Character.character.cameraOptions.radius,
      this.angle + diffX / 20,
      Character.character.cameraOptions.height
    )

    const characterWorldPos = new Vector3()
    Character.character.mesh.getWorldPosition(characterWorldPos)
    Character.character.camera.position.set(newPos.x, newPos.z, newPos.y)
    Character.character.camera.lookAt(characterWorldPos)
  }
}

export default CameraControls
