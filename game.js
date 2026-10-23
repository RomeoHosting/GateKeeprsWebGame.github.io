/* Gate Keeper — ماجراجویی ۸ مداره (جایگزین مینی‌گیم قبلی). index.html باید قبل از اسکریپت اصلی این فایل را لود کند. */
(()=>{
const $=id=>document.getElementById(id),gameEl=$('game'),cv=$('gcv'),c=cv.getContext('2d'),gnpc=$('gnpc'),gbub=$('gbub'),gload=$('gload'),goal=$('gGoal');
const T=32,W=18,H=16,fa=n=>n.toLocaleString('fa-IR');
/* s: ‎@ شروع، N ساکن، I آیتم، L/l چراغ(خاموش/روشن)، K/k بلور، R سنگ، H سنگِ پنهان‌کننده، B دکمه، P صفحه‌ی نوری، Q صفحه‌ی چشمک‌زن، W دیوار(x,y,w,h)، x/v/y باگ افقی/عمودی/تعقیب‌گر، X بُس. دروازه‌ی مدار همیشه خانه‌ی (۱۳،۵) و خروج (۱۵،۵) */
const RM=[
{n:'روستای سیم',c:'BUFFER',r:'buf',q:'zap',ik:'zap',nm:'عمو مقاومت',cl:'#e8a23c',p:['#15272a','#172b2e','#ff9d2e','#0d1a1c',.25],s:'@2,5 N2,2 I4,3 L11,5 x6,8',h:'پالس‌گیر رو بردار و چراغ رو روشن کن',
 d:['سلام جوجه‌برق! بالاخره بیدار شدی!','من عمو مقاومتم. برجِ نور خاموشه و شهر تاریک.','این پالس‌گیره؛ با دکمه‌ی ⚡ یا Space باگ‌های مزاحم رو خاموش می‌کنه. کنار پات گذاشتمش، بردار!','بعدش چراغِ سمتِ راست رو روشن کن تا پرده‌ی نور باز شه.']},
{n:'جنگلِ سایه',c:'AND',r:'and',nm:'خازنِ کوچولو',cl:'#7bd88f',p:['#16251a','#192a1d','#7bd88f','#0b140d',.4],s:'@2,9 N1,2 W1,1,1,1 W1,3,1,1 H2,2 R6,7 B10,4 B10,7 x8,9',h:'سنگ‌ها رو روی دکمه‌ها هول بده',
 d:['هییی! ...وای، سنگ رو کنار زدی؟ (از پشتش میاد بیرون)','من خازنِ کوچولوم. از باگ‌ها ترسیدم و قایم شدم.','دو تا دکمه‌ی زمینی هست. سنگ‌ها رو هول بده روشون؛ هر دو باید فشرده باشن (مدارِ AND).','سنگ گیر کرد؟ دکمه‌ی «ریست اتاق» پایینه.']},
{n:'میدانِ نئون',c:'RELAY',r:'neon',ik:'drink',nm:'نئون',cl:'#ff7eb6',p:['#1d1530','#22183a','#ff7eb6','#0f0a1a',.2],s:'@2,5 N9,3 I3,9',h:'با نئون حرف بزن و جرقه‌ها رو بگیر'},
{n:'تالارِ بلور',c:'XOR',r:'xor',nm:'ستاره‌شناس',cl:'#b58cff',p:['#14202e','#172636','#7be3ff','#0a121a',.4],s:'@2,9 N8,2 K4,3 K10,7 y11,2',h:'دقیقاً یکی از بلورها روشن باشه',
 d:['سلام ای مسافر. ستاره‌ها گفتن میای.','دو بلور هست. در فقط وقتی باز می‌شه که دقیقاً یکی‌شون بدرخشه (XOR).','هر دو روشن یا هیچ‌کدوم؟ بسته می‌مونه. مواظب اون باگِ تعقیب‌گر هم باش!']},
{n:'غارِ ذوب',c:'NOT',r:'not',q:'gc',ik:'candle',nm:'ننه‌شمع',cl:'#ffd36b',p:['#2a1810','#301b12','#ff9d2e','#150b07',.55],s:'@2,9 N3,2 I11,9 B6,5 R6,5 v9,3 v11,7',h:'شمع رو بیار، بعد سنگ رو از دکمه دور کن'},
{n:'بیابانِ ضربان',c:'AND·3',r:'and',nm:'تپش',cl:'#6bd1ff',p:['#2b2616','#312b19','#ffd36b','#15120a',.35],s:'@2,9 N2,2 P5,2 P5,8 Q10,5 v8,3 v8,7',h:'هر سه صفحه همزمان روشن باشن',
 d:['سه تا صفحه‌ی نوری هست. روی هر کدوم وایسا تا روشن بمونه.','ولی اون وسطی چشمک می‌زنه؛ وقتی روشنه روش پا بذار!','(AND سه‌ورودی) باگ‌ها هم دنبالتن، مواظب باش.']},
{n:'باتلاقِ باگ',c:'XNOR',r:'xnor',nm:'مهندسِ باگ',cl:'#9be07a',p:['#142418','#18291a','#9be07a','#08100a',.6],s:'@2,9 N2,2 l5,3 L5,8 y9,4 y10,8 v12,2',h:'هر دو چراغ هم‌حالت باشن',
 d:['وای نورِ آبی! بالاخره یکی که باگ‌ها رو می‌ترسونه.','در وقتی باز می‌شه که چراغ‌ها «هم‌حالت» باشن: هر دو روشن یا هر دو خاموش (XNOR).','بالاتر پادشاهِ خاموشیه… موفق باشی.']},
{n:'قلمروِ خاموشی',c:'CLOCK',r:'none',nm:'پادشاهِ خاموشی',cl:'#c36bff',p:['#0b0710','#0e0916','#c36bff','#050308',.8],s:'@2,5 X9,5',h:'پادشاه رو با ⚡ بزن!',
 d:['…تویی؟ همون نورِ کوچولو؟','من پادشاهِ خاموشیم. این‌جا ته‌ترین جای برجه؛ جایی که نور هیچ‌وقت نیومده.','اگه می‌خوای برج روشن شه، باید از من رد بشی.','پس بجنگ، نورِ کوچولو! (⚡ رو بزن)']}];
/* بخش «خیابان» زیر هر اتاق: کافه، وسایل و آدم‌های محلی. p: [نوع,x,y,w,h,تابلو]  f: [x,y,نام,رنگ,[حرف‌ها]] */
const STR=[
{p:[['cafe',2,11,4,2,'☕ کافه‌ی ولت'],['house',16,11,4,2,'🏠 خانه‌ی مقاومت'],['park',8,15,4,2],['lamp',7,13],['lamp',11,14],['bench',4,15],['bush',1,16],['bush',19,16]],f:[[8,13,'کافه‌چیِ مهربون','#ffb86b',['یه چای داغِ الکترونی؟ نوش جان!','اینجا همیشه گرمه، حتی وقتی برج خاموشه.']],[6,16,'بچه‌ی همسایه','#8fd3ff',['من یه‌بار یه جرقه دیدم! به‌خدا راست می‌گم!']],[18,14,'پیرمردِ نیمکت','#d9c8a0',['قدیما همه‌ی شهر روشن بود…','برو، برج منتظره.']]]},
{p:[['park',2,12,5,3],['house',9,13,3,2,'🛠️ کارگاهِ رزیستور'],['park',16,12,9,5],['house',25,13,3,2,'🏕️ کلبه‌ی جنگل‌بان'],['tree',2,11],['tree',11,16],['tree',5,17],['tree',8,17],['tree',17,12],['tree',20,15],['tree',22,11],['tree',18,17],['tree',27,16],['tree',27,12],['mush',7,15],['mush',12,14],['mush',15,16],['mush',21,13],['bench',4,15],['bench',19,14]],f:[[7,17,'رزیستورفروش','#e07a5f',['LEDهای اینجا توی تاریکی برق می‌زنن!','فقط از سایه‌ها دور بمون.']],[11,12,'دختر کوچولوی جنگل','#7bd88f',['خازنِ کوچولو دوستمه. خجالتیه ولی مهربونه.']],[4,16,'جنگل‌بان','#a8d5ba',['بعضی سنگ‌ها رو اگه بد هول بدی گیر می‌کنن. حواست باشه!']]]},
{p:[['cafe',5,15,4,2,'🥤 بارِ نئون'],['house',16,12,4,3,'🎛️ استودیوی نئون'],['neon',2,12],['neon',11,12],['neon',22,12],['neon',11,19],['neon',20,19],['neon',14,18],['bench',9,18],['bench',18,16]],f:[[8,12,'ساقیِ بار','#ff7eb6',['نئون این‌جا هر روز نوشیدنی می‌گیره، ولی نمی‌شینه!']],[10,18,'رقصنده‌ی خیابون','#ffd1e8',['ریتم رو حس کن! بوم‌-بوم‌-بوم!']],[20,17,'تماشاچی','#c9b6ff',['نئون سریع‌ترین توی شهره… ولی نفسش کمه.']]]},
{p:[['house',9,12,4,3,'🔭 رصدخانه'],['park',2,13,5,4],['park',16,13,8,4],['house',27,12,3,3,'📚 کتابخانه‌ی ستاره'],['crys',2,12],['crys',4,14],['crys',6,16],['crys',15,12],['crys',18,15],['crys',20,12],['crys',16,17],['crys',25,12],['crys',24,16],['bench',7,15]],f:[[7,15,'فال‌گیر','#b58cff',['می‌بینم… دو بلور… یکی روشن، یکی خاموش!']],[19,16,'شاگردِ ستاره‌شناس','#d7c4ff',['استادم می‌گه XOR یعنی «فقط یکی».']],[3,17,'مسافرِ خسته','#cfd8ff',['راهِ بلند بود. اینجا آدم نفس تازه می‌کنه.']]]},
{p:[['cafe',2,17,4,2,'🕯️ کافه‌ی شمع'],['house',9,14,4,3,'⛏️ کارگاهِ معدن'],['pond',18,15,6,4],['house',30,12,5,3,'🏭 نیروگاهِ کوچک'],['park',36,16,6,4],['stal',4,12],['stal',9,13],['stal',11,19],['stal',7,21],['stal',16,13],['stal',20,19],['stal',21,12],['stal',17,21],['stal',2,21],['stal',26,15],['stal',30,20],['stal',38,12],['stal',40,22],['stal',33,17],['lamp',6,16],['lamp',8,19]],f:[[8,12,'معدن‌چیِ شمع‌به‌دست','#ffd36b',['تو غار هیچی جز نورِ شمع نیست… همین کافیه.']],[5,21,'تکنسینِ شب‌کار','#9a8cff',['نه، من باگ نیستم! تکنسینِ شیفتِ شبم!']],[11,18,'ذوب‌کار','#ffae6b',['NOT یعنی برعکس. من همیشه برعکس فکر می‌کنم!']]]},
{p:[['house',2,12,5,3,'⛽ ایستگاهِ پمپ'],['park',20,13,8,5],['pond',22,15,4,2],['house',34,12,5,3,'🛖 کاروانسرا'],['tree',20,13],['tree',27,13],['tree',21,17],['tree',26,17],['cact',9,12],['cact',11,16],['cact',4,17],['cact',16,12],['cact',18,17],['cact',30,13],['cact',31,18],['cact',40,12],['cact',42,17],['cact',44,13],['cact',36,17]],f:[[22,17,'سیم‌کش','#e8c27b',['بیابون بی‌رحمه، ولی ستاره‌هاش قشنگن.']],[9,15,'تپش‌نواز','#6bd1ff',['سه صفحه، سه ضربان. هر کدوم رو روشن نگه دار!']],[12,13,'مسافرِ عطشان','#b8e6ff',['یه قطره آب بده… یا یه قطره نور!']]]},
{p:[['cafe',3,12,4,2,'☕ کافه‌ی دیود'],['pond',7,15,3,2],['pond',18,14,8,5],['house',30,12,4,3,'🔧 تعمیرگاه'],['reed',2,17],['reed',5,19],['reed',9,13],['reed',10,18],['reed',12,20],['reed',16,12],['reed',22,13],['reed',21,20],['reed',29,16],['reed',36,19],['reed',39,13],['reed',34,21]],f:[[8,18,'گارسونِ دیود','#9be07a',['سفارشِ شما؟ …فقط باگ نمی‌فروشیم.']],[11,12,'مهندسِ آماتور','#c4f09a',['XNOR: وقتی هر دو یکی‌ان، در باز می‌شه!']],[4,16,'تکنسینِ نگران','#d9f2b3',['باگ‌ها این‌جا زیادن… از اون‌ها فرار کن!']]]},
{p:[['ruin',3,12],['ruin',9,13],['ruin',15,12],['ruin',17,13],['bench',6,12]],f:[[6,13,'سایه‌ی ترسو','#a98bd6',['من از پادشاه می‌ترسم… ولی تو نه، درسته؟']],[11,13,'سایه‌ی مهربون','#c6a8ee',['اگه پیروز شدی، به ما هم یه ذره نور بده.']]]}];
/* ماموریت‌های فرعی: هر اتاق ۲ ماموریت (۲ چیزِ گمشده) دارد و پرده‌ی نور فقط با ۲ «جرقه‌ی دوستی» باز می‌شود. چیزهای گمشده: [ایموجی نام] */
const QN=['🍵 فنجونِ چینی|📒 دفترچه‌ی مقاومت‌ها|🔩 پیچِ طلایی|🪫 باتریِ قدیمی','💡 LEDِ درخشان|🌿 برگِ نقره‌ای|🪵 چوبِ خشک|🔋 باتریِ شیشه‌ای','🥤 نوشیدنیِ ورزشی|🎧 هدفونِ گم‌شده|💿 صفحه‌ی ریتم|🎤 میکروفونِ شکسته','🔮 گویِ بلورین|📜 نقشه‌ی ستاره‌ها|🪞 آینه‌ی کوچک|🧿 چشم‌نظر','🕯️ شمعِ یدکی|⛏️ کلنگِ زنگ‌زده|💎 سنگِ براق|🧯 فندکِ خاموش','🥁 طبلِ کوچک|🧭 قطب‌نمای شکسته|🧪 شیشه‌ی الکترولیت|📯 شیپورِ قدیمی','🔌 سیمِ پاره|⚙️ چرخ‌دنده‌ی ریز|🔧 آچارِ فرانسه|💾 فلاپیِ قدیمی|🛠️ جعبه‌ابزارِ زنگ‌زده'];
const DIM=[[22,18],[30,20],[26,22],[32,19],[44,26],[46,22],[42,24],[24,16]],SD=['U','R','D','D','R','R','U'],XP=[17,3,21,27,6,4,38],EP=[3,8,6,6,8,8,4],HW=[1,0,1,1,1,0,1],OP={R:'L',U:'D',D:'U'},OX=[0],OY=[0];
/* نقشه‌ی دنیا: هر اتاق نسبت به قبلی کنارش (راست) یا بالا/پایینش چسبیده؛ XP جای دروازه در اتاق قبل و EP جایش در اتاق بعد است */
for(let i=0;i<7;i++){const[w,h]=DIM[i],h2=DIM[i+1][1],d=SD[i];if(d=='R'){OX[i+1]=OX[i]+w*T;OY[i+1]=OY[i]+(XP[i]-EP[i])*T}else{OX[i+1]=OX[i]+(XP[i]-EP[i])*T;OY[i+1]=d=='U'?OY[i]-h2*T:OY[i]+h*T}}
function door(i,x,y){const W_=DIM[i][0],H_=DIM[i][1];for(const d of[i<7&&{s:SD[i],p:XP[i],w:HW[i]},i>0&&{s:OP[SD[i-1]],p:EP[i-1],w:HW[i-1]}]){if(!d)continue;const a=d.s=='R'?x>=W_&&Math.abs(y-d.p)<=d.w:d.s=='L'?x<0&&Math.abs(y-d.p)<=d.w:d.s=='U'?y<0&&Math.abs(x-d.p)<=d.w:y>=H_&&Math.abs(x-d.p)<=d.w;if(a)return true}return false}
let GO=0,GOY=0,cI=0,finL=null,camX=0,camY=0,RS=[];
const RULE={buf:a=>a[0],and:a=>a.every(Boolean),or:a=>a.some(Boolean),not:a=>!a[0],xor:a=>a[0]!==a[1],xnor:a=>a[0]===a[1],neon:()=>!!S.gd,none:()=>0};
const C4=[[3,2],[10,8],[6,5]],C3=[[3,2],[10,2],[3,8],[10,8],[6,5]];
const fresh=()=>({room:0,t:{},q:{},sh:{},mh:3,coin:0,bo:{},bd:0,mm:{},sv:null,zap:0,drink:0,candle:0,ns:0,sp:0,gd:0,gc:0,cs:0,done:0});
let bo=null,fin=0,S=fresh(),R,P={x:0,y:0},now=0,started=false,loading=false,raf=0,last=0,gW,gH,dpr=1,Z=1,ox=0,oy=0,dk,dg,tg=null,pend=null,hold=false,dlg=null,hp=S.mh,inv=0,fireT=0,pushT=0,face=[1,0],keys={},qT=0,shT=0;
const lk=()=>!S.t[R.i]&&R.i!=2&&R.i!=7;
const tfree=(x,y,s)=>s&&y>9?false:(!s&&door(R.i,x,y))||x>=0&&y>=0&&x<R.w&&y<R.h&&!R.wall[y][x]&&!(R.gate&&R.G.some(g=>!g.open&&x==g.x&&y==5))&&!R.rocks.some(r=>r.x==x&&r.y==y)&&!R.sol.some(o=>o.x==x&&o.y==y);
const wallAt=(x,y)=>{const i=Math.floor(x/T),j=Math.floor(y/T);return i<0||j<0||i>=R.w||j>=R.h||R.wall[j][i]||(R.gate&&R.G.some(g=>!g.open&&i==g.x&&j==5))};
const free=(x,y,s)=>[[-8,-8],[8,-8],[-8,8],[8,8]].every(([a,b])=>tfree(Math.floor((x+a)/T),Math.floor((y+b)/T),s));
function mv(o,dx,dy){let m=0;if(free(o.x+dx,o.y,1)){o.x+=dx;m=1}if(free(o.x,o.y+dy,1)){o.y+=dy;m=1}return m}
function say(t,o){bo=o||null;gbub.textContent=t;gbub.classList.add('on');clearTimeout(qT);qT=setTimeout(()=>{gbub.classList.remove('on');bo=null},2800)}
const val=o=>o.k=='btn'?R.rocks.some(r=>r.x==o.x&&r.y==o.y):o.k=='pad'?o.lit:o.on;
function check(){if(!R.gate)return;const m=RM[R.i];R.G.forEach((g,k)=>{const ins=R.ins.filter(o=>(o.g|0)==k),rule=k?EX[R.i][k-1].r:m.r,o1=!!((k||!m.q||S[m.q])&&RULE[rule](ins.map(val))),ok=k||R.i>6||(S.sh[R.i]|0)>=2,o=o1&&ok;
 if(!k&&o1&&!ok&&now-shT>6000){shT=now;say('مدار درسته! ولی پرده‌ی نور فقط با ۲ جرقه‌ی دوستی باز می‌شه. با آدم‌های خیابون حرف بزن.')}
 if(o!==g.open){g.open=o;g.t=now;if(!k){R.gOpen=o;R.gT=now}say(o?'پرده‌ی نور محو شد! راه باز شد.':'پرده‌ی نور دوباره بسته شد.')}})}
function build(i,pl){
 const m=RM[i];R={i,w:DIM[i][0],h:DIM[i][1],wall:Array.from({length:DIM[i][1]},(_,y)=>Array.from({length:DIM[i][0]},(_,x)=>x==0||y==0||x==DIM[i][0]-1||y==DIM[i][1]-1||(i<7&&x==13&&y!=5))),rocks:[],ins:[],sol:[],bugs:[],bolts:[],orbs:[],items:[],stars:[],npc:null,boss:null,star:null,nT:0,gate:i<7,gOpen:false,gT:-1e9,ban:now+2600};const opn=(s,p,w)=>{for(let d=-w;d<=w;d++){if(s=='R')R.wall[p+d][R.w-1]=0;else if(s=='L')R.wall[p+d][0]=0;else if(s=='U')R.wall[0][p+d]=0;else R.wall[R.h-1][p+d]=0}};if(i<7)opn(SD[i],XP[i],HW[i]);if(i>0)opn(OP[SD[i-1]],EP[i-1],HW[i-1]);RS[i]=R;R.G=[{x:13,open:false,t:-1e9}];(EX[i]||[]).forEach(e=>{R.G.push({x:e.gx,open:false,t:-1e9});for(let y=1;y<10;y++)if(y!=5)R.wall[y][e.gx]=1;for(let y=11;y<R.h-1;y++)R.wall[y][e.gx]=1});const gp=new Set(R.G.map(g=>g.x+2));for(let x=1;x<R.w-1;x++)if(x<6||x>8&&!gp.has(x))R.wall[10][x]=1;R.props=[];R.folk=[];R.qit=[];const st=STR[i];st.p.forEach(([k,x,y,w,h,t])=>{w=w||1;h=h||1;R.props.push({k,x,y,w,h,t});if(k=='cafe'||k=='house'||k=='pond'&&0){for(let a=0;a<h;a++)for(let b=0;b<w;b++)R.wall[y+a][x+b]=1;if(k=='cafe')R.wall[y+h-1][x+(w>>1)]=0}});
 st.f.forEach(([x,y,nm,cl,l])=>R.folk.push({k:'folk',hx:x*T+16,hy:y*T+16,px:x*T+16,py:y*T+16,nm,cl,l}));
 [...m.s.split(' ').map(t=>[t,0]),...(EX[i]||[]).flatMap((e,gi)=>e.s.split(' ').map(t=>[t,gi+1]))].forEach(([t,g])=>{const k=t[0],[x,y,w,h]=t.slice(1).split(',').map(Number),o={k,x,y,g,px:x*T+16,py:y*T+16};
  if(k=='@')R.st={x:o.px,y:o.py};
  else if(k=='W'){for(let a=0;a<h;a++)for(let b=0;b<w;b++)R.wall[y+a][x+b]=1}
  else if(k=='N'){o.k='npc';R.npc=o;if(i!=2){o.fix=1;R.sol.push(o)}}
  else if(k=='X'){Object.assign(o,{k:'npc',hp:12,tx:o.px,ty:o.py,mt:0,fl:1,a:0,hurt:0});R.npc=R.boss=o}
  else if(k=='L'||k=='l'){o.k='lamp';o.on=k=='l';R.sol.push(o);R.ins.push(o)}
  else if(k=='K'||k=='k'){o.k='crys';o.on=k=='k';R.sol.push(o);R.ins.push(o)}
  else if(k=='R'||k=='H')R.rocks.push({x,y,h:k=='H'})
  else if(k=='B'){o.k='btn';R.ins.push(o)}
  else if(k=='P'||k=='Q'){o.k='pad';o.q=k=='Q';o.lit=false;R.ins.push(o)}
  else if(k=='I'){o.k='item';o.kind=m.ik;R.items.push(o)}
  else if('xvy'.includes(k))R.bugs.push({x:o.px,y:o.py,k,d:1,a:1})});
 if(i==2&&S.ns==4)R.stars=C4.slice(S.sp).map(([x,y])=>({x:x*T+16,y:y*T+16}));
 if(i==2&&S.ns>=4)R.npc.py+=40;
 R.items.forEach(o=>o.v=false);if(i==7&&S.bd){R.boss.dead=1;mkTower()}qinit();memInit();if(pl!==false)P={...R.st};upd();
}
const MEM=['یادت میاد؟ روزی که همه‌ی چراغ‌ها با هم روشن شدن؟','روی دیوار با گچ نوشته: «برگرد».','یه نامه‌ی خیس: «من هنوز منتظرم.»','عکسِ یه برجِ روشن، گوشه‌هاش سوخته.','صدای یه ترانه از توی یه رادیوی خاموش.','یه دستکشِ کوچولو کنارِ یه پریز.','یه دفترچه: «امشب نور رو می‌گیرم».','کنارِ پریز نوشته: «اشتباهِ ما این بود که ترسیدیم».','یه جرقه‌ی کوچیک هنوز توی یه فیوز زنده‌ست.','یه سایه خندید و بعد جا زد.','روی یه صندلی: «اینجا یکی منتظر بود».','یه کلیدِ قدیمی که هیچ دری رو باز نمی‌کنه.','یه نقاشی: همه‌ی ما کنارِ برج.','ته‌دلت می‌دونی که روشنش می‌کنی.'];
function memInit(){R.mem=[];R.sv=null;if(R.i>6)return;for(const[a,b]of[[7,12],[7,13],[6,12],[8,12],[5,12],[9,12],[7,14],[4,13],[10,13]])if(!R.wall[b][a]&&!R.props.some(o=>(o.k=='cafe'||o.k=='house')&&a>=o.x&&a<o.x+o.w&&b>=o.y&&b<o.y+o.h)){R.sv={px:a*T+16,py:b*T+16};break}
 const seen=new Set(),cs=[],q=[[R.st.x/T|0,R.st.y/T|0]],ob=new Set([...R.rocks,...R.ins,...R.sol,...R.items].map(o=>o.x+','+o.y));
 while(q.length){const[x,y]=q.pop(),k=x+','+y;if(seen.has(k)||x<1||y<1||x>=R.w-1||y>=R.h-1||R.wall[y][x])continue;seen.add(k);q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1])}
 seen.forEach(k=>{const[x,y]=k.split(',').map(Number);if(ob.has(k)||R.props.some(o=>x>=o.x&&x<o.x+o.w&&y>=o.y&&y<o.y+o.h))return;const n=[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>R.wall[y+b][x+a]).length;if(n>=2&&Math.abs(x-13)>1)cs.push([x,y,n])});
 cs.sort((a,b)=>b[2]-a[2]||a[0]*31+a[1]-b[0]*31-b[1]);const top=cs.slice(0,16);
 for(let k=0;k<2&&top.length;k++){const[x,y]=top[(R.i*5+k*7+k*k)%top.length];R.mem.push({key:R.i+'_'+k,n:R.i*2+k,px:x*T+16,py:y*T+16})}}
