import http from 'node:http';

const sports = ['Lacrosse', 'Volleyball', 'Basketball', 'Swimming'];
const paths = sports.map(s => s.toLowerCase());

const style = `
*{box-sizing:border-box}
body{margin:0;background:#f5f0e7;color:#122239;font-family:Arial,sans-serif}
header{background:#0c1728;color:white;padding:20px 5%;border-bottom:5px solid #c62d44;display:flex;justify-content:space-between;align-items:center}
header a{color:white;text-decoration:none;font-weight:bold}
.logo{font-size:22px;letter-spacing:3px}
.logo b{font-size:35px;color:#edbd68;font-style:italic;margin-right:10px;text-shadow:3px 3px #bf2d47}
details{position:relative}
summary{cursor:pointer;font-weight:900}
nav{position:absolute;right:0;top:30px;background:white;color:#122239;min-width:210px;padding:12px;box-shadow:0 6px 25px #0005;z-index:3}
nav a{display:block;color:#122239;padding:13px}
.hero{min-height:65vh;padding:65px 7%;background:linear-gradient(110deg,#0e1b30,#213d5a);color:white}
.hero h1{font-size:clamp(46px,10vw,120px);line-height:.96;letter-spacing:-3px;margin:25px 0;font-weight:1000}
.hero p{font-size:20px;max-width:630px;line-height:1.5}
.gold{color:#edbd68}
.kicker{font-weight:900;letter-spacing:3px;color:#edbd68;text-transform:uppercase}
.btn{display:inline-block;background:#c62d44;color:white;text-decoration:none;border:0;padding:17px 22px;margin:10px 10px 5px 0;font-weight:bold;cursor:pointer}
main{padding:55px 7%;min-height:35vh}
h2{font-size:clamp(30px,5vw,60px);text-transform:uppercase}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px}
.card{padding:28px;background:white;border-top:6px solid #c62d44;min-height:145px;color:#122239;text-decoration:none}
.card strong{display:block;font-size:24px;text-transform:uppercase}
.card small{display:block;margin-top:20px;color:#596575}
label{display:block;font-weight:bold;margin-top:18px}
select{padding:14px;width:100%;max-width:480px;margin-top:8px}
.panel{background:white;padding:28px;max-width:650px}
.note{padding:15px;background:#f2e6ca;margin-top:25px}
footer{background:#0c1728;color:white;padding:22px 7%}
@media(max-width:600px){header{padding:14px}.logo{font-size:13px}.hero{padding:55px 22px}.hero h1{letter-spacing:-1px}}
`;

function layout(title, content) {
const links = sports.map(s =>
  `<a href="/sports/${s.toLowerCase()}">${s}</a>`
).join('');
return `<!doctype html><html lang="en">
<head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} | Arena Pathway</title>
<style>${style}</style></head>
<body>
<header>
<a class="logo" href="/"><b>A</b> ARENA PATHWAY</a>
<details><summary>SPORTS ▾</summary><nav>
${links}<a href="/build">Build Your Own</a>
</nav></details>
</header>
${content}
<footer>ARENA PATHWAY · Your sport. Your path. One place.</footer>
</body></html>`;
}

function homepage() {
return layout('Home', `
<section class="hero">
<div class="kicker">The journey starts here</div>
<h1>YOUR SPORT.<br><span class="gold">YOUR PATH.</span><br>ONE PLACE.</h1>
<p>Discover your team. Develop your game. Connect with your community. Explore your next opportunity.</p>
<a class="btn" href="/build">BUILD YOUR OWN PATHWAY</a>
<a class="btn" href="#sports">EXPLORE SPORTS</a>
</section>
<main id="sports">
<div class="kicker">Colorado first · Athletes and families</div>
<h2>Find your pathway</h2>
<div class="cards">
${sports.map(s => `<a class="card" href="/sports/${s.toLowerCase()}"><strong>${s}</strong><small>Teams · Tryouts · Camps · Community</small></a>`).join('')}
<a class="card" href="/build"><strong>Build Your Own</strong><small>Create your personalized pathway</small></a>
</div></main>`);
}

function sportpage(sport) {
return layout(sport, `
<section class="hero">
<div class="kicker">Colorado sports</div>
<h1>${sport.toUpperCase()}</h1>
<p>Find programs, teams, opportunities and community resources for ${sport.toLowerCase()}.</p>
<a class="btn" href="/build?sport=${sport}">BUILD MY ${sport.toUpperCase()} PATHWAY</a>
</section>
<main><h2>Explore ${sport}</h2>
<div class="cards">
${['Teams','Tryouts','Camps','Community'].map(x => `<div class="card"><strong>${x}</strong><small>Colorado records being expanded</small></div>`).join('')}
</div>
<div class="note">The statewide directory is not complete. We won't present external directories as populated team lists.</div>
</main>`);
}

function builder() {
return layout('Build Your Own', `
<section class="hero">
<div class="kicker">Your journey. Your choices.</div>
<h1>BUILD<br><span class="gold">YOUR OWN.</span></h1>
<p>Choose your sport, your goals, and what information matters to you.</p>
</section>
<main><div class="panel">
<h2>My Pathway</h2>
<label>Sport</label>
<select id="sport">${sports.map(s => `<option>${s}</option>`).join('')}<option>Other Sport</option></select>
<label>I am a...</label>
<select id="role"><option>Athlete</option><option>Parent / Family</option></select>
<label>My primary goal</label>
<select id="goal"><option>Find Teams</option><option>Tryouts & Camps</option><option>Development</option><option>Recruiting</option><option>Community</option></select>
<label><input type="checkbox" id="media"> Include sport media</label>
<p>Media is off by default. Source selection will be added with our data-connected release.</p>
<button class="btn" id="save">SAVE MY PATHWAY</button>
<p id="result" role="status"></p>
<div class="note">Alpha: preferences are saved on this device only. Accounts and live feeds are not connected.</div>
</div></main>
<script>
const chosen = new URLSearchParams(location.search).get('sport');
if(chosen) document.getElementById('sport').value = chosen;
document.getElementById('save').onclick = () => {
 const p = {
  sport:document.getElementById('sport').value,
  role:document.getElementById('role').value,
  goal:document.getElementById('goal').value,
  media:document.getElementById('media').checked
 };
 localStorage.setItem('arenaPathway',JSON.stringify(p));
 document.getElementById('result').textContent =
  'Saved locally: '+p.sport+' — '+p.goal;
};
</script>`);
}

const server = http.createServer((req,res) => {
const pathname = new URL(req.url,'http://localhost').pathname;
let output, status = 200;

if(pathname === '/') output = homepage();
else if(pathname === '/build') output = builder();
else if(pathname.startsWith('/sports/') &&
  paths.includes(pathname.split('/')[2])) {
 const sport = sports[paths.indexOf(pathname.split('/')[2])];
 output = sportpage(sport);
}
else if(pathname === '/health') {
 res.writeHead(200,{'Content-Type':'application/json'});
 return res.end(JSON.stringify({ok:true,version:'0.5.1-bootstrap'}));
}
else {
 status = 404;
 output = layout('Not Found','<main><h2>Page not found</h2></main>');
}
res.writeHead(status,{'Content-Type':'text/html; charset=utf-8'});
res.end(output);
});

server.listen(Number(process.env.PORT)||3000,'0.0.0.0',
 () => console.log('Arena Pathway started'));
