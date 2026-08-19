/* ambient-field — rolig, digital bakgrunn for forside- og skilleslides.
   Et punktgitter som bølger sakte. Ingen blink, ingen harde kontraster:
   bildene skal ha energien, bakgrunnen skal bare puste.
   Attributter: color (aksentfarge), density (0.6–1.6), speed (0.4–1.6) */
(function () {
  if (customElements.get('ambient-field')) return;

  class AmbientField extends HTMLElement {
    static get observedAttributes() { return ['density', 'speed', 'color']; }
    /* Nivåbytte i editoren endrer bare attributtene. Geometri og fart settes ved oppstart,
       så scenen bygges på nytt — samlet i én ramme, slik at tre attributter gir én ombygging. */
    attributeChangedCallback() {
      if (!this._booted || this._reboot) return;
      this._reboot = requestAnimationFrame(() => {
        this._reboot = null;
        if (!this.isConnected) return;
        this.teardown();
        this.connectedCallback();
      });
    }

    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      const gen = this._gen = (this._gen || 0) + 1;
      this.style.cssText = 'position:absolute;inset:0;display:block;overflow:hidden;background:#12101A';
      import('https://esm.sh/three@0.160.0')
        .then(T => { if (this._booted && gen === this._gen) this.boot(T); })
        .catch(e => { console.warn('[ambient-field] three.js kunne ikke lastes', e); this.fallback(); });
    }

    fallback() {
      this.style.background = 'repeating-linear-gradient(135deg,#1A1724 0 14px,#201C2C 14px 28px)';
    }

    boot(THREE) {
      const w = this.clientWidth || 1280, h = this.clientHeight || 720;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const accent = new THREE.Color(this.getAttribute('color') || '#4A6BFF');
      const density = parseFloat(this.getAttribute('density') || '1');
      const speed = parseFloat(this.getAttribute('speed') || '1');

      // preserveDrawingBuffer: uten den blir feltet blankt i PDF-eksport og skjermbilder
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x12101a, 0.058);

      const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 120);
      camera.position.set(0, 3.4, 10.5);
      camera.lookAt(0, 0.2, 0);

      // punktgitter → linjegitter. Linjer rasteriseres alltid; punkter på under én piksel gjør det ikke.
      const NX = Math.round(72 * density), NZ = Math.round(46 * density);
      const SX = 46, SZ = 30;
      const count = NX * NZ;
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const base = new Float32Array(count * 2);
      const tint = new THREE.Color();
      let i = 0;
      for (let z = 0; z < NZ; z++) {
        for (let x = 0; x < NX; x++, i++) {
          const px = (x / (NX - 1) - 0.5) * SX;
          const pz = (z / (NZ - 1) - 0.5) * SZ;
          pos[i * 3] = px; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = pz;
          base[i * 2] = px; base[i * 2 + 1] = pz;
          // fargen går fra aksent i dybden til nesten hvitt nærmest
          const t = Math.pow(z / (NZ - 1), 1.6);
          tint.copy(accent).lerp(new THREE.Color(0xffffff), 0.25 + t * 0.55);
          const fade = 0.3 + t * 0.7;
          col[i * 3] = tint.r * fade; col[i * 3 + 1] = tint.g * fade; col[i * 3 + 2] = tint.b * fade;
        }
      }
      const idx = [];
      for (let z = 0; z < NZ; z++) for (let x = 0; x < NX - 1; x++) { const a = z * NX + x; idx.push(a, a + 1); }
      for (let z = 0; z < NZ - 1; z++) for (let x = 0; x < NX; x++) { const a = z * NX + x; idx.push(a, a + NX); }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geo.setIndex(idx);
      const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false });
      const points = new THREE.LineSegments(geo, mat);
      scene.add(points);

      // datapartikler — stiger sakte over gitteret
      const PN = Math.round(110 * density);
      const pPos = new Float32Array(PN * 3), pSeed = new Float32Array(PN * 2);
      for (let k = 0; k < PN; k++) {
        pSeed[k * 2] = Math.random(); pSeed[k * 2 + 1] = Math.random();
        pPos[k * 3] = (pSeed[k * 2] - 0.5) * SX;
        pPos[k * 3 + 1] = Math.random() * 5;
        pPos[k * 3 + 2] = (Math.random() - 0.5) * SZ;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({ color: accent.clone().lerp(new THREE.Color(0xffffff), 0.55), size: 0.09, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending });
      const parts = new THREE.Points(pGeo, pMat);
      scene.add(parts);

      const wave = t => {
        const p = geo.attributes.position.array;
        for (let k = 0; k < count; k++) {
          const x = base[k * 2], z = base[k * 2 + 1];
          p[k * 3 + 1] = Math.sin(x * 0.22 + t) * 0.62
                       + Math.sin(z * 0.31 - t * 0.72) * 0.42
                       + Math.sin((x + z) * 0.09 + t * 0.45) * 0.3;
        }
        geo.attributes.position.needsUpdate = true;
      };

      const drift = t => {
        const p = pGeo.attributes.position.array;
        for (let k = 0; k < PN; k++) {
          const s1 = pSeed[k * 2], s2 = pSeed[k * 2 + 1];
          p[k * 3 + 1] = 0.3 + ((s1 * 5.2 + t * (0.22 + s2 * 0.3)) % 5.2);
          p[k * 3] = (s1 - 0.5) * SX + Math.sin(t * 0.4 + s2 * 6.283) * 0.5;
        }
        pGeo.attributes.position.needsUpdate = true;
      };
      const draw = t => { wave(t); drift(t); geo.computeBoundingSphere(); camera.position.x = Math.sin(t * 0.11) * 1.5; camera.lookAt(0, 0.2, 0); renderer.render(scene, camera); };

      if (reduced) { draw(0.8); return; }

      draw(0.6);   // ett bilde med én gang — rAF kan være strupt i skjulte faner og ved eksport
      let t0 = performance.now(), t = 0, visible = true;
      const loop = now => {
        this._raf = requestAnimationFrame(loop);
        if (!visible) { t0 = now; return; }
        const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
        t += dt * 0.28 * speed;
        draw(t);
      };
      this._raf = requestAnimationFrame(loop);

      this._io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.02 });
      this._io.observe(this);

      this._ro = new ResizeObserver(() => {
        const nw = this.clientWidth, nh = this.clientHeight;
        if (!nw || !nh) return;
        renderer.setSize(nw, nh, false);
        camera.aspect = nw / nh; camera.updateProjectionMatrix();
      });
      this._ro.observe(this);

      this._cleanup = () => { geo.dispose(); mat.dispose(); pGeo.dispose(); pMat.dispose(); renderer.dispose(); };
      this._dbg = { renderer, scene, camera, points, geo, mat, THREE };
    }

    disconnectedCallback() { cancelAnimationFrame(this._reboot); this._reboot = null; this.teardown(); }

    teardown() {
      cancelAnimationFrame(this._raf);
      this._io && this._io.disconnect();
      this._ro && this._ro.disconnect();
      this._cleanup && this._cleanup();
      this._dbg = null;
      this._booted = false;
      this.innerHTML = '';
    }
  }

  customElements.define('ambient-field', AmbientField);
})();