const sp=t=>{const i=t.indexOf(' ');return[t.slice(0,i),t.slice(i+1)]};
/* پازل‌های بیشتر: هر اتاق می‌تونه چند دروازه‌ی پشت‌سرهم داشته باشه. gx ستونِ دروازه، r قانونِ مدار، s مثلِ همان توکن‌های اتاق (با مختصاتِ مطلق) */
const EX=[0,[{gx:22,r:'and',s:'B19,3 B19,7 R15,3 R15,7 v17,8'}],0,[{gx:22,r:'xnor',s:'K17,3 k17,7 y19,5'}],
 [{gx:24,r:'xor',s:'B20,3 B20,7 R16,3 R16,7 v18,5'},{gx:34,r:'not',s:'B29,5 R29,5 x27,3 x27,7'}],
 [{gx:26,r:'and',s:'K18,2 K18,5 K18,8 v21,3'},{gx:38,r:'and',s:'B34,3 B34,7 R29,3 R29,7 y31,5'}],
 [{gx:25,r:'and',s:'P17,2 P17,8 Q22,5 v19,4 v19,7'},{gx:35,r:'not',s:'B30,5 R30,5 y32,2 y32,8'}],0];
const QP=[['TB','B',''],['T','BB','T'],['TT','TB',''],['B','','TB'],['BB','T','B'],['','TT','B'],['TB','BT','T']];
/* QP: برای هر ساکنِ هر اتاق؛ هر حرف یک چیزِ گمشده: T=بالا (محوطه‌ی مدار)، B=پایین (خیابون). خالی = فقط گپ */
function qinit(){if(R.i>6)return;const seen=new Set(),cs=[],sx=R.st.x/T|0,sy=R.st.y/T|0,q=[[sx,sy]],ob=new Set([...R.rocks,...R.ins,...R.sol,...R.items].map(o=>o.x+','+o.y));
 while(q.length){const[x,y]=q.pop(),k=x+','+y;if(seen.has(k)||x<1||y<1||x>=13||y>=R.h-1||R.wall[y][x])continue;seen.add(k);if(!ob.has(k)&&Math.abs(x-sx)+Math.abs(y-sy)>3)cs.push([x,y]);q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1])}
 const A={T:cs.filter(a=>a[1]<10),B:cs.filter(a=>a[1]>10)},nm=QN[R.i].split('|');let c0=0;
 R.folk.forEach((f,j)=>{const z=QP[R.i][j]||'';if(!z)return;f.qk=R.i+'_'+j;f.ar=z;f.it=[];f.loc=[];for(let k=0;k<z.length;k++){const L=A[z[k]];f.it.push(nm[c0++]);f.loc.push(L[(R.i*7+j*13+k*17+c0*5)%L.length])}});qsync()}
