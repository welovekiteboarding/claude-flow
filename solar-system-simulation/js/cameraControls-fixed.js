// Camera Controls - Fixed Version with Direct Zoom Implementation
// Based on the working approach from immediate-fix.html

class CameraControls {
    constructor(camera, domElement, scene) {
        this.camera = camera;
        this.domElement = domElement;
        this.scene = scene;
        
        // Camera control state
        this.enabled = true;
        this.target = new THREE.Vector3(0, 0, 0);
        
        // SIMPLIFIED: Direct distance tracking (like immediate-fix.html)
        this.distance = 25; // Direct distance from target
        this.minDistance = 1;
        this.maxDistance = 1000;
        
        // Spherical coordinates for rotation only
        this.spherical = new THREE.Spherical();
        this.sphericalDelta = new THREE.Spherical();
        
        // Control settings
        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;
        this.minAzimuthAngle = -Infinity;
        this.maxAzimuthAngle = Infinity;
        
        // Damping
        this.enableDamping = true;
        this.dampingFactor = 0.05;
        
        // Zoom settings - SIMPLIFIED
        this.enableZoom = true;
        this.zoomSpeed = 1.0;
        
        // Pan settings
        this.enablePan = true;
        this.panSpeed = 1.0;
        this.screenSpacePanning = true;
        this.panOffset = new THREE.Vector3();
        
        // Rotation settings
        this.enableRotate = true;
        this.rotateSpeed = 1.0;
        
        // Auto rotation
        this.autoRotate = false;
        this.autoRotateSpeed = 2.0;
        
        // Planet following
        this.followMode = false;
        this.followTarget = null;
        this.followDistance = 5;
        this.followTransitionSpeed = 0.02;
        
        // Internal state
        this.state = 'NONE';
        this.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        };
        
        // Event state
        this.rotateStart = new THREE.Vector2();
        this.rotateEnd = new THREE.Vector2();
        this.rotateDelta = new THREE.Vector2();
        
        this.panStart = new THREE.Vector2();
        this.panEnd = new THREE.Vector2();
        this.panDelta = new THREE.Vector2();
        
        this.dollyStart = new THREE.Vector2();
        this.dollyEnd = new THREE.Vector2();
        this.dollyDelta = new THREE.Vector2();
        
        // Touch state
        this.pointers = [];
        this.pointerPositions = {};
        
        // Initialize from current camera position
        this.initializeFromCamera();
        this.setupEventListeners();
        
