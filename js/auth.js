/* ==========================================================
   Lengkapi SOP - gerbang login dashboard
   Password tidak disimpan di kode; hanya hasil hash PBKDF2-SHA256 (js/auth-config.js).
   Catatan: ini situs statis, jadi gerbang ini berjalan di browser. Cukup untuk mencegah
   orang iseng, bukan pengganti keamanan server.
   ========================================================== */
(function (g) {
  'use strict';
  const C = g.LSOP_AUTH || {};
  const enc = new TextEncoder();
  const hex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  const SK = 'lsop.auth', FK = 'lsop.authfail';

  async function derive(pw) {
    const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(C.salt), iterations: C.iter || 210000 }, key, 256);
    return hex(bits);
  }
  const fails = () => { try { return JSON.parse(localStorage.getItem(FK)) || { n: 0, until: 0 }; } catch (e) { return { n: 0, until: 0 }; } };
  const setFails = f => { try { localStorage.setItem(FK, JSON.stringify(f)); } catch (e) { /* diabaikan */ } };

  g.Auth = {
    configured() { return !!(C.salt && C.hash); },
    isLoggedIn() { return this.configured() && sessionStorage.getItem(SK) === C.hash; },
    logout() { sessionStorage.removeItem(SK); },
    waitSeconds() { return Math.max(0, Math.ceil((fails().until - Date.now()) / 1000)); },
    async login(pw) {
      if (!this.configured() || !g.crypto || !crypto.subtle) return { ok: false, reason: 'config' };
      const w = this.waitSeconds(); if (w > 0) return { ok: false, reason: 'wait', wait: w };
      let h; try { h = await derive(pw); } catch (e) { return { ok: false, reason: 'config' }; }
      if (h === C.hash) { sessionStorage.setItem(SK, h); setFails({ n: 0, until: 0 }); return { ok: true }; }
      const f = fails(); f.n++;
      if (f.n >= 5) { f.until = Date.now() + Math.min(900, 15 * Math.pow(2, f.n - 5)) * 1000; }
      setFails(f); return { ok: false, reason: 'wrong', left: Math.max(0, 5 - f.n) };
    }
  };
})(window);
