import { Cylindrical, Vector3 } from 'three'
import Character from './Character'

class CameraControls {
  angle = 0
  eventX = 0
  isWheelPressed = false

  constructor(canvas: HTMLCanvasElement) {
    this.setAngle()
    canvas.addEventListener('mousedown', this.onWheelDownClick.bind(this))
    canvas.addEventListener('mouseup', this.onWheelUpClick.bind(this))
    canvas.addEventListener('mousemove', this.onWheelMove.bind(this))
    canvas.addEventListener('wheel', this.zoom.bind(this), { passive: true })
  }

  onWheelDownClick(e: MouseEvent) {
    if (e.button !== 1) return
    this.isWheelPressed = true
    this.eventX = e.clientX
  }

  onWheelUpClick(e: MouseEvent) {
    if (e.button !== 1) return
    this.isWheelPressed = false
    this.setAngle()
  }

  onWheelMove(e: MouseEvent) {
    if (!this.isWheelPressed) return

    const diffX = e.clientX - this.eventX

    this.setCameraPosition(this.angle + diffX / 20)
  }

  zoom(e: WheelEvent) {
    const newHeight =
      Character.character.cameraOptions.height * (1 + e.deltaY / 1000)
    const newRadius =
      Character.character.cameraOptions.radius * (1 + e.deltaY / 1000)

    const sqDistance = newHeight * newHeight + newRadius * newRadius

    const lowerLimit = 4
    const upperLimit = 2500

    if (sqDistance < lowerLimit || sqDistance > upperLimit) return

    Character.character.cameraOptions.height = newHeight
    Character.character.cameraOptions.radius = newRadius

    this.setCameraPosition(this.angle)
  }

  setCameraPosition(angle: number) {
    const newPos = new Vector3().setFromCylindricalCoords(
      Character.character.cameraOptions.radius,
      angle,
      Character.character.cameraOptions.height
    )
    const characterWorldPos = new Vector3()
    Character.character.mesh.getWorldPosition(characterWorldPos)
    Character.character.camera.position.set(newPos.x, newPos.z, newPos.y)
    Character.character.camera.lookAt(characterWorldPos)
  }

  setAngle() {
    const cameraPos = Character.character.camera.position
    const newCylindrical = new Cylindrical().setFromCartesianCoords(
      cameraPos.x,
      cameraPos.z,
      cameraPos.y
    )
    this.angle = newCylindrical.theta
  }
}

export default CameraControls
