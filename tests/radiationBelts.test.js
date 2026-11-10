import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  buildRadiationBeltGroup,
  disposeRadiationBeltGroup,
  updateBeltFlux,
  updateBeltClipping,
  STORM_MAX_DEFORM,
} from '../src/scene/radiationBelts.js';
import { resolveBeltProfile, beltFluxAt } from '../src/physics/beltProfile.js';

const FLUX = { innerFlux: 0.7, outerFlux: 0.6, slotFlux: 0, storageBeltFlux: 0.6 };

function planes() {
  return [new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)];
}

describe('buildRadiationBeltGroup', () => {
  it('builds three shells per visible belt and one cut face per clipping plane', () => {
    const group = buildRadiationBeltGroup({ clippingPlanes: planes() });
    expect(group.userData.shellGroup.children.length).toBe(9);
    expect(group.userData.cutFaceGroup.children.length).toBe(2);

    const innerOnly = buildRadiationBeltGroup({ showOuterBelt: false });
    expect(innerOnly.userData.shellGroup.children.length).toBe(3);
    expect(innerOnly.userData.cutFaceGroup.children.length).toBe(0);
    disposeRadiationBeltGroup(group);
    disposeRadiationBeltGroup(innerOnly);
  });

  it('shell geometry is finite, with finite normals', () => {
    const group = buildRadiationBeltGroup({ stormIntensity: 0.9, kp: 6, storageFlux: 0.6 });
    for (const mesh of group.userData.shellGroup.children) {
      for (const name of ['position', 'normal']) {
        const arr = mesh.geometry.attributes[name].array;
        // Count in a plain loop: one expect() per element made this test take ~5 s.
        let bad = 0;
        for (let i = 0; i < arr.length; i++) if (!Number.isFinite(arr[i])) bad++;
        expect(bad).toBe(0);
      }
    }
    disposeRadiationBeltGroup(group);
  });

  // The cut-face shader recovers flux from a world position by: world → dipole
  // frame, undo the storm scale, evaluate the flux model. This is the same
  // chain in JS; every shell vertex must land back on its own iso-flux level.
  it('shell vertices map back onto their iso-flux level through the cut-face transform', () => {
    const kp = 6;
    const storageFlux = 0.6;
    const storm = 0.9;
    const sun = new THREE.Vector2(Math.cos(0.7), Math.sin(0.7));
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(0.1, 0.98, -0.15).normalize());
    const group = buildRadiationBeltGroup({
      kp, storageFlux, stormIntensity: storm, sunDirX: sun.x, sunDirZ: sun.y, dipoleQuaternion: q,
    });
    group.updateMatrixWorld(true);
    const worldToDipole = group.userData.cutFaceUniforms.uWorldToDipole.value;
    const v = new THREE.Vector3();

    for (const mesh of group.userData.shellGroup.children) {
      const { beltName, shell, def } = mesh.userData;
      const profile = resolveBeltProfile(beltName, { kp, storageFlux });
      const pos = mesh.geometry.attributes.position;
      for (let i = 0; i < pos.count; i += 97) {
        v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld).applyMatrix4(worldToDipole);
        if (def.deforms) {
          const eq = Math.hypot(v.x, v.z);
          const cosA = eq > 1e-6 ? (v.x * sun.x + v.z * sun.y) / eq : 0;
          v.divideScalar(1 - storm * STORM_MAX_DEFORM * cosA);
        }
        const r = v.length();
        const lambda = Math.asin(v.y / r);
        const L = r / Math.cos(lambda) ** 2;
        expect(beltFluxAt(profile, L, lambda)).toBeCloseTo(shell.level, 4);
      }
    }
    disposeRadiationBeltGroup(group);
  });
});

describe('updateBeltFlux / updateBeltClipping', () => {
  it('hides the storage ring at quiet times and shows it in storms', () => {
    const group = buildRadiationBeltGroup({});
    const storage = () => group.userData.shellGroup.children.filter((m) => m.userData.beltName === 'storageBelt');
    updateBeltFlux(group, { innerFlux: 0.6, outerFlux: 0.1 }, 0.85); // no storageBeltFlux given
    expect(storage().every((m) => !m.visible)).toBe(true);
    updateBeltFlux(group, FLUX, 0.85);
    expect(storage().every((m) => m.visible)).toBe(true);
    disposeRadiationBeltGroup(group);
  });

  it('solid peak shell writes depth; translucent shells and a translucent cut face do not', () => {
    const group = buildRadiationBeltGroup({ clippingPlanes: planes() });
    const shells = group.userData.shellGroup.children.filter((m) => m.userData.beltName === 'outerBelt');
    const face = group.userData.cutFaceGroup.children[0];

    updateBeltFlux(group, FLUX, 0.85);
    expect(shells.find((m) => m.userData.shell.key === 'peak').material.depthWrite).toBe(true);
    expect(shells.find((m) => m.userData.shell.key === 'halo').material.depthWrite).toBe(false);
    expect(face.material.depthWrite).toBe(true);

    updateBeltFlux(group, FLUX, 0.3);
    expect(shells.every((m) => m.material.depthWrite === false)).toBe(true);
    expect(face.material.depthWrite).toBe(false);
    disposeRadiationBeltGroup(group);
  });

  it('flux moves the outer belt colour up the colormap (toward red) in flux mode', () => {
    const group = buildRadiationBeltGroup({});
    const peak = group.userData.shellGroup.children.find(
      (m) => m.userData.beltName === 'outerBelt' && m.userData.shell.key === 'peak');
    updateBeltFlux(group, { innerFlux: 0.6, outerFlux: 0, storageBeltFlux: 0 }, 0.85);
    const quietGreen = peak.material.uniforms.uColor.value.y;
    updateBeltFlux(group, { innerFlux: 0.6, outerFlux: 1, storageBeltFlux: 0 }, 0.85);
    expect(peak.material.uniforms.uColor.value.y).toBeLessThan(quietGreen);
    disposeRadiationBeltGroup(group);
  });

  it('cut faces follow the active clipping planes and exclude their own plane', () => {
    const group = buildRadiationBeltGroup({ colorMode: 'belt' });
    const [a, b] = planes();
    updateBeltClipping(group, [a, b]);
    const faces = group.userData.cutFaceGroup.children;
    expect(faces.length).toBe(2);
    expect(faces[0].material.clippingPlanes).toEqual([b]);
    expect(faces[1].material.clippingPlanes).toEqual([a]);
    updateBeltClipping(group, [b]);
    expect(faces.length).toBe(1);
    updateBeltClipping(group, []);
    expect(faces.length).toBe(0);
    expect(() => updateBeltFlux(group, FLUX, 0.85)).not.toThrow();
    disposeRadiationBeltGroup(group);
  });
});
