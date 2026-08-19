/* hex-ripple — heksagongitter der en ring av pulser går ut fra midten,
   som når noe treffer vann. Fargen kommer fra presentasjonens aksent.
   Attributter: color, density (0.6–1.6), speed (0.4–1.6) */
(function () {
  if (customElements.get('hex-ripple')) return;

  class HexRipple extends HTMLElement {
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
        .catch(e => { console.warn('[hex-ripple] three.js kunne ikke lastes', e); this.fallback(); });
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

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const VIEW = 46 / Math.max(0.6, density);          // høyde i verdensenheter
      const aspect = w / h;
      const camera = new THREE.OrthographicCamera(-VIEW * aspect / 2, VIEW * aspect / 2, VIEW / 2, -VIEW / 2, -10, 10);

      /* aksialt heksagongitter, flat topp */
      const S = 1;                                        // cellestørrelse
      const stepX = S * 1.5, stepY = S * Math.SQRT2 * 1.2247;   // ≈ sqrt(3)
      const cols = Math.ceil((VIEW * aspect) / stepX) + 4;
      const rows = Math.ceil(VIEW / stepY) + 4;
      const cells = [];
      let maxD = 1;
      for (let q = -cols; q <= cols; q++) {
        for (let r = -rows; r <= rows; r++) {
          const x = stepX * q;
          const y = stepY * (r + q / 2);
          if (Math.abs(x) > VIEW * aspect / 2 + S || Math.abs(y) > VIEW / 2 + S) continue;
          const d = Math.hypot(x, y);
          cells.push(x, y, d);
          if (d > maxD) maxD = d;
        }
      }
      const N = cells.length / 3;

      const hex = new THREE.CircleGeometry(S * 0.99, 6);
      const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: false });
      const mesh = new THREE.InstancedMesh(hex, mat, N);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
      scene.add(mesh);

      const m4 = new THREE.Matrix4();
      const col = new THREE.Color();
      const white = new THREE.Color(0xffffff);

      /* dråpene faller étt sted om gangen, spredt utover flaten, og overlapper så vidt
         hverandre — bakgrunnen står aldri stille, men bærer aldri mer enn en svak ring. */
      const PERIOD = 2.1, RSPEED = VIEW * 0.15, WIDTH = VIEW * 0.055, LIFE = VIEW * 0.42;
      const dark = new THREE.Color(0x12101a);
      const halfW = VIEW * aspect / 2, halfH = VIEW / 2;
      const rnd = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
      const originX = k => (rnd(k * 2 + 1) - 0.5) * halfW * 1.7;
      const originY = k => (rnd(k * 2 + 2) - 0.5) * halfH * 1.7;

      for (let i = 0; i < N; i++) {
        m4.makeScale(0.93, 0.93, 1);
        m4.setPosition(cells[i * 3], cells[i * 3 + 1], 0);
        mesh.setMatrixAt(i, m4);
      }
      mesh.instanceMatrix.needsUpdate = true;

      const draw = t => {
        const newest = Math.floor(t / PERIOD);
        for (let i = 0; i < N; i++) {
          const cx = cells[i * 3], cy = cells[i * 3 + 1];
          let v = 0;
          for (let k = newest; k > newest - 3; k--) {
            if (k < 0) continue;
            const r = (t - k * PERIOD) * RSPEED;
            if (r > LIFE) continue;
            const dx = cx - originX(k), dy = cy - originY(k);
            const d = Math.sqrt(dx * dx + dy * dy);
            if (Math.abs(d - r) > WIDTH * 3) continue;
            const band = Math.exp(-((d - r) * (d - r)) / (2 * WIDTH * WIDTH));
            v += band * Math.max(0, 1 - r / LIFE);
          }
          v = Math.min(1, v);
          col.copy(dark).lerp(accent, Math.min(1, v * 1.25)).lerp(white, Math.min(0.2, v * v * 0.24)).multiplyScalar(0.006 + v * 0.32);
          mesh.setColorAt(i, col);
        }
        mesh.instanceColor.needsUpdate = true;
        renderer.render(scene, camera);
      };

      if (reduced) { draw(PERIOD * 1.6); return; }

      draw(PERIOD * 1.4);
      let t0 = performance.now(), t = 0, visible = true;
      const loop = now => {
        this._raf = requestAnimationFrame(loop);
        if (!visible) { t0 = now; return; }
        const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
        t += dt * speed;
        draw(t);
      };
      this._raf = requestAnimationFrame(loop);

      this._io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.02 });
      this._io.observe(this);

      this._ro = new ResizeObserver(() => {
        const nw = this.clientWidth, nh = this.clientHeight;
        if (!nw || !nh) return;
        renderer.setSize(nw, nh, false);
        const ar = nw / nh;
        camera.left = -VIEW * ar / 2; camera.right = VIEW * ar / 2;
        camera.updateProjectionMatrix();
      });
      this._ro.observe(this);

      this._cleanup = () => { hex.dispose(); mat.dispose(); renderer.dispose(); };
      this._dbg = { renderer, scene, camera, mesh, THREE };
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

  customElements.define('hex-ripple', HexRipple);
})();