function qsync(){R.qit=[];R.folk.forEach(f=>{if(!f.qk)return;const s=S.q[f.qk]|0;if(s%2==1&&s<2*f.it.length+1){const i=(s-1)/2,[x,y]=f.loc[i];R.qit.push({f,s,px:x*T+16,py:y*T+16,e:f.it[i]})}})}
function fl(o){if(!o.qk)return[o.l];const s=S.q[o.qk]|0,n=o.it.length,k=o.qk,wh=i=>o.ar[i]=='T'?'یه جایی بالا، تو محوطه‌ی مدار':'یه جایی پایین، تو خیابون',I=i=>{const[e,t]=sp(o.it[i]);return'«'+t+'» '+e},set=(v,c)=>()=>{if(c){S.coin=(S.coin|0)+c;say('+'+fa(c)+' 🪙')}S.q[k]=v;qsync();save();upd()};
 if(s==0)return[[o.nm+': سلام مسافر! یه کمکی ازت می‌خوام.',I(0)+' گم کردم؛ '+wh(0)+'.',n>1?'پیداش کنی بقیه‌ی ماجرا رو هم می‌گم!':'پیداش کنی یه جرقه‌ی دوستی بهت می‌دم!'],set(1)];
 if(s%2==1&&s<2*n+1){const i=(s-1)/2;return[['هنوز '+I(i)+' رو پیدا نکردی؟ '+wh(i)+' بگرد!']]}
 if(s<2*n){const i=s/2;return[['وای! همینه! ممنون ✨','یه چیز دیگه هم کم دارم: '+I(i)+'؛ '+wh(i)+'.'],set(s+1,2)]}
 if(s==2*n)return[['عالیه! بیا، این جرقه‌ی دوستی مال تو. ✨'],()=>{S.coin=(S.coin|0)+3;S.q[k]=s+1;S.sh[R.i]=(S.sh[R.i]|0)+1;qsync();check();save();upd();say('✨ جرقه‌ی دوستی! ('+fa(S.sh[R.i])+' از ۲) ‎+۳ 🪙')}];
 return[o.l]}
