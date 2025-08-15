// Camera Controls - Interactive Camera Specialist Agent
// Smooth camera movement and planet focusing for solar system exploration

class CameraControls {
    constructor(camera, domElement, scene) {
        this.camera = camera;
        this.domElement = domElement;
        this.scene = scene;
        
        // Camera control state
        this.enabled = true;
        this.target = new THREE.Vector3(0, 0, 0);
        this.spherical = new THREE.Spherical();
        this.sphericalDelta = new THREE.Spherical();
        
        // Control settings
        this.minDistance = 1;
        this.maxDistance = 1000;
        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;
        this.minAzimuthAngle = -Infinity;
        this.maxAzimuthAngle = Infinity;
        
        // Damping
        this.enableDamping = true;
        this.dampingFactor = 0.05;
        
        // Zoom settings
        this.enableZoom = true;
        this.zoomSpeed = 1.0;
        this.keyZoomSpeed = 2.0;
        
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
        
        // Touch settings
        this.enableTouch = true;
        this.touchRotateSpeed = 1.0;
        this.touchZoomSpeed = 1.0;
        this.touchPanSpeed = 1.0;
        this.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
        
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
        
        // Initialize spherical coordinates from camera position
        this.initializeSphericalFromCamera();
        this.update();
        this.setupEventListeners();
        
        console.log('Camera controls initialized');
    }
    
    initializeSphericalFromCamera() {
        console.log('🚀 CRITICAL FIX: Initializing spherical coordinates from camera position');
        console.log('🚀 Camera position:', this.camera.position.x, this.camera.position.y, this.camera.position.z);
        console.log('🚀 Target position:', this.target.x, this.target.y, this.target.z);
        
        // Calculate offset from target to camera
        const offset = new THREE.Vector3();
        offset.copy(this.camera.position).sub(this.target);
        console.log('🚀 Offset vector:', offset.x, offset.y, offset.z);
        
        // Convert to spherical coordinates
        this.spherical.setFromVector3(offset);
        console.log('🚀 ZOOM FIX: Spherical radius set to:', this.spherical.radius);
        console.log('🚀 ZOOM FIX: Spherical coordinates:', this.spherical.radius, this.spherical.theta, this.spherical.phi);
        
        // Reset deltas
        this.sphericalDelta.set(0, 0, 0);
        this.panOffset.set(0, 0, 0);
        
        console.log('🚀 ZOOM FIX APPLIED: Camera controls ready for zoom functionality');
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
        
        // Touch events for mobile
        this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
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
        
        if (event.pointerType === 'touch') {
            this.onTouchStart(event);
        } else {
            this.onMouseDown(event);
        }
    }
    
    onPointerMove(event) {
        if (!this.enabled) return;
        
        if (event.pointerType === 'touch') {
            this.onTouchMove(event);
        } else {
            this.onMouseMove(event);
        }
    }
    
