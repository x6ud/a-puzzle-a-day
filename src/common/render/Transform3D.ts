import {mat4, quat, ReadonlyMat4, ReadonlyQuat, ReadonlyVec3} from 'gl-matrix';

export default class Transform3D {

    private _matrix: Float32Array = new Float32Array(16);
    private _position: Float32Array = new Float32Array([0, 0, 0]);
    private _quaternion: Float32Array = quat.fromEuler(new Float32Array(4), 0, 0, 0) as Float32Array;
    private _scale: Float32Array = new Float32Array([1, 1, 1]);

    private matrixNeedsUpdate: boolean = true;

    private updateMatrix() {
        mat4.fromRotationTranslationScale(
            this._matrix,
            this._quaternion,
            this._position,
            this._scale
        );
        this.matrixNeedsUpdate = false;
    }

    get matrix(): ReadonlyMat4 {
        if (this.matrixNeedsUpdate) {
            this.updateMatrix();
        }
        return this._matrix;
    }

    set matrix(value: ReadonlyMat4) {
        this._matrix.set(value);
        mat4.getTranslation(this._position, this._matrix);
        mat4.getRotation(this._quaternion, this._matrix);
        mat4.getScaling(this._scale, this._matrix);
        this.matrixNeedsUpdate = false;
    }

    get x(): number {
        return this._position[0];
    }

    set x(x: number) {
        this._position[0] = x;
        this.matrixNeedsUpdate = true;
    }

    get y(): number {
        return this._position[1];
    }

    set y(y: number) {
        this._position[1] = y;
        this.matrixNeedsUpdate = true;
    }


    get z(): number {
        return this._position[2];
    }

    set z(z: number) {
        this._position[2] = z;
        this.matrixNeedsUpdate = true;
    }

    get position(): ReadonlyVec3 {
        return this._position;
    }

    set position(value: ReadonlyVec3) {
        this._position.set(value);
        this.matrixNeedsUpdate = true;
    }

    get scaleX(): number {
        return this._scale[0];
    }

    set scaleX(x: number) {
        this._scale[0] = x;
        this.matrixNeedsUpdate = true;
    }

    get scaleY(): number {
        return this._scale[1];
    }

    set scaleY(y: number) {
        this._scale[1] = y;
        this.matrixNeedsUpdate = true;
    }

    get scaleZ(): number {
        return this._scale[2];
    }

    set scaleZ(z: number) {
        this._scale[2] = z;
        this.matrixNeedsUpdate = true;
    }

    get scale(): ReadonlyVec3 {
        return this._scale;
    }

    set scale(value: ReadonlyVec3) {
        this._scale.set(value);
        this.matrixNeedsUpdate = true;
    }

    get quaternion(): ReadonlyQuat {
        return this._quaternion;
    }

    set quaternion(value: ReadonlyQuat) {
        this._quaternion.set(value);
        this.matrixNeedsUpdate = true;
    }

    setRotation(xDegrees: number, yDegrees: number, zDegrees: number) {
        quat.fromEuler(this._quaternion, xDegrees, yDegrees, zDegrees);
        this.matrixNeedsUpdate = true;
    }

    rotateX(rad: number) {
        quat.rotateX(this._quaternion, this._quaternion, rad);
        this.matrixNeedsUpdate = true;
    }

    rotateY(rad: number) {
        quat.rotateY(this._quaternion, this._quaternion, rad);
        this.matrixNeedsUpdate = true;
    }

    rotateZ(rad: number) {
        quat.rotateZ(this._quaternion, this._quaternion, rad);
        this.matrixNeedsUpdate = true;
    }

    lookAt(eye: ReadonlyVec3, center: ReadonlyVec3, up: ReadonlyVec3 = [0, 1, 0]) {
        mat4.lookAt(this._matrix, eye, center, up);
        mat4.getTranslation(this._position, this._matrix);
        mat4.getRotation(this._quaternion, this._matrix);
        mat4.getScaling(this._scale, this._matrix);
        this.matrixNeedsUpdate = true;
    }

    targetTo(eye: ReadonlyVec3, center: ReadonlyVec3, up: ReadonlyVec3 = [0, 1, 0]) {
        mat4.targetTo(this._matrix, eye, center, up);
        mat4.getTranslation(this._position, this._matrix);
        mat4.getRotation(this._quaternion, this._matrix);
        mat4.getScaling(this._scale, this._matrix);
        this.matrixNeedsUpdate = true;
    }

}
