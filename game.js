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
{p:[['cafe',3,11,4,2,'☕ کافه‌ی ولت'],['bench',9,12],['plant',11,11],['plant',15,12]],f:[[9,13,'کافه‌چیِ مهربون','#ffb86b',['یه چای داغِ الکترونی؟ نوش جان!','اینجا همیشه گرمه، حتی وقتی برج خاموشه.']],[5,14,'بچه‌ی همسایه','#8fd3ff',['من یه‌بار یه جرقه دیدم! به‌خدا راست می‌گم!']],[15,13,'پیرمردِ نیمکت','#d9c8a0',['قدیما همه‌ی شهر روشن بود…','برو، برج منتظره.']]]},
{p:[['cafe',2,11,4,2,'🍄 کافه‌ی قارچ'],['plant',8,11],['bench',10,13],['plant',15,11]],f:[[8,13,'قارچ‌فروش','#e07a5f',['قارچ‌های اینجا توی تاریکی برق می‌زنن!','فقط از سایه‌ها دور بمون.']],[11,12,'دختر کوچولوی جنگل','#7bd88f',['خازنِ کوچولو دوستمه. خجالتیه ولی مهربونه.']],[15,13,'جنگل‌بان','#a8d5ba',['بعضی سنگ‌ها رو اگه بد هول بدی گیر می‌کنن. حواست باشه!']]]},
{p:[['cafe',3,11,4,2,'🥤 بارِ نئون'],['bench',9,12],['plant',12,13],['plant',15,11]],f:[[8,13,'ساقیِ بار','#ff7eb6',['نئون این‌جا هر روز نوشیدنی می‌گیره، ولی نمی‌شینه!']],[11,12,'رقصنده‌ی خیابون','#ffd1e8',['ریتم رو حس کن! بوم‌-بوم‌-بوم!']],[15,13,'تماشاچی','#c9b6ff',['نئون سریع‌ترین توی شهره… ولی نفسش کمه.']]]},
{p:[['cafe',2,11,4,2,'🔮 چای‌خانه‌ی ستاره'],['plant',8,11],['bench',9,13],['plant',15,12]],f:[[8,12,'فال‌گیر','#b58cff',['می‌بینم… دو بلور… یکی روشن، یکی خاموش!']],[11,13,'شاگردِ ستاره‌شناس','#d7c4ff',['استادم می‌گه XOR یعنی «فقط یکی».']],[15,13,'مسافرِ خسته','#cfd8ff',['راهِ بلند بود. این چای معجزه می‌کنه.']]]},
{p:[['cafe',3,11,4,2,'🕯️ کافه‌ی شمع'],['bench',9,12],['plant',11,13],['plant',15,11]],f:[[8,13,'معدن‌چیِ شمع‌به‌دست','#ffd36b',['تو غار هیچی جز نورِ شمع نیست… همین کافیه.']],[12,12,'خفاشِ دوست‌داشتنی','#9a8cff',['چی؟ نه، من گاز نمی‌گیرم! فقط صدا می‌زنم!']],[15,13,'ذوب‌کار','#ffae6b',['NOT یعنی برعکس. من همیشه برعکس فکر می‌کنم!']]]},
{p:[['cafe',2,11,5,2,'🌵 کاروانسرا'],['plant',8,11],['bench',10,13],['plant',15,12]],f:[[8,13,'شتربان','#e8c27b',['بیابون بی‌رحمه، ولی ستاره‌هاش قشنگن.']],[12,12,'تپش‌نواز','#6bd1ff',['سه صفحه، سه ضربان. هر کدوم رو روشن نگه دار!']],[15,13,'مسافرِ عطشان','#b8e6ff',['یه قطره آب بده… یا یه قطره نور!']]]},
{p:[['cafe',3,11,4,2,'🐸 کافه‌ی قورباغه'],['bench',9,12],['plant',11,13],['plant',15,11]],f:[[8,13,'قورباغه‌ی گارسون','#9be07a',['قورقور! سفارشِ شما؟ …فقط باگ نمی‌فروشیم.']],[12,12,'مهندسِ آماتور','#c4f09a',['XNOR: وقتی هر دو یکی‌ان، در باز می‌شه!']],[15,13,'پشه‌ی نگران','#d9f2b3',['باگ‌ها این‌جا زیادن… از اون‌ها فرار کن!']]]},
{p:[['plant',4,12],['bench',9,12],['plant',12,12]],f:[[6,13,'سایه‌ی ترسو','#a98bd6',['من از پادشاه می‌ترسم… ولی تو نه، درسته؟']],[11,13,'سایه‌ی مهربون','#c6a8ee',['اگه پیروز شدی، به ما هم یه ذره نور بده.']]]}];
/* ماموریت‌های فرعی: هر اتاق ۲ ماموریت (۲ چیزِ گمشده) دارد و پرده‌ی نور فقط با ۲ «جرقه‌ی دوستی» باز می‌شود. چیزهای گمشده: [ایموجی نام] */
const QN=['🍵 فنجونِ چینی|📒 دفترچه‌ی مقاومت‌ها|🔩 پیچِ طلایی|🪫 باتریِ قدیمی','🍄 قارچِ درخشان|🌿 برگِ نقره‌ای|🪵 چوبِ خشک|🦋 پروانه‌ی شیشه‌ای','🥤 نوشیدنیِ ورزشی|🎧 هدفونِ گم‌شده|💿 صفحه‌ی ریتم|🎤 میکروفونِ شکسته','🔮 گویِ بلورین|📜 نقشه‌ی ستاره‌ها|🪞 آینه‌ی کوچک|🧿 چشم‌نظر','🕯️ شمعِ یدکی|⛏️ کلنگِ زنگ‌زده|💎 سنگِ براق|🧯 فندکِ خاموش','🥁 طبلِ کوچک|🧭 قطب‌نمای شکسته|🏺 کوزه‌ی آب|📯 شیپورِ قدیمی','🔌 سیمِ پاره|🪲 سوسکِ مکانیکی|🔧 آچارِ فرانسه|💾 فلاپیِ قدیمی'];
const WP=W*T;let GO=0,camX=0,camY=0,RS=[];
const RULE={buf:a=>a[0],and:a=>a.every(Boolean),or:a=>a.some(Boolean),not:a=>!a[0],xor:a=>a[0]!==a[1],xnor:a=>a[0]===a[1],neon:()=>!!S.gd,none:()=>0};
const C4=[[3,2],[10,8],[6,5]],C3=[[3,2],[10,2],[3,8],[10,8],[6,5]];
const fresh=()=>({room:0,t:{},q:{},sh:{},zap:0,drink:0,candle:0,ns:0,sp:0,gd:0,gc:0,cs:0,done:0});
let S=fresh(),R,P={x:0,y:0},now=0,started=false,loading=false,raf=0,last=0,gW,gH,dpr=1,Z=1,ox=0,oy=0,dk,dg,tg=null,pend=null,hold=false,dlg=null,hp=3,inv=0,fireT=0,pushT=0,face=[1,0],keys={},qT=0,shT=0;
const lk=()=>!S.t[R.i]&&R.i!=2&&R.i!=7;
const tfree=(x,y,s)=>s&&y>9?false:(!s&&y==5&&(x<0&&R.i>0||x>=W&&R.i<7))||x>=0&&y>=0&&x<W&&y<H&&!R.wall[y][x]&&!(R.gate&&!R.gOpen&&x==13&&y==5)&&!R.rocks.some(r=>r.x==x&&r.y==y)&&!R.sol.some(o=>o.x==x&&o.y==y);
const wallAt=(x,y)=>{const i=Math.floor(x/T),j=Math.floor(y/T);return i<0||j<0||i>=W||j>=H||R.wall[j][i]||(R.gate&&!R.gOpen&&i==13&&j==5)};
const free=(x,y,s)=>[[-8,-8],[8,-8],[-8,8],[8,8]].every(([a,b])=>tfree(Math.floor((x+a)/T),Math.floor((y+b)/T),s));
function mv(o,dx,dy){let m=0;if(free(o.x+dx,o.y,1)){o.x+=dx;m=1}if(free(o.x,o.y+dy,1)){o.y+=dy;m=1}return m}
function say(t){gbub.textContent=t;gbub.classList.add('on');clearTimeout(qT);qT=setTimeout(()=>gbub.classList.remove('on'),2800)}
const val=o=>o.k=='btn'?R.rocks.some(r=>r.x==o.x&&r.y==o.y):o.k=='pad'?o.lit:o.on;
function check(){if(!R.gate)return;const m=RM[R.i],o1=!!((!m.q||S[m.q])&&RULE[m.r](R.ins.map(val))),ok=R.i>6||(S.sh[R.i]|0)>=2,o=o1&&ok;if(o1&&!ok&&now-shT>6000){shT=now;say('مدار درسته! ولی پرده‌ی نور فقط با ۲ جرقه‌ی دوستی باز می‌شه. با آدم‌های خیابون حرف بزن.')}if(o!==R.gOpen){R.gOpen=o;R.gT=now;say(o?'پرده‌ی نور محو شد! راه باز شد.':'پرده‌ی نور دوباره بسته شد.')}}
function build(i,pl){
 const m=RM[i];R={i,wall:Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=>x==0||y==0||x==W-1||y==H-1||(i<7&&x==13&&y!=5))),rocks:[],ins:[],sol:[],bugs:[],bolts:[],orbs:[],items:[],stars:[],npc:null,boss:null,star:null,nT:0,gate:i<7,gOpen:false,gT:-1e9,ban:now+2600};if(i<7)R.wall[5][W-1]=0;if(i>0)R.wall[5][0]=0;RS[i]=R;for(let x=1;x<W-1;x++)if(x<6||x>8&&x!=15)R.wall[10][x]=1;R.props=[];R.folk=[];R.qit=[];const st=STR[i];st.p.forEach(([k,x,y,w,h,t])=>{w=w||1;h=h||1;R.props.push({k,x,y,w,h,t});if(k=='cafe')for(let a=0;a<h;a++)for(let b=0;b<w;b++)R.wall[y+a][x+b]=1});
 st.f.forEach(([x,y,nm,cl,l])=>R.folk.push({k:'folk',hx:x*T+16,hy:y*T+16,px:x*T+16,py:y*T+16,nm,cl,l}));
 m.s.split(' ').forEach(t=>{const k=t[0],[x,y,w,h]=t.slice(1).split(',').map(Number),o={k,x,y,px:x*T+16,py:y*T+16};
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
 R.items.forEach(o=>o.v=false);qinit();if(pl!==false)P={...R.st};upd();
}
const sp=t=>{const i=t.indexOf(' ');return[t.slice(0,i),t.slice(i+1)]};
function qinit(){if(R.i>6)return;const seen=new Set(),cs=[],sx=R.st.x/T|0,sy=R.st.y/T|0,q=[[sx,sy]],ob=new Set([...R.rocks,...R.ins,...R.sol,...R.items].map(o=>o.x+','+o.y));
 while(q.length){const[x,y]=q.pop(),k=x+','+y;if(seen.has(k)||x<1||y<1||x>=13||y>=H-1||R.wall[y][x])continue;seen.add(k);if(!ob.has(k)&&Math.abs(x-sx)+Math.abs(y-sy)>3)cs.push([x,y]);q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1])}
 const top=cs.filter(a=>a[1]<10),bot=cs.filter(a=>a[1]>10);
 R.folk.forEach((f,j)=>{if(j>1)return;f.qk=R.i+'_'+j;const a=QN[R.i].split('|'),pk=(L,k)=>L[(R.i*7+j*13+k*5)%L.length];f.it=[a[j*2],a[j*2+1]];f.loc=[pk(top,0),pk(bot,1)]});qsync()}