const SELL=[['🍰','کیکِ ولت',3],0,['🥤','نوشیدنیِ نئون',5],0,['🕯️','شمعِ جان‌بخش',7],0,['🔋','کیکِ دیود',10]];
const CUST=[['این‌جا آرومه… همیشه می‌شه یه لحظه استراحت کرد.','می‌گن جرقه‌ی دوستی از هر نورِ دیگه‌ای گرم‌تره.'],['این کافه رو از روز اول می‌شناسم.','قهوه‌ش بدک نیست، ولی چایش عالیه!']];
function enterCafe(o){const out=R,k=(a,b,w,h)=>{for(let y=b;y<b+h;y++)for(let x=a;x<a+w;x++)I.wall[y][x]=1};
 const I={i:out.i,w:W,h:H,in:1,out,back:{x:(o.x+(o.w>>1))*T+16,y:(o.y+o.h)*T+16},wall:Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=>!(x>=4&&x<=13&&y>=4&&y<=11||x==9&&y==12))),rocks:[],ins:[],sol:[],bugs:[],bolts:[],orbs:[],items:[],stars:[],npc:null,boss:null,star:null,nT:0,gate:false,gOpen:false,gT:-1e9,ban:0,qit:[],st:{x:9*T+16,y:11*T+16},
  props:[{k:'counter',x:5,y:5,w:9,h:1},{k:'table',x:6,y:9,w:1,h:1},{k:'table',x:12,y:9,w:1,h:1}],folk:[]};
 k(5,5,9,1);k(6,9,1,1);k(12,9,1,1);
 const cb=()=>{const h=[];out.folk.forEach(f=>{if(!f.qk)return;const s=S.q[f.qk]|0;if(s==1)h.push('«'+sp(f.it[0])[1]+'» یه جایی بالا، تو محوطه‌ی مداره.');if(s==3)h.push('«'+sp(f.it[1])[1]+'» یه جایی تو خیابونه.')});
  return[['خوش اومدی! یه نوشیدنیِ مهمونِ من. ☕',...(h.length?['یه چیزی بگم؟ '+h[0]]:['به‌نظر می‌رسه همه‌ی کارهات این‌جا انجام شده. ✨'])],()=>{hp=S.mh;say('جون گرفتم! ♥♥♥')}]};
 const mf=(x,y,nm,cl,l,c2)=>I.folk.push({k:'folk',hx:x*T+16,hy:y*T+16,px:x*T+16,py:y*T+16,nm,cl,l,cb:c2});
 mf(9,5,'صاحبِ کافه','#ffb86b',[],cb);const r=out.i;
 if(SELL[r]){let ar=0;mf(11,5,'فروشنده','#ffd36b',[],()=>{const[e,n,pr]=SELL[r],coin=S.coin|0;
  if(S.bo[r])return[['«'+n+'» رو از من گرفتی. ممنون! ❤️']];
  if(coin<pr){ar=0;return[['«'+n+'» '+e+' — '+fa(pr)+' سکه. هر کدوم یه قلبِ بیشتر بهت می‌ده!','سکه‌ت کمه ('+fa(coin)+' از '+fa(pr)+'). با کمک به آدم‌ها و خاموش‌کردنِ باگ‌ها سکه جمع کن.']]}
  if(!ar){ar=1;return[['«'+n+'» '+e+' — '+fa(pr)+' سکه. هر کدوم یه قلبِ بیشتر بهت می‌ده!','می‌خوای؟ دوباره باهام حرف بزن تا بخری.']]}
  return[['بفرما! ظرفیتِ قلبت یکی بیشتر شد. ❤️'],()=>{S.coin-=pr;S.mh++;S.bo[r]=1;hp=S.mh;save();say('قلبِ جدید! ♥ ('+fa(S.mh)+')')}]})}
mf(5,9,'مشتریِ آروم','#8fd3ff',CUST[r%2]);mf(13,9,'مشتریِ قدیمی','#d9c8a0',CUST[(r+1)%2]);
 R=I;P={...I.st};tg=pend=null;say('خوش اومدی! ☕ (برای خروج از در پایین برو)')}
function upd(){const m=RM[R.i];goal.textContent=S.done?'پایان — شهر دوباره روشن شد. ممنون که بازی کردی!':'مدار '+fa(R.i+1)+' از ۸ · '+m.c+' — '+m.h+(R.i<7?' · جرقه‌ها '+fa(S.sh[R.i]|0)+'/۲':'')}
function lines(){const i=R.i,m=RM[i],A=[[]];
 if(i==2){const n=S.ns;
  if(n==0)return[['هوووی! تویی که می‌خوای برج رو روشن کنی؟','من نئونم! سریع‌ترین الکترونِ شهر!','ببینیم می‌تونی یه جرقه‌ی طلایی رو قبل از من بگیری؟','سه دور! ...البته من برنده‌ام. شروع!'],()=>{S.ns=1}];
  if(n<4)return[['(نئون داره می‌دوئه! اول جرقه رو دریاب)']];
  if(n==4)return[['…هاه… هاه… (نفس‌نفس) برو جرقه‌ها رو بگیر. دیگه نای ندارم.']];
  if(n==5)return[['هر سه‌تاشو جمع کردی؟! عجب پشتکار و استامینایی داری!','من دیگه نفس ندارم… یه نوشیدنی بیاری عالیه.','اون پایین-چپ، کنار دیوار گذاشتمش.'],()=>{S.ns=6}];
  if(!S.drink)return[['نوشیدنی اون پایین-چپه. لطفاً!']];
  if(!S.gd)return[['آهااای! (یه نفس سر می‌کشه) جون گرفتم!','قولمو یادمه: دروازه باز شد. مراقب سایه‌ها باش!'],()=>{S.gd=1}];
  return[['موفق باشی، قهرمان!']]}
 if(i==4){
  if(!S.cs)return[['آخ آخ… یه نورِ کوچولو! بیا جلوتر بچه.','شمعم رو تو غار جا گذاشتم… بدونِ اون چیزی نمی‌بینم.','بیارش! طلاییه؛ پایین-راست، کنار دیوار گذاشتمش.'],()=>{S.cs=1}];
  if(!S.candle)return[['شمعم رو بیار، بچه‌جون. (طلاییه، پایین-راست)']];
  if(!S.gc)return[['وااای شمعم! (روشنش می‌کنه) دیدی؟ نوره!','حالا رازِ در: این مدارِ NOT ـه!','در وقتی باز می‌شه که دکمه فشرده «نباشه». سنگ رو از روی دکمه هول بده!'],()=>{S.gc=1;S.t[4]=1}];
  return[['سنگ رو از روی دکمه هول بده. NOT یعنی برعکس!']]}
 if(!S.t[i])return[m.d,()=>{S.t[i]=1}];
 return[[m.h+'!']]}
function talk(){const[l,a]=lines();dlg={l,a,i:0,pos:0};gbub.classList.remove('on');show()}
function show(){dlg.pos=0;gnpc.innerHTML='<small style="color:'+(dlg.cl||RM[R.i].cl)+'">'+(dlg.nm||RM[R.i].nm)+'</small><span id="gt"></span><i>'+(dlg.i<dlg.l.length-1?'◂ برای ادامه بزن':'◂ باشه')+'</i>';gnpc.classList.add('on')}
function adv(){if(dlg.pos<dlg.l[dlg.i].length){dlg.pos=1e9;$('gt').textContent=dlg.l[dlg.i];return}
 if(++dlg.i>=dlg.l.length){const a=dlg.a;dlg=null;gnpc.classList.remove('on');a&&a();vis();save();upd()}else show()}
function vis(){R.items.forEach(o=>{const i=R.i;o.v=!S[o.kind]&&(i==0?S.t[0]:i==2?S.ns>=6:S.cs>=1)})}
function act(o){
 if(o.k=='folk'){const[l,a]=o.cb?o.cb():fl(o);dlg={l,a,i:0,pos:0,nm:o.nm,cl:o.cl,who:o};gbub.classList.remove('on');return show()}
 if(o.k=='tower'){if(!S.done){fin=now;finL=[...FIN,'✧ خاطره‌هایی که پیدا کردی: '+fa(Object.keys(S.mm).length)+' از ۱۴'];S.done=1;save();upd();say('برج روشن شد!')}return}
 if(o.k=='npc'){if(R.i==7&&S.t[7])return;return talk()}
 if(o.k=='item'){S[o.kind]=1;o.v=false;say({zap:'پالس‌گیر! حالا ⚡ یا Space رو بزن.',drink:'نوشیدنی! ببرمش برای نئون.',candle:'شمعِ طلایی! ببرمش برای ننه‌شمع.'}[o.kind]);save();check();return}
 if(lk())return say('اول باید با ساکنِ اینجا حرف بزنم.');
 o.on=!o.on;check();save()}
function hit(){if(now<inv||dlg)return;hp--;inv=now+1300;if(hp<=0){hp=S.mh;if(R.i<7){const v=S.sv&&S.sv.room==R.i?{px:S.sv.x,py:S.sv.y}:R.sv||R.st;P={x:v.px??v.x,y:v.py??v.y};tg=pend=null;say('(برگشتم به آخرین ستاره‌ی ✦ …)')}else{build(R.i);say('(ریست شدم… دوباره!)')}}else say('آخ! باگ!')}
const wl=(a,b)=>a<0||b<0||a>=R.w||b>=R.h||R.wall[b][a],bt=(a,b)=>R.ins.some(o=>o.k=='btn'&&o.x==a&&o.y==b);
/* سنگی که به گوشه یا کنار دیوارِ بدونِ دکمه برسه برای همیشه گیر می‌کنه؛ هولِ اون‌طوری رو قبول نمی‌کنیم */
function dead(x,y){if(!R.ins.some(o=>o.k=='btn')||RM[R.i].r=='not'||bt(x,y))return false;
 const runV=()=>{for(const d of[-1,1])for(let j=y;!wl(x,j);j+=d)if(bt(x,j)||!wl(x-1,j)&&!wl(x+1,j))return true;return false},
  runH=()=>{for(const d of[-1,1])for(let i=x;!wl(i,y);i+=d)if(bt(i,y)||!wl(i,y-1)&&!wl(i,y+1))return true;return false};
 return(wl(x-1,y)||wl(x+1,y))&&!runV()||(wl(x,y-1)||wl(x,y+1))&&!runH()}
function step(dx,dy){
 for(const[ax,ay]of[[dx,0],[0,dy]]){if(!ax&&!ay)continue;const nx=P.x+ax,ny=P.y+ay;let rk=null,bad=false;
  for(const[a,b]of[[-9,-9],[9,-9],[-9,9],[9,9]]){const tx=Math.floor((nx+a)/T),ty=Math.floor((ny+b)/T);if(!tfree(tx,ty)){const r=R.rocks.find(r=>r.x==tx&&r.y==ty);if(r)rk=r;else bad=true}}
  if(bad)continue;
  if(rk){if(lk()&&!rk.h){if(now-pushT>2500){pushT=now;say('اول باید با ساکنِ اینجا حرف بزنم.')}continue}
   if(now-pushT>170){const sx=Math.sign(ax),sy=Math.sign(ay);const nx2=rk.x+sx,ny2=rk.y+sy;if(tfree(nx2,ny2,1)){if(dead(nx2,ny2)){if(now-pushT>1800){pushT=now;say('اگه اینجا ببرمش دیگه تکون نمی‌خوره!')}}else{rk.x=nx2;rk.y=ny2;pushT=now;check()}}}continue}
  P.x=nx;P.y=ny}}
