    updateTritFromSelect('tritBState', inputTritB);
    document.getElementById('tritAState').addEventListener('change', (e) => updateTritVisual(inputTritA, e.target.value));
    document.getElementById('tritBState').addEventListener('change', (e) => updateTritVisual(inputTritB, e.target.value));
    document.getElementById('igniteATOL').addEventListener('click', toggleATOLIgnition);
    document.getElementById('toggleSelfieCam').addEventListener('click', () => {selfieMode = !selfieMode;});
    document.getElementById('auraColorPicker').addEventListener('input', (e) => {
        const color = new THREE.Color(e.target.value);
        if(chakras.length > 6) chakras[6].material.emissive = color; 
        if(atolVehicle && atolVehicle.atolCore) atolVehicle.atolCore.material.emissive = color;
    });
}

function updateTritVisual(tritGroup, state) {
    tritGroup.userData.state = state;
    const baseColor = new THREE.Color(stateColors[state]);
    tritGroup.tritMesh.material.forEach((mat, i) => {
        const faceAccentColor = new THREE.Color(zodiacColors[i % zodiacColors.length]);
        if (state === '0') { 
            mat.color.lerpColors(baseColor, faceAccentColor, 0.5);
            mat.transparent = true;
            mat.opacity = 0.7 + Math.sin(Date.now() * 0.0015 + i) * 0.15; 
        } else {
            mat.color.lerpColors(baseColor, faceAccentColor, 0.3); 
            mat.transparent = false; mat.opacity = 1.0;
        }
        mat.needsUpdate = true;
    });
    if(tritGroup.coreBattery) {
        tritGroup.coreBattery.material.emissive.set(baseColor);
        tritGroup.coreBattery.scale.setScalar(1 + Math.sin(Date.now()*0.005)*0.1);
    }
}
function updateTritFromSelect(selectId, trit) { updateTritVisual(trit, document.getElementById(selectId).value); }

function applyLogicGate() {
    const stateA = parseInt(inputTritA.userData.state); const stateB = parseInt(inputTritB.userData.state);
    const gateType = document.getElementById('logicGate').value;
    let ternaryResult, binaryResult = 'N/A';
    const binA = stateA === 0 ? 0 : (stateA > 0 ? 1 : 0); const binB = stateB === 0 ? 0 : (stateB > 0 ? 1 : 0);

    switch (gateType) {
        case 'B_AND': binaryResult = (binA && binB) ? 1 : 0; ternaryResult = Math.min(stateA, stateB); break;
        case 'B_OR': binaryResult = (binA || binB) ? 1 : 0; ternaryResult = Math.max(stateA, stateB); break;
        case 'B_NOT_A': binaryResult = binA ? 0 : 1; ternaryResult = -stateA; break;
        case 'T_AND': ternaryResult = Math.min(stateA, stateB); break;
        case 'T_OR': ternaryResult = Math.max(stateA, stateB); break;
        case 'T_NOT_A': ternaryResult = -stateA; break;
        case 'T_XOR': ternaryResult = (stateA === stateB) ? -1 : ((stateA === 0 || stateB === 0) ? 0 : 1); break;
        case 'T_CONSENSUS': ternaryResult = (stateA === stateB) ? stateA : 0; break;
        case 'T_SUM': ternaryResult = stateA + stateB; break;
        default: ternaryResult = 0;
    }
    ternaryResult = Math.max(-1, Math.min(1, ternaryResult));
    updateTritVisual(outputTrit, ternaryResult.toString());
    document.getElementById('outInputA').textContent = stateA; document.getElementById('outInputB').textContent = stateB;
    document.getElementById('outGateType').textContent = gateType; document.getElementById('outTernaryResult').textContent = ternaryResult;
    document.getElementById('outBinaryResult').textContent = binaryResult;
    const statusEl = document.getElementById('entanglementStatus');
    if (stateA === 0 || stateB === 0 || ternaryResult === 0) {
        statusEl.textContent = "System in Potentiality/Superposition.";
        if (outputTrit.userData.state === '0') outputTrit.scale.set(1.1, 1.1, 1.1);
    } else {
        outputTrit.scale.set(1,1,1);
        if (Math.abs(stateA) === 1 && stateA === -stateB && (gateType === 'T_XOR' || gateType === 'T_CONSENSUS')) statusEl.textContent = "Entangled-like state.";
        else statusEl.textContent = "States collapsed.";
    }
}

function toggleATOLIgnition() {
    atolIgnited = !atolIgnited;
    document.getElementById('atolStatus').textContent = atolIgnited ? "ATOL Core IGNITED! Systems Online." : "ATOL Core Offline.";
    document.getElementById('atolStatus').style.color = atolIgnited ? "#4ade80" : "#facc15"; 
    if(atolVehicle && atolVehicle.atolCore) {
        atolVehicle.atolCore.material.color.set(atolIgnited ? 0xFFFF00 : 0xFFD700); 
    }
}

function onKeyDown(event) { keyboard[event.key.toLowerCase()] = true; keyboard[event.keyCode] = true; }
function onKeyUp(event) { keyboard[event.key.toLowerCase()] = false; keyboard[event.keyCode] = false; }