        console.log('🚀 FIXED Camera controls initialized with direct zoom');
    }
    
    initializeFromCamera() {
        // Calculate current distance from camera to target
        const offset = new THREE.Vector3();
        offset.copy(this.camera.position).sub(this.target);
        this.distance = offset.length();
        
        // Set spherical coordinates for rotation tracking
        this.spherical.setFromVector3(offset);
        this.sphericalDelta.set(0, 0, 0);
        this.panOffset.set(0, 0, 0);
        
        console.log('🚀 FIXED: Initialized distance:', this.distance);
        console.log('🚀 FIXED: Spherical coords:', this.spherical.radius, this.spherical.theta, this.spherical.phi);
    }
    
    setupEventListeners() {
        if (!this.domElement) return;
        
        // Mouse events
        this.domElement.addEventListener('contextmenu', this.onContextMenu.bind(this));
        this.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.domElement.addEventListener('pointercancel', this.onPointerCancel.bind(this));
        this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
        
        // Keyboard events
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    
    onContextMenu(event) {
        if (!this.enabled) return;
        event.preventDefault();
    }
    
    onPointerDown(event) {
        if (!this.enabled) return;
        
        if (this.pointers.length === 0) {
            this.domElement.setPointerCapture(event.pointerId);
            this.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
            this.domElement.addEventListener('pointerup', this.onPointerUp.bind(this));
        }
        
        this.addPointer(event);
        this.onMouseDown(event);
    }
    
    onPointerMove(event) {
        if (!this.enabled) return;
        this.onMouseMove(event);
    }
    
    onPointerUp(event) {
        this.removePointer(event);
        
        if (this.pointers.length === 0) {
            this.domElement.releasePointerCapture(event.pointerId);
            this.domElement.removeEventListener('pointermove', this.onPointerMove.bind(this));
            this.domElement.removeEventListener('pointerup', this.onPointerUp.bind(this));
        }
        
        this.onMouseUp(event);
    }
    
    onPointerCancel(event) {
        this.removePointer(event);
    }
    
    addPointer(event) {
        this.pointers.push(event);
    }
    
    removePointer(event) {
        delete this.pointerPositions[event.pointerId];
        
        for (let i = 0; i < this.pointers.length; i++) {
            if (this.pointers[i].pointerId === event.pointerId) {
                this.pointers.splice(i, 1);
                return;
            }
        }
    }
    
    onMouseDown(event) {
        let mouseAction;
        
        switch (event.button) {
            case 0:
                mouseAction = this.mouseButtons.LEFT;
                break;
            case 1:
                mouseAction = this.mouseButtons.MIDDLE;
                break;
            case 2:
                mouseAction = this.mouseButtons.RIGHT;
                break;
            default:
                mouseAction = -1;
        }
        
        switch (mouseAction) {
            case THREE.MOUSE.DOLLY:
                if (!this.enableZoom) return;
                this.handleMouseDownDolly(event);
                this.state = 'DOLLY';
                break;
                
            case THREE.MOUSE.ROTATE:
                if (!this.enableRotate) return;
                this.handleMouseDownRotate(event);
                this.state = 'ROTATE';
                break;
                
            case THREE.MOUSE.PAN:
                if (!this.enablePan) return;
                this.handleMouseDownPan(event);
                this.state = 'PAN';
                break;
        }
        
        if (this.state !== 'NONE') {
            this.dispatchEvent({ type: 'start' });
        }
    }
    
    onMouseMove(event) {
        if (!this.enabled) return;
        
        switch (this.state) {
            case 'ROTATE':
                if (!this.enableRotate) return;
                this.handleMouseMoveRotate(event);
                break;
                
            case 'DOLLY':
                if (!this.enableZoom) return;
                this.handleMouseMoveDolly(event);
                break;
                
            case 'PAN':
                if (!this.enablePan) return;
                this.handleMouseMovePan(event);
                break;
        }
    }
    
    onMouseUp(event) {
        this.dispatchEvent({ type: 'end' });
        this.state = 'NONE';
    }
    
    // FIXED: Direct zoom implementation like immediate-fix.html
    onMouseWheel(event) {
        if (!this.enabled || !this.enableZoom) return;
        
        event.preventDefault();
        
        console.log('🚀 FIXED ZOOM: Mouse wheel event detected');
        console.log('🚀 FIXED ZOOM: deltaY:', event.deltaY);
        console.log('🚀 FIXED ZOOM: Current distance:', this.distance);
        
        this.dispatchEvent({ type: 'start' });
        
        // Direct distance manipulation (like immediate-fix.html)
        const zoomScale = 0.95;
        const oldDistance = this.distance;
        
        if (event.deltaY < 0) {
            // Zoom in
            this.distance = Math.max(this.minDistance, this.distance * zoomScale);
            console.log('🚀 FIXED ZOOM: Zooming IN');
        } else {
            // Zoom out
            this.distance = Math.min(this.maxDistance, this.distance / zoomScale);
            console.log('🚀 FIXED ZOOM: Zooming OUT');
        }
        
        console.log('🚀 FIXED ZOOM: Distance changed from', oldDistance.toFixed(2), 'to', this.distance.toFixed(2));
        
        // Update camera position directly
        this.updateCameraPosition();
        
        this.dispatchEvent({ type: 'end' });
    }
    
    onKeyDown(event) {
        if (!this.enabled) return;
        
        switch (event.code) {
            case 'Digit0':
                this.focusOnSun();
                break;
            case 'Digit1':
                this.focusOnPlanet('mercury');
                break;
            case 'Digit2':
                this.focusOnPlanet('venus');
                break;
            case 'Digit3':
                this.focusOnPlanet('earth');
                break;
            case 'Digit4':
                this.focusOnPlanet('mars');
                break;
            case 'Digit5':
                this.focusOnPlanet('jupiter');
                break;
            case 'Digit6':
                this.focusOnPlanet('saturn');
                break;
            case 'Digit7':
                this.focusOnPlanet('uranus');
                break;
            case 'Digit8':
                this.focusOnPlanet('neptune');
                break;
            case 'Escape':
                this.exitFollowMode();
                break;
            case 'Space':
                this.autoRotate = !this.autoRotate;
                break;
        }
    }
    
    // Mouse event handlers
    handleMouseDownRotate(event) {
        this.rotateStart.set(event.clientX, event.clientY);
    }
    
    handleMouseDownDolly(event) {
        this.dollyStart.set(event.clientX, event.clientY);
    }
    
    handleMouseDownPan(event) {
        this.panStart.set(event.clientX, event.clientY);
    }
    
    handleMouseMoveRotate(event) {
        this.rotateEnd.set(event.clientX, event.clientY);
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(this.rotateSpeed);
        
        const element = this.domElement;
        this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientHeight);
        this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientHeight);
        
        this.rotateStart.copy(this.rotateEnd);
        this.update();
    }
    
    handleMouseMoveDolly(event) {
        this.dollyEnd.set(event.clientX, event.clientY);
        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart);
        
        if (this.dollyDelta.y > 0) {
            this.dollyOut();
        } else if (this.dollyDelta.y < 0) {
            this.dollyIn();
        }
        
        this.dollyStart.copy(this.dollyEnd);
        this.update();
    }
    
    handleMouseMovePan(event) {
        this.panEnd.set(event.clientX, event.clientY);
        this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(this.panSpeed);
        
        this.pan(this.panDelta.x, this.panDelta.y);
        
        this.panStart.copy(this.panEnd);
        this.update();
    }
    
    // Movement functions
    rotateLeft(angle) {
        this.sphericalDelta.theta -= angle;
    }
    
    rotateUp(angle) {
        this.sphericalDelta.phi -= angle;
    }
    
    // FIXED: Direct distance manipulation
    dollyOut() {
        const scale = Math.pow(0.95, this.zoomSpeed);
        this.distance = Math.min(this.maxDistance, this.distance / scale);
        console.log('🚀 FIXED DOLLY OUT: New distance:', this.distance);
    }
    
    dollyIn() {
        const scale = Math.pow(0.95, this.zoomSpeed);
        this.distance = Math.max(this.minDistance, this.distance * scale);
        console.log('🚀 FIXED DOLLY IN: New distance:', this.distance);
    }
    
    pan(deltaX, deltaY) {
        const element = this.domElement;
        
        if (this.camera.isPerspectiveCamera) {
            const position = this.camera.position;
            let offset = position.clone().sub(this.target);
            let targetDistance = offset.length();
            
            targetDistance *= Math.tan((this.camera.fov / 2) * Math.PI / 180.0);
            
            this.panLeft(2 * deltaX * targetDistance / element.clientHeight, this.camera.matrix);
            this.panUp(2 * deltaY * targetDistance / element.clientHeight, this.camera.matrix);
        }
    }
    
    panLeft(distance, objectMatrix) {
        const v = new THREE.Vector3();
        v.setFromMatrixColumn(objectMatrix, 0);
        v.multiplyScalar(-distance);
        this.panOffset.add(v);
    }
    
    panUp(distance, objectMatrix) {
        const v = new THREE.Vector3();
        if (this.screenSpacePanning) {
            v.setFromMatrixColumn(objectMatrix, 1);
        } else {
            v.setFromMatrixColumn(objectMatrix, 0);
            v.crossVectors(this.camera.up, v);
        }
        v.multiplyScalar(distance);
        this.panOffset.add(v);
    }
    
    // FIXED: Direct camera position update
    updateCameraPosition() {
        // Calculate direction from target to camera
        const offset = new THREE.Vector3();
        offset.copy(this.camera.position).sub(this.target);
        offset.normalize();
        
        // Set camera position at correct distance
        this.camera.position.copy(this.target).add(offset.multiplyScalar(this.distance));
        this.camera.lookAt(this.target);
        
        console.log('🚀 FIXED: Camera position updated to:', this.camera.position.x.toFixed(2), this.camera.position.y.toFixed(2), this.camera.position.z.toFixed(2));
    }
    
    // Planet focusing functions
    focusOnPlanet(planetName) {
        const planet = this.findPlanetInScene(planetName);
        if (planet) {
            this.setFollowTarget(planet, planetName);
        } else {
            console.warn(`Planet ${planetName} not found in scene`);
        }
    }
    
    focusOnSun() {
        this.setTarget(new THREE.Vector3(0, 0, 0));
        this.setDistance(25);
        this.exitFollowMode();
    }
    
    findPlanetInScene(planetName) {
        return this.scene.getObjectByName(planetName);
    }
    
    setFollowTarget(target, planetName = '') {
        this.followTarget = target;
        this.followMode = true;
        
        // Get planet data for optimal distance
        const planetData = typeof PLANETARY_DATA !== 'undefined' ? PLANETARY_DATA[planetName] : null;
        if (planetData) {
            this.followDistance = this.getOptimalDistance(planetData);
        }
        
        console.log(`Following ${planetName || 'object'}`);
    }
    
    getOptimalDistance(planetData) {
        const baseDistance = (planetData.displayRadius || 1) * 3;
        return Math.max(this.minDistance, Math.min(baseDistance, this.maxDistance));
    }
    
    exitFollowMode() {
        this.followMode = false;
        this.followTarget = null;
        console.log('Exited follow mode');
    }
    
    setTarget(target) {
        this.target.copy(target);
    }
    
    setDistance(distance) {
        this.distance = Math.max(this.minDistance, Math.min(distance, this.maxDistance));
        this.updateCameraPosition();
    }
    
    // FIXED: Main update function with direct approach
    update() {
        // Follow mode update
        if (this.followMode && this.followTarget) {
            this.target.copy(this.followTarget.position);
            
            // Smooth transition to optimal distance
            const targetDistance = this.followDistance;
            this.distance += (targetDistance - this.distance) * this.followTransitionSpeed;
        }
        
        // Auto rotate
        if (this.autoRotate && this.state === 'NONE') {
            this.rotateLeft(this.getAutoRotationAngle());
        }
        
        // Apply rotation changes
        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi += this.sphericalDelta.phi;
        
        // Restrict angles
        this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
        this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
        this.spherical.makeSafe();
        
        // Apply pan offset
        this.target.add(this.panOffset);
        
        // FIXED: Calculate new position using direct distance
        const offset = new THREE.Vector3();
        this.spherical.radius = this.distance; // Use direct distance
        offset.setFromSpherical(this.spherical);
        
        // Apply rotation quaternion
        const quat = new THREE.Quaternion().setFromUnitVectors(this.camera.up, new THREE.Vector3(0, 1, 0));
        const quatInverse = quat.clone().invert();
        offset.applyQuaternion(quatInverse);
        
        // Set camera position
        this.camera.position.copy(this.target).add(offset);
        this.camera.lookAt(this.target);
        
        // Damping
        if (this.enableDamping) {
            this.sphericalDelta.theta *= (1 - this.dampingFactor);
            this.sphericalDelta.phi *= (1 - this.dampingFactor);
            this.panOffset.multiplyScalar(1 - this.dampingFactor);
        } else {
            this.sphericalDelta.set(0, 0, 0);
            this.panOffset.set(0, 0, 0);
        }
        
        return true;
    }
    
    getAutoRotationAngle() {
        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed;
    }
    
    // Event dispatcher
    addEventListener(type, listener) {
        if (!this._listeners) this._listeners = {};
        if (!this._listeners[type]) this._listeners[type] = [];
        this._listeners[type].push(listener);
    }
    
    dispatchEvent(event) {
        if (!this._listeners) return;
        const listeners = this._listeners[event.type];
        if (listeners) {
            listeners.forEach(listener => listener(event));
        }
    }
    
    dispose() {
        if (this.domElement) {
            this.domElement.removeEventListener('contextmenu', this.onContextMenu);
            this.domElement.removeEventListener('pointerdown', this.onPointerDown);
            this.domElement.removeEventListener('pointercancel', this.onPointerCancel);
            this.domElement.removeEventListener('wheel', this.onMouseWheel);
        }
        
        window.removeEventListener('keydown', this.onKeyDown);
    }
}

// Export for use in main simulation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraControls;
}