const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'public', 'index.html');
if (!fs.existsSync(file)) {
  console.error('❌ public/index.html nahi mila. Apni purani index.html public/ folder me daalo.');
  process.exit(1);
}

fs.copyFileSync(file, file + '.bak');
let html = fs.readFileSync(file, 'utf8');
let ok = 0, miss = 0;

const r = (from, to) => {
  if (!html.includes(from)) { console.warn('⚠️  Not found:', from.slice(0, 60)); miss++; return; }
  html = html.split(from).join(to); ok++;
};

// Naam
r('<meta name="theme-color" content="#070a16">', '<meta name="theme-color" content="#000000">');
r('content="Singify">', 'content="ANKY MUSIC HUB">');
r('<title>Singify</title>', '<title>ANKY MUSIC HUB</title>');
r('</svg>Singify</div>', '</svg>ANKY MUSIC HUB</div>');
r('aria-label="Singify home"><span class="bt">Singify</span>', 'aria-label="ANKY MUSIC HUB home"><span class="bt">ANKY</span>');
r('<div>Playing from<b id="nfrom">Singify</b></div>', '<div>Playing from<b id="nfrom">ANKY MUSIC HUB</b></div>');
r("VN='Singify'", "VN='ANKY MUSIC HUB'");
r("}[v]||'Singify';", "}[v]||'ANKY MUSIC HUB';");
r("VN=l.from||'Singify';", "VN=l.from||'ANKY MUSIC HUB';");
r("album:s.alb||'Singify'", "album:s.alb||'ANKY MUSIC HUB'");
r('>Singify Top 10 ›</a>', '>ANKY Top 10 ›</a>');
r('Trending on Singify \\u00b7 #', 'Trending on ANKY MUSIC HUB \\u00b7 #');
r('Singify v5', 'ANKY MUSIC HUB v1');
r("title:'Singify',text:web?'Singify - free music player':'Singify app - free music player'",
  "title:'ANKY MUSIC HUB',text:web?'ANKY MUSIC HUB - free music player':'ANKY MUSIC HUB app'");
r("dlg('Share Singify',u,{ok:'OK'})", "dlg('Share ANKY MUSIC HUB',u,{ok:'OK'})");
r('<h3>Share Singify</h3>', '<h3>Share ANKY MUSIC HUB</h3>');
r('Share Singify web', 'Share ANKY MUSIC HUB web');
r('Share Singify app', 'Share ANKY MUSIC HUB app');
r('<h3>Install Singify</h3>', '<h3>Install ANKY MUSIC HUB</h3>');
r("toast('Singify installed')", "toast('ANKY MUSIC HUB installed')");
r('<h3>Get the Singify app</h3>', '<h3>Get the ANKY MUSIC HUB app</h3>');
r("'A new version of Singify is ready.'", "'A new version of ANKY MUSIC HUB is ready.'");

// Theme
r("@property --ac{syntax:'<color>';inherits:true;initial-value:#7c6cff}",
  "@property --ac{syntax:'<color>';inherits:true;initial-value:#a855f7}");
r("@property --ac2{syntax:'<color>';inherits:true;initial-value:#4f8bff}",
  "@property --ac2{syntax:'<color>';inherits:true;initial-value:#7c3aed}");
r("@property --acl{syntax:'<color>';inherits:true;initial-value:#5a48e0}",
  "@property --acl{syntax:'<color>';inherits:true;initial-value:#8b2fd6}");
r("@property --acl2{syntax:'<color>';inherits:true;initial-value:#2f6fe0}",
  "@property --acl2{syntax:'<color>';inherits:true;initial-value:#6425c4}");
r(":root{--gold:var(--ac);--gold2:var(--ac2);--bg:#070a16;--ps:#0f1530;--panel:rgba(18,23,48,.66);--card:rgba(255,255,255,.07);--line:rgba(255,255,255,.1);--tx:#eef0ff;--mut:#9aa3c7;--g1:rgba(255,255,255,.1);--g2:rgba(255,255,255,.035);--gb:rgba(255,255,255,.15);--gh:rgba(255,255,255,.3);--sh:rgba(0,0,0,.35);transition:--ac .6s,--ac2 .6s,--acl .6s,--acl2 .6s}",
  ":root{--gold:var(--ac);--gold2:var(--ac2);--bg:#000000;--ps:#0a0410;--panel:rgba(22,10,34,.66);--card:rgba(255,255,255,.07);--line:rgba(168,85,247,.18);--tx:#f3ecff;--mut:#a89bc6;--g1:rgba(255,255,255,.09);--g2:rgba(168,85,247,.05);--gb:rgba(168,85,247,.22);--gh:rgba(255,255,255,.22);--sh:rgba(0,0,0,.5);transition:--ac .6s,--ac2 .6s,--acl .6s,--acl2 .6s}");
