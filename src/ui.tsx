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

let isMinimized = false


const uiComponent = () => (
  <UiEntity
    uiTransform={{
      width: isMinimized ? 56 : 240,
      height: isMinimized ? 56 : 'auto',
      positionType: 'absolute',
      position: { right: 12, bottom: 12 },
      padding: isMinimized ? 0 : 6,
      borderRadius: 12,
      borderWidth: isMinimized ? 0 : 1,
      borderColor: Color4.fromHexString('#ffffff33'),
      overflow: 'visible'
    }}
    uiBackground={{ color: isMinimized ? Color4.fromHexString('#00000000') : Color4.fromHexString('#111111cc') }}
  >
    {isMinimized ? (
      <UiEntity
        uiTransform={{ width: 64, height: 64 }}
        uiBackground={{
          textureMode: 'stretch',
          texture: { src: 'assets/images/flashlight.png' }
        }}
        onMouseDown={() => { isMinimized = false }}
      />
    ) : (
      <UiEntity uiTransform={{ width: '100%', height: 'auto', positionType: 'relative' }}>
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
        uiBackground={{ color: Color4.fromHexString('#222222ff') }}
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
        uiBackground={{ color: Color4.fromHexString('#222222ff') }}
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
        uiBackground={{ color: Color4.fromHexString('#222222ff') }}
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
        <UiEntity
          uiTransform={{ positionType: 'absolute', position: { top: -26, right: -12 }, width: 28, height: 28, zIndex: 10, borderRadius: 14, borderWidth: 1, borderColor: Color4.fromHexString('#00000022'), flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          uiBackground={{ color: Color4.fromHexString('#ffffffff') }}
          onMouseDown={() => { isMinimized = true }}
        >
          <UiEntity
            uiTransform={{ width: 18, height: 18 }}
            uiBackground={{ textureMode: 'stretch', texture: { src: 'assets/images/close.png' } }}
          />
        </UiEntity>
      </UiEntity>
    )}
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