function qsync(){R.qit=[];R.folk.forEach(f=>{if(!f.qk)return;const s=S.q[f.qk]|0;if(s==1||s==3){const[x,y]=f.loc[s==1?0:1];R.qit.push({f,s,px:x*T+16,py:y*T+16,e:f.it[s==1?0:1]})}})}
function fl(o){if(!o.qk)return[o.l];const s=S.q[o.qk]|0,[e1,n1]=sp(o.it[0]),[e2,n2]=sp(o.it[1]),k=o.qk,set=v=>()=>{S.q[k]=v;qsync();save();upd()};
 if(s==0)return[[o.nm+': سلام مسافر! یه کمکی ازت می‌خوام.','یه «'+n1+'» '+e1+' یه جایی بالا، تو محوطه‌ی مدار گم کردم.','پیداش کنی یه جرقه‌ی دوستی بهت می‌دم!'],set(1)];
 if(s==1)return[['هنوز «'+n1+'» '+e1+' رو پیدا نکردی؟ بگرد، یه جایی بالاست!']];
 if(s==2)return[['وای! همینه! ممنون ✨','یه چیز دیگه هم کم دارم: «'+n2+'» '+e2+'.','این یکی پایین، تو خیابونه.'],set(3)];
 if(s==3)return[['«'+n2+'» '+e2+' رو پیدا کردی؟ تو خیابون دنبالش بگرد!']];
 if(s==4)return[['عالیه! بیا، این جرقه‌ی دوستی مال تو. ✨'],()=>{S.q[k]=5;S.sh[R.i]=(S.sh[R.i]|0)+1;qsync();check();save();upd();say('✨ جرقه‌ی دوستی! ('+fa(S.sh[R.i])+' از ۲)')}];
 return[o.l]}
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
 if(o.k=='folk'){const[l,a]=fl(o);dlg={l,a,i:0,pos:0,nm:o.nm,cl:o.cl,who:o};gbub.classList.remove('on');return show()}
 if(o.k=='npc'){if(R.i==7&&S.t[7])return;return talk()}
 if(o.k=='item'){S[o.kind]=1;o.v=false;say({zap:'پالس‌گیر! حالا ⚡ یا Space رو بزن.',drink:'نوشیدنی! ببرمش برای نئون.',candle:'شمعِ طلایی! ببرمش برای ننه‌شمع.'}[o.kind]);save();check();return}
 if(lk())return say('اول باید با ساکنِ اینجا حرف بزنم.');
 o.on=!o.on;check();save()}
