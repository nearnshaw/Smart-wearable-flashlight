

import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { setupUi } from './ui'

// export all the functions required to make the scene work
export * from '@dcl/sdk'
import { AvatarAttach, AvatarAnchorPointType, engine, Entity, LightSource, MeshRenderer, Transform, SkyboxTime } from '@dcl/sdk/ecs'




export let flashlightEntity: null | Entity = null

export const FLASHLIGHT_CONFIG = {
  type: LightSource.Type.Spot({
    innerAngle: 30,
    outerAngle: 60
  }),
  intensity: 1000000,
  shadow: true,
  active: true
}

export function toggleFlashlight() {
  if (!flashlightEntity) return
  const existing = LightSource.getOrNull(flashlightEntity)
  if (!existing) {
    LightSource.create(flashlightEntity, { ...FLASHLIGHT_CONFIG, active: false })
    return
  }
  const flashLight = LightSource.getMutable(flashlightEntity)
  if (flashLight) {
    flashLight.active = !(flashLight.active ?? true)
  }
}

export function isFlashlightActive(): boolean {
  if (!flashlightEntity) return false
  const light = LightSource.getOrNull(flashlightEntity)
  if (!light) return false
  return light.active ?? true
}

export function setRandomFlashlightColor() {
  if (!flashlightEntity) return
  if (!LightSource.getOrNull(flashlightEntity)) {
    LightSource.create(flashlightEntity, FLASHLIGHT_CONFIG)
  }
  const light = LightSource.getMutable(flashlightEntity)
  if (!light) return
  const r = Math.random()
  const g = Math.random()
  const b = Math.random()
  light.color = { r, g, b }
}

export function setWhiteFlashlightColor() {
  if (!flashlightEntity) return
  if (!LightSource.getOrNull(flashlightEntity)) {
    LightSource.create(flashlightEntity, FLASHLIGHT_CONFIG)
  }
  const light = LightSource.getMutable(flashlightEntity)
  if (!light) return
  light.color = { r: 1, g: 1, b: 1 }
}

export function increaseFlashlightIntensity(step: number = 300000) {
  if (!flashlightEntity) return
  if (!LightSource.getOrNull(flashlightEntity)) {
    LightSource.create(flashlightEntity, FLASHLIGHT_CONFIG)
  }
  const light = LightSource.getMutable(flashlightEntity)
  if (!light) return
  const current = light.intensity ?? 1000000
  light.intensity = Math.max(0, current + step)
  light.type = LightSource.Type.Spot({
    innerAngle: 30,
    outerAngle: 60 * Math.cbrt((light.intensity ?? 1000000) / 1000000)
  })
  console.log('Flashlight intensity increased to', light.intensity)
}

export function decreaseFlashlightIntensity(step: number = 300000) {
  increaseFlashlightIntensity(-Math.abs(step))
}

export function main() {


  flashlightEntity = engine.addEntity()

  const flashlightParentEntity = engine.addEntity()

  Transform.create(flashlightEntity, {
    position: Vector3.create(0, 0.4, 0.4),
    rotation: Quaternion.fromEulerDegrees(12, 0, 0),
    parent: flashlightParentEntity
  })

  AvatarAttach.create(flashlightParentEntity, {
    anchorPointId: AvatarAnchorPointType.AAPT_HEAD,
  })

  LightSource.create(flashlightEntity, FLASHLIGHT_CONFIG)

  setupUi({
    toggle: toggleFlashlight,
    randomColor: setRandomFlashlightColor,
    resetColor: setWhiteFlashlightColor,
    increaseIntensity: () => increaseFlashlightIntensity(100000),
    decreaseIntensity: () => decreaseFlashlightIntensity(100000),
    getActive: isFlashlightActive
  })


}


function changeSkyboxTime(time: number) {
  SkyboxTime.create(engine.RootEntity, { fixedTime: time })
}

function resetSkyboxTime() {
  if(SkyboxTime.has(engine.RootEntity)) {
    SkyboxTime.deleteFrom(engine.RootEntity)
  }
}