function fire(){if(!S.zap||dlg||now<fireT||!R)return;fireT=now+380;let t=null,bd=300;
 R.bugs.forEach(b=>{if(b.a){const d=Math.hypot(b.x-P.x,b.y-P.y);if(d<bd){bd=d;t=[b.x,b.y]}}});
 if(R.boss&&S.t[7]&&!R.boss.dead)t=[R.boss.px,R.boss.py];
 const v=t?[t[0]-P.x,t[1]-P.y]:face,d=Math.hypot(v[0],v[1])||1;R.bolts.push({x:P.x,y:P.y,vx:v[0]/d*430,vy:v[1]/d*430})}
const FIN=['تو برجِ نور رو روشن کردی. ✨','روستای سیم دوباره زنده شد…','جنگلِ سایه نفس کشید…','میدانِ نئون داره می‌رقصه…','تالارِ بلور برق می‌زنه…','غارِ ذوب گرم شد…','بیابانِ ضربان می‌تپه…','باتلاقِ باگ آروم گرفت…','این نور، کارِ خودِ توئه.','تو شهر رو روشن کردی. این جایزه‌ی خودته. ✨'];
function mkTower(){R.tower={k:'tower',px:(R.w-4)*T+16,py:5*T+16}}
function tw(o){const x=o.px,y=o.py,on=S.done,t=now/1000;sh(x,y+14,22);c.fillStyle='#2b2733';c.beginPath();c.moveTo(x-18,y+14);c.lineTo(x-8,y-40);c.lineTo(x+8,y-40);c.lineTo(x+18,y+14);c.fill();c.fillStyle='#3d3649';c.fillRect(x-4,y-40,8,54);c.fillStyle='#1a1620';c.fillRect(x-22,y+10,44,6);
 c.save();if(on||Math.sin(t*3)>.2){c.shadowColor=on?'#ffd36b':'#7be3ff';c.shadowBlur=on?40:12}ci(x,y-48,on?13:10,on?'#fff1b8':'#2a4a5a');c.restore();c.strokeStyle=on?'#ffd36b':'#7be3ff';c.globalAlpha=.5+Math.sin(t*3)*.3;c.lineWidth=2;c.beginPath();c.arc(x,y-48,18+Math.sin(t*3)*2,0,6.3);c.stroke();c.globalAlpha=1}
function winBoss(){R.orbs=[];R.boss.dead=1;dlg={l:['…آخ. تموم شد.','می‌دونی؟ تو منو نترسوندی. فقط یادم آوردی نور چه شکلیه.','برو، برج رو روشن کن. من دیگه از نور نمی‌ترسم.'],i:0,pos:0,a:()=>{S.bd=1;mkTower();save();say('یه برجِ خاموش پشتِ اتاق پیدا شد… برو، خودت روشنش کن!')}};show()}
function go(i){const o=R.i;R=RS[i];const dx=OX[o]-OX[i],dy=OY[o]-OY[i];P.x+=dx;P.y+=dy;if(tg){tg.x+=dx;tg.y+=dy}pend=null;hp=S.mh;R.ban=now+2600;S.room=i;upd();save()}
function camT(){const vw=gW/Z,vh=gH/Z,cl=(v,a,b)=>Math.max(a,Math.min(b,v));let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;[R.i-1,R.i,R.i+1].filter(k=>k>=0&&k<8).forEach(k=>{x0=Math.min(x0,OX[k]);y0=Math.min(y0,OY[k]);x1=Math.max(x1,OX[k]+DIM[k][0]*T);y1=Math.max(y1,OY[k]+DIM[k][1]*T)});const gx=P.x+OX[R.i],gy=P.y+OY[R.i];return[vw>=x1-x0?(x0+x1-vw)/2:cl(gx-vw/2,x0,x1-vw),vh>=y1-y0?(y0+y1-vh)/2:cl(gy-vh/2,y0,y1-vh)]}
function camUp(dt,snap){const[tx,ty]=camT(),k=snap?1:Math.min(1,dt*6);camX+=(tx-camX)*k;camY+=(ty-camY)*k}
function update(dt){
 if(dlg){if(dlg.pos<dlg.l[dlg.i].length){dlg.pos+=dt*36;const e=$('gt');if(e)e.textContent=dlg.l[dlg.i].slice(0,Math.floor(dlg.pos))}return}
 let vx=0,vy=0;if(keys.ArrowLeft||keys.KeyA)vx--;if(keys.ArrowRight||keys.KeyD)vx++;if(keys.ArrowUp||keys.KeyW)vy--;if(keys.ArrowDown||keys.KeyS)vy++;
 if(vx||vy){tg=null;pend=null}else if(tg){const dx=tg.x-P.x,dy=tg.y-P.y,d=Math.hypot(dx,dy);if(d>5){vx=dx/d;vy=dy/d}else tg=null}
 if(vx||vy){const d=Math.hypot(vx,vy);vx/=d;vy/=d;face=[vx,vy];step(vx*130*dt,vy*130*dt)}
 if(pend&&Math.hypot(P.x-pend.px,P.y-pend.py)<52){const o=pend;pend=null;tg=null;act(o)}
 if(R.tower&&!S.done&&Math.hypot(P.x-R.tower.px,P.y-R.tower.py)<34)act(R.tower);
 R.folk.forEach((f,i)=>{f.px=f.hx+Math.sin(now/1700+i*2)*9;f.py=f.hy+Math.cos(now/2100+i)*5});
 const mm=R.mem.find(m=>!S.mm[m.key]&&Math.hypot(P.x-m.px,P.y-m.py)<22);if(mm){S.mm[mm.key]=1;S.coin=(S.coin|0)+2;say('✧ '+MEM[mm.n]+' ‎+۲ 🪙');save()}
 if(R.sv&&Math.hypot(P.x-R.sv.px,P.y-R.sv.py)<24&&(hp<S.mh||!S.sv||S.sv.room!=R.i||S.sv.x!=R.sv.px)){S.sv={room:R.i,x:R.sv.px,y:R.sv.py};hp=S.mh;save();say('✦ ذخیره شد! قلب‌هات پر شد.')}
 const got=R.qit.find(t=>Math.hypot(P.x-t.px,P.y-t.py)<22);if(got){S.q[got.f.qk]=got.s+1;say('پیدا شد! '+got.e+' — برگردم پیشِ '+got.f.nm);qsync();save()}
 R.items.forEach(o=>{if(o.v&&Math.hypot(P.x-o.px,P.y-o.py)<22)act(o)});vis();
 R.ins.forEach(o=>{if(o.k=='pad'&&!o.lit&&!lk()&&Math.hypot(P.x-o.px,P.y-o.py)<18&&(!o.q||Math.sin(now/700)>0))o.lit=true});check();
 R.bugs.forEach(b=>{if(!b.a)return;if(b.k=='y'){const dx=P.x-b.x,dy=P.y-b.y,d=Math.hypot(dx,dy);if(d<190&&d>1)mv(b,dx/d*55*dt,dy/d*55*dt)}else if(!mv(b,b.k=='x'?b.d*50*dt:0,b.k=='v'?b.d*50*dt:0))b.d=-b.d;
  if(Math.hypot(P.x-b.x,P.y-b.y)<19)hit()});
 R.bolts=R.bolts.filter(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;if(wallAt(b.x,b.y))return false;
  for(const g of R.bugs)if(g.a&&Math.hypot(g.x-b.x,g.y-b.y)<15){g.a=0;S.coin=(S.coin|0)+1;say('باگ خاموش شد! ‎+۱ 🪙');return false}
  const B=R.boss;if(B&&S.t[7]&&!B.dead&&Math.hypot(B.px-b.x,B.py-b.y)<14){B.hp--;B.hurt=now+160;if(B.hp<=0)winBoss();return false}return true});
 if(R.i==2&&!R.in){const n=R.npc;
  if(S.ns>=1&&S.ns<=3){
   if(!R.star){if(!R.nT)R.nT=now+1400;if(now>R.nT){const cs=C3.map(([x,y])=>({x:x*T+16,y:y*T+16})).filter(q=>Math.hypot(q.x-P.x,q.y-P.y)>150);R.star=cs[Math.floor(Math.random()*cs.length)];R.nT=0}}
   else{const v=[0,300,200,130][S.ns],dx=R.star.x-n.px,dy=R.star.y-n.py,d=Math.hypot(dx,dy);
    if(d<8||Math.hypot(P.x-R.star.x,P.y-R.star.y)<30){n.px=R.star.x;n.py=R.star.y;R.star=null;say(['نئون: هه! مالِ من!','نئون: (نفس‌نفس) …باز مالِ من!','نئون: هاه… هاه… …مال… من…'][S.ns-1],n);S.ns++;
     if(S.ns==4){R.stars=C4.map(([x,y])=>({x:x*T+16,y:y*T+16}));S.sp=0;say('نئون از نفس افتاد! حالا جرقه‌ها مالِ منن.',n)}save()}
    else{n.px+=dx/d*v*dt;n.py+=dy/d*v*dt}}}
  R.stars=R.stars.filter(s=>{if(Math.hypot(P.x-s.x,P.y-s.y)<22){S.sp++;say('جرقه! ('+fa(S.sp)+' از ۳)');if(S.sp>=3){S.ns=5;say('نئون خسته‌ست… برم باهاش حرف بزنم.')}save();return false}return true})}
 const B=R.boss;if(B&&S.t[7]&&!B.dead){B.mt-=dt;if(B.mt<=0){B.mt=1.8;B.tx=(3+Math.random()*10)*T;B.ty=(2+Math.random()*7)*T}
  const dx=B.tx-B.px,dy=B.ty-B.py,d=Math.hypot(dx,dy)||1,sp=B.hp>6?55:85;if(d>4){B.px+=dx/d*sp*dt;B.py+=dy/d*sp*dt}
  B.fl-=dt;if(B.fl<=0){B.fl=B.hp>6?1.5:1;B.a+=.35;const n=B.hp>6?8:10;for(let k=0;k<n;k++){const a=B.a+k*6.283/n;R.orbs.push({x:B.px,y:B.py,vx:Math.cos(a)*95,vy:Math.sin(a)*95})}
   if(B.hp<=6){const a=Math.atan2(P.y-B.py,P.x-B.px);R.orbs.push({x:B.px,y:B.py,vx:Math.cos(a)*150,vy:Math.sin(a)*150})}}
  if(Math.hypot(P.x-B.px,P.y-B.py)<18)hit()}
 R.orbs=R.orbs.filter(o=>{o.x+=o.vx*dt;o.y+=o.vy*dt;if(wallAt(o.x,o.y))return false;if(Math.hypot(P.x-o.x,P.y-o.y)<13){hit();return false}return true});
 if(R.in){if(P.y>12*T){const b=R.back;R=R.out;P={...b};tg=pend=null}return}
 const dr=R.props.find(o=>o.k=='cafe'&&(P.x/T|0)==o.x+(o.w>>1)&&(P.y/T|0)==o.y+o.h-1);
 if(dr)enterCafe(dr);else{const ex=R.i<7&&SD[R.i],en=R.i>0&&OP[SD[R.i-1]];if(ex=='R'&&P.x>=R.w*T||ex=='U'&&P.y<0||ex=='D'&&P.y>=R.h*T)go(R.i+1);else if(en=='L'&&P.x<0||en=='U'&&P.y<0||en=='D'&&P.y>=R.h*T)go(R.i-1)}}