function hit(){if(now<inv||dlg)return;hp--;inv=now+1300;if(hp<=0){hp=3;build(R.i);say('(ریست شدم… دوباره!)')}else say('آخ! باگ!')}
const wl=(a,b)=>a<0||b<0||a>=W||b>=H||R.wall[b][a],bt=(a,b)=>R.ins.some(o=>o.k=='btn'&&o.x==a&&o.y==b);
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
function winBoss(){R.orbs=[];R.boss.dead=1;dlg={l:['…آخ. تموم شد.','می‌دونی؟ تو منو نترسوندی. فقط یادم آوردی نور چه شکلیه.','برو، برج رو روشن کن. من دیگه از نور نمی‌ترسم.'],i:0,pos:0,a:()=>{S.done=1;upd();save();say('برجِ نور روشن شد! پایان. ممنون که تا آخر بودی!');typeof burst=='function'&&burst({getBoundingClientRect:()=>({left:(P.x+R.i*WP-camX)*Z,top:(P.y-camY)*Z,width:0,height:0})})}};show()}
function go(i,dx){R=RS[i];P.x+=dx;if(tg)tg.x+=dx;pend=null;hp=3;R.ban=now+2600;S.room=i;upd();save()}
function camT(){const vw=gW/Z,vh=gH/Z,mw=8*WP,mh=H*T,cl=(v,a,b)=>Math.max(a,Math.min(b,v));return[vw>=mw?(mw-vw)/2:cl(P.x+R.i*WP-vw/2,0,mw-vw),vh>=mh?(mh-vh)/2:cl(P.y-vh/2,0,mh-vh)]}
function camUp(dt,snap){const[tx,ty]=camT(),k=snap?1:Math.min(1,dt*6);camX+=(tx-camX)*k;camY+=(ty-camY)*k}
function update(dt){
 if(dlg){if(dlg.pos<dlg.l[dlg.i].length){dlg.pos+=dt*36;const e=$('gt');if(e)e.textContent=dlg.l[dlg.i].slice(0,Math.floor(dlg.pos))}return}
 let vx=0,vy=0;if(keys.ArrowLeft||keys.KeyA)vx--;if(keys.ArrowRight||keys.KeyD)vx++;if(keys.ArrowUp||keys.KeyW)vy--;if(keys.ArrowDown||keys.KeyS)vy++;
 if(vx||vy){tg=null;pend=null}else if(tg){const dx=tg.x-P.x,dy=tg.y-P.y,d=Math.hypot(dx,dy);if(d>5){vx=dx/d;vy=dy/d}else tg=null}
 if(vx||vy){const d=Math.hypot(vx,vy);vx/=d;vy/=d;face=[vx,vy];step(vx*130*dt,vy*130*dt)}
 if(pend&&Math.hypot(P.x-pend.px,P.y-pend.py)<52){const o=pend;pend=null;tg=null;act(o)}
 R.folk.forEach((f,i)=>{f.px=f.hx+Math.sin(now/1700+i*2)*9;f.py=f.hy+Math.cos(now/2100+i)*5});
 const got=R.qit.find(t=>Math.hypot(P.x-t.px,P.y-t.py)<22);if(got){S.q[got.f.qk]=got.s+1;say('پیدا شد! '+got.e+' — برگردم پیشِ '+got.f.nm);qsync();save()}
 R.items.forEach(o=>{if(o.v&&Math.hypot(P.x-o.px,P.y-o.py)<22)act(o)});vis();
 R.ins.forEach(o=>{if(o.k=='pad'&&!o.lit&&!lk()&&Math.hypot(P.x-o.px,P.y-o.py)<18&&(!o.q||Math.sin(now/700)>0))o.lit=true});check();
 R.bugs.forEach(b=>{if(!b.a)return;if(b.k=='y'){const dx=P.x-b.x,dy=P.y-b.y,d=Math.hypot(dx,dy);if(d<190&&d>1)mv(b,dx/d*55*dt,dy/d*55*dt)}else if(!mv(b,b.k=='x'?b.d*50*dt:0,b.k=='v'?b.d*50*dt:0))b.d=-b.d;
  if(Math.hypot(P.x-b.x,P.y-b.y)<19)hit()});
 R.bolts=R.bolts.filter(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;if(wallAt(b.x,b.y))return false;
  for(const g of R.bugs)if(g.a&&Math.hypot(g.x-b.x,g.y-b.y)<15){g.a=0;say('باگ خاموش شد!');return false}
  const B=R.boss;if(B&&S.t[7]&&!B.dead&&Math.hypot(B.px-b.x,B.py-b.y)<14){B.hp--;B.hurt=now+160;if(B.hp<=0)winBoss();return false}return true});
 if(R.i==2){const n=R.npc;
  if(S.ns>=1&&S.ns<=3){
   if(!R.star){if(!R.nT)R.nT=now+1400;if(now>R.nT){const cs=C3.map(([x,y])=>({x:x*T+16,y:y*T+16})).filter(q=>Math.hypot(q.x-P.x,q.y-P.y)>150);R.star=cs[Math.floor(Math.random()*cs.length)];R.nT=0}}
   else{const v=[0,300,200,130][S.ns],dx=R.star.x-n.px,dy=R.star.y-n.py,d=Math.hypot(dx,dy);
    if(d<8||Math.hypot(P.x-R.star.x,P.y-R.star.y)<30){n.px=R.star.x;n.py=R.star.y;R.star=null;say(['نئون: هه! مالِ من!','نئون: (نفس‌نفس) …باز مالِ من!','نئون: هاه… هاه… …مال… من…'][S.ns-1]);S.ns++;
     if(S.ns==4){R.stars=C4.map(([x,y])=>({x:x*T+16,y:y*T+16}));S.sp=0;say('نئون از نفس افتاد! حالا جرقه‌ها مالِ منن.')}save()}
    else{n.px+=dx/d*v*dt;n.py+=dy/d*v*dt}}}
  R.stars=R.stars.filter(s=>{if(Math.hypot(P.x-s.x,P.y-s.y)<22){S.sp++;say('جرقه! ('+fa(S.sp)+' از ۳)');if(S.sp>=3){S.ns=5;say('نئون خسته‌ست… برم باهاش حرف بزنم.')}save();return false}return true})}
 const B=R.boss;if(B&&S.t[7]&&!B.dead){B.mt-=dt;if(B.mt<=0){B.mt=1.8;B.tx=(3+Math.random()*10)*T;B.ty=(2+Math.random()*7)*T}
  const dx=B.tx-B.px,dy=B.ty-B.py,d=Math.hypot(dx,dy)||1,sp=B.hp>6?55:85;if(d>4){B.px+=dx/d*sp*dt;B.py+=dy/d*sp*dt}
  B.fl-=dt;if(B.fl<=0){B.fl=B.hp>6?1.5:1;B.a+=.35;const n=B.hp>6?8:10;for(let k=0;k<n;k++){const a=B.a+k*6.283/n;R.orbs.push({x:B.px,y:B.py,vx:Math.cos(a)*95,vy:Math.sin(a)*95})}
   if(B.hp<=6){const a=Math.atan2(P.y-B.py,P.x-B.px);R.orbs.push({x:B.px,y:B.py,vx:Math.cos(a)*150,vy:Math.sin(a)*150})}}
  if(Math.hypot(P.x-B.px,P.y-B.py)<18)hit()}
 R.orbs=R.orbs.filter(o=>{o.x+=o.vx*dt;o.y+=o.vy*dt;if(wallAt(o.x,o.y))return false;if(Math.hypot(P.x-o.x,P.y-o.y)<13){hit();return false}return true});
 if(P.x>=WP&&R.i<7)go(R.i+1,-WP);else if(P.x<0&&R.i>0)go(R.i-1,WP)}