r('linear-gradient(180deg,#0b1128,#060812)', 'linear-gradient(180deg,#0a0312,#000000)');
r("html[data-theme=light]{--gold:var(--acl);--gold2:var(--acl2);--bg:#eef1fb;--ps:#f5f7ff;--panel:rgba(255,255,255,.62);--card:rgba(255,255,255,.55);--line:rgba(40,50,110,.12);--tx:#141838;--mut:#5b6389;--g1:rgba(255,255,255,.85);--g2:rgba(255,255,255,.45);--gb:rgba(255,255,255,.95);--gh:#fff;--sh:rgba(60,70,140,.18)}",
  "html[data-theme=light]{--gold:var(--acl);--gold2:var(--acl2);--bg:#f4eefc;--ps:#fbf7ff;--panel:rgba(255,255,255,.62);--card:rgba(255,255,255,.55);--line:rgba(90,40,140,.14);--tx:#1a1030;--mut:#6b5b86;--g1:rgba(255,255,255,.85);--g2:rgba(255,255,255,.45);--gb:rgba(168,85,247,.35);--gh:#fff;--sh:rgba(80,40,130,.18)}");
r('linear-gradient(180deg,#f6f8ff,#e6eafa)', 'linear-gradient(180deg,#fbf7ff,#ece2fa)');
r("html[data-skin=violet]{--ac:hsl(250 95% 62%);--ac2:hsl(220 95% 55%);--acl:hsl(250 80% 48%);--acl2:hsl(220 85% 42%)}",
  "html[data-skin=violet]{--ac:hsl(272 92% 66%);--ac2:hsl(292 88% 60%);--acl:hsl(272 85% 48%);--acl2:hsl(292 80% 44%)}");
r('.logo{color:#f2b630}', '.logo{color:#b06bff}');
r('.bt{background-image:linear-gradient(100deg,#b8800f 10%,#ffe08a 45%,#f2b630 55%,#b8800f 90%)}.bq i{background:#f2b630}',
  '.bt{background-image:linear-gradient(100deg,#7c3aed 10%,#e9d5ff 45%,#a855f7 55%,#7c3aed 90%)}.bq i{background:#a855f7}');
r('.logo{display:flex;align-items:center;gap:10px;font-size:26px;font-weight:800;color:var(--gold);padding:0 10px 24px;letter-spacing:.3px}\n.logo svg{width:34px;height:34px}',
  '.logo{display:flex;align-items:center;gap:9px;font-size:19px;font-weight:800;color:var(--gold);padding:0 8px 24px;letter-spacing:.2px}\n.logo svg{width:30px;height:30px;flex:none}');
r("let SKIN=ls('sg_skin','lemon');if(!SKINS.some(x=>x[0]===SKIN))SKIN='lemon';",
  "let SKIN=ls('sg_skin','violet');if(!SKINS.some(x=>x[0]===SKIN))SKIN='violet';");
r("if(on){stopMixT();paintSkin('lemon')}", "if(on){stopMixT();paintSkin('violet')}");
r(`localStorage.setItem('sg_skin','"lemon"')`, `localStorage.setItem('sg_skin','"violet"')`);
r("if(m)m.content=t==='light'?'#eef1fb':'#070a16';", "if(m)m.content=t==='light'?'#f4eefc':'#000000';");

// Footer credit
r('</style>', `
/* ===== credit footer ===== */
#main::after{
  content:"Design by Master ANIKESH";
  display:block;
  text-align:center;
  font-size:12px;
  font-weight:700;
  letter-spacing:1.1px;
  text-transform:uppercase;
  color:var(--gold);
  opacity:.75;
  padding:30px 0 10px;
  margin-top:auto;
}
</style>`);

r('<a class="nl tp" data-nav="settings" href="#/settings" style="margin-top:14px"></a>',
  '<a class="nl tp" data-nav="settings" href="#/settings" style="margin-top:14px"></a>\n  <div style="margin:18px 12px 6px;font-size:11px;letter-spacing:.8px;color:var(--mut);opacity:.7;text-align:center">Design by Master ANIKESH</div>');

fs.writeFileSync(file, html);
console.log(`\n✅ ${ok} changes applied, ${miss} skipped.`);
console.log(`📁 Backup: public/index.html.bak`);