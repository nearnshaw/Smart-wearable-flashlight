import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

let onToggleFlashlight: (() => void) | null = null
let onRandomColor: (() => void) | null = null
let onResetColor: (() => void) | null = null
let onIncreaseIntensity: (() => void) | null = null
let onDecreaseIntensity: (() => void) | null = null
let getIsActive: (() => boolean) | null = null


const uiComponent = () => (
  <UiEntity
    uiTransform={{
      width: 240,
      height: 140,
      positionType: 'absolute',
      position: { right: 12, bottom: 12 },
      padding: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Color4.fromHexString('#ffffff33')
    }}
    uiBackground={{ color: Color4.fromHexString('#111111cc') }}
  >
    <UiEntity
      uiTransform={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        borderRadius: 10
      }}
      uiBackground={{ color: Color4.fromHexString('#222222ff') }}
    >
      <UiEntity
        uiTransform={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Button
          uiTransform={{ width: '100%', height: 36, margin: 3, borderRadius: 8 }}
          value={getIsActive?.() ? 'Light On' : 'Light Off'}
          variant={getIsActive?.() ? 'primary' : 'secondary'}
          fontSize={14}
          onMouseDown={() => {
            onToggleFlashlight?.()
          }}
        />
      </UiEntity>

      <UiEntity
        uiTransform={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Button
          uiTransform={{ width: '50%', height: 30, margin: 3, borderRadius: 8 }}
          value='Random color'
          variant='secondary'
          fontSize={13}
          onMouseDown={() => {
            onRandomColor?.()
          }}
        />
        <Button
          uiTransform={{ width: '50%', height: 30, margin: 3, borderRadius: 8 }}
          value='White'
          variant='secondary'
          fontSize={13}
          onMouseDown={() => {
            onResetColor?.()
          }}
        />
      </UiEntity>

      <UiEntity
        uiTransform={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Button
          uiTransform={{ width: '50%', height: 30, margin: 3, borderRadius: 8 }}
          value='+ Intensity'
          variant='secondary'
          fontSize={13}
          onMouseDown={() => {
            onIncreaseIntensity?.()
          }}
        />
        <Button
          uiTransform={{ width: '50%', height: 30, margin: 3, borderRadius: 8 }}
          value='- Intensity'
          variant='secondary'
          fontSize={13}
          onMouseDown={() => {
            onDecreaseIntensity?.()
          }}
        />
      </UiEntity>
    </UiEntity>
  </UiEntity>
)

function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

export function setupUi(callbacks?: {
  toggle?: () => void,
  randomColor?: () => void,
  resetColor?: () => void,
  increaseIntensity?: () => void,
  decreaseIntensity?: () => void,
  getActive?: () => boolean,
}) {
  onToggleFlashlight = callbacks?.toggle ?? null
  onRandomColor = callbacks?.randomColor ?? null
  onResetColor = callbacks?.resetColor ?? null
  onIncreaseIntensity = callbacks?.increaseIntensity ?? null
  onDecreaseIntensity = callbacks?.decreaseIntensity ?? null
  getIsActive = callbacks?.getActive ?? null
  ReactEcsRenderer.setUiRenderer(uiComponent)
}