const L=(d,x,y,r)=>{const sx=(x+GO-camX)*Z*dpr,sy=(y-camY)*Z*dpr,R2=r*Z*dpr,g=d.createRadialGradient(sx,sy,0,sx,sy,R2);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.55,'rgba(0,0,0,.65)');g.addColorStop(1,'rgba(0,0,0,0)');d.fillStyle=g;d.beginPath();d.arc(sx,sy,R2,0,6.3);d.fill()};
function eyes(x,y,col){c.fillStyle=col;c.beginPath();c.arc(x-4,y,3,0,6.3);c.arc(x+4,y,3,0,6.3);c.fill()}
function body(){
 const m=RM[R.i],p=m.p;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const h=((x*73856093)^(y*19349663))>>>0,X=x*T,Y=y*T;
  c.fillStyle=R.wall[y][x]?p[3]:(x+y)%2?p[0]:p[1];c.fillRect(X,Y,T,T);
  if(R.wall[y][x]){c.strokeStyle=p[2];c.globalAlpha=.12;c.strokeRect(X+2.5,Y+2.5,T-5,T-5);c.globalAlpha=1;if(R.i==7&&h%3==0){const bl=Math.sin(now/900+h)>-.8?1:.1;c.fillStyle='#c36bff';c.globalAlpha=.7*bl;c.beginPath();c.ellipse(X+16,Y+16,7,3*bl+.5,0,0,6.3);c.fill();c.globalAlpha=1}}
  else if(h%6==0){c.fillStyle=p[2];c.globalAlpha=.22;const q=R.i%4;c.beginPath();if(q==0)c.arc(X+16,Y+16,2.5,0,6.3);else if(q==1){c.moveTo(X+16,Y+8);c.lineTo(X+22,Y+22);c.lineTo(X+10,Y+22)}else if(q==2){c.rect(X+14,Y+8,4,16);c.rect(X+8,Y+14,16,4)}else{c.moveTo(X+16,Y+8);c.lineTo(X+22,Y+16);c.lineTo(X+16,Y+24);c.lineTo(X+10,Y+16)}c.fill();c.globalAlpha=1}}
 if(R.gate){const a=R.gOpen?Math.max(0,1-(now-R.gT)/700):1;if(a>0){c.save();c.globalAlpha=.55*a;c.fillStyle='#c8262c';c.fillRect(13*T,5*T,T,T);c.globalAlpha=a;c.strokeStyle='#ff7b80';c.lineWidth=2;c.setLineDash([6,6]);c.lineDashOffset=-now/60;c.strokeRect(13*T+1,5*T+1,T-2,T-2);c.restore()}
  c.strokeStyle=p[2];c.globalAlpha=R.gOpen?.9:.25;c.lineWidth=3;c.beginPath();c.arc(15*T+16,5*T+16,11+Math.sin(now/250)*2,0,6.3);c.stroke();c.globalAlpha=1}
 R.ins.forEach(o=>{const X=o.x*T,Y=o.y*T,on=val(o);
  if(o.k=='btn'){c.fillStyle=on?p[2]:'#0b1214';c.strokeStyle=p[2];c.lineWidth=2;c.fillRect(X+5,Y+5,22,22);c.strokeRect(X+5,Y+5,22,22)}
  else if(o.k=='pad'){const bl=o.q&&!o.lit&&Math.sin(now/700)>0;c.fillStyle=o.lit||bl?p[2]:'#0b1214';c.strokeStyle=p[2];c.lineWidth=2;c.beginPath();c.arc(X+16,Y+16,11,0,6.3);c.fill();c.stroke()}});
 R.items.forEach(o=>{if(!o.v)return;c.font='22px sans-serif';c.textAlign='center';c.fillText({zap:'⚡',drink:'🥤',candle:'🕯️'}[o.kind],o.px,o.py+8+Math.sin(now/250)*3)});
 R.stars.forEach(s=>{c.font='20px sans-serif';c.textAlign='center';c.fillText('⭐',s.x,s.y+7+Math.sin(now/200)*3)});
 if(R.star){c.font='20px sans-serif';c.textAlign='center';c.fillText('⭐',R.star.x,R.star.y+7)}
 R.props.forEach(o=>{const X=o.x*T,Y=o.y*T,w=o.w*T,h=o.h*T;
  if(o.k=='cafe'){c.fillStyle='#241f2c';c.fillRect(X,Y,w,h);c.fillStyle=p[2];c.globalAlpha=.85;for(let a=0;a<o.w*2;a++)if(a%2==0)c.fillRect(X+a*16,Y,16,10);c.globalAlpha=1;c.strokeStyle=p[2];c.lineWidth=2;c.strokeRect(X+1,Y+1,w-2,h-2);c.fillStyle='#0b1214';c.fillRect(X+w/2-9,Y+h-24,18,24);c.fillStyle='#ffd36b';c.globalAlpha=.8;c.fillRect(X+8,Y+16,14,14);c.fillRect(X+w-22,Y+16,14,14);c.globalAlpha=1;c.font='700 11px Vazirmatn,Tahoma';c.textAlign='center';c.fillStyle='#eef5f5';c.fillText(o.t,X+w/2,Y-5)}
  else if(o.k=='bench'){c.fillStyle='#4a3a2c';c.fillRect(X+3,Y+10,26,8);c.fillStyle='#2e231a';c.fillRect(X+5,Y+18,4,7);c.fillRect(X+23,Y+18,4,7)}
  else{c.fillStyle='#2f5a3c';c.beginPath();c.arc(X+16,Y+12,9,0,6.3);c.fill();c.fillStyle='#4a3a2c';c.fillRect(X+12,Y+18,8,8)}});
 R.folk.forEach(f=>{const x=f.px,y=f.py;c.fillStyle=f.cl;c.beginPath();c.arc(x,y,11,0,6.3);c.fill();eyes(x,y+1,'#fff');c.fillStyle='#111';c.fillRect(x-5,y,2,2);c.fillRect(x+3,y,2,2);c.font='700 9px Vazirmatn,Tahoma';c.fillStyle='#cfe3e3';c.textAlign='center';c.fillText(f.nm,x,y+24);if(f.qk&&[0,2,4].includes(S.q[f.qk]|0)){c.font='700 17px sans-serif';c.fillStyle='#ffd36b';c.fillText('!',x,y-16+Math.sin(now/200)*2)}});
 R.qit.forEach(t=>{c.font='22px sans-serif';c.textAlign='center';c.fillText(t.e.split(' ')[0],t.px,t.py+8+Math.sin(now/250)*3)});
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
function draw(){const m=RM[R.i],p=m.p,cur=R,GX=R.i*WP;GO=GX;c.setTransform(1,0,0,1,0,0);c.fillStyle='#050708';c.fillRect(0,0,cv.width,cv.height);
 for(const k of[cur.i-1,cur.i,cur.i+1]){if(!RS[k])continue;R=RS[k];c.setTransform(dpr*Z,0,0,dpr*Z,(k*WP-camX)*Z*dpr,-camY*Z*dpr);body()}
 R=cur;c.setTransform(dpr*Z,0,0,dpr*Z,(GX-camX)*Z*dpr,-camY*Z*dpr);
 if(now>=inv||Math.floor(now/90)%2){const r=8+Math.sin(now/220)*1.2,g=c.createRadialGradient(P.x,P.y,0,P.x,P.y,28);g.addColorStop(0,'rgba(120,200,255,.95)');g.addColorStop(.35,'rgba(61,169,255,.45)');g.addColorStop(1,'rgba(61,169,255,0)');c.fillStyle=g;c.beginPath();c.arc(P.x,P.y,28,0,6.3);c.fill();c.save();c.fillStyle='#e8f6ff';c.shadowColor='#3da9ff';c.shadowBlur=18;c.beginPath();c.arc(P.x,P.y,r,0,6.3);c.fill();c.restore()}
 const d=dg;d.setTransform(1,0,0,1,0,0);d.globalCompositeOperation='source-over';d.clearRect(0,0,dk.width,dk.height);d.fillStyle='rgba(3,6,8,'+(S.done?0:p[4])+')';d.fillRect(0,0,dk.width,dk.height);d.globalCompositeOperation='destination-out';
 L(d,P.x,P.y,190);R.ins.forEach(o=>{if(val(o)&&o.k!='btn')L(d,o.px,o.py,110)});R.items.forEach(o=>o.v&&L(d,o.px,o.py,60));R.props.forEach(o=>o.k=='cafe'&&L(d,(o.x+o.w/2)*T,(o.y+o.h/2)*T,125));R.folk.forEach(f=>L(d,f.px,f.py,55));R.qit.forEach(t=>L(d,t.px,t.py,60));R.stars.forEach(s=>L(d,s.x,s.y,70));R.orbs.forEach(o=>L(d,o.x,o.y,40));if(R.boss&&!R.boss.dead)L(d,R.boss.px,R.boss.py,90);if(R.gOpen)L(d,15*T+16,5*T+16,100);
 c.setTransform(1,0,0,1,0,0);c.drawImage(dk,0,0);c.setTransform(dpr,0,0,dpr,0,0);
 c.font='20px sans-serif';c.textAlign='left';for(let k=0;k<3;k++){c.fillStyle=k<hp?'#ff4d6d':'#3a2a30';c.fillText('♥',16+k*24,98)}
 if(now<R.ban){c.globalAlpha=Math.min(1,(R.ban-now)/600);c.textAlign='center';c.font='400 22px "Archivo Black",sans-serif';c.fillStyle=m.p[2];c.fillText(R.i+1+' · '+m.c,gW/2,130);c.font='700 16px Vazirmatn,Tahoma';c.fillStyle='#eef5f5';c.fillText(m.n,gW/2,156);c.globalAlpha=1}
 if(R.boss&&S.t[7]&&!R.boss.dead){c.fillStyle='#2a1a3a';c.fillRect(gW/2-90,84,180,8);c.fillStyle='#c36bff';c.fillRect(gW/2-90,84,180*R.boss.hp/12,8)}
 if(now<inv-900){c.fillStyle='rgba(200,40,80,'+.3*(inv-900-now)/400+')';c.fillRect(0,0,gW,gH)}
 const wo=dlg&&dlg.who||R.npc,el=dlg?gnpc:gbub,wx=dlg?wo.px:P.x,wy=dlg?wo.py:P.y;el.style.left=Math.max(130,Math.min(gW-130,(wx+GO-camX)*Z))+'px';el.style.top=Math.max(76,(wy-34-camY)*Z)+'px'}
