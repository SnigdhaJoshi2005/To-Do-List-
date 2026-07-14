const QMascot = (() => {
  const CELL = 5;
  const FILL = { f:"url(#qPetal)", c:"var(--q-center)", s:"var(--q-stem)", l:"var(--q-leaf)", r:"var(--q-pot-rim)", p:"var(--q-pot)" };

  function bodyGrid(){
    const rows = 22, cols = 20;
    const g = Array.from({length:rows}, () => Array(cols).fill(null));
    const set = (r,c0,c1,ch) => { for (let c=c0;c<=c1;c++) g[r][c]=ch; };
    // top petal
    set(1,8,11,"f"); set(2,7,12,"f"); set(3,7,12,"f");
    // main head + left/right petal bumps
    set(4,6,13,"f"); set(5,5,14,"f"); set(6,4,15,"f");
    set(7,1,4,"f");  set(7,5,14,"f");  set(7,15,18,"f");
    set(8,1,4,"f");  set(8,5,14,"f");  set(8,15,18,"f");
    set(9,1,4,"f");  set(9,5,14,"f");  set(9,15,18,"f");
    set(10,1,4,"f"); set(10,5,14,"f"); set(10,15,18,"f");
    set(11,4,15,"f"); set(12,5,14,"f"); set(13,6,13,"f");
    // bottom petal
    set(14,7,12,"f"); set(15,7,12,"f"); set(16,8,11,"f");
    // pale center patch (face sits here)
    set(7,7,12,"c"); set(8,7,12,"c"); set(9,7,12,"c"); set(10,7,12,"c");
    // stem + leaf
    set(17,9,10,"s"); set(18,9,10,"s"); set(18,12,14,"l");
    // pot
    set(19,6,13,"r"); set(20,6,13,"p"); set(21,7,12,"p");
    return g;
  }

  function rectsFromGrid(g){
    let out = "";
    for (let r=0;r<g.length;r++) for (let c=0;c<g[r].length;c++){
      const ch = g[r][c];
      if (!ch) continue;
      out += `<rect x="${c*CELL}" y="${r*CELL}" width="${CELL}" height="${CELL}" fill="${FILL[ch]}"/>`;
    }
    return out;
  }

  function face(state){
    const blink = state==="sleepy" ? "q-eye-closed" : "q-eye";
    let mouth;
    if (state==="cheer") mouth = `<rect x="40" y="50" width="20" height="5" fill="#4B5563"/><rect x="45" y="55" width="10" height="5" fill="#4B5563"/>`;
    else if (state==="happy") mouth = `<rect x="40" y="50" width="20" height="5" fill="#4B5563"/>`;
    else mouth = `<rect x="45" y="50" width="10" height="5" fill="#4B5563"/>`;
    return `
      <rect class="${blink}" x="35" y="40" width="5" height="5" fill="#4B5563"/>
      <rect class="${blink}" x="60" y="40" width="5" height="5" fill="#4B5563"/>
      <rect x="30" y="45" width="5" height="5" fill="var(--q-blush)" opacity="0.85"/>
      <rect x="65" y="45" width="5" height="5" fill="var(--q-blush)" opacity="0.85"/>
      ${mouth}`;
  }

  function svg(state){
    return `<svg viewBox="0 0 100 110" class="w-full h-full" shape-rendering="crispEdges">
      <ellipse cx="50" cy="105" rx="24" ry="5" fill="#000" opacity="0.06"/>
      <g class="q-mascot-bob">
        ${rectsFromGrid(bodyGrid())}
        ${face(state)}
      </g>
      <defs><linearGradient id="qPetal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="var(--q-petal-a)"/><stop offset="50%" stop-color="var(--q-petal-c)"/><stop offset="100%" stop-color="var(--q-petal-b)"/>
      </linearGradient></defs></svg>`;
  }
  function mount(elId,initialState="idle"){ const el=document.getElementById(elId); if(!el) return; el.innerHTML=svg(initialState); el.dataset.state=initialState; }
  function setState(elId,state){ const el=document.getElementById(elId); if(!el) return; el.innerHTML=svg(state); el.dataset.state=state; if(state==="cheer"){ el.classList.add("q-mascot-cheer"); setTimeout(()=>el.classList.remove("q-mascot-cheer"),700); } }
  return { mount, setState };
})();