    onPointerUp(event) {
        this.removePointer(event);
        
        if (this.pointers.length === 0) {
            this.domElement.releasePointerCapture(event.pointerId);
            this.domElement.removeEventListener('pointermove', this.onPointerMove.bind(this));
            this.domElement.removeEventListener('pointerup', this.onPointerUp.bind(this));
        }
        
        if (event.pointerType === 'touch') {
            this.onTouchEnd(event);
        } else {
            this.onMouseUp(event);
        }
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
    
    getSecondPointerPosition(event) {
        const pointer = (event.pointerId === this.pointers[0].pointerId) ? 
            this.pointers[1] : this.pointers[0];
        return this.pointerPositions[pointer.pointerId];
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
        this.handleMouseUp(event);
        
        this.dispatchEvent({ type: 'end' });
        this.state = 'NONE';
    }
    
    onMouseWheel(event) {
        if (!this.enabled || !this.enableZoom) return;
        
        event.preventDefault();
        
        this.dispatchEvent({ type: 'start' });
        this.handleMouseWheel(event);
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
    
    onTouchStart(event) {
        if (!this.enabled || !this.enableTouch) return;
        
        event.preventDefault();
        
        switch (this.pointers.length) {
            case 1:
                switch (this.touches.ONE) {
                    case THREE.TOUCH.ROTATE:
                        if (!this.enableRotate) return;
                        this.handleTouchStartRotate();
                        this.state = 'TOUCH_ROTATE';
                        break;
                        
                    case THREE.TOUCH.PAN:
                        if (!this.enablePan) return;
                        this.handleTouchStartPan();
                        this.state = 'TOUCH_PAN';
                        break;
                }
                break;
                
            case 2:
                switch (this.touches.TWO) {
                    case THREE.TOUCH.DOLLY_PAN:
                        if (!this.enableZoom && !this.enablePan) return;
                        this.handleTouchStartDollyPan();
                        this.state = 'TOUCH_DOLLY_PAN';
                        break;
                        
                    case THREE.TOUCH.DOLLY_ROTATE:
                        if (!this.enableZoom && !this.enableRotate) return;
                        this.handleTouchStartDollyRotate();
                        this.state = 'TOUCH_DOLLY_ROTATE';
                        break;
                }
                break;
        }
        
        if (this.state !== 'NONE') {
            this.dispatchEvent({ type: 'start' });
        }
    }
    
    onTouchMove(event) {
        if (!this.enabled || !this.enableTouch) return;
        
        event.preventDefault();
        
        switch (this.state) {
            case 'TOUCH_ROTATE':
                if (!this.enableRotate) return;
                this.handleTouchMoveRotate(event);
                this.update();
                break;
                
            case 'TOUCH_PAN':
                if (!this.enablePan) return;
                this.handleTouchMovePan(event);
                this.update();
                break;
                
            case 'TOUCH_DOLLY_PAN':
                if (!this.enableZoom && !this.enablePan) return;
                this.handleTouchMoveDollyPan(event);
                this.update();
                break;
                
            case 'TOUCH_DOLLY_ROTATE':
                if (!this.enableZoom && !this.enableRotate) return;
                this.handleTouchMoveDollyRotate(event);
                this.update();
                break;
        }
    }
    
    onTouchEnd(event) {
        this.handleTouchEnd(event);
        
        this.dispatchEvent({ type: 'end' });
        this.state = 'NONE';
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
            this.dollyOut(this.getZoomScale());
        } else if (this.dollyDelta.y < 0) {
            this.dollyIn(this.getZoomScale());
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
    
    handleMouseUp(event) {
        // Mouse up handling
    }
    
    handleMouseWheel(event) {
        console.log('🚀 ZOOM FIX: Mouse wheel event detected');
        console.log('🚀 ZOOM FIX: deltaY:', event.deltaY);
        console.log('🚀 ZOOM FIX: Current camera position:', this.camera.position.x, this.camera.position.y, this.camera.position.z);
        console.log('🚀 ZOOM FIX: Current spherical radius:', this.spherical.radius);
        
        event.preventDefault();
        
        // FIXED: Direct zoom implementation like immediate-fix.html
        const zoomScale = 0.95;
        const oldRadius = this.spherical.radius;
        
        if (event.deltaY < 0) {
            // Zoom in
            this.spherical.radius = Math.max(this.minDistance, this.spherical.radius * zoomScale);
            console.log('🚀 ZOOM FIX: Zooming IN');
        } else {
            // Zoom out  
            this.spherical.radius = Math.min(this.maxDistance, this.spherical.radius / zoomScale);
            console.log('🚀 ZOOM FIX: Zooming OUT');
        }
        
        console.log('🚀 ZOOM FIX: Radius changed from', oldRadius.toFixed(2), 'to', this.spherical.radius.toFixed(2));
        
        this.update();
        
        console.log('🚀 ZOOM FIX: After update - camera position:', this.camera.position.x.toFixed(2), this.camera.position.y.toFixed(2), this.camera.position.z.toFixed(2));
    }
    
    // Touch event handlers (simplified)
    handleTouchStartRotate() {
        if (this.pointers.length === 1) {
            this.rotateStart.set(this.pointers[0].pageX, this.pointers[0].pageY);
        }
    }
    
    handleTouchStartPan() {
        if (this.pointers.length === 1) {
            this.panStart.set(this.pointers[0].pageX, this.pointers[0].pageY);
        }
    }
    
    handleTouchStartDollyPan() {
        if (this.enableZoom) this.handleTouchStartDolly();
        if (this.enablePan) this.handleTouchStartPan();
    }
    
    handleTouchStartDollyRotate() {
        if (this.enableZoom) this.handleTouchStartDolly();
        if (this.enableRotate) this.handleTouchStartRotate();
    }
    
    handleTouchStartDolly() {
        const dx = this.pointers[0].pageX - this.pointers[1].pageX;
        const dy = this.pointers[0].pageY - this.pointers[1].pageY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.dollyStart.set(0, distance);
    }
    
    handleTouchMoveRotate(event) {
        if (this.pointers.length === 1) {
            this.rotateEnd.set(this.pointers[0].pageX, this.pointers[0].pageY);
        }
        
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(this.rotateSpeed);
        
        const element = this.domElement;
        this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientHeight);
        this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientHeight);
        
        this.rotateStart.copy(this.rotateEnd);
    }
    
    handleTouchMovePan(event) {
        // Touch pan handling
    }
    
    handleTouchMoveDollyPan(event) {
        // Touch dolly pan handling
    }
    
    handleTouchMoveDollyRotate(event) {
        // Touch dolly rotate handling
    }
    
    handleTouchEnd(event) {
        // Touch end handling
    }
    
    // Movement functions
    rotateLeft(angle) {
        this.sphericalDelta.theta -= angle;
    }
    
    rotateUp(angle) {
        this.sphericalDelta.phi -= angle;
    }
    
    dollyOut(dollyScale) {
        console.log('🚀 ZOOM FIX: dollyOut called with scale:', dollyScale);
        console.log('🚀 ZOOM FIX: Current spherical.radius:', this.spherical.radius);
        
        const oldRadius = this.spherical.radius;
        const scale = dollyScale || (1 / 0.95);
        this.spherical.radius = Math.min(this.maxDistance, this.spherical.radius * scale);
        
        console.log('🚀 ZOOM FIX: Radius changed from', oldRadius.toFixed(2), 'to', this.spherical.radius.toFixed(2));
    }
    
    dollyIn(dollyScale) {
        console.log('🚀 ZOOM FIX: dollyIn called with scale:', dollyScale);
        console.log('🚀 ZOOM FIX: Current spherical.radius:', this.spherical.radius);
        
        const oldRadius = this.spherical.radius;
        const scale = dollyScale || 0.95;
        this.spherical.radius = Math.max(this.minDistance, this.spherical.radius * scale);
        
        console.log('🚀 ZOOM FIX: Radius changed from', oldRadius.toFixed(2), 'to', this.spherical.radius.toFixed(2));
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
    
    getZoomScale() {
        return Math.pow(0.95, this.zoomSpeed);
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
        this.setDistance(this.getOptimalDistance({ displayRadius: 5 }));
        this.exitFollowMode();
    }
    
    findPlanetInScene(planetName) {
        return this.scene.getObjectByName(planetName);
    }
    
    setFollowTarget(target, planetName = '') {
        this.followTarget = target;
        this.followMode = true;
        
        // Get planet data for optimal distance
        const planetData = PLANETARY_DATA[planetName];
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
        this.spherical.radius = Math.max(this.minDistance, Math.min(distance, this.maxDistance));
    }
    
    // Main update function
    update() {
        const offset = new THREE.Vector3();
        const quat = new THREE.Quaternion().setFromUnitVectors(this.camera.up, new THREE.Vector3(0, 1, 0));
        const quatInverse = quat.clone().invert();
        
        // Follow mode update
        if (this.followMode && this.followTarget) {
            this.target.copy(this.followTarget.position);
            
            // Smooth transition to optimal distance
            const targetDistance = this.followDistance;
            this.spherical.radius += (targetDistance - this.spherical.radius) * this.followTransitionSpeed;
        }
        
        // Auto rotate
        if (this.autoRotate && this.state === 'NONE') {
            this.rotateLeft(this.getAutoRotationAngle());
        }
        
        // Apply spherical delta (rotation only, radius is set directly)
        this.spherical.theta += this.sphericalDelta.theta;
        this.spherical.phi += this.sphericalDelta.phi;
        // NOTE: radius is set directly in dolly methods, not accumulated
        
        // Restrict theta and phi
        this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta));
        this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi));
        this.spherical.makeSafe();
        
        // Restrict radius
        this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
        
        // Move target to panned location
        this.target.add(this.panOffset);
        
        // Calculate new position
        console.log('🚀 ZOOM FIX UPDATE: Spherical before position calc:', this.spherical.radius.toFixed(2), this.spherical.theta.toFixed(2), this.spherical.phi.toFixed(2));
        offset.setFromSpherical(this.spherical);
        console.log('🚀 ZOOM FIX UPDATE: Offset from spherical:', offset.x.toFixed(2), offset.y.toFixed(2), offset.z.toFixed(2));
        offset.applyQuaternion(quatInverse);
        console.log('🚀 ZOOM FIX UPDATE: Offset after quaternion:', offset.x.toFixed(2), offset.y.toFixed(2), offset.z.toFixed(2));
        
        const oldPosition = this.camera.position.clone();
        this.camera.position.copy(this.target).add(offset);
        console.log('🚀 ZOOM FIX UPDATE: Camera moved from:', oldPosition.x.toFixed(2), oldPosition.y.toFixed(2), oldPosition.z.toFixed(2));
        console.log('🚀 ZOOM FIX UPDATE: Camera moved to:', this.camera.position.x.toFixed(2), this.camera.position.y.toFixed(2), this.camera.position.z.toFixed(2));
        
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
        
        // ZOOM FIX: Don't override spherical radius with calculated position
        // This was causing the zoom to not work because it kept resetting the radius
        // offset.copy(this.camera.position).sub(this.target);
        // offset.applyQuaternion(quat);
        // this.spherical.setFromVector3(offset);
        
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