function frame(t){raf=requestAnimationFrame(frame);now=t;const dt=Math.min(.05,(t-last)/1000);last=t;update(dt);camUp(dt);draw()}
const startLoop=()=>{if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}},stopLoop=()=>{cancelAnimationFrame(raf);raf=0};
function save(){try{localStorage.setItem('gk_g2',JSON.stringify(S))}catch(e){}}
function reset(first,full){let sv=null;if(first)try{sv=JSON.parse(localStorage.getItem('gk_g2'))}catch(e){}
 if(full){S=fresh();try{localStorage.removeItem('gk_g2')}catch(e){}}else if(sv)S=Object.assign(fresh(),sv);
 hp=3;dlg=null;gnpc.classList.remove('on');tg=pend=null;RS=[];for(let i=0;i<8;i++)build(i,false);R=RS[S.room];P={...R.st};camUp(0,1);upd();
 say(full?'از اول شروع کردیم!':sv?'برگشتم! بریم ادامه بدیم.':'…اینجا کجاست؟ همه‌جا تاریکه. (کلیک یا WASD برای حرکت)')}
function gSize(){dpr=Math.min(2,devicePixelRatio||1);gW=gameEl.clientWidth;gH=gameEl.clientHeight;cv.width=gW*dpr;cv.height=gH*dpr;Z=Math.max(.9,Math.min(1.5,gW/560));dk=dk||document.createElement('canvas');dk.width=gW*dpr;dk.height=gH*dpr;dg=dk.getContext('2d')}
function gLoad(){loading=true;gload.classList.remove('off');const fl=$('gfl'),dot=$('gdot'),pc=$('gpct'),len=fl.getTotalLength(),t0=performance.now();
 const tick=n=>{const t=Math.min(1,(n-t0)/1800),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,p=fl.getPointAtLength(len*e);fl.setAttribute('stroke-dashoffset',100*(1-e));dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);pc.textContent=Math.round(e*100)+'%';
  if(t<1)requestAnimationFrame(tick);else setTimeout(()=>{gload.classList.add('off');loading=false;started=true;reset(true);if(document.body.dataset.state=='steps')startLoop()},300)};requestAnimationFrame(tick)}