const L=(d,x,y,r)=>{const sx=(x+GO-camX)*Z*dpr,sy=(y+GOY-camY)*Z*dpr,R2=r*Z*dpr,g=d.createRadialGradient(sx,sy,0,sx,sy,R2);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.55,'rgba(0,0,0,.65)');g.addColorStop(1,'rgba(0,0,0,0)');d.fillStyle=g;d.beginPath();d.arc(sx,sy,R2,0,6.3);d.fill()};
function eyes(x,y,col){c.fillStyle=col;c.beginPath();c.arc(x-4,y,3,0,6.3);c.arc(x+4,y,3,0,6.3);c.fill()}
const dfr=(sd,p,w,pl)=>{const hz=sd=='U'||sd=='D',X=sd=='R'?(R.w-1)*T:sd=='L'?0:(p-w)*T,Y=sd=='D'?(R.h-1)*T:sd=='U'?0:(p-w)*T,A=hz?(2*w+1)*T:T,B=hz?T:(2*w+1)*T;c.save();c.shadowColor=pl[2];c.shadowBlur=14;c.fillStyle=pl[2];if(hz){c.fillRect(X-5,Y,5,B);c.fillRect(X+A,Y,5,B)}else{c.fillRect(X,Y-5,A,5);c.fillRect(X,Y+B,A,5)}c.restore();c.fillStyle='rgba(255,255,255,.07)';c.fillRect(X,Y,A,B)};
const sh=(x,y,r)=>{c.fillStyle='rgba(0,0,0,.38)';c.beginPath();c.ellipse(x,y,r,r*.4,0,0,6.3);c.fill()},ci=(x,y,r,f)=>{c.fillStyle=f;c.beginPath();c.arc(x,y,r,0,6.3);c.fill()};
function deco(X,Y,h,i){c.save();c.globalAlpha=.4;c.strokeStyle=c.fillStyle=RM[i].p[2];c.lineWidth=1.5;const a=X+6+h%13,b=Y+8+(h>>4)%13;c.beginPath();
 if(i==0)c.rect(a,b,9,6);else if(i==1){c.moveTo(a,b+7);c.lineTo(a-1,b);c.moveTo(a+3,b+7);c.lineTo(a+4,b+1)}else if(i==2){c.rect(X,Y+15,T,1)}else if(i==3){c.moveTo(a,b-3);c.lineTo(a+3,b);c.lineTo(a,b+3);c.lineTo(a-3,b)}else if(i==4)c.ellipse(a,b,4,2.5,0,0,6.3);else if(i==5)c.arc(a,b,6,3.4,6);else if(i==6)c.ellipse(a,b,7,2.5,0,0,6.3);else{c.moveTo(a,b);c.lineTo(a+8,b+5);c.lineTo(a+5,b+11)}
 i==1||i==2||i==5||i==6||i==7||i==0?c.stroke():c.fill();c.restore()}
function prop(o,p){const X=o.x*T,Y=o.y*T,w=o.w*T,h=o.h*T,k=o.k,t=now/1000;
 if(k=='cafe'||k=='house'){const cf=k=='cafe',bd=cf?'#2c2433':'#2a2a33',rf=cf?p[2]:'#5a4a66';c.fillStyle='rgba(0,0,0,.4)';c.fillRect(X+4,Y+h-2,w,7);c.fillStyle=bd;c.fillRect(X,Y,w,h);c.fillStyle=rf;c.fillRect(X-2,Y-2,w+4,13);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(X-2,Y+9,w+4,3);
  if(cf){c.fillStyle=p[2];for(let a=0;a<o.w*2;a++){c.beginPath();c.arc(X+8+a*16,Y+11,8,0,3.2);c.fill()}}
  const wc='#ffd36b';c.save();c.shadowColor=wc;c.shadowBlur=10;c.fillStyle=wc;c.globalAlpha=.85;c.fillRect(X+6,Y+17,13,12);c.fillRect(X+w-19,Y+17,13,12);c.restore();c.fillStyle='rgba(0,0,0,.35)';c.fillRect(X+12,Y+17,1.5,12);c.fillRect(X+w-13,Y+17,1.5,12);
  const dx=(o.x+(o.w>>1))*T+6;c.fillStyle='#120e16';c.fillRect(dx,Y+h-26,20,26);c.fillStyle=cf?wc:'#7a6a55';c.globalAlpha=.9;c.fillRect(dx+15,Y+h-13,2,2);c.globalAlpha=1;c.strokeStyle=rf;c.lineWidth=2;c.strokeRect(dx,Y+h-26,20,26);
  if(o.t){const bw=Math.max(w-6,o.t.length*7+10);c.save();c.shadowColor=p[2];c.shadowBlur=12;c.fillStyle='#14101a';c.fillRect(X+w/2-bw/2,Y-24,bw,17);c.restore();c.strokeStyle=p[2];c.lineWidth=1.5;c.strokeRect(X+w/2-bw/2,Y-24,bw,17);c.font='700 11px Vazirmatn,Tahoma';c.textAlign='center';c.fillStyle='#fff5dc';c.fillText(o.t,X+w/2,Y-11)}return}
 if(k=='counter'){c.fillStyle='#4a3524';c.fillRect(X,Y+4,w,h-4);c.fillStyle=p[2];c.fillRect(X,Y+2,w,4);c.fillStyle='rgba(0,0,0,.3)';c.fillRect(X,Y+h-5,w,5);c.font='18px sans-serif';c.textAlign='center';[1,3,5,7].forEach((q,i)=>c.fillText(['☕','🍰','🫖','🥐'][i],X+q*T+16,Y+2));return}
 if(k=='table'){sh(X+16,Y+27,12);ci(X+16,Y+15,12,'#4a3524');c.strokeStyle=p[2];c.lineWidth=2;c.stroke();c.font='14px sans-serif';c.textAlign='center';c.fillText('☕',X+16,Y+20);return}
 const cx=X+16,by=Y+28;
 if(k=='park'){c.fillStyle=p[2];c.globalAlpha=.13;c.fillRect(X+2,Y+2,w-4,h-4);c.globalAlpha=.3;c.fillRect(X+w/2-5,Y+2,10,h-4);c.globalAlpha=1;c.strokeStyle=p[2];c.globalAlpha=.35;c.strokeRect(X+2,Y+2,w-4,h-4);c.globalAlpha=1;return}
 if(k=='pond'){c.fillStyle='#173a43';c.beginPath();c.roundRect?c.roundRect(X+2,Y+2,w-4,h-4,14):c.rect(X+2,Y+2,w-4,h-4);c.fill();c.strokeStyle='#5fa9b0';c.globalAlpha=.5;c.lineWidth=1.5;for(let q=0;q<3;q++){c.beginPath();c.ellipse(X+w/2+Math.sin(t+q)*8,Y+h/2+(q-1)*9,12+q*3,3,0,0,6.3);c.stroke()}c.globalAlpha=1;ci(X+w-14,Y+14,6,'#3e7a3b');return}
 sh(cx,by,k=='tree'?12:k=='house'?0:9);
 if(k=='tree'){c.fillStyle='#4a3322';c.fillRect(cx-3,Y+14,6,14);ci(cx,Y+10,13,'#1f4d33');ci(cx-4,Y+6,7,'#2f6e48');ci(cx+6,Y+12,7,'#265a3c')}
 else if(k=='mush'){c.fillStyle='#e8dccb';c.fillRect(cx-2,Y+16,4,10);c.save();c.shadowColor='#ff7b5f';c.shadowBlur=9;ci(cx,Y+16,10,'#e07a5f');c.restore();c.fillStyle='#fff';[[-4,13],[3,11],[5,16]].forEach(([a,b])=>ci(cx+a,Y+b,1.8,'#fff'))}
 else if(k=='neon'){c.fillStyle='#1b1626';c.fillRect(cx-5,Y+6,10,22);c.save();c.shadowColor=p[2];c.shadowBlur=14+Math.sin(t*4+o.x)*4;c.fillStyle=p[2];c.fillRect(cx-2,Y+2,4,22);ci(cx,Y+3,5,p[2]);c.restore()}
 else if(k=='crys'){c.save();c.shadowColor=p[2];c.shadowBlur=16;c.fillStyle=p[2];[[0,-14,9],[-8,-6,6],[8,-4,6]].forEach(([a,b,r])=>{c.beginPath();c.moveTo(cx+a,by+b-r);c.lineTo(cx+a+r*.6,by+b+8);c.lineTo(cx+a-r*.6,by+b+8);c.fill()});c.restore();c.fillStyle='rgba(255,255,255,.35)';c.fillRect(cx-1,by-22,2,10)}
 else if(k=='stal'){c.fillStyle='#3b3548';c.beginPath();c.moveTo(cx-9,by);c.lineTo(cx-2,by-24);c.lineTo(cx+9,by);c.fill();c.fillStyle='#524a63';c.beginPath();c.moveTo(cx-2,by-24);c.lineTo(cx+9,by);c.lineTo(cx+2,by);c.fill()}
 else if(k=='cact'){c.fillStyle='#3f7d4a';c.fillRect(cx-4,by-22,8,22);c.fillRect(cx-11,by-16,5,4);c.fillRect(cx-11,by-20,4,8);c.fillRect(cx+6,by-12,5,4);c.fillRect(cx+7,by-18,4,10);ci(cx,by-22,4,'#3f7d4a');ci(cx+1,by-26,2,'#ff7eb6')}
 else if(k=='reed'){c.strokeStyle='#5f8a45';c.lineWidth=2;[-5,0,5].forEach((a,i)=>{c.beginPath();c.moveTo(cx+a,by);c.quadraticCurveTo(cx+a+Math.sin(t*1.5+i)*3,by-12,cx+a*1.4,by-20-i*2);c.stroke();ci(cx+a*1.4,by-21-i*2,2.5,'#6b4a2a')})}
 else if(k=='ruin'){c.fillStyle='#4b4458';c.fillRect(cx-8,by-18,16,18);c.fillStyle='#625a72';c.fillRect(cx-8,by-18,16,4);c.fillStyle='#2a2433';c.fillRect(cx-3,by-12,3,12);c.fillStyle='#4b4458';c.fillRect(cx+2,by-26,6,8)}
 else if(k=='lamp'){c.fillStyle='#31494b';c.fillRect(cx-2,by-24,4,24);c.save();c.shadowColor='#ffb347';c.shadowBlur=16;ci(cx,by-26,6,'#ffd36b');c.restore()}
 else if(k=='bench'){c.fillStyle='#4a3a2c';c.fillRect(X+3,Y+10,26,8);c.fillStyle='#6a5442';c.fillRect(X+3,Y+10,26,3);c.fillStyle='#2e231a';c.fillRect(X+5,Y+18,4,7);c.fillRect(X+23,Y+18,4,7)}
 else{ci(cx,by-10,10,'#2a5a3c');ci(cx-4,by-14,5,'#3f7d4f');ci(cx+5,by-8,4,'#ff9aa8')}}
