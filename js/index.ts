/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 *     - `wle:auto-constants:start` and `wle:auto-constants:end`: The project's constants,
 *        such as the project's name, whether it should use the physx runtime, etc...
 *     - `wle:auto-benchmark:start` and `wle:auto-benchmark:end`: Append the benchmarking code
 */

import "reflect-metadata";
import {container} from 'tsyringe';
import { DependencyRegistrar } from './compositionRoot/dependencyRegistrar.js';

/* wle:auto-imports:start */
import {Flipbook} from '@sorskoot/wonderland-components';
import {SnapRotate} from '@sorskoot/wonderland-components';
import {Tags} from '@sorskoot/wonderland-components';
import {Cursor} from '@wonderlandengine/components';
import {CursorTarget} from '@wonderlandengine/components';
import {HowlerAudioListener} from '@wonderlandengine/components';
import {MouseLookComponent} from '@wonderlandengine/components';
import {PlayerHeight} from '@wonderlandengine/components';
import {VrModeActiveSwitch} from '@wonderlandengine/components';
import {WasdControlsComponent} from '@wonderlandengine/components';
import {DoorHandler} from './components/door-handler.js';
import {FadeScreen} from './components/fadeScreen.js';
import {Game} from './components/game.js';
import {LevelGenerator} from './components/level-generator.js';
import {LookAt} from './components/look-at.js';
import {PickTarget} from './components/pick-target.js';
import {PlayerHeight2} from './components/player-height2.js';
import {SorskootTeleport} from './components/teleport.js';
import {TurnManager} from './components/turnManager.js';
import {TileDescriptor} from './dungeongen/components/tileComponent.js';
import {UiActionClose} from './ui/components/ui-action-close.js';
import {UiButton} from './ui/components/ui-button.js';
import {UiInventory} from './ui/components/ui-inventory.js';
import {UiManager} from './ui/components/ui-manager.js';
import {UiPanel} from './ui/components/ui-panel.js';
/* wle:auto-imports:end */

import {loadRuntime} from '@wonderlandengine/api';
import * as API from '@wonderlandengine/api'; // Deprecated: Backward compatibility.


/* wle:auto-constants:start */
const RuntimeOptions = {
    physx: false,
    loader: false,
    xrFramebufferScaleFactor: 1,
    canvas: 'canvas',
};
const Constants = {
    ProjectName: 'RunesOfTheDeep',
    RuntimeBaseName: 'WonderlandRuntime',
    WebXRRequiredFeatures: ['local',],
    WebXROptionalFeatures: ['local','local-floor','hand-tracking','hit-test',],
};
/* wle:auto-constants:end */



const engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);
Object.assign(engine, API); // Deprecated: Backward compatibility.
window.WL = engine; // Deprecated: Backward compatibility.

engine.onSceneLoaded.once(() => {
    const el = document.getElementById('version');
    if (el) setTimeout(() => el.remove(), 2000);

});

DependencyRegistrar.registerDependencies();
container.registerInstance(API.WonderlandEngine, engine); // register the engine as a singleton to can access from everywhere

/* WebXR setup. */

function requestSession(mode) {
    engine
        .requestXRSession(mode, Constants.WebXRRequiredFeatures, Constants.WebXROptionalFeatures)
        .catch((e) => console.error(e));
}

function setupButtonsXR() {
    /* Setup AR / VR buttons */
    const arButton = document.getElementById('ar-button');
    if (arButton) {
        arButton.dataset.supported = engine.arSupported;
        arButton.addEventListener('click', () => requestSession('immersive-ar'));
    }
    const vrButton = document.getElementById('vr-button');
    if (vrButton) {
        vrButton.dataset.supported = engine.vrSupported;
        vrButton.addEventListener('click', () => requestSession('immersive-vr'));
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('load', setupButtonsXR);
} else {
    setupButtonsXR();
}

/* wle:auto-register:start */
engine.registerComponent(Flipbook);
engine.registerComponent(SnapRotate);
engine.registerComponent(Tags);
engine.registerComponent(Cursor);
engine.registerComponent(CursorTarget);
engine.registerComponent(HowlerAudioListener);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(PlayerHeight);
engine.registerComponent(VrModeActiveSwitch);
engine.registerComponent(WasdControlsComponent);
engine.registerComponent(DoorHandler);
engine.registerComponent(FadeScreen);
engine.registerComponent(Game);
engine.registerComponent(LevelGenerator);
engine.registerComponent(LookAt);
engine.registerComponent(PickTarget);
engine.registerComponent(PlayerHeight2);
engine.registerComponent(SorskootTeleport);
engine.registerComponent(TurnManager);
engine.registerComponent(TileDescriptor);
engine.registerComponent(UiActionClose);
engine.registerComponent(UiButton);
engine.registerComponent(UiInventory);
engine.registerComponent(UiManager);
engine.registerComponent(UiPanel);
/* wle:auto-register:end */

engine.scene.load(`${Constants.ProjectName}.bin`);

/* wle:auto-benchmark:start */
/* wle:auto-benchmark:end */