window.gameOnState=id=>{if(id!='steps'){stopLoop();return}gSize();if(!started&&!loading)gLoad();else if(started)startLoop()};
cv.addEventListener('pointerdown',e=>{if(!started||loading)return;e.preventDefault();if(dlg){adv();return}hold=true;
 const r=cv.getBoundingClientRect(),wx=(e.clientX-r.left)/Z+camX-R.i*WP,wy=(e.clientY-r.top)/Z+camY;
 const o=[R.npc,...R.folk,...R.ins.filter(o=>o.k=='lamp'||o.k=='crys'),...R.items.filter(o=>o.v)].find(o=>o&&Math.hypot(wx-o.px,wy-o.py)<26&&!(R.boss&&S.t[7]));
 if(o){pend=o;tg={x:o.px,y:o.py}}else{pend=null;tg={x:wx,y:wy}}});
cv.addEventListener('pointermove',e=>{if(hold&&!dlg&&started&&!pend){const r=cv.getBoundingClientRect();tg={x:(e.clientX-r.left)/Z+camX-R.i*WP,y:(e.clientY-r.top)/Z+camY}}});
addEventListener('pointerup',()=>{hold=false});cv.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(document.body.dataset.state!='steps'||!started)return;
 if(/^(Arrow|Key[WASD])/.test(e.code)||e.code=='Space'){e.preventDefault();keys[e.code]=true}
 if(e.code=='Space'||e.code=='Enter'||e.code=='KeyE'){if(dlg)adv();else if(e.code=='Space')fire();else{const o=[R.npc,...R.folk,...R.ins.filter(o=>o.k=='lamp'||o.k=='crys'),...R.items.filter(o=>o.v)].find(o=>o&&Math.hypot(P.x-o.px,P.y-o.py)<56);o&&act(o)}}});
addEventListener('keyup',e=>{keys[e.code]=false});
const bar=document.querySelector('.gbar'),mk=(t,f)=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.addEventListener('click',f);return b};
const zb=mk('⚡ شلیک',fire);bar.prepend(zb);$('gReset').textContent='ریست اتاق';
$('gReset').addEventListener('click',()=>{if(started){hp=3;dlg=null;gnpc.classList.remove('on');build(R.i)}});
bar.append(mk('بازی از اول',()=>{if(started&&confirm('همه‌ی پیشرفت پاک شه؟'))reset(false,true)}));
addEventListener('resize',()=>{if(gameEl.clientWidth)gSize()});
})();
