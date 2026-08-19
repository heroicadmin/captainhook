/* bg-scenes — tre ekstra three.js-bakgrunner for forside og seksjonsskille.
   Alle følger samme regler som ambient-field: rolig tempo, aksentfarge,
   stopper når sliden er ute av synsfeltet, står stille ved redusert bevegelse.
   Attributter: color, density (0.6–1.6), speed (0.4–1.6) */
(function () {
  const define = (tag, build) => {
    if (customElements.get(tag)) return;
    class Scene extends HTMLElement {
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
        import('https://esm.sh/three@0.160.0').then(T => { if (this._booted && gen === this._gen) this.boot(T); }).catch(e => {
          console.warn('[' + tag + '] three.js kunne ikke lastes', e);
          this.style.background = 'repeating-linear-gradient(135deg,#1A1724 0 14px,#201C2C 14px 28px)';
        });
      }
      boot(THREE) {
        const w = this.clientWidth || 1280, h = this.clientHeight || 720;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const o = {
          w, h, aspect: w / h,
          accent: new THREE.Color(this.getAttribute('color') || '#4A6BFF'),
          density: parseFloat(this.getAttribute('density') || '1'),
          speed: parseFloat(this.getAttribute('speed') || '1')
        };
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(w, h, false);
        renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
        this.appendChild(renderer.domElement);

        const s = build(THREE, o);
        const draw = t => { s.step(t); renderer.render(s.scene, s.camera); };

        if (reduced) { draw(2.4); return; }
        draw(1.6);
        let t0 = performance.now(), t = 0, visible = true;
        const loop = now => {
          this._raf = requestAnimationFrame(loop);
          if (!visible) { t0 = now; return; }
          const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
          t += dt * o.speed;
          draw(t);
        };
        this._raf = requestAnimationFrame(loop);

        this._io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.02 });
        this._io.observe(this);
        this._ro = new ResizeObserver(() => {
          const nw = this.clientWidth, nh = this.clientHeight;
          if (!nw || !nh) return;
          renderer.setSize(nw, nh, false);
          s.resize && s.resize(nw / nh);
        });
        this._ro.observe(this);
        this._cleanup = () => { s.dispose && s.dispose(); renderer.dispose(); };
        this._dbg = { renderer, THREE, scene: s.scene, camera: s.camera };
      }
      disconnectedCallback() { cancelAnimationFrame(this._reboot); this._reboot = null; this.teardown(); }

      teardown() {
        cancelAnimationFrame(this._raf);
        this._io && this._io.disconnect();
        this._ro && this._ro.disconnect();
        this._cleanup && this._cleanup();
        this._dbg = null; this._booted = false; this.innerHTML = '';
      }
    }
    customElements.define(tag, Scene);
  };

  /* ---------- 1. nettverk: punkter som driver, med korte forbindelser ---------- */
  define('bg-constellation', (THREE, o) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, o.aspect, 0.1, 100);
    camera.position.set(0, 0, 26);

    const N = Math.round(70 * o.density);
    const SX = 46, SY = 26, SZ = 16;
    const pos = new Float32Array(N * 3), seed = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * SX;
      pos[i * 3 + 1] = (Math.random() - 0.5) * SY;
      pos[i * 3 + 2] = (Math.random() - 0.5) * SZ;
      seed[i * 3] = Math.random() * 6.283; seed[i * 3 + 1] = Math.random() * 6.283; seed[i * 3 + 2] = 0.4 + Math.random() * 0.8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ color: o.accent.clone().lerp(new THREE.Color(0xffffff), 0.45), size: 0.22, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    /* forbindelsene bestemmes én gang — ellers blinker nettet */
    const pairs = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = pos[i * 3] - pos[j * 3], dy = pos[i * 3 + 1] - pos[j * 3 + 1], dz = pos[i * 3 + 2] - pos[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < 46) pairs.push(i, j);
    }
    const lPos = new Float32Array(pairs.length * 3);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3));
    const lMat = new THREE.LineBasicMaterial({ color: o.accent, transparent: true, opacity: 0.22, depthWrite: false });
    scene.add(new THREE.LineSegments(lGeo, lMat));

    return {
      scene, camera,
      resize: a => { camera.aspect = a; camera.updateProjectionMatrix(); },
      step: t => {
        const p = pGeo.attributes.position.array;
        for (let i = 0; i < N; i++) {
          p[i * 3] += Math.sin(t * 0.22 * seed[i * 3 + 2] + seed[i * 3]) * 0.004;
          p[i * 3 + 1] += Math.cos(t * 0.19 * seed[i * 3 + 2] + seed[i * 3 + 1]) * 0.004;
        }
        pGeo.attributes.position.needsUpdate = true;
        for (let k = 0; k < pairs.length; k++) {
          const s = pairs[k] * 3;
          lPos[k * 3] = p[s]; lPos[k * 3 + 1] = p[s + 1]; lPos[k * 3 + 2] = p[s + 2];
        }
        lGeo.attributes.position.needsUpdate = true;
        scene.rotation.y = Math.sin(t * 0.06) * 0.14;
        scene.rotation.x = Math.cos(t * 0.05) * 0.06;
      },
      dispose: () => { pGeo.dispose(); pMat.dispose(); lGeo.dispose(); lMat.dispose(); }
    };
  });

  /* ---------- 2. tunnel: heksagonrammer som kommer mot deg ---------- */
  define('bg-tunnel', (THREE, o) => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x12101a, 0.024);
    const camera = new THREE.PerspectiveCamera(58, o.aspect, 0.1, 160);
    camera.position.set(0, 0, 0);

    const RINGS = Math.round(22 * o.density), GAP = 5.5, R = 13;
    const pts = [];
    for (let i = 0; i <= 6; i++) pts.push(new THREE.Vector3(Math.cos(i / 6 * 6.283) * R, Math.sin(i / 6 * 6.283) * R, 0));
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const group = new THREE.Group();
    const mats = [];
    for (let i = 0; i < RINGS; i++) {
      const m = new THREE.LineBasicMaterial({ color: o.accent.clone().lerp(new THREE.Color(0xffffff), (i % 5) === 0 ? 0.5 : 0.05), transparent: true, opacity: 0.42, depthWrite: false });
      mats.push(m);
      const line = new THREE.Line(geo, m);
      line.position.z = -i * GAP;
      line.rotation.z = i * 0.11;
      group.add(line);
    }
    scene.add(group);

    const span = RINGS * GAP;
    return {
      scene, camera,
      resize: a => { camera.aspect = a; camera.updateProjectionMatrix(); },
      step: t => {
        const travel = (t * 2.6) % GAP;
        group.children.forEach((line, i) => {
          const z = -span + ((i * GAP + travel) % span);
          line.position.z = z;
          line.rotation.z = i * 0.11 + t * 0.05;
        });
        camera.position.x = Math.sin(t * 0.16) * 1.1;
        camera.position.y = Math.cos(t * 0.13) * 0.8;
        camera.lookAt(0, 0, -30);
      },
      dispose: () => { geo.dispose(); mats.forEach(m => m.dispose()); }
    };
  });

  /* ---------- 3. sveip: en radar som går rundt over et polargitter ---------- */
  define('bg-sweep', (THREE, o) => {
    const scene = new THREE.Scene();
    const H = 30;
    const camera = new THREE.OrthographicCamera(-H * o.aspect / 2, H * o.aspect / 2, H / 2, -H / 2, -10, 10);

    const grid = new THREE.Group();
    const gMat = new THREE.LineBasicMaterial({ color: o.accent.clone().lerp(new THREE.Color(0x12101a), 0.72), transparent: true, opacity: 0.4, depthWrite: false });
    const geos = [];
    for (let r = 4; r <= 26; r += 4) {
      const pts = [];
      for (let i = 0; i <= 72; i++) pts.push(new THREE.Vector3(Math.cos(i / 72 * 6.283) * r, Math.sin(i / 72 * 6.283) * r, 0));
      const g = new THREE.BufferGeometry().setFromPoints(pts); geos.push(g);
      grid.add(new THREE.Line(g, gMat));
    }
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * 6.283;
      const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * 26, Math.sin(a) * 26, 0)]);
      geos.push(g);
      grid.add(new THREE.Line(g, gMat));
    }
    scene.add(grid);

    /* selve sveipet: en kile som roterer og etterlater et kort spor */
    const wedge = new THREE.CircleGeometry(26, 40, 0, 0.85);
    const wMat = new THREE.MeshBasicMaterial({ color: o.accent, transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending });
    const arm = new THREE.Mesh(wedge, wMat);
    scene.add(arm);

    const BN = Math.round(26 * o.density);
    const bPos = new Float32Array(BN * 3), bAng = new Float32Array(BN);
    for (let i = 0; i < BN; i++) {
      const a = Math.random() * 6.283, r = 3 + Math.random() * 22;
      bPos[i * 3] = Math.cos(a) * r; bPos[i * 3 + 1] = Math.sin(a) * r; bPos[i * 3 + 2] = 0.01;
      bAng[i] = a;
    }
    const bGeo = new THREE.BufferGeometry();
    bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
    const bMat = new THREE.PointsMaterial({ color: o.accent.clone().lerp(new THREE.Color(0xffffff), 0.5), size: 0.55, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
    scene.add(new THREE.Points(bGeo, bMat));

    return {
      scene, camera,
      resize: a => { camera.left = -H * a / 2; camera.right = H * a / 2; camera.updateProjectionMatrix(); },
      step: t => {
        arm.rotation.z = -t * 0.55;
        grid.rotation.z = t * 0.012;
        /* blipp lyser opp idet armen passerer */
        const head = ((-t * 0.55) % 6.283 + 6.283) % 6.283;
        let lit = 0;
        for (let i = 0; i < BN; i++) {
          let d = head - bAng[i]; d = ((d % 6.283) + 6.283) % 6.283;
          if (d < 0.9) lit++;
        }
        bMat.opacity = 0.32 + 0.3 * Math.min(1, lit / Math.max(1, BN * 0.25));
      },
      dispose: () => { geos.forEach(g => g.dispose()); gMat.dispose(); wedge.dispose(); wMat.dispose(); bGeo.dispose(); bMat.dispose(); }
    };
  });
})();