function updateATOLMovement(delta) {
    if (!atolVehicle || !atolIgnited) return;
    const currentSpeed = atolMoveSpeed * (keyboard['shift'] ? 2 : 1);
    
    let yawRate = 0;
    let thrust = 0;

    if(joystickActive) {
        yawRate = -joystickCurrent.x * atolRotateSpeed * 2.5; 
        thrust = -joystickCurrent.y * currentSpeed * 1.5; 
    }

    // Keyboard overrides or adds to joystick for yaw
    if (keyboard['a']) yawRate = atolRotateSpeed; // Assuming A is yaw left
    if (keyboard['d']) yawRate = -atolRotateSpeed; // Assuming D is yaw right
    
    // Keyboard for pitch
    if (keyboard['w']) atolVehicle.rotateX(-atolRotateSpeed);
    if (keyboard['s']) atolVehicle.rotateX(atolRotateSpeed);
    
    // Keyboard for altitude
    if (keyboard['q']) atolVehicle.position.y += currentSpeed * 0.5;
    if (keyboard['e']) atolVehicle.position.y -= currentSpeed * 0.5;
    
    // Keyboard overrides or adds to joystick for thrust
    if (keyboard[38] || keyboard['arrowup']) thrust = currentSpeed;
    if (keyboard[40] || keyboard['arrowdown']) thrust = -currentSpeed;

    // Apply Yaw
    atolVehicle.rotateY(yawRate);

    // Apply Thrust
    const forward = new THREE.Vector3(0,0,-1).applyQuaternion(atolVehicle.quaternion);
    atolVehicle.position.add(forward.multiplyScalar(thrust));


    if(atolVehicle.rotorDisc) atolVehicle.rotorDisc.rotation.y += delta * (atolIgnited ? 20 : 1); 
}

function updateVitruvianEnergyFlow(elapsedTime) {
    if (!vitruvianMan || !chakras[6]) return; // Ensure objects exist
    const crownPos = new THREE.Vector3();
    chakras[6].getWorldPosition(crownPos); 
    const feetY = vitruvianMan.position.y; 

    const crownParticles = [];
    const groundParticles = [];
    const numParticles = 20;

    for(let i=0; i<numParticles; i++){
        const t = (elapsedTime * 0.5 + i*0.1) % 1; 
        crownParticles.push(crownPos.x, crownPos.y + t * 5, crownPos.z); 
        const downY = crownPos.y - t * (crownPos.y - feetY);
        groundParticles.push(crownPos.x, downY, crownPos.z);
    }
    crownEnergyParticles.geometry.setAttribute('position', new THREE.Float32BufferAttribute(crownParticles, 3));
    crownEnergyParticles.geometry.attributes.position.needsUpdate = true;
    groundEnergyParticles.geometry.setAttribute('position', new THREE.Float32BufferAttribute(groundParticles, 3));
    groundEnergyParticles.geometry.attributes.position.needsUpdate = true;
    
    const auraColor = new THREE.Color(document.getElementById('auraColorPicker').value);
    crownEnergyParticles.material.color = auraColor;
    groundEnergyParticles.material.color = auraColor;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    if(atolSelfieCamera) {
        atolSelfieCamera.aspect = window.innerWidth / window.innerHeight;
        atolSelfieCamera.updateProjectionMatrix();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if(joystickBase) { 
        const baseRect = joystickBase.getBoundingClientRect();
        joystickOrigin.x = baseRect.left + baseRect.width / 2;
        joystickOrigin.y = baseRect.top + baseRect.height / 2;
    }
}

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    trits.forEach((tritGroup, index) => {
        tritGroup.rotateOnWorldAxis(gyroAxis, delta * 0.25 * (index * 0.15 + 1));
        tritGroup.tritMesh.rotation.z += delta * 0.08 * (index % 2 === 0 ? 1: -1);
        if (tritGroup.userData.state === '0') {
            const baseOpacity = 0.7;
            tritGroup.tritMesh.material.forEach((mat, i) => {
                 mat.opacity = baseOpacity + Math.sin(elapsedTime * 3.5 + tritGroup.id * 0.6 + i * 0.12) * 0.2;
            });
        } else {
             if(tritGroup.scale.x > 1) tritGroup.scale.lerp(new THREE.Vector3(1,1,1), 0.1);
        }
        if(tritGroup.coreBattery) tritGroup.coreBattery.rotation.y += delta * 0.5;
    });

    if (infinityLoopMesh) infinityLoopMesh.rotation.y += delta * 0.04;
    if (quantumFieldPlane && quantumFieldPlane.material.wireframe) {
        const hue = (elapsedTime * 0.03) % 1;
        const saturation = 0.6;
        const lightness = 0.1 + Math.sin(elapsedTime*0.2)*0.05;
        quantumFieldPlane.material.color.setHSL(hue, saturation, lightness);
    }
    
    updateVitruvianEnergyFlow(elapsedTime);
    updateATOLMovement(delta);

    if (selfieMode && atolVehicle) {
        const offset = new THREE.Vector3(0, 3, 7); 
        const selfieTarget = new THREE.Vector3();
        atolVehicle.getWorldPosition(selfieTarget); 
        
        const selfieCamPos = offset.applyMatrix4(atolVehicle.matrixWorld); 
        atolSelfieCamera.position.copy(selfieCamPos);
        atolSelfieCamera.lookAt(selfieTarget); 
        renderer.render(scene, atolSelfieCamera);
    } else {
        renderer.render(scene, camera);
    }
}
init();