function body(){
 const m=RM[R.i],p=m.p;
 for(let y=0;y<R.h;y++)for(let x=0;x<R.w;x++){const h=((x*73856093)^(y*19349663))>>>0,X=x*T,Y=y*T;
  c.fillStyle=R.wall[y][x]?p[3]:(x+y)%2?p[0]:p[1];c.fillRect(X,Y,T,T);if(R.wall[y][x]){c.fillStyle='rgba(255,255,255,.08)';c.fillRect(X,Y,T,3);c.fillStyle='rgba(0,0,0,.28)';c.fillRect(X,Y+T-4,T,4)}
  if(R.wall[y][x]){c.strokeStyle=p[2];c.globalAlpha=.12;c.strokeRect(X+2.5,Y+2.5,T-5,T-5);c.globalAlpha=1;if(R.i==7&&h%3==0){const bl=Math.sin(now/900+h)>-.8?1:.1;c.fillStyle='#c36bff';c.globalAlpha=.7*bl;c.beginPath();c.ellipse(X+16,Y+16,7,3*bl+.5,0,0,6.3);c.fill();c.globalAlpha=1}}
  else if(h%6==0){c.fillStyle=p[2];c.globalAlpha=.22;const q=R.i%4;c.beginPath();if(q==0)c.arc(X+16,Y+16,2.5,0,6.3);else if(q==1){c.moveTo(X+16,Y+8);c.lineTo(X+22,Y+22);c.lineTo(X+10,Y+22)}else if(q==2){c.rect(X+14,Y+8,4,16);c.rect(X+8,Y+14,16,4)}else{c.moveTo(X+16,Y+8);c.lineTo(X+22,Y+16);c.lineTo(X+16,Y+24);c.lineTo(X+10,Y+16)}c.fill();c.globalAlpha=1}else if(h%3==0)deco(X,Y,h,R.i)}
 if(R.i<7&&!R.in)dfr(SD[R.i],XP[R.i],HW[R.i],p);if(R.i>0&&!R.in)dfr(OP[SD[R.i-1]],EP[R.i-1],HW[R.i-1],p);
 if(R.gate){R.G.forEach(g=>{const a=g.open?Math.max(0,1-(now-g.t)/700):1;if(a>0){c.save();c.globalAlpha=.55*a;c.fillStyle='#c8262c';c.fillRect(g.x*T,5*T,T,T);c.globalAlpha=a;c.strokeStyle='#ff7b80';c.lineWidth=2;c.setLineDash([6,6]);c.lineDashOffset=-now/60;c.strokeRect(g.x*T+1,5*T+1,T-2,T-2);c.restore()}});
  c.strokeStyle=p[2];c.globalAlpha=R.gOpen?.9:.25;c.lineWidth=3;c.beginPath();c.arc(15*T+16,5*T+16,11+Math.sin(now/250)*2,0,6.3);c.stroke();c.globalAlpha=1}
 R.ins.forEach(o=>{const X=o.x*T,Y=o.y*T,on=val(o);
  if(o.k=='btn'){c.fillStyle=on?p[2]:'#0b1214';c.strokeStyle=p[2];c.lineWidth=2;c.fillRect(X+5,Y+5,22,22);c.strokeRect(X+5,Y+5,22,22)}
  else if(o.k=='pad'){const bl=o.q&&!o.lit&&Math.sin(now/700)>0;c.fillStyle=o.lit||bl?p[2]:'#0b1214';c.strokeStyle=p[2];c.lineWidth=2;c.beginPath();c.arc(X+16,Y+16,11,0,6.3);c.fill();c.stroke()}});
 R.items.forEach(o=>{if(!o.v)return;c.font='22px sans-serif';c.textAlign='center';c.fillText({zap:'⚡',drink:'🥤',candle:'🕯️'}[o.kind],o.px,o.py+8+Math.sin(now/250)*3)});
 R.stars.forEach(s=>{c.font='20px sans-serif';c.textAlign='center';c.fillText('⭐',s.x,s.y+7+Math.sin(now/200)*3)});
 if(R.star){c.font='20px sans-serif';c.textAlign='center';c.fillText('⭐',R.star.x,R.star.y+7)}
 R.props.forEach(o=>prop(o,p));
 R.folk.forEach(f=>{const x=f.px,y=f.py;c.fillStyle=f.cl;c.beginPath();c.arc(x,y,11,0,6.3);c.fill();eyes(x,y+1,'#fff');c.fillStyle='#111';c.fillRect(x-5,y,2,2);c.fillRect(x+3,y,2,2);c.font='700 9px Vazirmatn,Tahoma';c.fillStyle='#cfe3e3';c.textAlign='center';c.fillText(f.nm,x,y+24);if(f.qk&&[0,2,4].includes(S.q[f.qk]|0)){c.font='700 17px sans-serif';c.fillStyle='#ffd36b';c.fillText('!',x,y-16+Math.sin(now/200)*2)}});
 R.qit.forEach(t=>{c.font='22px sans-serif';c.textAlign='center';c.fillText(t.e.split(' ')[0],t.px,t.py+8+Math.sin(now/250)*3)});
 if(R.tower)tw(R.tower);
 if(R.sv&&R.i<7){const t=now/400;c.save();c.shadowColor='#7be3ff';c.shadowBlur=16+Math.sin(t)*5;c.fillStyle='#c9f2ff';c.font='22px sans-serif';c.textAlign='center';c.fillText('✦',R.sv.px,R.sv.py+8+Math.sin(t)*2);c.restore()}
 R.mem.forEach(m=>{if(S.mm[m.key]||R.i!=cI)return;const d=Math.hypot(P.x-m.px,P.y-m.py),a=Math.max(0,Math.min(.9,(150-d)/90));if(a>0){c.save();c.globalAlpha=a;c.shadowColor='#ffe9a8';c.shadowBlur=14;c.fillStyle='#fff4c8';c.font='18px sans-serif';c.textAlign='center';c.fillText('✧',m.px,m.py+6+Math.sin(now/300+m.n)*2);c.restore()}});
 R.rocks.forEach(r=>{const X=r.x*T,Y=r.y*T;c.fillStyle='#3a4a4c';c.beginPath();c.moveTo(X+4,Y+26);c.lineTo(X+7,Y+9);c.lineTo(X+18,Y+4);c.lineTo(X+28,Y+12);c.lineTo(X+27,Y+26);c.closePath();c.fill();c.strokeStyle='#5d7376';c.lineWidth=2;c.stroke()});
 R.sol.forEach(o=>{if(o.k!='lamp'&&o.k!='crys')return;const x=o.px,y=o.py;c.save();
  if(o.k=='lamp'){c.fillStyle='#31494b';c.fillRect(x-2,y-2,4,16);c.fillStyle=o.on?'#ffb347':'#3b3a35';if(o.on){c.shadowColor='#ff9d2e';c.shadowBlur=22}c.beginPath();c.arc(x,y-6,9,0,6.3);c.fill()}
  else{c.fillStyle=o.on?'#7be3ff':'#2b4a56';if(o.on){c.shadowColor='#3da9ff';c.shadowBlur=22}c.beginPath();c.moveTo(x,y-16);c.lineTo(x+10,y);c.lineTo(x,y+12);c.lineTo(x-10,y);c.closePath();c.fill()}c.restore()});
 R.bugs.forEach(b=>{if(!b.a)return;c.save();c.translate(b.x,b.y);c.strokeStyle='#5a3a78';c.lineWidth=2;c.beginPath();for(let k=-1;k<=1;k++){c.moveTo(-8,k*5);c.lineTo(-14,k*7+Math.sin(now/90+k)*2);c.moveTo(8,k*5);c.lineTo(14,k*7+Math.cos(now/90+k)*2)}c.stroke();
  c.fillStyle=b.k=='y'?'#4a1230':'#1e1436';c.shadowColor='#c36bff';c.shadowBlur=10;c.beginPath();c.ellipse(0,0,9,11,0,0,6.3);c.fill();c.shadowBlur=0;eyes(0,-3,'#ff4d6d');c.restore()});
 const n=R.npc;if(n){c.save();const bs=R.boss,x=n.px,y=n.py+Math.sin(now/400+n.x)*1.5;
  if(bs){if(bs.dead){c.globalAlpha=.5}c.fillStyle=now<bs.hurt?'#fff':'#1a1030';c.shadowColor='#c36bff';c.shadowBlur=16;c.beginPath();c.arc(x,y,8,0,6.3);c.fill();c.shadowBlur=0;c.fillStyle='#c36bff';c.beginPath();c.moveTo(x-8,y-6);c.lineTo(x-6,y-16);c.lineTo(x-2,y-9);c.lineTo(x,y-17);c.lineTo(x+2,y-9);c.lineTo(x+6,y-16);c.lineTo(x+8,y-6);c.fill();eyes(x,y+1,'#ff4d6d')}
  else{c.fillStyle=RM[R.i].cl;c.beginPath();c.arc(x,y,13,0,6.3);c.fill();eyes(x,y+1,'#fff');c.fillStyle='#111';c.fillRect(x-5,y,2,2);c.fillRect(x+3,y,2,2);
   if(R.i==2){c.fillStyle=RM[R.i].cl;[-15,15].forEach(k=>{c.beginPath();c.ellipse(x+k,y+4,5,11,k>0?.3:-.3,0,6.3);c.fill()});if(S.ns>=2){c.font='14px sans-serif';c.textAlign='center';c.fillText('💦',x+16,y-14)}}
   if(R.i==4){c.fillStyle='#fff3c4';c.fillRect(x-3,y-24,6,10);c.fillStyle='#ff9d2e';c.beginPath();c.ellipse(x,y-28,3,5,0,0,6.3);c.fill()}
   c.font='700 10px Vazirmatn,Tahoma';c.fillStyle='#cfe3e3';c.textAlign='center';c.fillText(RM[R.i].nm,x,y+27)}c.restore()}
 R.orbs.forEach(o=>{c.fillStyle='#c36bff';c.shadowColor='#c36bff';c.shadowBlur=10;c.beginPath();c.arc(o.x,o.y,6,0,6.3);c.fill();c.shadowBlur=0});
 R.bolts.forEach(b=>{c.strokeStyle='#bfe3ff';c.lineWidth=3;c.shadowColor='#3da9ff';c.shadowBlur=10;c.beginPath();c.moveTo(b.x,b.y);c.lineTo(b.x-b.vx*.03,b.y-b.vy*.03);c.stroke();c.shadowBlur=0});
 }
function draw(){const m=RM[R.i],p=m.p,cur=R,GX=OX[R.i],GY=OY[R.i];GO=GX;GOY=GY;cI=R.i;c.setTransform(1,0,0,1,0,0);c.fillStyle='#050708';c.fillRect(0,0,cv.width,cv.height);
 for(const[rm,k]of cur.in?[[cur,cur.i]]:[cur.i-1,cur.i,cur.i+1].filter(k=>RS[k]).map(k=>[k==cur.i?cur:RS[k],k])){R=rm;c.setTransform(dpr*Z,0,0,dpr*Z,(OX[k]-camX)*Z*dpr,(OY[k]-camY)*Z*dpr);body()}
 R=cur;c.setTransform(dpr*Z,0,0,dpr*Z,(GX-camX)*Z*dpr,(GY-camY)*Z*dpr);
 if(now>=inv||Math.floor(now/90)%2){const r=8+Math.sin(now/220)*1.2,g=c.createRadialGradient(P.x,P.y,0,P.x,P.y,28);g.addColorStop(0,'rgba(120,200,255,.95)');g.addColorStop(.35,'rgba(61,169,255,.45)');g.addColorStop(1,'rgba(61,169,255,0)');c.fillStyle=g;c.beginPath();c.arc(P.x,P.y,28,0,6.3);c.fill();c.save();c.fillStyle='#e8f6ff';c.shadowColor='#3da9ff';c.shadowBlur=18;c.beginPath();c.arc(P.x,P.y,r,0,6.3);c.fill();c.restore()}
 const d=dg;d.setTransform(1,0,0,1,0,0);d.globalCompositeOperation='source-over';d.clearRect(0,0,dk.width,dk.height);d.fillStyle='rgba(3,6,8,'+(S.done?0:R.in?.3:Math.min(.62,p[4]*.62))+')';d.fillRect(0,0,dk.width,dk.height);d.globalCompositeOperation='destination-out';
 L(d,P.x,P.y,300);if(R.in)L(d,9*T,8*T,280);R.ins.forEach(o=>{if(val(o)&&o.k!='btn')L(d,o.px,o.py,110)});R.items.forEach(o=>o.v&&L(d,o.px,o.py,60));R.props.forEach(o=>o.k=='cafe'&&L(d,(o.x+o.w/2)*T,(o.y+o.h/2)*T,125));R.folk.forEach(f=>L(d,f.px,f.py,55));R.qit.forEach(t=>L(d,t.px,t.py,60));R.stars.forEach(s=>L(d,s.x,s.y,70));R.orbs.forEach(o=>L(d,o.x,o.y,40));if(R.boss&&!R.boss.dead)L(d,R.boss.px,R.boss.py,90);if(R.gOpen)L(d,15*T+16,5*T+16,100);
 c.setTransform(1,0,0,1,0,0);c.drawImage(dk,0,0);c.setTransform(dpr,0,0,dpr,0,0);
 c.font='20px sans-serif';c.textAlign='left';for(let k=0;k<S.mh;k++){c.fillStyle=k<hp?'#ff4d6d':'#3a2a30';c.fillText('♥',16+k*24,98)}c.font='700 14px Vazirmatn,Tahoma';c.fillStyle='#ffd36b';c.fillText('🪙 '+fa(S.coin|0),16,122);c.fillStyle='#fff4c8';c.fillText('✧ '+fa(Object.keys(S.mm).length)+'/۱۴',16,144);
 if(now<R.ban){c.globalAlpha=Math.min(1,(R.ban-now)/600);c.textAlign='center';c.font='400 22px "Archivo Black",sans-serif';c.fillStyle=m.p[2];c.fillText(R.i+1+' · '+m.c,gW/2,130);c.font='700 16px Vazirmatn,Tahoma';c.fillStyle='#eef5f5';c.fillText(m.n,gW/2,156);c.globalAlpha=1}
 if(R.boss&&S.t[7]&&!R.boss.dead){c.fillStyle='#2a1a3a';c.fillRect(gW/2-90,84,180,8);c.fillStyle='#c36bff';c.fillRect(gW/2-90,84,180*R.boss.hp/12,8)}
 if(fin){const t=now-fin,end=1800+2200*(finL||FIN).length+2500;if(t>end)fin=0;else{const a=Math.min(1,t/2500)*Math.min(1,(end-t)/2500),W2=gW*dpr,H2=gH*dpr,g=c.createRadialGradient(W2/2,H2/2,0,W2/2,H2/2,Math.max(W2,H2)*(.25+.6*a));c.setTransform(1,0,0,1,0,0);g.addColorStop(0,'rgba(255,246,208,'+.9*a+')');g.addColorStop(1,'rgba(255,214,120,'+.15*a+')');c.fillStyle=g;c.fillRect(0,0,cv.width,cv.height);
  const i=Math.floor((t-1800)/2200);if(i>=0&&i<(finL||FIN).length){const f=((t-1800)%2200)/2200;c.setTransform(dpr,0,0,dpr,0,0);c.globalAlpha=Math.min(1,f*4,(1-f)*4);c.textAlign='center';c.fillStyle='#2a1a00';c.font='700 20px Vazirmatn,Tahoma';c.fillText((finL||FIN)[i],gW/2,gH/2);c.globalAlpha=1}}}
 if(now<inv-900){c.fillStyle='rgba(200,40,80,'+.3*(inv-900-now)/400+')';c.fillRect(0,0,gW,gH)}
 const wo=dlg&&dlg.who||R.npc,el=dlg?gnpc:gbub,wx=dlg?wo.px:bo?bo.px:P.x,wy=dlg?wo.py:bo?bo.py:P.y;el.style.left=Math.max(130,Math.min(gW-130,(wx+GO-camX)*Z))+'px';el.style.top=Math.max(76,(wy-34+GOY-camY)*Z)+'px'}
function frame(t){raf=requestAnimationFrame(frame);now=t;const dt=Math.min(.05,(t-last)/1000);last=t;update(dt);camUp(dt);draw()}
const startLoop=()=>{if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}},stopLoop=()=>{cancelAnimationFrame(raf);raf=0};
function save(){try{localStorage.setItem('gk_g3',JSON.stringify(S))}catch(e){}}
function reset(first,full){let sv=null;if(first)try{sv=JSON.parse(localStorage.getItem('gk_g3'))}catch(e){}
 if(full){S=fresh();try{localStorage.removeItem('gk_g3')}catch(e){}}else if(sv)S=Object.assign(fresh(),sv);
 hp=S.mh;dlg=null;gnpc.classList.remove('on');tg=pend=null;RS=[];for(let i=0;i<8;i++)build(i,false);R=RS[S.room];P={...R.st};camUp(0,1);upd();
 say(full?'از اول شروع کردیم!':sv?'برگشتم! بریم ادامه بدیم.':'…اینجا کجاست؟ همه‌جا تاریکه. (کلیک یا WASD برای حرکت)')}
function gSize(){dpr=Math.min(2,devicePixelRatio||1);gW=gameEl.clientWidth;gH=gameEl.clientHeight;cv.width=gW*dpr;cv.height=gH*dpr;Z=Math.max(.9,Math.min(1.5,gW/560));dk=dk||document.createElement('canvas');dk.width=gW*dpr;dk.height=gH*dpr;dg=dk.getContext('2d')}
function gLoad(){loading=true;gload.classList.remove('off');const fl=$('gfl'),dot=$('gdot'),pc=$('gpct'),len=fl.getTotalLength(),t0=performance.now();
 const tick=n=>{const t=Math.min(1,(n-t0)/1800),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,p=fl.getPointAtLength(len*e);fl.setAttribute('stroke-dashoffset',100*(1-e));dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);pc.textContent=Math.round(e*100)+'%';
  if(t<1)requestAnimationFrame(tick);else setTimeout(()=>{gload.classList.add('off');loading=false;started=true;reset(true);if(document.body.dataset.state=='steps')startLoop()},300)};requestAnimationFrame(tick)}
window.gameOnState=id=>{if(id!='steps'){stopLoop();return}gSize();if(!started&&!loading)gLoad();else if(started)startLoop()};
cv.addEventListener('pointerdown',e=>{if(!started||loading)return;e.preventDefault();if(dlg){adv();return}hold=true;
 const r=cv.getBoundingClientRect(),wx=(e.clientX-r.left)/Z+camX-OX[R.i],wy=(e.clientY-r.top)/Z+camY-OY[R.i];
 const o=[R.npc,...R.folk,...R.ins.filter(o=>o.k=='lamp'||o.k=='crys'),...R.items.filter(o=>o.v)].find(o=>o&&Math.hypot(wx-o.px,wy-o.py)<26&&!(R.boss&&S.t[7]));
 if(o){pend=o;tg={x:o.px,y:o.py}}else{pend=null;tg={x:wx,y:wy}}});
cv.addEventListener('pointermove',e=>{if(hold&&!dlg&&started&&!pend){const r=cv.getBoundingClientRect();tg={x:(e.clientX-r.left)/Z+camX-OX[R.i],y:(e.clientY-r.top)/Z+camY-OY[R.i]}}});
addEventListener('pointerup',()=>{hold=false});cv.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(document.body.dataset.state!='steps'||!started)return;
 if(/^(Arrow|Key[WASD])/.test(e.code)||e.code=='Space'){e.preventDefault();keys[e.code]=true}
 if(e.code=='Space'||e.code=='Enter'||e.code=='KeyE'){if(dlg)adv();else if(e.code=='Space')fire();else{const o=[R.npc,...R.folk,...R.ins.filter(o=>o.k=='lamp'||o.k=='crys'),...R.items.filter(o=>o.v)].find(o=>o&&Math.hypot(P.x-o.px,P.y-o.py)<56);o&&act(o)}}});
addEventListener('keyup',e=>{keys[e.code]=false});
const bar=document.querySelector('.gbar'),mk=(t,f)=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.addEventListener('click',f);return b};
const zb=mk('⚡ شلیک',fire);bar.prepend(zb);$('gReset').textContent='ریست اتاق';
$('gReset').addEventListener('click',()=>{if(started){hp=S.mh;dlg=null;gnpc.classList.remove('on');build(R.i)}});
bar.append(mk('بازی از اول',()=>{if(started&&confirm('همه‌ی پیشرفت پاک شه؟'))reset(false,true)}));
addEventListener('resize',()=>{if(gameEl.clientWidth)gSize()});
})();
