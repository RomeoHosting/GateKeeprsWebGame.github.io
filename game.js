/* Gate Keeper — ماجراجویی ۸ مداره (جایگزین مینی‌گیم قبلی). index.html باید قبل از اسکریپت اصلی این فایل را لود کند. */
(()=>{
const $=id=>document.getElementById(id),gameEl=$('game'),cv=$('gcv'),c=cv.getContext('2d'),gnpc=$('gnpc'),gbub=$('gbub'),gload=$('gload'),goal=$('gGoal');
const T=32,W=18,H=16,fa=n=>n.toLocaleString('fa-IR');
/* s: ‎@ شروع، N ساکن، I آیتم، L/l چراغ(خاموش/روشن)، K/k بلور، R سنگ، H سنگِ پنهان‌کننده، B دکمه، P صفحه‌ی نوری، Q صفحه‌ی چشمک‌زن، W دیوار(x,y,w,h)، x/v/y باگ افقی/عمودی/تعقیب‌گر، X بُس. دروازه‌ی مدار همیشه خانه‌ی (۱۳،۵) و خروج (۱۵،۵) */
const RM=[
{n:'روستای سیم',c:'BUFFER',r:'buf',q:'zap',ik:'zap',nm:'عمو مقاومت',cl:'#e8a23c',p:['#15272a','#172b2e','#ff9d2e','#0d1a1c',.25],s:'@2,5 N2,2 I4,3 S2,9 J6,5 L11,5 T3,7 T8,3 T10,8 E4,9,0 E10,1,1 E12,6,2 x6,8 v9,5',h:'باتری رو بیدار کن؛ جریان رو با ریله هدایت کن',
 d:['سلام جوجه‌برق! بالاخره بیدار شدی!','من عمو مقاومتم. برجِ نور خاموشه و شهر تاریک.','این پالس‌گیره؛ با دکمه‌ی ⚡ یا Space باگ‌های مزاحم رو خاموش می‌کنه. کنار پات گذاشتمش، بردار!','باتریِ ایستگاه خالیه؛ فقط یه جرقه مثلِ تو می‌تونه بیدارش کنه. بعدش با ریله جریان رو هدایت کن: یا چراغ‌های روستا، یا موتورِ دروازه. هر دو با هم نه.']},
{n:'جنگلِ سایه',c:'AND',r:'and',nm:'خازنِ کوچولو',cl:'#7bd88f',p:['#16251a','#192a1d','#7bd88f','#0b140d',.4],s:'@2,9 N1,2 W1,1,1,1 W1,3,1,1 H2,2 R6,7 B10,4 B10,7 x8,9 S3,6 J5,4 T4,8 T8,2 T11,9 E9,5,0 E3,3,1 E12,2,2',h:'سنگ‌ها رو روی دکمه‌ها هول بده',
 d:['هییی! ...وای، سنگ رو کنار زدی؟ (از پشتش میاد بیرون)','من خازنِ کوچولوم. از باگ‌ها ترسیدم و قایم شدم.','دو تا دکمه‌ی زمینی هست. سنگ‌ها رو هول بده روشون؛ هر دو باید فشرده باشن (مدارِ AND).','سنگ گیر کرد؟ دکمه‌ی «ریست اتاق» پایینه.']},
{n:'میدانِ نئون',c:'RELAY',r:'neon',ik:'drink',nm:'نئون',cl:'#ff7eb6',p:['#1d1530','#22183a','#ff7eb6','#0f0a1a',.2],s:'@2,5 N9,3 I3,9 S2,2 T5,2 T5,8 T11,8 E7,5,0 E12,2,1 E6,9,2',h:'با نئون حرف بزن و جرقه‌ها رو بگیر'},
{n:'تالارِ بلور',c:'XOR',r:'xor',nm:'ستاره‌شناس',cl:'#b58cff',p:['#14202e','#172636','#7be3ff','#0a121a',.4],s:'@2,9 N8,2 K4,3 K10,7 y11,2 S2,5 J5,6 T3,2 T7,9 T11,5 E6,3,0 E12,8,1 E9,9,2',h:'دقیقاً یکی از بلورها روشن باشه',
 d:['سلام ای مسافر. ستاره‌ها گفتن میای.','دو بلور هست. در فقط وقتی باز می‌شه که دقیقاً یکی‌شون بدرخشه (XOR).','هر دو روشن یا هیچ‌کدوم؟ بسته می‌مونه. مواظب اون باگِ تعقیب‌گر هم باش!']},
{n:'غارِ ذوب',c:'NOT',r:'not',q:'gc',ik:'candle',nm:'ننه‌شمع',cl:'#ffd36b',p:['#2a1810','#301b12','#ff9d2e','#150b07',.55],s:'@2,9 N3,2 I11,9 B6,5 R6,5 v9,3 v11,7 S2,6 J4,6 T4,3 T8,8 T11,4 E8,5,0 E12,9,1 E9,1,2',h:'شمع رو بیار، بعد سنگ رو از دکمه دور کن'},
{n:'بیابانِ ضربان',c:'AND·3',r:'and',nm:'تپش',cl:'#6bd1ff',p:['#2b2616','#312b19','#ffd36b','#15120a',.35],s:'@2,9 N2,2 P5,2 P5,8 Q10,5 v8,3 v8,7 S2,6 J4,5 T3,3 T7,5 T11,8 E6,9,0 E11,2,1 E8,1,2',h:'هر سه صفحه همزمان روشن باشن',
 d:['سه تا صفحه‌ی نوری هست. روی هر کدوم وایسا تا روشن بمونه.','ولی اون وسطی چشمک می‌زنه؛ وقتی روشنه روش پا بذار!','(AND سه‌ورودی) باگ‌ها هم دنبالتن، مواظب باش.']},
{n:'باتلاقِ باگ',c:'XNOR',r:'xnor',nm:'مهندسِ باگ',cl:'#9be07a',p:['#142418','#18291a','#9be07a','#08100a',.6],s:'@2,9 N2,2 l5,3 L5,8 y9,4 y10,8 v12,2 S2,6 J3,5 T7,5 T11,6 T8,9 E7,2,0 E12,5,1 E3,9,2',h:'هر دو چراغ هم‌حالت باشن',
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
const DIM=[[22,18],[30,20],[26,22],[40,19],[44,26],[56,22],[54,24],[24,16]],SD=['U','R','D','D','R','R','U'],XP=[17,3,21,37,6,4,50],EP=[3,8,6,6,8,8,4],HW=[1,0,1,1,1,0,1],OP={R:'L',U:'D',D:'U'},OX=[0],OY=[0];
/* نقشه‌ی دنیا: هر اتاق نسبت به قبلی کنارش (راست) یا بالا/پایینش چسبیده؛ XP جای دروازه در اتاق قبل و EP جایش در اتاق بعد است */
for(let i=0;i<7;i++){const[w,h]=DIM[i],h2=DIM[i+1][1],d=SD[i];if(d=='R'){OX[i+1]=OX[i]+w*T;OY[i+1]=OY[i]+(XP[i]-EP[i])*T}else{OX[i+1]=OX[i]+(XP[i]-EP[i])*T;OY[i+1]=d=='U'?OY[i]-h2*T:OY[i]+h*T}}
function door(i,x,y){const W_=DIM[i][0],H_=DIM[i][1];for(const d of[i<7&&{s:SD[i],p:XP[i],w:HW[i]},i>0&&{s:OP[SD[i-1]],p:EP[i-1],w:HW[i-1]}]){if(!d)continue;const a=d.s=='R'?x>=W_&&Math.abs(y-d.p)<=d.w:d.s=='L'?x<0&&Math.abs(y-d.p)<=d.w:d.s=='U'?y<0&&Math.abs(x-d.p)<=d.w:y>=H_&&Math.abs(x-d.p)<=d.w;if(a)return true}return false}
let GO=0,GOY=0,cI=0,finL=null,camX=0,camY=0,RS=[];
const MBK={3:'c',5:'d',6:'g'},MBH={3:14,5:16,6:18},MBN={c:'نگهبانِ بلور',d:'ضرب‌آهنگِ خشمگین',g:'باگِ غول‌پیکر'};
const RULE={seal:()=>!R.mb||!!R.mb.dead,buf:a=>a[0],and:a=>a.every(Boolean),or:a=>a.some(Boolean),not:a=>!a[0],xor:a=>a[0]!==a[1],xnor:a=>a[0]===a[1],neon:()=>!!S.gd,none:()=>0};
const C4=[[3,2],[10,8],[6,5]],C3=[[3,2],[10,2],[3,8],[10,8],[6,5]];
const fresh=()=>({room:0,t:{},q:{},sh:{},mh:3,coin:0,bo:{},bd:0,ev:{},evN:0,pw0:0,conf:0,cf:{},pw:{},mbd:{},mm:{},sv:null,zap:0,drink:0,candle:0,ns:0,sp:0,gd:0,gc:0,cs:0,done:0});
let QG=[],vA=Math.PI/4,vK=.74,rotK=0,isoOn=true,QQ=[],dashT=0,dashCd=0,bo=null,fin=0,S=fresh(),R,P={x:0,y:0},now=0,started=false,loading=false,raf=0,last=0,gW,gH,dpr=1,Z=1,ox=0,oy=0,dk,dg,tg=null,pend=null,hold=false,dlg=null,hp=S.mh,inv=0,fireT=0,pushT=0,face=[1,0],keys={},qT=0,shT=0;
const lk=()=>!S.t[R.i]&&R.i!=2&&R.i!=7;
const tfree=(x,y,s)=>s&&y>9?false:(!s&&door(R.i,x,y))||x>=0&&y>=0&&x<R.w&&y<R.h&&!R.wall[y][x]&&!(R.gate&&R.G.some(g=>!g.open&&x==g.x&&y==5))&&!R.rocks.some(r=>r.x==x&&r.y==y)&&!R.sol.some(o=>o.x==x&&o.y==y);
const wallAt=(x,y)=>{const i=Math.floor(x/T),j=Math.floor(y/T);return i<0||j<0||i>=R.w||j>=R.h||R.wall[j][i]||(R.gate&&R.G.some(g=>!g.open&&i==g.x&&j==5))};
const free=(x,y,s)=>[[-8,-8],[8,-8],[-8,8],[8,8]].every(([a,b])=>tfree(Math.floor((x+a)/T),Math.floor((y+b)/T),s));
function mv(o,dx,dy){let m=0;if(free(o.x+dx,o.y,1)){o.x+=dx;m=1}if(free(o.x,o.y+dy,1)){o.y+=dy;m=1}return m}
function say(t,o){bo=o||null;gbub.textContent=t;gbub.classList.add('on');clearTimeout(qT);qT=setTimeout(()=>{gbub.classList.remove('on');bo=null},2800)}
const val=o=>o.k=='btn'?R.rocks.some(r=>r.x==o.x&&r.y==o.y)&&machOK('btn'):o.k=='pad'?o.lit:o.on;
const pwA=()=>!!(R.src&&R.src.on&&(!R.relay||!R.rst)),pwB=()=>!!(R.src&&R.src.on&&R.relay&&R.rst==1);
/* ریله‌ی هر اتاق: وضعیت ۰ = چراغ‌ها و نور؛ وضعیت ۱ = «دستگاه‌های» همان اتاق (MACH). دستگاه‌ها فقط وقتی کار می‌کنن که جریان بهشون برسه */
const MACH={1:['btn'],3:['crys'],4:['conv'],5:['pad','conv','crys'],6:['lamp','pad']},BM=['موتورِ دروازه','صفحه‌های فشاری','','بلورها','نوارنقاله‌ها','صفحه‌ها و بلورها','چراغ‌ها و صفحه‌ها'],machOK=t=>!R.relay||!(MACH[R.i]||[]).includes(t)||pwB();
const evc=i=>[0,1,2].filter(k=>S.ev[i+'_'+k]).length;
const EV=[['روی دیوارِ ایستگاه با گچ: «کلیدِ ریله رو دستی چرخوندن. ساعتِ ۲:۱۷ شب.»','رد پاهای کوچولو روی خاک… همه‌شون سمتِ دروازه می‌رن. هیچ‌کدوم برنمی‌گرده.','کنارِ ریله یه فنجونِ نیمه‌پر و یه تکه نخ مانده. کسی تا همین چند ساعت پیش این‌جا نشسته بوده.'],
['روی تنهٔ یه درخت با چاقو کنده‌کاری شده: «اون شب اومد. آروم. از سمتِ دروازه.»','قفلِ یه ظرفِ شیشه‌ای شکسته؛ بارِ نیم‌مصرف توشه، انگار کسی نصفه برش داشته.','یه ردِ سوختگی کوتاه روی خاک، درست جایی که ریله موج می‌داد.'],
['روی زمین با گچ مسیرِ دویدن تا دروازه کشیده شده.','یه نوشیدنیِ نیمه‌خورده کنار باتری. کسی داشته منتظر می‌موند.','جلوی یه چراغ نوشته: «اون زودتر رسید»… خط خورده.'],
['یه نقشهٔ آسمون روی زمین: برجِ نور با یه فلشِ بزرگ که ازش بیرون می‌ره.','یادداشتِ ستاره‌شناس: «نور نمرده. جابه‌جا شده.»','یه فنجونِ قهوه‌ی سرد؛ روش ردِ یه دستِ کوچیکه.'],
['ردِ کوچیکِ مومِ شمع تا دهانهٔ دروازه ادامه داره.','یه برگه: «تا برنگشتم، شمع رو روشن نگه دار.»','روی دیوار یه جفت چشمِ کنده‌کاری‌شده؛ همیشه سمتِ غار نگاه می‌کنن.'],
['روی زمین ضرب‌آهنگی با نقطه حک شده؛ آخرش یه نقطه تنها به بیرون می‌ره.','یه چوب‌طبلِ شکسته، نوکش سوخته.','یه کاغذ: «اگه ضربانم قطع شد، دنبالِ ضربانی بگرد که هنوز می‌زنه.»'],
['سیمِ اصلی تمیز بریده نشده: لبه‌هاش رو با ابزار قیچی کردن، نه باگ.','پیچ‌های جعبهٔ ریله شل شده؛ کسی با دقت بازشون کرده.','یه عینکِ مهندسی با شیشهٔ ترک‌خورده؛ پشتش با مداد: «من نبودم.»']];
const REV=[['…تو خوندیشون. درسته؟','من بودم. اون شب ریله رو من چرخوندم؛ ساعتِ ۲:۱۷.','یکی می‌خواست از دروازه بره بیرون و گفت «فقط یه ساعت». من دروازه رو باز کردم… و چراغ‌ها رو خاموش.','نمی‌خواستم کسی ببینه کی رفت. بعدش هیچ‌کس برنگشت.','برو جلو، جوجه‌برق. شاید جواب اون‌طرف دروازه باشه.'],
['…اون نوشته‌ها رو دیدی؟','من خازنم؛ بارِ اون شب رو من نگه داشتم.','ساعتِ ۲:۱۷ یه موج از ریله اومد، ولی به ما نرسید؛ از دروازه رفت بیرون.','کسی بارِ ما رو با خودش برد. ما فقط خاموشی موند.'],
['…خوب شد خوندیشون. (نفس‌نفس)','اون شب می‌دویدم. یه جرقه‌ی کوچولو رو دیدم که جلوی من، سمتِ دروازه می‌رفت.','صداش زدم. برنگشت. بهم گفته بودن «بدو و ساکت باش».','من سریع‌ترم… ولی اون شب برای اولین‌بار نرسیدم.'],
['…بلورها همه‌چی رو نشون دادن، نه؟','من آسمونِ اون شب رو ثبت کردم: برجِ نور نمرده بود.','کسی «برش داشته» بود؛ مثل فانوسی که توی دست می‌چرخه.','مداری که روشنه ولی چراغ‌هاش خاموشه یعنی جریان یه جای دیگه می‌ره.'],
['…نوشته‌ها رو که دیدی، دیگه نمی‌تونم دروغ بگم.','اون شب یه نفر شمعم رو خواست. گفت: «تا برنگشتم، نذار خاموش شه.»','من هر شب روشنش نگه داشتم. فکر می‌کردم برمی‌گرده.','هر وقت شعله می‌لرزه، یه صدا از سمتِ دروازه می‌شنوم.'],
['…ضربان‌ها رو شنیدی؟','هر منطقه یه ضربان داره. اون شب همه‌شون یه لحظه ایستادن.','فقط یه ضربانِ تنها موند، دوردست، از قلمروِ خاموشی. ضعیف ولی زنده.','اون ضربان مالِ اونیه که رفت. هنوز می‌تپه.'],
['…ریله‌ها رو درست دنبال کردی.','سیمِ اصلی رو باگ‌ها نبریدن؛ باگ‌ها بعدش از همون سوراخی اومدن که یکی باز گذاشت.','من نقشه‌شو دارم: دستی چرخونده شد، نه خراب.','پس همه‌ی این‌ها انتخاب بود… و یه نفر هنوز اون‌طرفه.']];
let evT=0;
function psync(){if(R.i==0)R.ins.forEach(o=>{if(o.k=='lamp')o.on=pwB()})}
function check(){if(R.relay)psync();if(!R.gate)return;const m=RM[R.i];R.G.forEach((g,k)=>{const ins=R.ins.filter(o=>(o.g|0)==k),rule=k?EX[R.i][k-1].r:m.r,o1=!!((k||!m.q||S[m.q])&&RULE[rule](ins.map(val))),ok=k||R.i>6||(S.sh[R.i]|0)>=2,o=o1&&ok;
 if(!k&&o1&&!ok&&now-shT>6000){shT=now;say('مدار درسته! ولی پرده‌ی نور فقط با ۲ جرقه‌ی دوستی باز می‌شه. با آدم‌های خیابون حرف بزن.')}
 if(o!==g.open){g.open=o;g.t=now;if(!k){R.gOpen=o;R.gT=now}say(o?'پرده‌ی نور محو شد! راه باز شد.':'پرده‌ی نور دوباره بسته شد.')}})}
function build(i,pl){
 const m=RM[i];R={i,w:DIM[i][0],h:DIM[i][1],wall:Array.from({length:DIM[i][1]},(_,y)=>Array.from({length:DIM[i][0]},(_,x)=>x==0||y==0||x==DIM[i][0]-1||y==DIM[i][1]-1||(i<7&&x==13&&y!=5))),rocks:[],ins:[],sol:[],bugs:[],bolts:[],orbs:[],items:[],stars:[],npc:null,boss:null,star:null,nT:0,gate:i<7,gOpen:false,gT:-1e9,ban:now+2600};const opn=(s,p,w)=>{for(let d=-w;d<=w;d++){if(s=='R')R.wall[p+d][R.w-1]=0;else if(s=='L')R.wall[p+d][0]=0;else if(s=='U')R.wall[0][p+d]=0;else R.wall[R.h-1][p+d]=0}};if(i<7)opn(SD[i],XP[i],HW[i]);if(i>0)opn(OP[SD[i-1]],EP[i-1],HW[i-1]);RS[i]=R;R.G=[{x:13,open:false,t:-1e9}];(EX[i]||[]).forEach(e=>{R.G.push({x:e.gx,open:false,t:-1e9,seal:e.r=='seal'});for(let y=1;y<10;y++)if(y!=5)R.wall[y][e.gx]=1;for(let y=11;y<R.h-1;y++)R.wall[y][e.gx]=1});const gp=new Set(R.G.map(g=>g.x+2));for(let x=1;x<R.w-1;x++)if(x<6||x>8&&!gp.has(x))R.wall[10][x]=1;R.props=[];R.folk=[];R.qit=[];R.conv=[];R.bl=new Set();R.tl=[];R.ev=[];R.rls=[];R.rst=0;const st=STR[i];st.p.forEach(([k,x,y,w,h,t])=>{w=w||1;h=h||1;R.props.push({k,x,y,w,h,t});if(k=='cafe'||k=='house'||k=='pond'&&0){for(let a=0;a<h;a++)for(let b=0;b<w;b++){R.wall[y+a][x+b]=1;R.bl.add((x+b)+','+(y+a))}if(k=='cafe')R.wall[y+h-1][x+(w>>1)]=0}});
 st.f.forEach(([x,y,nm,cl,l])=>R.folk.push({k:'folk',hx:x*T+16,hy:y*T+16,px:x*T+16,py:y*T+16,nm,cl,l}));addLamps(i);
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
  else if('xvy'.includes(k))R.bugs.push({x:o.px,y:o.py,k,d:1,a:1})
  else if(k=='S'){o.k='src';o.on=!!(S.pw[i]||i==0&&S.pw0);R.src=o;R.sol.push(o)}
  else if(k=='J'){o.k='relay';R.relay=R.relay||o;R.rls.push(o);R.sol.push(o)}
  else if(k=='T'){o.k='tlamp';R.tl.push(o);R.sol.push(o)}
  else if(k=='E'){R.ev.push({id:w,x,y,px:o.px,py:o.py})}
  else if(k=='M'){R.mb={x:o.px,y:o.py,hy:o.py,hp:MBH[i],max:MBH[i],k:MBK[i],cd:2,dead:S.mbd[i]?1:0,on:0}}
  else if(k=='z'||k=='s')R.bugs.push({x:o.px,y:o.py,k,d:1,a:1,hp:k=='z'?3:2,cd:0})
  else if('><^V'.includes(k))for(let a=0;a<(h||1);a++)for(let b=0;b<(w||1);b++)R.conv.push({x:x+b,y:y+a,dx:k=='>'?1:k=='<'?-1:0,dy:k=='V'?1:k=='^'?-1:0})});
 if(i==2&&S.ns==4)R.stars=C4.slice(S.sp).map(([x,y])=>({x:x*T+16,y:y*T+16}));
 if(i==2&&S.ns>=4)R.npc.py+=40;
 R.items.forEach(o=>o.v=false);if(i==7&&S.bd){R.boss.dead=1;mkTower()}qinit();memInit();mkNet();if(pl!==false)P={...R.st};upd();
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
const EX=[0,[{gx:22,r:'and',s:'B19,3 B19,7 R15,3 R15,7 z19,5'}],0,[{gx:22,r:'xnor',s:'K17,3 k17,7 s20,5'},{gx:34,r:'seal',s:'M31,5 J27,2'}],
 [{gx:24,r:'xor',s:'B20,3 B20,7 R16,3 R16,7 >17,3,3,1 z21,8'},{gx:34,r:'not',s:'B29,5 R29,5 s31,2 s31,8 ^27,4,1,2'}],
 [{gx:26,r:'and',s:'K18,2 K18,5 K18,8 z22,3 z22,7'},{gx:38,r:'and',s:'B34,3 B34,7 R29,3 R29,7 >30,3,4,1 <31,7,2,1 s36,5'},{gx:50,r:'seal',s:'M47,5 J43,2'}],
 [{gx:25,r:'and',s:'P17,2 P17,8 Q22,5 s20,5 z19,2'},{gx:35,r:'not',s:'B30,5 R30,5 z32,3 z32,7 s28,5'},{gx:47,r:'seal',s:'M44,5 J40,2'}],0];
const QP=[['TB','B',''],['T','BB','T'],['TT','TB',''],['B','','TB'],['BB','T','B'],['','TT','B'],['TB','BT','T']];
/* QP: برای هر ساکنِ هر اتاق؛ هر حرف یک چیزِ گمشده: T=بالا (محوطه‌ی مدار)، B=پایین (خیابون). خالی = فقط گپ */
function qinit(){if(R.i>6)return;const seen=new Set(),cs=[],sx=R.st.x/T|0,sy=R.st.y/T|0,q=[[sx,sy]],ob=new Set([...R.rocks,...R.ins,...R.sol,...R.items].map(o=>o.x+','+o.y));
 while(q.length){const[x,y]=q.pop(),k=x+','+y;if(seen.has(k)||x<1||y<1||x>=13||y>=R.h-1||R.wall[y][x])continue;seen.add(k);if(!ob.has(k)&&Math.abs(x-sx)+Math.abs(y-sy)>3)cs.push([x,y]);q.push([x+1,y],[x-1,y],[x,y+1],[x,y-1])}
 const wf=a=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(R.wall[a[1]+dy]&&R.wall[a[1]+dy][a[0]+dx])return false;return true},op=cs.filter(wf),pk=(f)=>{const o=op.filter(f);return o.length>=3?o:cs.filter(f)},A={T:pk(a=>a[1]<10),B:pk(a=>a[1]>10)},nm=QN[R.i].split('|');let c0=0;
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
 const I={i:out.i,w:W,h:H,in:1,out,conv:[],bl:new Set(),tl:[],ev:[],rls:[],rst:0,mem:[],sv:null,G:[],back:{x:(o.x+(o.w>>1))*T+16,y:(o.y+o.h)*T+16},wall:Array.from({length:H},(_,y)=>Array.from({length:W},(_,x)=>!(x>=4&&x<=13&&y>=4&&y<=11||x==9&&y==12))),rocks:[],ins:[],sol:[],bugs:[],bolts:[],orbs:[],items:[],stars:[],npc:null,boss:null,star:null,nT:0,gate:false,gOpen:false,gT:-1e9,ban:0,qit:[],st:{x:9*T+16,y:11*T+16},
  props:[{k:'counter',x:5,y:5,w:9,h:1},{k:'table',x:6,y:9,w:1,h:1},{k:'table',x:12,y:9,w:1,h:1}],folk:[]};
 k(5,5,9,1);k(6,9,1,1);k(12,9,1,1);for(const[a,b]of[[5,5],[6,9],[12,9]])for(let q=0;q<(a==5?9:1);q++)I.bl.add((a+q)+','+b);
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
 if(i<7&&evc(i)>=3&&!S.cf[i])return[REV[i],()=>{S.cf[i]=1;S.coin=(S.coin|0)+3;say('ساکنِ این‌جا چشم‌هاش رو ازم دزدید… ‎+۳ 🪙');save()}];
 if(i==0&&S.cf[0])return[['…برو. هر چی اون‌طرفه، تو باید خودت ببینی.']];
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
function flipRelay(){if(lk())return say('اول باید با ساکنِ اینجا حرف بزنم.');if(!R.src.on)return say('ریله بی‌جریانه. اول باتری رو بیدار کن.');R.rst^=1;check();say(R.rst?'جریان رفت سمتِ '+BM[R.i]+'… ولی چراغ‌های این‌جا خاموش شدن! سایه‌ها دارن جون می‌گیرن.':'جریان برگشت سمتِ چراغ‌ها. سایه‌ها یخ زدن.')}
function act(o){
 if(o.k=='folk'){const[l,a]=o.cb?o.cb():fl(o);dlg={l,a,i:0,pos:0,nm:o.nm,cl:o.cl,who:o};gbub.classList.remove('on');return show()}
 if(o.k=='tower'){if(!S.done){fin=now;finL=[...FIN,'✧ خاطره‌هایی که پیدا کردی: '+fa(Object.keys(S.mm).length)+' از ۱۴'];S.done=1;save();upd();say('برج روشن شد!')}return}
 if(o.k=='npc'){if(R.i==7&&S.t[7])return;return talk()}
 if(o.k=='item'){S[o.kind]=1;o.v=false;say({zap:'پالس‌گیر! حالا ⚡ یا Space رو بزن.',drink:'نوشیدنی! ببرمش برای نئون.',candle:'شمعِ طلایی! ببرمش برای ننه‌شمع.'}[o.kind]);save();check();return}
 if(o.k=='src'){if(lk())return say('اول باید با عمو مقاومت حرف بزنم.');if(o.on)return say('باتری بیداره. جریانش رو با ریله هدایت می‌کنم.');S.pw[R.i]=1;o.on=true;check();save();return say('جرقه‌ی من تو باتری رفت… ایستگاه از خواب بیدار شد و چراغ‌های روستا روشن شدن.')}
 if(o.k=='relay')return flipRelay();
 if(R.i==0&&R.relay&&o.k=='lamp')return say('این چراغ فقط از ریله جریان می‌گیره.');
 if(!machOK(o.k=='crys'?'crys':'lamp'))return say('این دستگاه بی‌جریانه؛ ریله رو سمتِ دستگاه‌ها بچرخون.');
 if(lk())return say('اول باید با ساکنِ اینجا حرف بزنم.');
 o.on=!o.on;check();save()}
function hit(){if(now<inv||dlg)return;hp--;inv=now+1300;if(hp<=0){hp=S.mh;if(R.mb&&!R.mb.dead){R.mb.hp=R.mb.max;R.mb.on=0;R.orbs=[]}if(R.i<7){const v=S.sv&&S.sv.room==R.i?{px:S.sv.x,py:S.sv.y}:R.sv||R.st;P={x:v.px??v.x,y:v.py??v.y};tg=pend=null;say('(برگشتم به آخرین ستاره‌ی ✦ …)')}else{build(R.i);say('(ریست شدم… دوباره!)')}}else say('آخ! باگ!')}
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
const rotV=d=>{rotK+=d;say('🔄 چرخش نما')},togV=()=>{isoOn=!isoOn;say(isoOn?'🧊 نمای سه‌بعدی':'⬜ نمای از بالا')};
function dash(){if(!started||dlg||now<dashCd||!R||R.in)return;dashT=now+170;dashCd=now+1100;inv=Math.max(inv,now+520)}
function fire(){if(!S.zap||dlg||now<fireT||!R)return;fireT=now+380;let t=null,bd=300;
 R.bugs.forEach(b=>{if(b.a){const d=Math.hypot(b.x-P.x,b.y-P.y);if(d<bd){bd=d;t=[b.x,b.y]}}});
 if(R.boss&&S.t[7]&&!R.boss.dead)t=[R.boss.px,R.boss.py];
 if(R.mb&&R.mb.on&&!R.mb.dead&&Math.hypot(R.mb.x-P.x,R.mb.y-P.y)<340)t=[R.mb.x,R.mb.y];
 const v=t?[t[0]-P.x,t[1]-P.y]:face,d=Math.hypot(v[0],v[1])||1;R.bolts.push({x:P.x,y:P.y,vx:v[0]/d*430,vy:v[1]/d*430})}
const FIN=['تو برجِ نور رو روشن کردی. ✨','روستای سیم دوباره زنده شد…','جنگلِ سایه نفس کشید…','میدانِ نئون داره می‌رقصه…','تالارِ بلور برق می‌زنه…','غارِ ذوب گرم شد…','بیابانِ ضربان می‌تپه…','باتلاقِ باگ آروم گرفت…','این نور، کارِ خودِ توئه.','تو شهر رو روشن کردی. این جایزه‌ی خودته. ✨'];
function mkTower(){R.tower={k:'tower',px:(R.w-4)*T+16,py:5*T+16}}

/* چراغ‌های خیابان: در همه‌ی مدارها (مثل روستای سیم) چند تیرِ چراغ تا شبِ برج زنده بماند */
function addLamps(i){if(i>6)return;let n=R.props.filter(o=>o.k=='lamp').length;const occ=(x,y)=>R.wall[y][x]||R.props.some(o=>o.k!='park'&&x>=o.x-(o.k=='pond'?0:0)&&x<o.x+o.w&&y>=o.y&&y<o.y+o.h)||R.folk.some(f=>(f.hx/T|0)==x&&(f.hy/T|0)==y),step_=Math.max(6,Math.round(R.w/5));
 for(let x=3+(i*2)%4;x<R.w-2&&n<5;x+=step_){for(const y of[12,13,14,15,16]){if(y<R.h-1&&!occ(x,y)&&!R.props.some(o=>o.k=='lamp'&&Math.abs(o.x-x)<4)){R.props.push({k:'lamp',x,y,w:1,h:1});n++;break}}}}
function winBoss(){R.orbs=[];R.boss.dead=1;dlg={l:['…آخ. تموم شد.','می‌دونی؟ تو منو نترسوندی. فقط یادم آوردی نور چه شکلیه.','برو، برج رو روشن کن. من دیگه از نور نمی‌ترسم.'],i:0,pos:0,a:()=>{S.bd=1;mkTower();save();say('یه برجِ خاموش پشتِ اتاق پیدا شد… برو، خودت روشنش کن!')}};show()}
function go(i){const o=R.i;R=RS[i];const dx=OX[o]-OX[i],dy=OY[o]-OY[i];P.x+=dx;P.y+=dy;if(tg){tg.x+=dx;tg.y+=dy}pend=null;hp=S.mh;R.ban=now+2600;S.room=i;upd();save();schedulePrep(i);disposeFar(i)}
function camT(){const vw=gW/Z,vh=gH/Z,cl=(v,a,b)=>Math.max(a,Math.min(b,v));let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;[R.i-1,R.i,R.i+1].filter(k=>k>=0&&k<8).forEach(k=>{x0=Math.min(x0,OX[k]);y0=Math.min(y0,OY[k]);x1=Math.max(x1,OX[k]+DIM[k][0]*T);y1=Math.max(y1,OY[k]+DIM[k][1]*T)});const gx=P.x+OX[R.i],gy=P.y+OY[R.i];if(vK<.995)return[gx-vw/2,gy-vh/2];return[vw>=x1-x0?(x0+x1-vw)/2:cl(gx-vw/2,x0,x1-vw),vh>=y1-y0?(y0+y1-vh)/2:cl(gy-vh/2,y0,y1-vh)]}
function camUp(dt,snap){const[tx,ty]=camT(),k=snap?1:Math.min(1,dt*6);camX+=(tx-camX)*k;camY+=(ty-camY)*k;
 const ta=isoOn?Math.PI/4+rotK*Math.PI/2:0,tk=isoOn?.74:1;let da=((ta-vA+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;const kk=snap?1:Math.min(1,dt*7);vA+=da*kk;vK+=(tk-vK)*kk}

function update(dt){
 if(dlg){if(dlg.pos<dlg.l[dlg.i].length){dlg.pos+=dt*36;const e=$('gt');if(e)e.textContent=dlg.l[dlg.i].slice(0,Math.floor(dlg.pos))}return}
 let vx=0,vy=0;if(keys.ArrowLeft||keys.KeyA)vx--;if(keys.ArrowRight||keys.KeyD)vx++;if(keys.ArrowUp||keys.KeyW)vy--;if(keys.ArrowDown||keys.KeyS)vy++;
 if(vx||vy){tg=null;pend=null;const ca=Math.cos(vA),sa=Math.sin(vA),ux=vx,uy=vy;vx=ux*ca+uy*sa;vy=-ux*sa+uy*ca}else if(tg){const dx=tg.x-P.x,dy=tg.y-P.y,d=Math.hypot(dx,dy);if(d>5){vx=dx/d;vy=dy/d}else tg=null}
 if(vx||vy){const d=Math.hypot(vx,vy);vx/=d;vy/=d;face=[vx,vy];step(vx*130*dt,vy*130*dt)}
 if(pend&&Math.hypot(P.x-pend.px,P.y-pend.py)<52){const o=pend;pend=null;tg=null;act(o)}
 if(R.tower&&!S.done&&Math.hypot(P.x-R.tower.px,P.y-R.tower.py)<34)act(R.tower);
 R.folk.forEach((f,i)=>{f.px=f.hx+Math.sin(now/1700+i*2)*9;f.py=f.hy+Math.cos(now/2100+i)*5});
 const mm=R.mem.find(m=>!S.mm[m.key]&&Math.hypot(P.x-m.px,P.y-m.py)<22);if(mm){S.mm[mm.key]=1;S.coin=(S.coin|0)+2;say('✧ '+MEM[mm.n]+' ‎+۲ 🪙');save()}
 if(R.sv&&Math.hypot(P.x-R.sv.px,P.y-R.sv.py)<24&&(hp<S.mh||!S.sv||S.sv.room!=R.i||S.sv.x!=R.sv.px)){S.sv={room:R.i,x:R.sv.px,y:R.sv.py};hp=S.mh;save();say('✦ ذخیره شد! قلب‌هات پر شد.')}
 if(R.conv.length&&machOK('conv')){const cv0=R.conv.find(q=>q.x==(P.x/T|0)&&q.y==(P.y/T|0));if(cv0)step(cv0.dx*62*dt,cv0.dy*62*dt);
  if(now>(R.cvT|0)){R.cvT=now+450;R.rocks.forEach(rk=>{const q=R.conv.find(z=>z.x==rk.x&&z.y==rk.y);if(q){const nx=rk.x+q.dx,ny=rk.y+q.dy;if(tfree(nx,ny,1)){rk.x=nx;rk.y=ny;check()}}})}}
 if(now<dashT){step(face[0]*430*dt,face[1]*430*dt)}
 R.ev.forEach(e=>{const key=R.i+'_'+e.id;if(S.ev[key]||Math.hypot(P.x-e.px,P.y-e.py)>46)return;if(pwA()){S.ev[key]=1;S.evN=(S.evN|0)+1;say(EV[R.i][e.id]+(evc(R.i)>=3?'  ← این با حرف‌های ساکنِ این‌جا نمی‌خونه…':''));save()}else if(now>evT){evT=now+4500;say('یه چیزی این‌جا خط‌خطی شده… ولی تو تاریکی نمی‌خونمش.')}});
 const got=R.qit.find(t=>Math.hypot(P.x-t.px,P.y-t.py)<22);if(got){S.q[got.f.qk]=got.s+1;say('پیدا شد! '+got.e+' — برگردم پیشِ '+got.f.nm);qsync();save()}
 R.items.forEach(o=>{if(o.v&&Math.hypot(P.x-o.px,P.y-o.py)<22)act(o)});vis();
 R.ins.forEach(o=>{if(o.k=='pad'&&!o.lit&&!lk()&&machOK('pad')&&Math.hypot(P.x-o.px,P.y-o.py)<18&&(!o.q||Math.sin(now/700)>0))o.lit=true});check();
 const mb=R.mb;if(mb&&!mb.dead&&!R.in){const si=R.G.findIndex(g=>g.seal),px=P.x/T;if(px>R.G[si-1].x+1&&px<R.G[si].x){mb.on=1;const hf=mb.hp<=mb.max/2,dx=P.x-mb.x,dy=P.y-mb.y,d=Math.hypot(dx,dy)||1,aim=Math.atan2(dy,dx),sp2=(a,v)=>R.orbs.push({x:mb.x,y:mb.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v});mb.cd-=dt;
  if(mb.k=='c'){mb.y=mb.hy+Math.sin(now/800)*70;if(mb.cd<=0){mb.cd=hf?1.2:1.7;mb.a=(mb.a||0)+.35;for(let k=0;k<10;k++)sp2(mb.a+k*.628,100);if(hf)for(let k=-2;k<=2;k++)sp2(aim+k*.28,150)}}
  else if(mb.k=='d'){mb.y=mb.hy+Math.sin(now/600)*40;if(mb.cd<=0){mb.cd=hf?1.2:1.8;mb.vt=now+1900;const gp=1+((Math.random()*8)|0);for(let k=1;k<=9;k++)if(Math.abs(k-gp)>(hf?0:1))R.orbs.push({x:mb.x,y:k*T+16,vx:-125,vy:0});if(hf)for(let k=-1;k<=1;k++)sp2(aim+k*.25,130)}}
  else{mv(mb,dx/d*(hf?58:40)*dt,dy/d*(hf?58:40)*dt);if(mb.cd<=0){mb.cd=hf?1.6:2.2;for(let k=-1;k<=1;k++)sp2(aim+k*.3,130);if(hf&&R.bugs.filter(b=>b.a&&b.k=='x').length<3)R.bugs.push({x:mb.x,y:mb.y,k:'x',d:1,a:1})}}
  if(d<26)hit()}}
 R.bugs.forEach(b=>{if(!b.a)return;if(pwA()&&R.tl.some(l=>Math.hypot(l.px-b.x,l.py-b.y)<150)){b.fz=1;return}b.fz=0;if(b.k=='z'){const dx=P.x-b.x,dy=P.y-b.y,d=Math.hypot(dx,dy);if(d<230&&d>1)mv(b,dx/d*72*dt,dy/d*72*dt)}else if(b.k=='s'){const dx=P.x-b.x,dy=P.y-b.y,d=Math.hypot(dx,dy);if(d<110&&d>1)mv(b,-dx/d*45*dt,-dy/d*45*dt);if(d<290&&now>b.cd&&!R.in){b.cd=now+2100;for(const o of[-.22,0,.22]){const a=Math.atan2(dy,dx)+o;R.orbs.push({x:b.x,y:b.y,vx:Math.cos(a)*120,vy:Math.sin(a)*120})}}}else if(b.k=='y'){const dx=P.x-b.x,dy=P.y-b.y,d=Math.hypot(dx,dy);if(d<190&&d>1)mv(b,dx/d*55*dt,dy/d*55*dt)}else if(!mv(b,b.k=='x'?b.d*50*dt:0,b.k=='v'?b.d*50*dt:0))b.d=-b.d;
  if(Math.hypot(P.x-b.x,P.y-b.y)<19)hit()});
 R.bolts=R.bolts.filter(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;if(wallAt(b.x,b.y))return false;
  for(const g of R.bugs)if(g.a&&Math.hypot(g.x-b.x,g.y-b.y)<(g.hp?17:15)){if(g.hp>1){g.hp--;g.hurt=now+180;return false}g.a=0;const cn=g.hp?3:1;S.coin=(S.coin|0)+cn;say((g.hp?'نگهبان خاموش شد!':'باگ خاموش شد!')+' ‎+'+fa(cn)+' 🪙');return false}
  for(const o of R.rls)if(Math.hypot(o.px-b.x,o.py-b.y)<20){if(R.src.on)flipRelay();return false}
  for(const o of R.ins)if(o.k=='crys'&&Math.hypot(o.px-b.x,o.py-b.y)<17){if(!lk()&&machOK('crys')){o.on=!o.on;check();say(o.on?'بلور روشن شد! ✨':'بلور خاموش شد.')}return false}
  const M=R.mb;if(M&&M.on&&!M.dead&&Math.hypot(M.x-b.x,M.y-b.y)<26){if(M.k=='c'&&!pwB()||M.k=='g'&&!pwA()||M.k=='d'&&now>=(M.vt|0)){if(now>shT){shT=now+2500;say(M.k=='c'?'سپرِ بلوری! فقط وقتی جریان به دستگاه‌هاست باز می‌شه — ریله رو بچرخون (یا بهش شلیک کن).':M.k=='g'?'سپرِ تاریکی! فقط زیر نور آسیب می‌بینه — ریله رو سمتِ چراغ‌ها ببر.':'سپرِ ضرب‌آهنگ! درست بعد از شلیکِ دیوارِ گلوله باز می‌شه.')}return false}M.hp--;M.hurt=now+150;if(M.hp<=0){M.dead=1;S.mbd[R.i]=1;S.coin=(S.coin|0)+10;R.orbs=[];say('مینی‌باس شکست خورد! ‎+۱۰ 🪙');save()}return false}
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

const hs=t=>{let h=7;for(const ch of t)h=(h*31+ch.charCodeAt(0))>>>0;return h};
const man=(a,b)=>[a,[b[0],a[1]],b];
function mkNet(){R.net={f:[],a:[],b:[]};if(!R.src)return;const r0=R.relay?[R.relay.x,R.relay.y]:[R.src.x,R.src.y];R.net.f.push(man([R.src.x,R.src.y],r0));R.tl.forEach(l=>R.net.a.push(man(r0,[l.x,l.y])));
 if(R.relay){let t=[];if(R.i==0)t=R.ins.filter(o=>o.k=='lamp').map(o=>[o.x,o.y]);else for(const m of MACH[R.i]||[]){if(m=='conv'){if(R.conv[0])t.push([R.conv[0].x,R.conv[0].y])}else t.push(...R.ins.filter(o=>o.k==m||m=='lamp'&&o.k=='lamp').map(o=>[o.x,o.y]))}t.filter(q=>q[0]<13).slice(0,4).forEach(q=>R.net.b.push(man(r0,q)));R.rls.slice(1).forEach(h=>R.net.f.push(man(r0,[h.x,h.y])))}}

/* ===================================================================
   موتور سه‌بعدی WebGL (بدون وابستگی): ماتریس، شیدر، شکل‌های پایه، مش ثابت
   مختصات: x شرق، z (همان y بازی) جنوب، y بالا. واحد = پیکسلِ بازی (هر خانه T=32)
   =================================================================== */
const NL=16,TAU=Math.PI*2;
let GC=null,GL=null,GV2=false,PM=null,PS=null,VAOX=null,ANI=null;
const GU={},SU={},hxc={};
const hx=c=>hxc[c]||(hxc[c]=(c=c.length==4?'#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3]:c,[parseInt(c.slice(1,3),16)/255,parseInt(c.slice(3,5),16)/255,parseInt(c.slice(5,7),16)/255]));
const clp=(v,a,b)=>v<a?a:v>b?b:v,lrp=(a,b,t)=>a+(b-a)*t,sst=(a,b,x)=>{const t=clp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const mixc=(a,b,t)=>[lrp(a[0],b[0],t),lrp(a[1],b[1],t),lrp(a[2],b[2],t)];
/* ---------- نویز و تصادفیِ قطعی ---------- */
function rng(s){s>>>=0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function h2(x,y,s){let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(s,2147483629))|0;h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967295}
const md=(a,n)=>((a%n)+n)%n;
function vn(x,y,P,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=h2(md(xi,P),md(yi,P),s),b=h2(md(xi+1,P),md(yi,P),s),c2=h2(md(xi,P),md(yi+1,P),s),d=h2(md(xi+1,P),md(yi+1,P),s);return a+(b-a)*u+(c2-a)*v+(a-b-c2+d)*u*v}
function fbm(x,y,P,o,s){let a=.5,f=1,r=0,n=0;for(let i=0;i<o;i++){r+=a*vn(x*f,y*f,P*f,s+i*7);n+=a;f*=2;a*=.5}return r/n}
/* ---------- ماتریس ---------- */
const MS=Array.from({length:48},()=>new Float32Array(16));let msp=0;
const mId=m=>{m.fill(0);m[0]=m[5]=m[10]=m[15]=1},mReset=()=>{msp=0;mId(MS[0])},pu=()=>{MS[msp+1].set(MS[msp]);msp++},po=()=>{msp--};
function tr(x,y,z){const m=MS[msp];m[12]+=m[0]*x+m[4]*y+m[8]*z;m[13]+=m[1]*x+m[5]*y+m[9]*z;m[14]+=m[2]*x+m[6]*y+m[10]*z}
function sc(x,y,z){const m=MS[msp];if(y===undefined)y=z=x;m[0]*=x;m[1]*=x;m[2]*=x;m[4]*=y;m[5]*=y;m[6]*=y;m[8]*=z;m[9]*=z;m[10]*=z}
function ry(a){const m=MS[msp],c=Math.cos(a),s=Math.sin(a);for(let i=0;i<3;i++){const p=m[i],q=m[8+i];m[i]=c*p-s*q;m[8+i]=s*p+c*q}}
function rx(a){const m=MS[msp],c=Math.cos(a),s=Math.sin(a);for(let i=0;i<3;i++){const p=m[4+i],q=m[8+i];m[4+i]=c*p+s*q;m[8+i]=-s*p+c*q}}
function rz(a){const m=MS[msp],c=Math.cos(a),s=Math.sin(a);for(let i=0;i<3;i++){const p=m[i],q=m[4+i];m[i]=c*p+s*q;m[4+i]=-s*p+c*q}}
function mMul(a,b,o){const r=new Float32Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];r[i*4+j]=s}o.set(r)}
function mPersp(f,a,n,fr,o){const t=1/Math.tan(f/2);o.fill(0);o[0]=t/a;o[5]=t;o[10]=(fr+n)/(n-fr);o[11]=-1;o[14]=2*fr*n/(n-fr)}
function mLook(e,c0,o){let zx=e[0]-c0[0],zy=e[1]-c0[1],zz=e[2]-c0[2],l=Math.hypot(zx,zy,zz);zx/=l;zy/=l;zz/=l;let xx=zz,xy=0,xz=-zx;l=Math.hypot(xx,xz)||1;xx/=l;xz/=l;const yx=zy*xz-zz*xy,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;o.set([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*e[0]+xy*e[1]+xz*e[2]),-(yx*e[0]+yy*e[1]+yz*e[2]),-(zx*e[0]+zy*e[1]+zz*e[2]),1])}
function mInv(m,o){const a=m,i=new Float32Array(16);const b00=a[0]*a[5]-a[1]*a[4],b01=a[0]*a[6]-a[2]*a[4],b02=a[0]*a[7]-a[3]*a[4],b03=a[1]*a[6]-a[2]*a[5],b04=a[1]*a[7]-a[3]*a[5],b05=a[2]*a[7]-a[3]*a[6],b06=a[8]*a[13]-a[9]*a[12],b07=a[8]*a[14]-a[10]*a[12],b08=a[8]*a[15]-a[11]*a[12],b09=a[9]*a[14]-a[10]*a[13],b10=a[9]*a[15]-a[11]*a[13],b11=a[10]*a[15]-a[11]*a[14];let d=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;if(!d)return false;d=1/d;
i[0]=(a[5]*b11-a[6]*b10+a[7]*b09)*d;i[1]=(a[2]*b10-a[1]*b11-a[3]*b09)*d;i[2]=(a[13]*b05-a[14]*b04+a[15]*b03)*d;i[3]=(a[10]*b04-a[9]*b05-a[11]*b03)*d;i[4]=(a[6]*b08-a[4]*b11-a[7]*b07)*d;i[5]=(a[0]*b11-a[2]*b08+a[3]*b07)*d;i[6]=(a[14]*b02-a[12]*b05-a[15]*b01)*d;i[7]=(a[8]*b05-a[10]*b02+a[11]*b01)*d;i[8]=(a[4]*b10-a[5]*b08+a[7]*b06)*d;i[9]=(a[1]*b08-a[0]*b10-a[3]*b06)*d;i[10]=(a[12]*b04-a[13]*b02+a[15]*b00)*d;i[11]=(a[9]*b02-a[8]*b04-a[11]*b00)*d;i[12]=(a[5]*b07-a[4]*b09-a[6]*b06)*d;i[13]=(a[0]*b09-a[1]*b07+a[2]*b06)*d;i[14]=(a[13]*b01-a[12]*b03-a[14]*b00)*d;i[15]=(a[8]*b03-a[9]*b01+a[10]*b00)*d;o.set(i);return true}
/* ---------- شیدرها ---------- */
const VS=`attribute vec3 aPos;attribute vec3 aNor;attribute vec4 aCol;attribute vec4 aMat;
uniform mat4 uVP,uM;uniform mat3 uNM;
varying vec3 vW,vN;varying vec4 vC,vM;
void main(){vec4 w=uM*vec4(aPos,1.);vW=w.xyz;vN=uNM*aNor;vC=aCol;vM=aMat;gl_Position=uVP*w;}`;
const FS=`precision highp float;
#define NL ${NL}
varying vec3 vW,vN;varying vec4 vC,vM;
uniform sampler2D uD0,uD1,uD2,uD3,uFA,uFN;
uniform vec3 uCam,uFoc,uAT,uAG,uFog,uAcc,uOrg;
uniform vec4 uFP,uFR,uL[NL];uniform vec3 uLC[NL];
uniform float uOcc,uGhost,uFloor,uEmP,uAlpha,uFx,uNS,uRim;
float ign(vec2 p){return fract(52.9829189*fract(dot(p,vec2(.06711056,.00583715))));}
vec4 dt(vec2 uv,float id){if(id<.5)return texture2D(uD0,uv);if(id<1.5)return texture2D(uD1,uv);if(id<2.5)return texture2D(uD2,uv);return texture2D(uD3,uv);}
float cav;
vec3 tri(vec3 p,vec3 n,float id,float tl,float s){
 vec3 w=pow(abs(n),vec3(4.));w/=w.x+w.y+w.z;
 vec4 a=dt(p.zy*tl,id),b=dt(p.xz*tl,id),c=dt(p.xy*tl,id);
 cav=a.a*w.x+b.a*w.y+c.a*w.z;
 vec3 tx=vec3((a.xy*2.-1.)*s,1.),ty=vec3((b.xy*2.-1.)*s,1.),tz=vec3((c.xy*2.-1.)*s,1.);
 tx=vec3(tx.xy+n.zy,abs(tx.z)*n.x);ty=vec3(ty.xy+n.xz,abs(ty.z)*n.y);tz=vec3(tz.xy+n.xy,abs(tz.z)*n.z);
 return normalize(tx.zyx*w.x+ty.xzy*w.y+tz.xyz*w.z);}
void main(){
 vec3 V=normalize(uCam-vW);
 if(uGhost>.5){gl_FragColor=vec4(vC.rgb*1.25+vC.rgb*vC.a,uAlpha);return;}
 float al=uAlpha;
 if(uOcc>.5&&vW.y>7.){vec3 ab=uFoc-uCam;float tt=dot(vW-uCam,ab)/dot(ab,ab);vec3 cp=uCam+ab*tt;float d=length(vW-cp);
  float f=(1.-smoothstep(10.,34.,d))*.96*step(tt,.992);if(f>ign(gl_FragCoord.xy))discard;}
 vec3 alb=vC.rgb,N=normalize(vN),Ec=vec3(0.);float e=vC.a,spec=vM.z,shin;cav=1.;
 if(e<0.)e=-e*uEmP;
 if(uFloor>.5){
  vec2 fuv=(vW.xz-uFR.xy)/uFR.zw;vec4 fa=texture2D(uFA,fuv),fn=texture2D(uFN,fuv);
  alb=fa.rgb;N=normalize(vec3((fn.r*2.-1.)*uNS,1.,(fn.g*2.-1.)*uNS));spec=fn.a*.8;
  float pulse=pow(.5+.5*sin(fn.b*80.-uFP.w*3.2),5.);
  e=0.;Ec=uAcc*fa.a*(uFP.z*(.18+1.15*pulse)+.07);
 }else if(vM.x>-.5){
  N=tri(vW-uOrg,N,vM.x,vM.y,vM.w);alb*=mix(1.,cav*1.25,.6*clamp(vM.w,0.,1.));
 }
 if(uFx>.5&&uFx<1.5){
  vec2 w1=vW.xz*.018+vec2(uFP.w*.02,uFP.w*.013),w2=vW.xz*.031-vec2(uFP.w*.017,-uFP.w*.022);
  vec3 n1=texture2D(uD3,w1).xyz*2.-1.,n2=texture2D(uD3,w2).xyz*2.-1.;
  N=normalize(vec3((n1.x+n2.x)*uNS,1.,(n1.y+n2.y)*uNS));spec=1.;
  alb=mix(alb,vec3(.35,.55,.62)+uFog*2.,pow(1.-max(dot(N,V),0.),3.)*.7);
 }
 if(uFx>1.5){float s=fract(vW.y*.07-uFP.w*.9+(vW.x+vW.z)*.02);al*=.4+.6*step(.5,s);e=1.6;}
 shin=6.+spec*74.;
 if(uOcc>.5)alb*=mix(.5,1.,smoothstep(0.,22.,vW.y));
 vec3 lit=mix(uAG,uAT,N.y*.5+.5),sp=vec3(0.);
 for(int i=0;i<NL;i++){vec4 l=uL[i];if(l.w<1.)continue;
  vec3 d=l.xyz-vW;float dist=length(d),k=1.-dist/l.w;if(k<=0.)continue;k*=k;
  vec3 Ld=d/dist;float nl=dot(N,Ld),dif=max((nl+.3)/1.3,0.);
  lit+=uLC[i]*(k*dif);
  vec3 Hh=normalize(Ld+V);sp+=uLC[i]*(k*pow(max(dot(N,Hh),0.),shin)*step(0.,nl));}
 vec3 col=alb*lit+sp*spec*1.5+alb*e*1.7+Ec;
 col+=uAT*uRim*pow(1.-max(dot(N,V),0.),3.)*alb;
 float fd=length(vW.xz-uFoc.xz);col=mix(col,uFog,smoothstep(uFP.x,uFP.y,fd));
 col=col/(1.+col*.2)*1.12;
 gl_FragColor=vec4(col,al);}`;
const SVS=`attribute vec2 aQ;uniform mat4 uVP;uniform vec3 uC,uR,uU;varying vec2 vQ;
void main(){vQ=aQ;gl_Position=uVP*vec4(uC+uR*aQ.x+uU*aQ.y,1.);}`;
const SFS=`precision mediump float;varying vec2 vQ;uniform vec4 uCol;uniform float uMode;uniform sampler2D uT;
void main(){if(uMode>2.5){vec4 t=texture2D(uT,vec2(vQ.x*.5+.5,.5-vQ.y*.5));if(t.a<.02)discard;gl_FragColor=vec4(t.rgb*uCol.rgb,t.a*uCol.a);return;}float r=length(vQ);float a;if(uMode<.5)a=pow(max(1.-r,0.),2.4);else if(uMode<1.5)a=smoothstep(1.,.35,r);else a=smoothstep(1.,.88,r)*smoothstep(.62,.8,r);
 if(a<.003)discard;gl_FragColor=vec4(uCol.rgb,a*uCol.a);}`;
function compile(t,s){const o=GL.createShader(t);GL.shaderSource(o,s);GL.compileShader(o);if(!GL.getShaderParameter(o,GL.COMPILE_STATUS))throw new Error('shader: '+GL.getShaderInfoLog(o));return o}
function mkProg(v,f,U,names){const p=GL.createProgram();GL.attachShader(p,compile(GL.VERTEX_SHADER,v));GL.attachShader(p,compile(GL.FRAGMENT_SHADER,f));names.forEach((n,i)=>GL.bindAttribLocation(p,i,n));GL.linkProgram(p);if(!GL.getProgramParameter(p,GL.LINK_STATUS))throw new Error('link: '+GL.getProgramInfoLog(p));const n=GL.getProgramParameter(p,GL.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){const a=GL.getActiveUniform(p,i),k=a.name.replace(/\[0\]$/,'');U[k]=GL.getUniformLocation(p,a.name)}return p}
/* ---------- هندسه‌ی شکل‌های پایه ---------- */
const SH={};
function vaoMake(){return GV2?GL.createVertexArray():VAOX.createVertexArrayOES()}
function vaoBind(v){GV2?GL.bindVertexArray(v):VAOX.bindVertexArrayOES(v)}
function mkShape(P,N,I){
 /* جهتِ مثلث‌ها خودکار طوری اصلاح می‌شود که با نرمال رأس‌ها هم‌جهت باشد (CCW = بیرون) */
 for(let i=0;i<I.length;i+=3){const a=I[i]*3,b=I[i+1]*3,c=I[i+2]*3,ux=P[b]-P[a],uy=P[b+1]-P[a+1],uz=P[b+2]-P[a+2],vx=P[c]-P[a],vy=P[c+1]-P[a+1],vz=P[c+2]-P[a+2],gx=uy*vz-uz*vy,gy=uz*vx-ux*vz,gz=ux*vy-uy*vx,nx=N[a]+N[b]+N[c],ny=N[a+1]+N[b+1]+N[c+1],nz=N[a+2]+N[b+2]+N[c+2];if(gx*nx+gy*ny+gz*nz<0){const t=I[i+1];I[i+1]=I[i+2];I[i+2]=t}}
 const nv=P.length/3,d=new Float32Array(nv*6);for(let i=0;i<nv;i++){d.set([P[i*3],P[i*3+1],P[i*3+2],N[i*3],N[i*3+1],N[i*3+2]],i*6)}
 const vbo=GL.createBuffer(),ebo=GL.createBuffer(),idx=Uint16Array.from(I),vao=vaoMake();vaoBind(vao);
 GL.bindBuffer(GL.ARRAY_BUFFER,vbo);GL.bufferData(GL.ARRAY_BUFFER,d,GL.STATIC_DRAW);GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,ebo);GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,idx,GL.STATIC_DRAW);
 GL.enableVertexAttribArray(0);GL.vertexAttribPointer(0,3,GL.FLOAT,false,24,0);GL.enableVertexAttribArray(1);GL.vertexAttribPointer(1,3,GL.FLOAT,false,24,12);
 vaoBind(null);return{vao,n:idx.length,nv,d,idx}}
function gBox(){const P=[],N=[],I=[],F=[[[1,0,0],[0,1,0],[0,0,1]],[[-1,0,0],[0,0,1],[0,1,0]],[[0,1,0],[0,0,1],[1,0,0]],[[0,-1,0],[1,0,0],[0,0,1]],[[0,0,1],[1,0,0],[0,1,0]],[[0,0,-1],[0,1,0],[1,0,0]]];
 for(const[n,u,v]of F){const b=P.length/3;for(const[a,c]of[[-1,-1],[1,-1],[1,1],[-1,1]]){P.push(n[0]*.5+u[0]*a*.5+v[0]*c*.5,n[1]*.5+u[1]*a*.5+v[1]*c*.5,n[2]*.5+u[2]*a*.5+v[2]*c*.5);N.push(...n)}I.push(b,b+1,b+2,b,b+2,b+3)}return mkShape(P,N,I)}
function gCyl(seg,rt,smooth,capB,capT){const P=[],N=[],I=[],sl=1-rt,nl=Math.hypot(1,sl);
 for(let j=0;j<=seg;j++){const a=j/seg*TAU,c=Math.cos(a),s=Math.sin(a);let nx=c/nl*1,ny=sl/nl,nz=s/nl;if(!smooth){const am=(j+.5)/seg*TAU;nx=Math.cos(am)/nl;nz=Math.sin(am)/nl}
  P.push(c,0,s,c*rt,1,s*rt);N.push(nx,ny,nz,nx,ny,nz);if(j<seg){const b=j*2;I.push(b+1,b,b+2,b+1,b+2,b+3)}}
 if(!smooth){/* برای سایه‌ی تخت: رأس‌ها تکرار می‌شوند */const P2=[],N2=[],I2=[];for(let j=0;j<seg;j++){const a0=j/seg*TAU,a1=(j+1)/seg*TAU,am=(j+.5)/seg*TAU,nx=Math.cos(am)/nl,nz=Math.sin(am)/nl,b=P2.length/3;P2.push(Math.cos(a0),0,Math.sin(a0),Math.cos(a1),0,Math.sin(a1),Math.cos(a0)*rt,1,Math.sin(a0)*rt,Math.cos(a1)*rt,1,Math.sin(a1)*rt);for(let q=0;q<4;q++)N2.push(nx,sl/nl,nz);I2.push(b+1,b,b+2,b+1,b+2,b+3)}P.length=0;N.length=0;I.length=0;P.push(...P2);N.push(...N2);I.push(...I2)}
 const cap=(y,r,ny)=>{const b=P.length/3;P.push(0,y,0);N.push(0,ny,0);for(let j=0;j<=seg;j++){const a=j/seg*TAU;P.push(Math.cos(a)*r,y,Math.sin(a)*r);N.push(0,ny,0);if(j<seg)I.push(b,ny>0?b+j+2:b+j+1,ny>0?b+j+1:b+j+2)}};
 if(capT&&rt>0)cap(1,rt,1);if(capB)cap(0,1,-1);return mkShape(P,N,I)}
function gSph(la,lo,smooth,top){const P=[],N=[],I=[],lm=top?la/2:la;
 for(let i=0;i<=lm;i++){const v=i/la*Math.PI,y=Math.cos(v),r=Math.sin(v);for(let j=0;j<=lo;j++){const a=j/lo*TAU,x=Math.cos(a)*r,z=Math.sin(a)*r;P.push(x,y,z);N.push(x,y,z);if(i<lm&&j<lo){const b=i*(lo+1)+j,c=b+lo+1;I.push(b,b+1,c,b+1,c+1,c)}}}
 if(top){const b=P.length/3;P.push(0,0,0);N.push(0,-1,0);for(let j=0;j<=lo;j++){const a=j/lo*TAU;P.push(Math.cos(a),0,Math.sin(a));N.push(0,-1,0);if(j<lo)I.push(b,b+j+1,b+j+2)}}
 return mkShape(P,N,I)}
function gPri(){const P=[],N=[],I=[],q=(a,n)=>{const b=P.length/3;for(const p of a){P.push(...p);N.push(...n)}I.push(b,b+1,b+2);if(a.length>3)I.push(b,b+2,b+3)};
 q([[-.5,0,.5],[0,1,.5],[0,1,-.5],[-.5,0,-.5]],[-.894,.447,0]);
 q([[.5,0,-.5],[0,1,-.5],[0,1,.5],[.5,0,.5]],[.894,.447,0]);
 q([[-.5,0,.5],[.5,0,.5],[0,1,.5]],[0,0,1]);q([[.5,0,-.5],[-.5,0,-.5],[0,1,-.5]],[0,0,-1]);
 q([[-.5,0,-.5],[.5,0,-.5],[.5,0,.5],[-.5,0,.5]],[0,-1,0]);return mkShape(P,N,I)}
function gGem(n,top,ring,bot){const P=[],N=[],I=[];
 const tri=(a,b,c)=>{const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;const l=Math.hypot(nx,ny,nz)||1;nx/=l;ny/=l;nz/=l;const b0=P.length/3;P.push(...a,...b,...c);for(let i=0;i<3;i++)N.push(nx,ny,nz);I.push(b0,b0+1,b0+2)};
 for(let j=0;j<n;j++){const a0=(j+.5)/n*TAU,a1=(j+1.5)/n*TAU,p0=[Math.cos(a0),ring,Math.sin(a0)],p1=[Math.cos(a1),ring,Math.sin(a1)];tri([0,top,0],p1,p0);tri([0,bot,0],p0,p1)}
 return mkShape(P,N,I)}
function gTor(R,r,sa,sb){const P=[],N=[],I=[];for(let i=0;i<=sa;i++){const a=i/sa*TAU,ca=Math.cos(a),sa_=Math.sin(a);for(let j=0;j<=sb;j++){const b=j/sb*TAU,cb=Math.cos(b),sb_=Math.sin(b);P.push((R+r*cb)*ca,r*sb_,(R+r*cb)*sa_);N.push(cb*ca,sb_,cb*sa_);if(i<sa&&j<sb){const k=i*(sb+1)+j,m=k+sb+1;I.push(k,k+1,m,k+1,m+1,m)}}}return mkShape(P,N,I)}
function gQuad(){return mkShape([-.5,0,.5,.5,0,.5,.5,0,-.5,-.5,0,-.5],[0,1,0,0,1,0,0,1,0,0,1,0],[0,1,2,0,2,3])}
function gCone4(){return gCyl(4,0,false,true,false)}
function shapesInit(){
 SH.box=gBox();SH.cy=gCyl(20,1,true,true,true);SH.cyl=gCyl(8,1,true,true,true);SH.cn=gCyl(20,0,true,true,false);SH.c5=gCyl(20,.5,true,true,true);SH.c7=gCyl(20,.72,true,true,true);SH.c3=gCyl(20,.3,true,true,true);
 SH.cy6=gCyl(6,1,false,true,true);SH.cy3=gCyl(3,1,false,true,true);SH.cn6=gCyl(6,0,false,true,false);SH.cn4=gCyl(4,0,false,true,false);SH.cy5=gCyl(5,.6,false,true,true);SH.cyo=gCyl(24,1,true,false,false);SH.cyo1=gCyl(24,.12,true,false,false);
 SH.sph=gSph(14,20);SH.spl=gSph(6,9);SH.hem=gSph(12,20,true,true);SH.pri=gPri();SH.gm4=gGem(4,1,.35,-.25);SH.gm6=gGem(6,1,.72,-.1);SH.gm5=gGem(5,1,.3,-.4);
 SH.tor=gTor(1,.14,24,8);SH.tor2=gTor(1,.3,20,8);SH.tor3=gTor(1,.07,24,6);SH.qud=gQuad()}
/* ---------- سطح‌ها و مواد ---------- */
const mt={r:1,g:1,b:1,e:0,tx:-1,tl:.04,sp:.2,ns:.8};
const MP={ghost:0,fx:0,alpha:1,occ:0,org:[0,0,0]};
function mat(c,e,s,t,tl,n){const q=typeof c=='string'?hx(c):c;mt.r=q[0];mt.g=q[1];mt.b=q[2];mt.e=e||0;mt.sp=s===undefined?.2:s;mt.tx=t===undefined?-1:t;mt.tl=tl||.04;mt.ns=n===undefined?.8:n}
const MB={on:false,a:[],nv:0,I:[],ch:[]};
function mbBegin(){MB.on=true;MB.a=[];MB.I=[];MB.nv=0;MB.ch=[]}
function mbFlush(){if(!MB.nv)return;const d=new Float32Array(MB.a),idx=new Uint16Array(MB.I),vbo=GL.createBuffer(),ebo=GL.createBuffer(),vao=vaoMake();vaoBind(vao);GL.bindBuffer(GL.ARRAY_BUFFER,vbo);GL.bufferData(GL.ARRAY_BUFFER,d,GL.STATIC_DRAW);GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,ebo);GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,idx,GL.STATIC_DRAW);
 for(const[i,n,o]of[[0,3,0],[1,3,12],[2,4,24],[3,4,40]]){GL.enableVertexAttribArray(i);GL.vertexAttribPointer(i,n,GL.FLOAT,false,56,o)}vaoBind(null);MB.ch.push({vao,n:idx.length,vbo,ebo});MB.a=[];MB.I=[];MB.nv=0}
function mbEnd(){mbFlush();MB.on=false;const c=MB.ch;MB.ch=[];return c}
function emit(s){if(MB.nv+s.nv>60000)mbFlush();const m=MS[msp],ax=m[0],ay=m[1],az=m[2],bx=m[4],by=m[5],bz=m[6],cx=m[8],cy_=m[9],cz=m[10];
 let n0x=by*cz-bz*cy_,n0y=bz*cx-bx*cz,n0z=bx*cy_-by*cx,n1x=cy_*az-cz*ay,n1y=cz*ax-cx*az,n1z=cx*ay-cy_*ax,n2x=ay*bz-az*by,n2y=az*bx-ax*bz,n2z=ax*by-ay*bx;const dt_=ax*n0x+ay*n0y+az*n0z,sg=dt_<0?-1:1;
 const d=s.d,a=MB.a,e=mt.e;for(let i=0;i<s.nv;i++){const o=i*6,x=d[o],y=d[o+1],z=d[o+2];let nx=(n0x*d[o+3]+n1x*d[o+4]+n2x*d[o+5])*sg,ny=(n0y*d[o+3]+n1y*d[o+4]+n2y*d[o+5])*sg,nz=(n0z*d[o+3]+n1z*d[o+4]+n2z*d[o+5])*sg;const l=Math.hypot(nx,ny,nz)||1;
  a.push(m[0]*x+m[4]*y+m[8]*z+m[12],m[1]*x+m[5]*y+m[9]*z+m[13],m[2]*x+m[6]*y+m[10]*z+m[14],nx/l,ny/l,nz/l,mt.r,mt.g,mt.b,e,mt.tx,mt.tl,mt.sp,mt.ns)}
 const base=MB.nv,I=MB.I,id=s.idx;for(let i=0;i<id.length;i++)I.push(id[i]+base);MB.nv+=s.nv}
let LASTV=null;const NM=new Float32Array(9);
function dr(s){if(MB.on){emit(s);return}
 const m=MS[msp],ax=m[0],ay=m[1],az=m[2],bx=m[4],by=m[5],bz=m[6],cx=m[8],cy_=m[9],cz=m[10],sg=(ax*(by*cz-bz*cy_)+ay*(bz*cx-bx*cz)+az*(bx*cy_-by*cx))<0?-1:1;
 NM[0]=(by*cz-bz*cy_)*sg;NM[1]=(bz*cx-bx*cz)*sg;NM[2]=(bx*cy_-by*cx)*sg;NM[3]=(cy_*az-cz*ay)*sg;NM[4]=(cz*ax-cx*az)*sg;NM[5]=(cx*ay-cy_*ax)*sg;NM[6]=(ay*bz-az*by)*sg;NM[7]=(az*bx-ax*bz)*sg;NM[8]=(ax*by-ay*bx)*sg;
 GL.uniformMatrix4fv(GU.uM,false,m);GL.uniformMatrix3fv(GU.uNM,false,NM);
 vaoBind(s.vao);GL.vertexAttrib4f(2,mt.r,mt.g,mt.b,mt.e);GL.vertexAttrib4f(3,mt.tx,mt.tl,mt.sp,mt.ns);GL.drawElements(GL.TRIANGLES,s.n,GL.UNSIGNED_SHORT,0)}
/* میان‌بُرهای رسم (پایه‌ی استوانه/مخروط روی y=۰، بقیه مرکزی) */
const dBox=(w,h,d)=>{pu();sc(w,h,d);dr(SH.box);po()},dSph=(a,b,c,k)=>{pu();sc(a,b===undefined?a:b,c===undefined?a:c);dr(SH[k||'sph']);po()},dCyl=(r,h,k,r2)=>{pu();sc(r,h,r2===undefined?r:r2);dr(SH[k||'cy']);po()},dCon=(r,h,k)=>{pu();sc(r,h,r);dr(SH[k||'cn']);po()},dHem=(a,b,c)=>{pu();sc(a,b===undefined?a:b,c===undefined?a:c);dr(SH.hem);po()},dGem=(r,h,k)=>{pu();sc(r,h,r);dr(SH[k||'gm4']);po()},dTor=(R,k,sy)=>{pu();sc(R,sy||R,R);dr(SH[k||'tor']);po()},dPri=(w,h,d)=>{pu();sc(w,h,d);dr(SH.pri);po()},dQud=(w,d)=>{pu();sc(w,1,d);dr(SH.qud);po()};
/* جعبه با کفِ روی y=۰ در نقطه‌ی (x,y,z) */
const bxAt=(x,y,z,w,h,d)=>{pu();tr(x,y+h/2,z);sc(w,h,d);dr(SH.box);po()};

/* ---------- راه‌اندازی WebGL، بافت‌های نرمال‌مپ، دوربین، اسپرایت ---------- */
const DTEX=[null,null,null,null],CAM={vp:new Float32Array(16),v:new Float32Array(16),p:new Float32Array(16),iv:new Float32Array(16),eye:[0,0,0],r:[1,0,0],u:[0,1,0],fx:0,fz:0};
let SQ=[],SQS=[],GW=0,GHt=0;
function glInit(){
 GC=document.createElement('canvas');GC.width=GC.height=8;
 const o={alpha:false,antialias:true,depth:true,stencil:false,powerPreference:'high-performance',preserveDrawingBuffer:false};
 GL=GC.getContext('webgl2',o);GV2=!!GL;if(!GL)GL=GC.getContext('webgl',o)||GC.getContext('experimental-webgl',o);
 if(!GL)throw new Error('WebGL not supported');
 if(!GV2){VAOX=GL.getExtension('OES_vertex_array_object');if(!VAOX)throw new Error('OES_vertex_array_object')}
 ANI=GL.getExtension('EXT_texture_filter_anisotropic');
 PM=mkProg(VS,FS,GU,['aPos','aNor','aCol','aMat']);PS=mkProg(SVS,SFS,SU,['aQ']);
 shapesInit();
 GL.useProgram(PM);for(let i=0;i<4;i++)GL.uniform1i(GU['uD'+i],i);GL.uniform1i(GU.uFA,4);GL.uniform1i(GU.uFN,5);
 /* بافت‌های جزئیات (نرمال + حفره) */
 for(let i=0;i<4;i++)DTEX[i]=texUp(256,256,detailTex(i),{rep:true});
 /* کوادِ اسپرایت */
 SQB=GL.createBuffer();GL.bindBuffer(GL.ARRAY_BUFFER,SQB);GL.bufferData(GL.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,1,1,-1,-1,1,1,-1,1]),GL.STATIC_DRAW);
}
let SQB=null;
const isP2=n=>(n&(n-1))==0;
function texUp(w,h,data,o){o=o||{};const t=GL.createTexture();GL.bindTexture(GL.TEXTURE_2D,t);GL.pixelStorei(GL.UNPACK_ALIGNMENT,1);GL.texImage2D(GL.TEXTURE_2D,0,GL.RGBA,w,h,0,GL.RGBA,GL.UNSIGNED_BYTE,data);
 const ok=GV2||(isP2(w)&&isP2(h)),mip=o.mip!==false&&ok,wr=o.rep&&ok?GL.REPEAT:GL.CLAMP_TO_EDGE;
 GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_WRAP_S,wr);GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_WRAP_T,wr);GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MAG_FILTER,GL.LINEAR);
 if(mip){GL.generateMipmap(GL.TEXTURE_2D);GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MIN_FILTER,GL.LINEAR_MIPMAP_LINEAR);if(ANI)GL.texParameterf(GL.TEXTURE_2D,ANI.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,GL.getParameter(ANI.MAX_TEXTURE_MAX_ANISOTROPY_EXT)))}else GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MIN_FILTER,GL.LINEAR);
 return t}
/* ارتفاع → نقشه‌ی نرمال (R,G) و حفره (A) */
function heightToNormal(h,w,hh,S,wrap){const o=new Uint8Array(w*hh*4);
 for(let y=0;y<hh;y++){const ym=wrap?(y-1+hh)%hh:y>0?y-1:0,yp=wrap?(y+1)%hh:y<hh-1?y+1:hh-1,r0=y*w,rm_=ym*w,rp=yp*w;
  for(let x=0;x<w;x++){const xm=wrap?(x-1+w)%w:x>0?x-1:0,xp=wrap?(x+1)%w:x<w-1?x+1:w-1,nx=-(h[r0+xp]-h[r0+xm])*S,ny=-(h[rp+x]-h[rm_+x])*S,il=.5/Math.sqrt(nx*nx+ny*ny+1),i=(r0+x)*4,hv=h[r0+x];o[i]=(nx*il+.5)*255;o[i+1]=(ny*il+.5)*255;o[i+2]=255;o[i+3]=hv<0?0:hv>1?255:hv*255}}
 return o}
function detailTex(kind){const n=256,h=new Float32Array(n*n),sd=kind*31+5;
 if(kind==0){/* سنگ: سلولی + دانه */const C=6,pts=[];for(let j=0;j<C;j++)for(let i=0;i<C;i++)pts.push([i+h2(i,j,sd),j+h2(i,j,sd+9)]);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){const u=x/n*C,v=y/n*C,ci=Math.floor(u),cj=Math.floor(v);let f1=9,f2=9;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){const ii=md(ci+a,C),jj=md(cj+b,C),p=pts[jj*C+ii];let px=p[0]+(ci+a-ii),py=p[1]+(cj+b-jj);const d=Math.hypot(u-px,v-py);if(d<f1){f2=f1;f1=d}else if(d<f2)f2=d}
   h[y*n+x]=sst(0,.16,f2-f1)*.62+fbm(x/n*8,y/n*8,8,4,sd)*.3+vn(x/n*64,y/n*64,64,sd+3)*.08}return heightToNormal(h,n,n,5,true)}
 if(kind==1){/* صفحه‌ی فلزی: پنل + پیچ + خراش */for(let y=0;y<n;y++)for(let x=0;x<n;x++){const lx=(x%64)/64,ly=(y%64)/64,g=Math.min(lx,ly,1-lx,1-ly);let v=sst(0,.07,g)*.5+.3;
   const rv=Math.min(Math.hypot(lx-.14,ly-.14),Math.hypot(lx-.86,ly-.14),Math.hypot(lx-.14,ly-.86),Math.hypot(lx-.86,ly-.86));v+=sst(.06,.02,rv)*.25;v+=vn(x*.04,y*.9,64,sd)*.09+vn(x*.3,y*.3,64,sd+1)*.05;h[y*n+x]=v}return heightToNormal(h,n,n,4.5,true)}
 if(kind==2){/* چوب/پوست: رگه‌ها */for(let y=0;y<n;y++)for(let x=0;x<n;x++){const w=fbm(x/n*4,y/n*2,4,3,sd)*12;const r=.5+.5*Math.sin((x/n*7+w)*TAU);h[y*n+x]=r*.45+fbm(x/n*3,y/n*32,4,4,sd+2)*.4+vn(x*.5,y*.04,128,sd+6)*.1}return heightToNormal(h,n,n,4,true)}
 /* نرم: پارچه/آب/ارگانیک */for(let y=0;y<n;y++)for(let x=0;x<n;x++){const wv=(Math.sin(x*TAU/8)*Math.sin(y*TAU/8))*.07;h[y*n+x]=fbm(x/n*4,y/n*4,4,4,sd)*.85+wv+.1}return heightToNormal(h,n,n,6,true)}
let QS=1,fAcc=0,fN=0,fGood=0;
/* اندازه‌ی بومِ رندر: سقفِ تعداد پیکسل + کاهشِ خودکار اگر کارت گرافیک نرسید */
function glResize(f){const s=QS*Math.min(1,Math.sqrt(2.4e6/(cv.width*cv.height))),w=Math.max(8,Math.round(cv.width*s)),hh=Math.max(8,Math.round(cv.height*s));if(!f&&GW==w&&GHt==hh)return;GW=w;GHt=hh;GC.width=w;GC.height=hh}
function adaptQ(dt){if(window.gameNoAdapt)return;fAcc+=dt;fN++;if(fN>=40){const av=fAcc/fN;if(av>.034&&QS>.5){QS=Math.max(.5,QS*.84);glResize(true);fGood=0}else if(av<.019){if(++fGood>=5&&QS<1){QS=Math.min(1,QS*1.12);fGood=0;glResize(true)}}else fGood=0;fAcc=fN=0}}
/* ---------- دوربین ---------- */
const FOV=.58;
function camBuild(fx,fz){
 const pitch=Math.asin(clp(vK,.3,.997)),asp=gW/gH,d=1.3*(gH/Z)/(2*Math.tan(FOV/2)),sa=Math.sin(vA),ca=Math.cos(vA),cp=Math.cos(pitch),sp_=Math.sin(pitch);
 CAM.fx=fx;CAM.fz=fz;CAM.eye=[fx+d*cp*sa,d*sp_,fz+d*cp*ca];
 mPersp(FOV,asp,24,5000,CAM.p);mLook(CAM.eye,[fx,0,fz],CAM.v);mMul(CAM.p,CAM.v,CAM.vp);mInv(CAM.vp,CAM.iv);
 const v=CAM.v;CAM.r=[v[0],v[4],v[8]];CAM.u=[v[1],v[5],v[9]]}
/* مختصات جهانی → صفحه (پیکسل CSS)؛ null اگر پشتِ دوربین */
function proj(x,y,z){const m=CAM.vp,cx=m[0]*x+m[4]*y+m[8]*z+m[12],cy_=m[1]*x+m[5]*y+m[9]*z+m[13],cw=m[3]*x+m[7]*y+m[11]*z+m[15];if(cw<=1)return null;return[(cx/cw*.5+.5)*gW,(1-(cy_/cw*.5+.5))*gH,cw]}
/* پیکسل صفحه → نقطه روی زمین (y=۰) در مختصات جهانی */
function unproj(sx,sy){const nx=sx/gW*2-1,ny=1-sy/gH*2,iv=CAM.iv,f=(x,y,z)=>{const X=iv[0]*x+iv[4]*y+iv[8]*z+iv[12],Y=iv[1]*x+iv[5]*y+iv[9]*z+iv[13],Z_=iv[2]*x+iv[6]*y+iv[10]*z+iv[14],W_=iv[3]*x+iv[7]*y+iv[11]*z+iv[15];return[X/W_,Y/W_,Z_/W_]},a=f(nx,ny,-1),b=f(nx,ny,1),dy=b[1]-a[1];if(Math.abs(dy)<1e-6)return[a[0],a[2]];const t=-a[1]/dy;return[a[0]+(b[0]-a[0])*t,a[2]+(b[2]-a[2])*t]}
/* ---------- اسپرایت (درخشش افزایشی) و سایه‌ی نرم ---------- */
let RO=[0,0],GHOSTP=false;
function spr(x,y,z,s,r,g,b,a,mode){if(!GHOSTP&&a>.004&&s>0.5)SQ.push([x+RO[0],y,z+RO[1],s,r,g,b,a,mode||0])}
function shw(x,z,s,a){if(!GHOSTP)SQS.push([x+RO[0],.7,z+RO[1],s,0,0,0,a,1,1])}
function sprFlush(){
 if(!SQ.length&&!SQS.length)return;
 GL.useProgram(PS);GL.uniformMatrix4fv(SU.uVP,false,CAM.vp);GL.bindBuffer(GL.ARRAY_BUFFER,SQB);vaoBind(null);GL.enableVertexAttribArray(0);GL.vertexAttribPointer(0,2,GL.FLOAT,false,0,0);GL.disableVertexAttribArray(1);GL.disableVertexAttribArray(2);GL.disableVertexAttribArray(3);GL.uniform1i(SU.uT,6);
 GL.enable(GL.BLEND);GL.depthMask(false);GL.disable(GL.CULL_FACE);
 const run=(L,flat)=>{for(const q of L){const s=q[3];GL.uniform3f(SU.uC,q[0],q[1],q[2]);if(q[8]==3){GL.activeTexture(GL.TEXTURE6);GL.bindTexture(GL.TEXTURE_2D,q[10]);GL.uniform3f(SU.uR,q[11],0,0);GL.uniform3f(SU.uU,0,q[12],0)}else if(q[9]||flat)GL.uniform3f(SU.uR,s,0,0),GL.uniform3f(SU.uU,0,0,s);else GL.uniform3f(SU.uR,CAM.r[0]*s,CAM.r[1]*s,CAM.r[2]*s),GL.uniform3f(SU.uU,CAM.u[0]*s,CAM.u[1]*s,CAM.u[2]*s);GL.uniform4f(SU.uCol,q[4],q[5],q[6],q[7]);GL.uniform1f(SU.uMode,q[8]);GL.drawArrays(GL.TRIANGLES,0,6)}};
 GL.blendFunc(GL.SRC_ALPHA,GL.ONE_MINUS_SRC_ALPHA);run(SQS);
 GL.blendFunc(GL.SRC_ALPHA,GL.ONE);run(SQ);
 GL.disableVertexAttribArray(0);GL.depthMask(true);GL.enable(GL.CULL_FACE);GL.disable(GL.BLEND);SQ=[];SQS=[];GL.useProgram(PM)}

/* ---------- چراغ‌ها و وضعیتِ رسم ---------- */
const LT=[],LA=new Float32Array(NL*4),LC=new Float32Array(NL*3);
/* نورهای لحظه‌ای (حین رسم) به فریمِ بعد می‌روند؛ نورهای ثابت/بازیکن همان فریم */
let LNXa=[],LPVa=[];
function addL(x,y,z,r,cr,cg,cb,k){if(!GHOSTP&&k>.01&&r>1)LNXa.push({x:x+RO[0],y,z:z+RO[1],r,cr:cr*k,cg:cg*k,cb:cb*k,pri:0})}
function addLT(x,y,z,r,cr,cg,cb,k,pri){if(k>.01&&r>1)LT.push({x,y,z,r,cr:cr*k,cg:cg*k,cb:cb*k,pri:pri||0})}
function lightsUpload(fx,fz){
 for(const l of LT){const d=Math.hypot(l.x-fx,l.z-fz);l.s=l.pri?1e9:l.r*(l.cr+l.cg+l.cb+.15)/(70+Math.max(0,d-l.r*.45))}
 LT.sort((a,b)=>b.s-a.s);LA.fill(0);LC.fill(0);const n=Math.min(NL,LT.length);
 for(let i=0;i<n;i++){const l=LT[i];LA.set([l.x,l.y,l.z,l.r],i*4);LC.set([l.cr,l.cg,l.cb],i*3)}
 GL.uniform4fv(GU.uL,LA);GL.uniform3fv(GU.uLC,LC);LT.length=0}
function setMP(k,v){if(MP[k]===v)return;MP[k]=v;switch(k){case'ghost':GL.uniform1f(GU.uGhost,v);break;case'fx':GL.uniform1f(GU.uFx,v);break;case'alpha':GL.uniform1f(GU.uAlpha,v);break;case'occ':GL.uniform1f(GU.uOcc,v);break}}
function setOrg(x,y,z){GL.uniform3f(GU.uOrg,x,y,z)}
function mainBegin(){
 GL.useProgram(PM);GL.uniformMatrix4fv(GU.uVP,false,CAM.vp);GL.uniform3f(GU.uCam,CAM.eye[0],CAM.eye[1],CAM.eye[2]);
 for(let i=0;i<4;i++){GL.activeTexture(GL.TEXTURE0+i);GL.bindTexture(GL.TEXTURE_2D,DTEX[i])}
 MP.ghost=MP.fx=MP.occ=-1;MP.alpha=-1;setMP('ghost',0);setMP('fx',0);setMP('alpha',1);setMP('occ',0);GL.uniform1f(GU.uFloor,0);GL.uniform1f(GU.uNS,.8);GL.uniform1f(GU.uRim,0);GL.uniform1f(GU.uEmP,1);setOrg(0,0,0);
 GL.enable(GL.DEPTH_TEST);GL.depthFunc(GL.LEQUAL);GL.enable(GL.CULL_FACE);GL.cullFace(GL.BACK);GL.frontFace(GL.CCW);GL.disable(GL.BLEND)}
/* رنگ‌های محیطِ هر اتاق */
function roomEnv(amT,amG,fog,acc,r0,r1,pw,tm){GL.uniform3fv(GU.uAT,amT);GL.uniform3fv(GU.uAG,amG);GL.uniform3fv(GU.uFog,fog);GL.uniform3fv(GU.uAcc,acc);GL.uniform4f(GU.uFP,r0,r1,pw,tm)}
function drawChunks(ch,x,z,floorU){for(const c of ch){vaoBind(c.vao);GL.drawElements(GL.TRIANGLES,c.n,GL.UNSIGNED_SHORT,0)}}
/* مش ثابت: مدل = جابه‌جایی (x,0,z)، ماتریس نرمال = یکه */
const IDN=new Float32Array([1,0,0,0,1,0,0,0,1]);
function drawStatic(ch,x,z){const m=new Float32Array(16);mId(m);m[12]=x;m[14]=z;GL.uniformMatrix4fv(GU.uM,false,m);GL.uniformMatrix3fv(GU.uNM,false,IDN);for(const c of ch){vaoBind(c.vao);GL.drawElements(GL.TRIANGLES,c.n,GL.UNSIGNED_SHORT,0)}}

/* ===================== کفِ مداری: ردهای مسی، پد، قطعه‌های ریز، نرمال‌مپ ===================== */
let NZC=null;const PTX=32,FB=2.1,NZ=new Float32Array(65536),D8=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
for(let y=0;y<256;y++)for(let x=0;x<256;x++)NZ[y*256+x]=fbm(x/16,y/16,16,3,77);
const CRK=[0,0,0,0,1,0,0,1],RIP=[0,0,0,0,0,1,0,0],DIA=[0,0,0,1,0,0,0,0],MOS=[0,1,0,0,0,0,1,0];
/* برنامه‌ی چیدمانِ هر اتاق: ردها، تراشه‌ها، قطعه‌ها (قطعی بر اساس شماره‌ی اتاق) */
function mkPlan(rm,key){
 const i=rm.in?rm.i:rm.i,rnd=rng(i*7919+(rm.in?555:13)),w=rm.w,h=rm.h,blk=new Set(),T_=[],chips=[],cell=(x,y)=>!(x<0||y<0||x>=w||y>=h||rm.wall[y][x]);
 if(rm.in)return{tr:T_,chips,blk};
 rm.wall.forEach((r,y)=>r.forEach((v,x)=>v&&blk.add(x+','+y)));
 rm.props.forEach(o=>{for(let a=0;a<o.h;a++)for(let b=0;b<o.w;b++)blk.add((o.x+b)+','+(o.y+a))});
 for(const o of[...rm.rocks,...rm.ins,...rm.sol,...rm.items,...rm.conv])blk.add(o.x+','+o.y);
 rm.folk.forEach(f=>blk.add((f.hx/T|0)+','+(f.hy/T|0)));rm.ev.forEach(e=>blk.add(e.x+','+e.y));if(rm.st)blk.add((rm.st.x/T|0)+','+(rm.st.y/T|0));
 rm.G.forEach(g=>{for(let d=-1;d<=1;d++)blk.add((g.x+d)+',5'),blk.add((g.x+d)+',4'),blk.add((g.x+d)+',6')});
 for(let d=-2;d<=2;d++){blk.add('14,'+(5+d));blk.add('15,'+(5+d))}
 const nT=Math.round(w*h/34);
 for(let t=0;t<nT;t++){let cx=1+rnd()*(w-2),cy=1+rnd()*(h-2);if(!cell(cx|0,cy|0))continue;let x=Math.round(cx*2)*16,y=Math.round(cy*2)*16,d=(rnd()*8)|0;const pts=[[x,y]],segs=2+(rnd()*5|0);
  for(let s=0;s<segs;s++){const n=2+(rnd()*7|0);let k=0;for(;k<n;k++){const nx=x+D8[d][0]*16,ny=y+D8[d][1]*16;if(!cell(nx/T|0,ny/T|0)||!cell((x+nx)/2/T|0,(y+ny)/2/T|0)){break}x=nx;y=ny}if(k)pts.push([x,y]);const q=rnd();d=(d+(q<.4?1:q<.8?7:q<.9?2:6))%8}
  if(pts.length<2)continue;const lanes=rnd()<.4?2+(rnd()*3|0):1;for(let L=0;L<lanes;L++)T_.push({pts,off:(L-(lanes-1)/2)*5.5,ph:rnd()*60,vc:rnd()<.5})}
 /* قطعه‌ها */
 const g=rnd,types=['dip','dip','qfp','res','res','cap','smd','smd','led','xt'];
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){if(blk.has(x+','+y))continue;if(g()>.15)continue;if(chips.some(c=>Math.abs(c.cx-x)<2&&Math.abs(c.cy-y)<2))continue;
  const t=types[(g()*types.length)|0];chips.push({t,cx:x,cy:y,x:x*T+16+(g()-.5)*6,z:y*T+16+(g()-.5)*6,r:g()<.5?0:1,n:(g()*99)|0,lab:(t=='dip'||t=='qfp'?'U':t=='res'?'R':t=='cap'?'C':t=='led'?'D':'X')+(1+(g()*40|0))})}
 return{tr:T_,chips,blk}}
function offPoly(pts,o){if(!o)return pts;const r=[];for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[i],c=pts[Math.min(pts.length-1,i+1)];let n1=[0,0],n2=[0,0];if(i>0){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;n1=[-dy/l,dx/l]}if(i<pts.length-1){const dx=c[0]-b[0],dy=c[1]-b[1],l=Math.hypot(dx,dy)||1;n2=[-dy/l,dx/l]}if(i==0)n1=n2;if(i==pts.length-1)n2=n1;let mx=n1[0]+n2[0],my=n1[1]+n2[1];const ml=Math.hypot(mx,my)||1;mx/=ml;my/=ml;const cs=Math.max(.5,mx*n1[0]+my*n1[1]);r.push([b[0]+mx*o/cs,b[1]+my*o/cs])}return r}
const g8=v=>{v=clp(Math.round(v*255),0,255);return'rgb('+v+','+v+','+v+')'},rgbs=(c,k)=>'rgb('+Math.round(clp(c[0]*k,0,1)*255)+','+Math.round(clp(c[1]*k,0,1)*255)+','+Math.round(clp(c[2]*k,0,1)*255)+')';
function* floorGenG(rm,plan){
 const w=rm.w,h=rm.h,W_=w*PTX,H_=h*PTX,p=RM[rm.i].p,c0=hx(p[0]),c1=hx(p[1]),ac=hx(p[2]),mk=()=>{const k=document.createElement('canvas');k.width=W_;k.height=H_;return k},cvs=[mk(),mk(),mk(),mk()],X=cvs.map(k=>k.getContext('2d',{willReadFrequently:true})),[xa,xh,xm,xp]=X,th=rm.i,rnd=rng(rm.i*313+7),wd=rm.in,flush=()=>{for(const q of X)q.getImageData(0,0,1,1)};
 /* پایه‌ی کف: حلقه‌ی پیکسلی روی آرایه‌ی تایپ‌دار (سریع‌تر از ابزارهای کانواس) */
 const ia=xa.createImageData(W_,H_),ih=xh.createImageData(W_,H_),da=ia.data,dh=ih.data;
 for(let y=0;y<H_;y++){const ty=y>>5,ly=y&31,row=rm.wall[ty];if((y&127)==127)yield;
  for(let x=0;x<W_;x++){const tx=x>>5,lx=x&31,o=(y*W_+x)*4,n=NZ[((y&255)<<8)|(x&255)],n2=NZ[(((y*3+11)&255)<<8)|((x*3+97)&255)],e=Math.min(lx,ly,31-lx,31-ly);let r,g,b,hh=.52+.1*n2;
   if(wd){const seam=(y%32<1.5)||((x+((y>>5)&1)*48)%96<1.5),k=.8+.4*n,pl=((x>>5)&1)?1.08:.95;r=.5*k*pl;g=.31*k*pl;b=.17*k;hh=seam?.25:.55+.1*n2;if(row[tx]){r=g=b=.02;hh=.8}}
   else{const base=((tx+ty)&1)?c1:c0,k=FB*(.78+.44*n);r=base[0]*k;g=base[1]*k;b=base[2]*k;
    if(e<1.2){r*=.5;g*=.5;b*=.5;hh=.18}else if(e<3.2)hh-=(3.2-e)*.06;else if(e>28.5){hh+=.04}
    if(RIP[th]){const s=Math.sin(x*.11+y*.05+n*7)*.5+.5;hh+=s*.2;const k2=.85+.3*s;r*=k2;g*=k2;b*=k2*.95;r+=.06;g+=.04}
    if(row[tx]){r=g=b=.02;hh=.8}}
   da[o]=r<0?0:r>1?255:r*255;da[o+1]=g<0?0:g>1?255:g*255;da[o+2]=b<0?0:b>1?255:b*255;da[o+3]=255;const hv=hh<0?0:hh>1?255:hh*255;dh[o]=dh[o+1]=dh[o+2]=hv;dh[o+3]=255}}
 xa.putImageData(ia,0,0);xh.putImageData(ih,0,0);xm.fillStyle='#000';xm.fillRect(0,0,W_,H_);xp.fillStyle='#000';xp.fillRect(0,0,W_,H_);
 X.forEach(q=>{q.lineCap='round';q.lineJoin='round'});yield;
 const st=(pts,lw,col,hv,gl)=>{xa.strokeStyle=col;xa.lineWidth=lw;xh.strokeStyle=g8(hv);xh.lineWidth=lw;xm.strokeStyle=g8(gl);xm.lineWidth=lw;for(const q of[xa,xh,xm]){q.beginPath();pts.forEach((a,i)=>i?q.lineTo(a[0],a[1]):q.moveTo(a[0],a[1]));q.stroke()}},
 fl=(fn,col,hv,gl)=>{xa.fillStyle=col;xh.fillStyle=g8(hv);xm.fillStyle=g8(gl);for(const q of[xa,xh,xm]){q.beginPath();fn(q);q.fill()}},
 rc=(x,y,ww,hh,col,hv,gl)=>fl(q=>q.rect(x,y,ww,hh),col,hv,gl),ci_=(x,y,r,col,hv,gl)=>fl(q=>q.arc(x,y,r,0,TAU),col,hv,gl);
 const trC=rgbs(mixc(mixc(c0,c1,.5),ac,.34),FB*.95),padC=rgbs(mixc(ac,[1,1,1],.25),.8),silk='rgba(225,222,205,.42)';
 /* منطقه‌ها: پارک، حوض، خیابان */
 for(const o of rm.props){const X0=o.x*T,Y0=o.y*T,ww=o.w*T,hh=o.h*T;
  if(o.k=='park'){const g=mixc([.1,.28,.14],ac,.18);xa.fillStyle=rgbs(g,1.5);xa.fillRect(X0,Y0,ww,hh);xh.fillStyle=g8(.6);xh.fillRect(X0,Y0,ww,hh);const rr=rng(o.x*91+o.y);for(let q=0;q<ww*hh/26;q++){const x=X0+rr()*ww,y=Y0+rr()*hh,l=3+rr()*5,a=-1.2+rr()*.5;xa.strokeStyle=rgbs(mixc(g,[.3,.7,.25],rr()),1.2+rr()*1.3);xa.lineWidth=1.1;xa.beginPath();xa.moveTo(x,y);xa.lineTo(x+Math.cos(a)*l*.3,y+Math.sin(a)*l);xa.stroke();xh.strokeStyle=g8(.62+rr()*.2);xh.lineWidth=1.1;xh.beginPath();xh.moveTo(x,y);xh.lineTo(x+Math.cos(a)*l*.3,y+Math.sin(a)*l);xh.stroke()}
   xa.strokeStyle=rgbs(ac,1.2);xa.globalAlpha=.5;xa.lineWidth=2;xa.strokeRect(X0+3,Y0+3,ww-6,hh-6);xa.globalAlpha=1;xh.strokeStyle=g8(.72);xh.lineWidth=2.5;xh.strokeRect(X0+3,Y0+3,ww-6,hh-6)}
  if(o.k=='pond'){xa.fillStyle='rgb(14,38,44)';xa.beginPath();xa.roundRect(X0+2,Y0+2,ww-4,hh-4,16);xa.fill();xh.fillStyle=g8(.12);xh.beginPath();xh.roundRect(X0+3,Y0+3,ww-6,hh-6,16);xh.fill();xh.strokeStyle=g8(.7);xh.lineWidth=5;xh.beginPath();xh.roundRect(X0+1,Y0+1,ww-2,hh-2,18);xh.stroke()}}
 if(!wd&&MOS[th]){const g=[.12,.34,.12];for(let q=0;q<w*h*.22;q++){const x=rnd()*W_,y=rnd()*H_;if(rm.wall[(y/PTX)|0][(x/PTX)|0])continue;const r=16+rnd()*34,gr=xa.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(40,110,45,.5)');gr.addColorStop(1,'rgba(40,110,45,0)');xa.fillStyle=gr;xa.fillRect(x-r,y-r,r*2,r*2);const g2=xh.createRadialGradient(x,y,0,x,y,r);g2.addColorStop(0,'rgba(255,255,255,.18)');g2.addColorStop(1,'rgba(255,255,255,0)');xh.fillStyle=g2;xh.fillRect(x-r,y-r,r*2,r*2)}}
 if(!wd&&DIA[th]){xa.strokeStyle='rgba(150,220,255,.14)';xa.lineWidth=1;xh.strokeStyle='rgba(255,255,255,.22)';xh.lineWidth=2;for(const q of[xa,xh]){q.beginPath();for(let k=-H_;k<W_;k+=64){q.moveTo(k,0);q.lineTo(k+H_,H_);q.moveTo(k+H_,0);q.lineTo(k,H_)}q.stroke()}}
 if(!wd&&CRK[th]){for(let q=0;q<w*h/18;q++){let x=rnd()*W_,y=rnd()*H_,a=rnd()*TAU;const pts=[[x,y]];for(let s=0;s<6+(rnd()*8|0);s++){a+=(rnd()-.5)*1.3;x+=Math.cos(a)*(10+rnd()*14);y+=Math.sin(a)*(10+rnd()*14);pts.push([x,y])}st(pts,3,'rgba(10,6,6,1)',.1,0);st(pts,1.3,rgbs(ac,1.1),.12,.85);if(rnd()<.3){const m=pts[pts.length>>1];let bx=m[0],by=m[1],ba=a+(rnd()-.5)*2;const bp=[[bx,by]];for(let s=0;s<4;s++){ba+=(rnd()-.5);bx+=Math.cos(ba)*10;by+=Math.sin(ba)*10;bp.push([bx,by])}st(bp,1,rgbs(ac,1),.14,.7)}}}
 flush();yield;
 /* ردهای مسی (نبض‌ها فاز ممتد دارند تا جریان در مسیر دیده شود) */
 for(const t of plan.tr){const pts=offPoly(t.pts,t.off),lw=t.vc?2.2:1.7;
  xa.strokeStyle='rgba(0,0,0,.35)';xa.lineWidth=lw+2.5;xa.beginPath();pts.forEach((a,i)=>i?xa.lineTo(a[0]+1,a[1]+1.5):xa.moveTo(a[0]+1,a[1]+1.5));xa.stroke();
  st(pts,lw,trC,.86,.55);let cum=t.ph;for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],l=Math.hypot(b[0]-a[0],b[1]-a[1]),p0=(cum/4)%255,p1=((cum+l)/4)%255;const gr=xp.createLinearGradient(a[0],a[1],b[0],b[1]);gr.addColorStop(0,g8(p0/255));gr.addColorStop(1,g8(Math.max(p1,p0)/255));xp.strokeStyle=gr;xp.lineWidth=lw;xp.beginPath();xp.moveTo(a[0],a[1]);xp.lineTo(b[0],b[1]);xp.stroke();cum+=l}
  const e0=pts[0],e1=pts[pts.length-1];for(const e of[e0,e1]){ci_(e[0],e[1],3.6,padC,.95,1);ci_(e[0],e[1],1.3,'rgb(8,10,12)',.3,.1)}}
 flush();yield;
 /* جای قطعه‌ها: خطِ سیلک، پدها، برچسب */
 const lab=(t,x,y)=>{xa.font='700 7px monospace';xa.fillStyle=silk;xa.textAlign='center';xa.fillText(t,x,y)};
 for(const c of plan.chips){xa.save();xh.save();xm.save();for(const q of[xa,xh,xm]){q.translate(c.x,c.z);if(c.r)q.rotate(Math.PI/2)}
  const pad=(x,y,ww,hh)=>rc(x-ww/2,y-hh/2,ww,hh,padC,.93,.9);
  if(c.t=='dip'){for(let k=0;k<7;k++){const x=-9+k*3;pad(x,-8,1.7,3);pad(x,8,1.7,3);if(k%2==0){st([[x,-9.5],[x,-14-(k%3)*3]],1.3,trC,.86,.5);st([[x,9.5],[x,14+(k%3)*3]],1.3,trC,.86,.5)}}xa.strokeStyle=silk;xa.lineWidth=.9;xa.strokeRect(-12.5,-6.5,25,13);xa.stroke()}
  else if(c.t=='qfp'){for(let k=0;k<6;k++){const o=-7.5+k*3;pad(o,-10.5,1.6,3);pad(o,10.5,1.6,3);pad(-10.5,o,3,1.6);pad(10.5,o,3,1.6);if(k%2)st([[o,-12],[o,-17]],1.2,trC,.86,.5)}xa.strokeStyle=silk;xa.lineWidth=.9;xa.strokeRect(-9.5,-9.5,19,19)}
  else if(c.t=='res'){for(let k=0;k<2;k++){const y=-6+k*12;pad(-8,y,3.2,3.2);pad(8,y,3.2,3.2);st([[-10,y],[-15,y]],1.4,trC,.86,.5);st([[10,y],[15,y]],1.4,trC,.86,.5);xa.strokeStyle=silk;xa.lineWidth=.8;xa.strokeRect(-6,y-2.5,12,5)}}
  else if(c.t=='cap'){ci_(0,0,5.4,'rgba(0,0,0,.0)',.5,0);xa.strokeStyle=silk;xa.lineWidth=1;xa.beginPath();xa.arc(0,0,6.4,0,TAU);xa.stroke();pad(-4,0,3,3);pad(4,0,3,3);st([[-6,0],[-12,0]],1.4,trC,.86,.5)}
  else if(c.t=='smd'){for(let k=0;k<3;k++){const x=-8+k*8;pad(x,-3.5,2.4,2.2);pad(x,3.5,2.4,2.2);xa.strokeStyle=silk;xa.lineWidth=.7;xa.strokeRect(x-2.2,-5.8,4.4,11.6);if(k==1){st([[x,5],[x,12]],1.2,trC,.86,.5)}}}
  else if(c.t=='led'){pad(-3.5,0,2.6,3);pad(3.5,0,2.6,3);xa.strokeStyle=silk;xa.lineWidth=.9;xa.strokeRect(-7,-4.5,14,9)}
  else{pad(-6,0,3,3);pad(6,0,3,3);xa.strokeStyle=silk;xa.lineWidth=.9;xa.beginPath();xa.ellipse(0,0,10,5.5,0,0,TAU);xa.stroke()}
  xa.restore();xh.restore();xm.restore();lab(c.lab,c.x,c.z+(c.t=='dip'?-17:19))}
 /* سایه‌ی اتصال به دیوار */
 for(let ty=0;ty<h;ty++)for(let tx=0;tx<w;tx++){if(rm.wall[ty][tx])continue;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=tx+dx,ny=ty+dy;if(nx<0||ny<0||nx>=w||ny>=h||!rm.wall[ny][nx])continue;const X0=tx*PTX,Y0=ty*PTX,L=11;let g;if(dx==1){g=xa.createLinearGradient(X0+PTX,0,X0+PTX-L,0);xa.fillStyle=g;g.addColorStop(0,'rgba(0,0,0,.75)');g.addColorStop(1,'rgba(0,0,0,0)');xa.fillRect(X0+PTX-L,Y0,L,PTX)}else if(dx==-1){g=xa.createLinearGradient(X0,0,X0+L,0);g.addColorStop(0,'rgba(0,0,0,.75)');g.addColorStop(1,'rgba(0,0,0,0)');xa.fillStyle=g;xa.fillRect(X0,Y0,L,PTX)}else if(dy==1){g=xa.createLinearGradient(0,Y0+PTX,0,Y0+PTX-L);g.addColorStop(0,'rgba(0,0,0,.75)');g.addColorStop(1,'rgba(0,0,0,0)');xa.fillStyle=g;xa.fillRect(X0,Y0+PTX-L,PTX,L)}else{g=xa.createLinearGradient(0,Y0,0,Y0+L);g.addColorStop(0,'rgba(0,0,0,.75)');g.addColorStop(1,'rgba(0,0,0,0)');xa.fillStyle=g;xa.fillRect(X0,Y0,PTX,L)}}}
 flush();yield;
 /* بسته‌بندی: آلبیدو+ماسکِ درخشش، نرمال+فاز+براقی */
 const A=xa.getImageData(0,0,W_,H_).data,Hh=xh.getImageData(0,0,W_,H_).data,M=xm.getImageData(0,0,W_,H_).data,Pp=xp.getImageData(0,0,W_,H_).data,hf=new Float32Array(W_*H_),alb=new Uint8Array(W_*H_*4);
 for(let i=0;i<W_*H_;i++){hf[i]=Hh[i*4]/255;alb[i*4]=A[i*4];alb[i*4+1]=A[i*4+1];alb[i*4+2]=A[i*4+2];alb[i*4+3]=M[i*4]}
 yield;const nor=heightToNormal(hf,W_,H_,wd?4:7,false);yield;for(let i=0;i<W_*H_;i++){nor[i*4+2]=Pp[i*4];nor[i*4+3]=clp(40+M[i*4]*.7+(Hh[i*4]>200?50:0)+(RIP[th]?20:0)+(wd?20:0),0,255)}
 return{a:texUp(W_,H_,alb,{}),n:texUp(W_,H_,nor,{}),w:W_,h:H_}}

function runGen(g){let r;while(!(r=g.next()).done);return r.value}
const floorGen=(rm,plan)=>runGen(floorGenG(rm,plan));

/* ===================== هندسه‌ی ثابتِ اتاق: دیوار، خانه، درخت، قطعه‌های مدار ===================== */
const RCc={};
function RC(i){if(RCc[i])return RCc[i];const p=RM[i].p,w=mixc(hx(p[3]),hx(p[1]),.4).map(v=>clp(v*3.4,0,.9)),a=hx(p[2]);return RCc[i]={wall:w,cap:mixc(w,a,.22).map(v=>clp(v*1.35,0,1)),acc:a,fl:[hx(p[0]),hx(p[1])],p}}
const dbg=a=>a;
function doorsOf(i){const r=[];if(i<7)r.push({s:SD[i],p:XP[i],w:HW[i]});if(i>0)r.push({s:OP[SD[i-1]],p:EP[i-1],w:HW[i-1]});return r}
const SIGNS={};
function signTex(t,col){const k=t+col;if(SIGNS[k])return SIGNS[k];const cn=document.createElement('canvas');cn.width=384;cn.height=84;const x=cn.getContext('2d');x.fillStyle='#120e18';x.beginPath();x.roundRect(4,4,376,76,16);x.fill();x.strokeStyle=col;x.lineWidth=5;x.stroke();x.fillStyle='rgba(255,255,255,.05)';x.fillRect(10,10,364,30);x.font='700 34px Vazirmatn,Tahoma,sans-serif';x.textAlign='center';x.textBaseline='middle';x.direction='rtl';x.fillStyle='#fff4d8';x.shadowColor=col;x.shadowBlur=10;x.fillText(t,192,44);
 const d=x.getImageData(0,0,384,84).data,u=new Uint8Array(d.buffer.slice(0));return SIGNS[k]=texUp(384,84,u,{})}
/* ---- مدل‌های کوچک (در مختصات محلی اتاق) ---- */
function tree(x,z,hs){const r=(hs%7)/7,s=.85+r*.4;pu();tr(x,0,z);ry(r*6);sc(s);mat('#4a3322',0,.1,2,1/22,1);dCyl(3.4,24,'c7');mat('#1f4d33',.1,.1,3,1/26,.7);pu();tr(5,18,1);dSph(11,10,11,'spl');po();mat('#265a3c',.12,.1,3,1/26,.7);pu();tr(-5,23,-2);dSph(10,9,10,'spl');po();mat('#2f6e48',.16,.1,3,1/26,.7);pu();tr(0,33,0);dSph(10,10,10,'spl');po();mat('#3b8456',.2,.1,3,1/26,.7);pu();tr(2,40,-1);dSph(6,6,6,'spl');po();po()}
function bush(x,z){pu();tr(x,0,z);mat('#2a5a3c',.1,.1,3,1/20,.7);pu();tr(0,6,0);dSph(9,7,8,'spl');po();pu();tr(-6,5,3);dSph(6,5,6,'spl');po();pu();tr(6,5,-2);dSph(5,5,5,'spl');po();mat('#ff9aa8',.5,.3);for(const[a,b,c]of[[3,10,5],[-3,9,-4],[7,7,3]]){pu();tr(a,b,c);dSph(1.8,1.8,1.8,'spl');po()}po()}
function mush(x,z,hs){const r=(hs%5)/5;pu();tr(x,0,z);ry(r*6);mat('#e8dccb',.05,.2,3,1/20,.5);dCyl(2.3,9,'c7');mat('#e07a5f',.5,.35,3,1/20,.5);pu();tr(0,8,0);sc(1,.75,1);dHem(10.5+r*2);po();mat('#fff3e0',.6,.2);for(const[a,b,c]of[[-4,10.4,2],[3,11.5,-2],[5,9.6,3],[-1,12.2,-4]]){pu();tr(a,b,c);dSph(1.5,.8,1.5,'spl');po()}po()}
function neonP(x,z,ac){pu();tr(x,0,z);mat('#1b1626',0,.5,1,1/30,.6);dCyl(3,6);bxAt(0,6,0,5,22,5);mat(mixc(ac,[1,1,1],.2),1.2,.4);dCyl(1.8,26,'cy');pu();tr(0,30,0);dSph(4.4,4.4,4.4,'spl');po();pu();tr(0,22,0);dTor(8,'tor3',1);po();po()}
function crysP(x,z,ac){pu();tr(x,0,z);mat(mixc(ac,[1,1,1],.15),.9,.9,-1);pu();tr(0,0,0);rz(.06);dGem(5.2,19,'gm6');po();pu();tr(-7,0,3);rz(.4);dGem(3.8,12,'gm6');po();pu();tr(7,0,-2);rz(-.45);dGem(3.6,11,'gm6');po();pu();tr(2,0,8);rx(.5);dGem(2.8,8,'gm5');po();mat('#2b2a3a',0,.3,0,1/28,1);pu();tr(0,1,0);dSph(9,3.5,9,'spl');po();po()}
function stalP(x,z,hs){pu();tr(x,0,z);ry(hs%6);mat('#3f3850',0,.25,0,1/36,1.1);dCon(9,28,'cn6');pu();tr(-8,0,4);dCon(5,14,'cn6');po();pu();tr(7,0,-5);dCon(4,10,'cn6');po();po()}
function cactP(x,z,hs){pu();tr(x,0,z);mat('#3f7d4a',.08,.2,3,1/18,.9);dCyl(4.3,24,'c7');pu();tr(0,24,0);dSph(4.3,4.3,4.3,'spl');po();for(const sd of[-1,1]){pu();tr(sd*4,12+(hs%3)*2,0);rz(-sd*Math.PI/2);dCyl(2.8,7+sd*0,'cy');tr(0,7,0);dSph(2.8,2.8,2.8,'spl');po();pu();tr(sd*10.5,12+(hs%3)*2,0);dCyl(2.8,8+sd*2+(sd>0?0:0),'cy');tr(0,8,0);dSph(2.8,2.8,2.8,'spl');po()}mat('#ff7eb6',.5,.3);pu();tr(1,27,0);dSph(2.2,2.2,2.2,'spl');po();po()}
function reedP(x,z,hs){pu();tr(x,0,z);for(let k=0;k<5;k++){const a=(k-2)*5,h=20+((hs+k*3)%6)*2;pu();tr(a*.9,0,((k*7)%5)-2);rz(-a*.012);mat('#5f8a45',.05,.1,3,1/20,.5);dCyl(.8,h,'cyl');tr(0,h,0);mat('#6b4a2a',.0,.2);dCyl(1.9,6,'cyl');po()}po()}
function ruinP(x,z,hs){pu();tr(x,0,z);ry((hs%8)*.4);mat('#4b4458',.0,.2,0,1/38,1.2);bxAt(0,0,0,16,20,16);mat('#625a72',0,.25,0,1/38,1.2);bxAt(0,20,0,19,4,19);mat('#4b4458',0,.2,0,1/38,1.2);pu();tr(8,0,10);rz(.3);ry(.5);bxAt(0,0,0,10,10,14);po();bxAt(-12,0,8,8,9,8);mat('#c36bff',-.8,.5);bxAt(0,9,8.1,6,1.2,.6);bxAt(0,13,8.1,4,1.2,.6);po()}
function lampP(x,z){pu();tr(x,0,z);mat('#31494b',0,.5,1,1/30,.6);dCyl(3.2,3);dCyl(1.7,34,'c7');mat('#2a3d3f',0,.5);bxAt(0,34,0,7,1.6,7);mat('#ffb85a',-1.0,.4);pu();tr(0,40,0);dSph(5.2,6.5,5.2);po();mat('#3a4b4d',0,.6);dCon(7,4);pu();tr(0,44,0);dCyl(6.6,1.4,'cy');po();pu();tr(0,36.5,0);dTor(5.4,'tor3',1);po();po()}
function benchP(x,z,rot){pu();tr(x,0,z);ry(rot||0);mat('#6a5442',0,.2,2,1/24,1);bxAt(0,9,0,28,2.8,10);mat('#5a4636',0,.2,2,1/24,1);bxAt(0,14,-4.6,28,6,2);mat('#2e231a',0,.3,1,1/30,.6);bxAt(-11,0,0,3,9,8);bxAt(11,0,0,3,9,8);po()}
const BL={sign:null};
function chip3(c){pu();tr(c.x,0,c.z);if(c.r)ry(Math.PI/2);const pin=(x,y,z,w,d)=>{mat('#a9afb8',0,.85);bxAt(x,.3,z,w,.9,d)};
 if(c.t=='dip'){mat('#101216',0,.8);bxAt(0,.7,0,22,4.2,9);mat('#25282f',0,.9);bxAt(0,4.9,0,20,.3,7);mat('#6e7480',0,.6);pu();tr(-8.5,5.1,2.2);dCyl(1.2,.2);po();mat('#8a90a0',0,.4);bxAt(1.5,5.1,0,9,.12,1.2);for(let k=0;k<7;k++){const x=-9+k*3;pin(x,0,-5.8,1.5,3);pin(x,0,5.8,1.5,3);mat('#a9afb8',0,.85);bxAt(x,.3,-4.6,1.4,2.6,.7);bxAt(x,.3,4.6,1.4,2.6,.7)}}
 else if(c.t=='qfp'){mat('#0e1014',0,.85);bxAt(0,.7,0,16,3.8,16);mat('#22252c',0,.9);bxAt(0,4.5,0,14.4,.3,14.4);mat('#6e7480',0,.6);pu();tr(-5.5,4.7,-5.5);dCyl(1.1,.2);po();for(let k=0;k<6;k++){const o=-7.5+k*3;for(const[a,b,w,d]of[[o,-9.6,1.2,3],[o,9.6,1.2,3],[-9.6,o,3,1.2],[9.6,o,3,1.2]])pin(a,0,b,w,d)}}
 else if(c.t=='res'){for(let k=0;k<2;k++){const y=-6+k*12,col=['#c9a36a','#6aa0c9','#c98a6a','#9ac96a'][(c.n+k)%4];pu();tr(-5.4,2.4,y);rz(-Math.PI/2);mat(col,0,.5,-1);dCyl(1.9,10.8,'cy');const b=[['#8a3a1a',.2],['#101010',.4],['#c9a227',.62],['#c0c0c0',.84]];for(const[bc,t]of b){mat(bc,0,.4);pu();tr(0,t*10.8,0);dCyl(2.02,1.3,'cy');po()}mat('#a9afb8',0,.85);pu();tr(0,-3,0);dCyl(.5,3,'cyl');po();pu();tr(0,10.8,0);dCyl(.5,4,'cyl');po();po()}}
 else if(c.t=='cap'){mat('#1b2a4a',0,.6,-1);dCyl(3.7,8,'cy');mat('#aab3c4',0,.8);pu();tr(0,8,0);dCyl(3.5,.3,'cy');po();mat('#7da0d8',0,.4);bxAt(2.5,.5,0,1.2,7,2.2);mat('#aab3c4',0,.8);pu();tr(-4,0,0);dCyl(.45,6,'cyl');po();pu();tr(4,0,0);dCyl(.45,6,'cyl');po();mat('#c9a227',0,.5,-1);pu();tr(-12,0,0);dCyl(2.8,3,'cy');po()}
 else if(c.t=='smd'){for(let k=0;k<3;k++){const x=-8+k*8;mat(k==1?'#3a2a1a':'#15171b',0,.7);bxAt(x,.4,0,4,1.5,2.2);mat('#b8bdc6',0,.9);bxAt(x-2,.4,0,.9,1.5,2.2);bxAt(x+2,.4,0,.9,1.5,2.2)}}
 else if(c.t=='led'){const cl=['#ff4d6d','#7bd88f','#ffb347','#5fb8ff'][c.n%4];mat('#1a1c20',0,.7);bxAt(0,.3,0,10,1.2,6);mat(cl,-1.1,.9);pu();tr(0,1.4,0);dHem(2.9,2.4,2.9);po();mat('#a9afb8',0,.85);bxAt(-3.5,.3,0,2.4,1,2.6);bxAt(3.5,.3,0,2.4,1,2.6)}
 else{mat('#aeb4be',0,.9);pu();tr(0,.4,0);dCyl(8,4,'cy',4.5);po();mat('#e8ecf2',0,.9);pu();tr(0,4.4,0);dCyl(7.4,.3,'cy',4.0);po();mat('#101216',0,.5);bxAt(0,.3,0,3,1,3)}
 po()}
/* ---- خانه / کافه ---- */
function winM(x,y,z,w,h,ry_,col){pu();tr(x,y,z);ry(ry_);mat('#16121a',0,.5,1,1/40,.5);bxAt(0,-h/2-1.5,.6,w+5,h+3,1.4);mat(col||'#ffd36b',.95,.2,-1);bxAt(0,-h/2,1.4,w,h,.8);mat('#16121a',0,.4);bxAt(0,-h/2,1.9,1.4,h,.6);bxAt(0,-h/2,1.9,w,1.3,.6);mat('#3a2f40',0,.3,2,1/20,1);bxAt(0,-h/2-h/2-2.4,2.6,w+7,1.8,3.4);po()}
function houseM(o,p,rmI,acc,L,SG){const cf=o.k=='cafe',X0=o.x*T+1,Z0=o.y*T+1,W=o.w*T-2,D=o.h*T-2,cx=X0+W/2,cz=Z0+D/2,Hb=cf?54:46,roofC=cf?mixc(hx(p[2]),[0,0,0],.35):[.36,.28,.4],bodyC=cf?[.2,.15,.24]:[.19,.19,.26],em=(o.t||'')[0]||'';
 const dX=(o.x+(o.w>>1)+.5)*T,body=mixc(bodyC,hx(p[3]),.15).map(v=>v*1.55);
 mat('#2b2831',0,.2,0,1/36,1.1);bxAt(cx,0,cz,W+3,7,D+3);
 mat(body,0,.12,1,1/64,.9);
 if(cf){const dl=dX-T/2-X0,dr_=X0+W-(dX+T/2);bxAt(X0+dl/2,7,cz,dl,Hb-7,D);bxAt(X0+W-dr_/2,7,cz,dr_,Hb-7,D);bxAt(dX,7,cz-T/2,T,Hb-7,D-T);bxAt(dX,34,Z0+D-T/2,T,Hb-34,T);mat('#0b0810',0,.1);bxAt(dX,0,Z0+D-T-.5,T-6,30,1);mat('#ffb347',.8,.2);bxAt(dX,26,Z0+D-T,T-8,3,2);mat('#ffd36b',.4,.2);bxAt(dX-T/2+5,0,Z0+D-T/2,3,34,T-2);bxAt(dX+T/2-5,0,Z0+D-T/2,3,34,T-2);L.push({x:dX,y:20,z:Z0+D-T/2,r:150,c:[1,.65,.3],k:1.3,pw:0})}
 else{bxAt(cx,7,cz,W,Hb-7,D);mat('#120e16',0,.1);bxAt(dX,0,Z0+D+.2,18,30,1.4);mat('#4b3a2e',0,.2,2,1/20,1);bxAt(dX,0,Z0+D+.5,14,28,1.2);mat('#c9a227',.3,.6);pu();tr(dX+4,14,Z0+D+1.4);dSph(1.1,1.1,1.1,'spl');po();mat('#2b2831',0,.2,0,1/36,1);bxAt(dX,0,Z0+D+4,22,3,8)}
 mat('#3d3447',0,.2,0,1/40,1.1);bxAt(cx,Hb-3,cz,W+4,3,D+4);
 const wc=cf?'#ffd36b':'#ffcf75';
 for(let q=0;q<Math.max(1,Math.floor(W/46));q++){const n=Math.max(1,Math.floor(W/46)),wx=X0+(q+.5)*W/n;if(Math.abs(wx-dX)<26)continue;winM(wx,Hb-12,Z0+D,14,15,0,wc)}
 winM(X0,Hb-12,cz,13,15,-Math.PI/2,wc);winM(X0+W,Hb-12,cz,13,15,Math.PI/2,wc);
 if(D>50){winM(X0+W/2-18,Hb-12,Z0,14,15,Math.PI,wc);winM(X0+W/2+18,Hb-12,Z0,14,15,Math.PI,wc)}
 /* سقف */
 const hr=cf?22:26;mat(roofC.map(v=>v*1.7),0,.25,1,1/48,1);
 if(em=='🔭'){pu();tr(cx,Hb,cz);dCyl(Math.min(W,D)/2-2,5,'cy');tr(0,5,0);mat('#7a7a92',0,.6,1,1/40,.8);dHem(Math.min(W,D)/2-4,Math.min(W,D)/2-6,Math.min(W,D)/2-4);mat('#0b0d16',0,.2);bxAt(0,2,Math.min(W,D)/2-5,5,Math.min(W,D)/2,3);mat('#7be3ff',.9,.8);pu();tr(0,Math.min(W,D)/2-1,Math.min(W,D)/2-4);rx(-.9);dCyl(3,16,'cy');po();L.push({x:cx,y:Hb+20,z:cz,r:140,c:[.5,.8,1],k:.8,pw:0});po()}
 else if(em=='🏭'){mat('#2e2b36',0,.3,1,1/48,1);bxAt(cx,Hb,cz,W+3,4,D+3);for(const sx of[-.28,.28]){pu();tr(cx+sx*W,Hb+4,cz-D*.15);mat('#4a4655',0,.3,1,1/30,1);dCyl(7,34,'c7');mat('#ff6a3d',-1.3,.2);pu();tr(0,34,0);dCyl(5,1.5,'cy');po();po();L.push({x:cx+sx*W,y:Hb+40,z:cz-D*.15,r:120,c:[1,.45,.2],k:.9,pw:0})}}
 else if(em=='⛽'||em=='🛖'){mat(roofC.map(v=>v*1.5),0,.25,1,1/48,1);bxAt(cx,Hb,cz,W+8,5,D+8);mat('#e8a23c',.3,.3);bxAt(cx,Hb+5,Z0+D+4,W+8,2,1.4);if(em=='⛽'){mat('#c9302a',0,.4);bxAt(X0+12,0,Z0+D+14,8,18,6);mat('#7bd88f',.9,.2);bxAt(X0+12,12,Z0+D+17.2,5,4,.6)}else{mat('#8a6a4a',0,.3,2,1/24,1);pu();tr(cx,Hb+5,cz);dCon(Math.min(W,D)*.42,22,'cn6');po()}}
 else{pu();tr(cx,Hb,cz);if(W>=D){ry(Math.PI/2);dPri(D+10,hr,W+10)}else dPri(W+10,hr,D+10);po();mat('#2b2831',0,.3);bxAt(cx+W*.25,Hb+hr*.45,cz-D*.2,8,16,8);if(em=='📚'||em=='🎛️'){mat(em=='📚'?'#ffe58a':acc,1.2,.5);pu();tr(cx,Hb+hr+8,cz);dGem(7,9,'gm5');po();L.push({x:cx,y:Hb+hr+14,z:cz,r:130,c:em=='📚'?[1,.9,.5]:acc,k:.8,pw:0})}}
 if(em=='🛠️'){mat('#9aa0aa',0,.7,1,1/30,1);pu();tr(cx-W*.3,Hb+hr+4,cz);rx(Math.PI/2);dCyl(9,3,'cy6');po();mat('#14101a',0,.1);pu();tr(cx-W*.3,Hb+hr+4,cz+1.6);rx(Math.PI/2);dCyl(3,3,'cy');po()}
 if(em=='⛏️'){mat('#5a4a3a',0,.2,2,1/24,1);bxAt(X0+W+6,0,cz,3,14,3);bxAt(X0+W+6,0,cz+10,3,14,3);bxAt(X0+W+6,14,cz+5,3,2,14)}
 if(em=='🏕️'){mat('#3b6a45',0,.2,3,1/20,.8);bxAt(cx,Hb+hr*.45,cz,W+10,1.6,D+8)}
 if(cf){const n=Math.max(6,Math.round(W/9)),aw=W+6,sw=aw/n;for(let k=0;k<n;k++){pu();tr(X0-3+(k+.5)*sw,Hb-12,Z0+D+7);rx(.55);mat(k%2?'#f2e6d0':hx(p[2]),k%2?.1:.35,.2,3,1/18,.5);bxAt(0,-1,0,sw-.4,1.8,17);po();pu();tr(X0-3+(k+.5)*sw,Hb-20,Z0+D+15.2);rz(Math.PI/2);mat(k%2?'#f2e6d0':hx(p[2]),k%2?.1:.35,.2);dCyl(3.2,sw-.4,'cy');po()}L.push({x:dX,y:30,z:Z0+D+12,r:170,c:[1,.7,.35],k:1.1,pw:0})}
 /* تابلو */
 if(o.t){SG.push({t:o.t,col:p[2],x:cx,y:Hb+(cf?4:10)+ (em=='🔭'?0:0),z:Z0+D+(cf?20:3.2),hw:Math.min(W-6,Math.max(46,o.t.length*7.5+16))/2,hh:11,tilt:cf?.4:0});}
 const lightC=cf?[1,.7,.35]:[1,.78,.45];for(const[lx,lz]of[[X0+W*.25,Z0+D+16],[X0+W*.75,Z0+D+16]])if(!cf)L.push({x:lx,y:26,z:lz,r:105,c:lightC,k:.7,pw:0});
 L.push({x:cx,y:Hb*.6,z:Z0-10,r:100,c:lightC,k:.45,pw:0});L.push({x:X0-10,y:Hb*.6,z:cz,r:100,c:lightC,k:.4,pw:0});L.push({x:X0+W+10,y:Hb*.6,z:cz,r:100,c:lightC,k:.4,pw:0})}
/* ---- ساختِ مش ثابتِ اتاق ---- */
function buildSolid(rm,plan){
 const i=rm.i,rc=RC(i),p=rc.p,acc=rc.acc,hs=(x,y)=>(((x*73856093)^(y*19349663))>>>0),L=[],SG=[],wA=rm.wall,w=rm.w,h=rm.h,ex=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&!wA[y][x];
 mbBegin();mReset();
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!wA[y][x]||rm.bl.has(x+','+y))continue;const sides=[[0,-1,0,-1],[1,0,1,0],[0,1,0,1],[-1,0,-1,0]].filter(([a,b])=>ex(x+a,y+b));if(!sides.length)continue;const hh=hs(x,y),Hw=rm.in?44:34+hh%3*2,X=x*T+16,Z=y*T+16;
  mat(rc.wall.map(v=>v*(.9+(hh%5)*.05)),0,.12,1,1/64,.95);bxAt(X,0,Z,T,Hw,T);mat(rc.cap,0,.3,0,1/44,.9);bxAt(X,Hw,Z,T+1.5,3.2,T+1.5);
  for(const[a,b]of sides){const fx=X+a*(T/2+.25),fz=Z+b*(T/2+.25),al=a?.8:T-8,bl=b?.8:T-8;mat(acc,-.85,.4,-1);bxAt(fx,Hw*.62,fz,a?.5:T-10,2,b?.5:T-10);
   if(i==7&&hh%3==0&&!rm.in){mat('#ff4d9a',1.1,.5);for(const q of[-5,5]){pu();tr(fx+a*.4+(b?q:0),Hw*.45,fz+b*.4+(a?q:0));dSph(a?.8:2.6,1.6,b?.8:2.6,'spl');po()}}}
 }
 /* دروازه‌های بینِ اتاق‌ها */
 if(!rm.in)for(const d of doorsOf(i)){const hz=d.s=='U'||d.s=='D',n=(d.w*2+1)*T;for(const sg of[-1,1]){const off=(d.p+.5)*T+sg*(n/2+0),x=hz?off:(d.s=='R'?w*T:0),z=hz?(d.s=='D'?h*T:0):off;mat('#2b2831',0,.4,1,1/30,.8);bxAt(x,0,z,13,58,13);mat(acc,-1.2,.5);bxAt(x,58,z,11,4,11);L.push({x,y:62,z,r:100,c:acc,k:.8,pw:1})}
  mat(acc,-.7,.3);const cxd=hz?(d.p+.5)*T:(d.s=='R'?w*T-3:3),czd=hz?(d.s=='D'?h*T-3:3):(d.p+.5)*T;bxAt(cxd,0,czd,hz?n:3,.7,hz?3:n)}
 /* پراپ‌ها */
 for(const o of rm.props){const X=o.x*T+16,Z=o.y*T+16,hh=hs(o.x,o.y);
  if(o.k=='cafe'||o.k=='house')houseM(o,p,i,acc,L,SG);
  else if(o.k=='tree')tree(X,Z,hh);else if(o.k=='bush')bush(X,Z);else if(o.k=='mush'){mush(X,Z,hh);L.push({x:X,y:12,z:Z,r:62,c:[1,.45,.3],k:.65,pw:0})}
  else if(o.k=='neon'){neonP(X,Z,acc);L.push({x:X,y:26,z:Z,r:135,c:acc,k:1.1,pw:2})}
  else if(o.k=='crys'){crysP(X,Z,acc);L.push({x:X,y:14,z:Z,r:110,c:acc,k:1,pw:2})}
  else if(o.k=='stal')stalP(X,Z,hh);else if(o.k=='cact')cactP(X,Z,hh);else if(o.k=='reed')reedP(X,Z,hh);else if(o.k=='ruin')ruinP(X,Z,hh);
  else if(o.k=='lamp'){lampP(X,Z);L.push({x:X,y:40,z:Z,r:175,c:[1,.75,.4],k:1.45,pw:1})}
  else if(o.k=='bench')benchP(X,Z+4,0);
  else if(o.k=='pond'){const rr=rng(hh);for(let q=0;q<o.w*o.h*3;q++){const a=rr()*TAU,ex_=o.w*T/2-3,ey=o.h*T/2-3;mat('#3a4a4c',0,.2,0,1/20,1);pu();tr(o.x*T+o.w*T/2+Math.cos(a)*ex_*(.92+rr()*.1),0,o.y*T+o.h*T/2+Math.sin(a)*ey*(.92+rr()*.1));dSph(3+rr()*3,2.4+rr()*2,3+rr()*3,'spl');po()}mat('#3e7a3b',0,.2,3,1/20,.5);for(let q=0;q<2+o.w;q++){pu();tr(o.x*T+4+rr()*(o.w*T-8),1.4,o.y*T+4+rr()*(o.h*T-8));dCyl(4+rr()*2,.6,'cy');po()}}
  else if(o.k=='park'){const rr=rng(hh);mat('#4a8a4a',.05,.1,3,1/16,.5);for(let q=0;q<o.w*o.h*5;q++){const a=o.x*T+4+rr()*(o.w*T-8),b=o.y*T+4+rr()*(o.h*T-8);pu();tr(a,0,b);ry(rr()*6);rz((rr()-.5)*.4);dCon(1.5,5+rr()*5,'cn4');po()}}
  else if(o.k=='counter'){mat('#5a4030',0,.3,2,1/24,1);bxAt(X+(o.w-1)*T/2,0,Z-4,o.w*T,15,T-8);mat(hx(p[2]),.4,.3);bxAt(X+(o.w-1)*T/2,15,Z-4,o.w*T+2,3,T-5);mat('#2e2018',0,.3,2,1/24,1);bxAt(X+(o.w-1)*T/2,0,Z+9,o.w*T,15,2)}
  else if(o.k=='table'){pu();tr(X,0,Z);mat('#4a3524',0,.3,2,1/24,1);dCyl(2.2,13,'cy');tr(0,13,0);mat('#6a4a30',0,.4,2,1/24,1);dCyl(12,2.4,'cy');mat('#f2e6d0',.1,.5);pu();tr(5,2.4,-2);dCyl(2.4,3,'c7');po();mat('#ffd36b',.7);pu();tr(-5,2.4,3);dCyl(2,.9);po();po()}}
 /* قطعه‌های مدار روی زمین */
 for(const c of plan.chips)chip3(c);
 return{solid:mbEnd(),lights:L,signs:SG}}

/* ===================== شخصیت‌ها (سه‌بعدی) ===================== */
const hs3=t=>{let h=7;for(const ch of t)h=(h*31+ch.charCodeAt(0))>>>0;return h};
/* جسمِ اصلی: b=۰ کپسول ۱ تخم‌مرغی ۲ ردا ۳ جعبه ۴ مثلث */
function bodyShape(b,w,h,ll,col,tex){mat(col,0,.18,tex===undefined?3:tex,1/18,.55);
 if(b==0){dCyl(w,h-w,'cy');pu();tr(0,h-w,0);dSph(w,w,w);po()}
 else if(b==1){pu();tr(0,h*.5,0);dSph(w*1.15,h*.55,w*1.05);po()}
 else if(b==2){dCyl(w*1.35,h,'c5')}
 else if(b==3){pu();tr(0,0,0);bxAt(0,0,0,w*2,h-2,w*1.7);pu();tr(0,h-2,0);dSph(w*1.02,w*.4,w*.85,'spl');po();po()}
 else{pu();ry(Math.PI/2);dCyl(w*1.5,h,'cy3');po()}}
function chr3(x,z,o,face,t,an){an=an||{};
 const w=o.w||9,h=o.h||24,hr=o.hr||8.5,ll=o.lg===0?0:7,sw=an.run?Math.sin(t*11)*.7:Math.sin(t*1.6+(o.s||0))*.06,bob=Math.sin(t*2.6+(o.s||0))*.9*(o.fl?1.6:1),fl=o.fl||0,hy=ll+h+hr*.55+bob;
 pu();tr(x,fl+(o.fl?Math.sin(t*2)*3:0),z);ry(face);if(an.lean)rx(an.lean);
 if(o.ghost){setMP('alpha',.62)}
 /* سایه‌ی نرم */
 /* پاها */
 if(o.lg!==0){for(const s of[-1,1]){pu();tr(s*w*.42,0,0);rx(s*sw);mat(o.l||'#1b1620',0,.15,3,1/18,.5);dCyl(2.3,ll+1,'cy');pu();tr(0,0,2);bxAt(0,0,0,5,2.4,7.5);po();po()}}
 pu();tr(0,ll+bob*.5,0);bodyShape(o.b|0,w,h,ll,o.c,o.tex);
 if(o.bands)for(const[q,cl]of o.bands){mat(cl,0,.2,3,1/18,.4);pu();tr(0,h*q-1.3,0);const r=(o.b==1?w*1.17*Math.sqrt(Math.max(.05,1-Math.pow((q-.5)*2,2))):w*1.03);dCyl(r+.2,2.8,'cy');po()}
 po();
 /* بازوها */
 const ar=an.arms||[0,0];for(const s of[-1,1]){const sx=s*(w*(o.b==2?.9:1)+1),sy=ll+h*.76+bob*.5,sa=(s<0?ar[0]:ar[1])+(an.run?s*Math.sin(t*11)*.9:Math.sin(t*1.7+s)*.05);pu();tr(sx,sy,0);rx(sa);rz(Math.PI+s*.14);mat(o.a||o.c,0,.15,3,1/18,.5);dCyl(2.1,h*.42,'cy');pu();tr(0,h*.42,0);mat(o.hc||'#f0cfae',0,.2,3,1/16,.4);dSph(2.6,2.6,2.6,'spl');po();po()}
 /* سر */
 pu();tr(0,hy,0);mat(o.hc||o.c,0,.22,3,1/16,.45);dSph(hr,hr*(o.hy||1),hr*.98);
 const e=o.e|0,ez=hr*.82;mat('#ffffff',.1,.4);
 if(e==0){for(const s of[-1,1]){pu();tr(s*hr*.38,hr*.1,ez);dSph(hr*.27,hr*.3,hr*.15,'spl');po()}mat('#0d0d14',0,.6);for(const s of[-1,1]){pu();tr(s*hr*.38,hr*.08,ez+hr*.1);dSph(hr*.13,hr*.16,hr*.08,'spl');po()}}
 else if(e==1){mat('#0c1118',.0,.7);pu();tr(0,hr*.1,ez-1);dSph(hr*.86,hr*.26,hr*.3,'spl');po();mat('#4dd0ff',1.4,.5);pu();tr(0,hr*.1,ez+hr*.12);dSph(hr*.74,hr*.1,hr*.12,'spl');po()}
 else if(e==2){pu();tr(0,hr*.1,ez);dSph(hr*.38,hr*.38,hr*.2,'spl');po();mat('#101018');pu();tr(0,hr*.1,ez+hr*.14);dSph(hr*.17,hr*.17,hr*.1,'spl');po()}
 else if(e==3){for(const s of[-1,1]){mat('#e8e8f0',.1,.6);pu();tr(s*hr*.4,hr*.1,ez+hr*.06);rx(Math.PI/2);dTor(hr*.3,'tor3',1);po();mat('#cfe6ff',.15,.8);pu();tr(s*hr*.4,hr*.1,ez+hr*.04);dSph(hr*.27,hr*.27,hr*.04,'spl');po();mat('#101018',0,.5);pu();tr(s*hr*.4,hr*.1,ez+hr*.1);dSph(hr*.1,hr*.1,hr*.05,'spl');po()}mat('#e8e8f0',.1,.6);bxAt(0,hr*.06,ez+hr*.08,hr*.2,.7,.7)}
 else{mat('#16101c',0,.5);for(const s of[-1,1]){pu();tr(s*hr*.4,hr*.1,ez+hr*.04);rz(s*.25);dSph(hr*.24,hr*.06,hr*.06,'spl');po()}mat('#ff9aa8',.2,.3);for(const s of[-1,1]){pu();tr(s*hr*.62,-hr*.12,ez-hr*.1);dSph(hr*.18,hr*.12,hr*.06,'spl');po()}}
 if(e!=1&&!o.ghost){mat('#6a2a2a',0,.3);pu();tr(0,-hr*.32,ez-hr*.05);dSph(hr*.18,hr*.06,hr*.06,'spl');po()}
 hatShape(o.hat|0,hr,o.hcl||'#c9a227',t);
 po();
 if(o.ac)o.ac({w,h,ll,hr,hy,t,bob,e:o});
 if(o.ghost)setMP('alpha',1);
 po()}
function hatShape(ht,hr,cl,t){if(!ht)return;mat(cl,.05,.2,3,1/18,.5);
 if(ht==1||ht==14||ht==5){pu();tr(0,hr*.1,0);dHem(hr*1.1,hr*.95,hr*1.1);pu();tr(0,-.4,hr*.15);dCyl(hr*1.32,1.2,'cy');po();po();if(ht==14){mat('#ffe9a0',1.5,.4);pu();tr(0,hr*.45,hr*1.0);dSph(2.6,2.6,2.2,'spl');po()}if(ht==5){mat('#3a3f48',0,.6);bxAt(0,hr*.0,hr*.95,hr*1.1,1.4,2.6)}}
 else if(ht==2){pu();tr(0,hr*.55,0);rx(-.12);dCon(hr*1.05,hr*2.3,'cn');pu();tr(0,-hr*.1,0);dCyl(hr*1.5,.8,'cy');po();mat('#ffe58a',1.1,.5);pu();tr(0,hr*2.3,0);dGem(2.6,3.2,'gm5');po();po()}
 else if(ht==3){mat('#9aa0aa',0,.7);pu();tr(0,hr*.9,0);dCyl(.6,10,'cyl');po();mat('#7be3ff',1.5,.5);pu();tr(0,hr*.9+11,0);dSph(2.4,2.4,2.4,'spl');po()}
 else if(ht==4){for(const s of[-1,1]){pu();tr(s*hr*.55,hr*.7,0);rz(-s*.5);dCon(hr*.38,hr*.95,'cn');po()}}
 else if(ht==6){mat('#f6f1e6',.08,.2,3,1/16,.4);pu();tr(0,hr*.55,0);dCyl(hr*.82,hr*.8,'cy');tr(0,hr*.8,0);dSph(hr*1.05,hr*.85,hr*1.05);po()}
 else if(ht==7){pu();tr(0,hr*.55,0);dHem(hr*.95,hr*.7,hr*.95);po();mat('#d8d8e0',0,.6);pu();tr(0,hr*1.15,0);dCyl(.5,4,'cyl');tr(0,4,0);ry(t*14);bxAt(0,0,0,hr*1.6,.4,2.2);bxAt(0,0,0,2.2,.4,hr*1.6);po()}
 else if(ht==8){pu();tr(0,hr*.4,0);dCyl(hr*1.95,.9,'cy');tr(0,.5,0);dHem(hr*.95,hr*.8,hr*.95);po()}
 else if(ht==9){pu();tr(0,hr*.5,0);dSph(hr*1.12,hr*.72,hr*1.12);mat('#e8d8b0',0,.3,3,1/16);tr(0,-hr*.1,0);dTor(hr*1.1,'tor2',.3);po()}
 else if(ht==10){pu();tr(0,hr*.1,-hr*.1);dHem(hr*1.18,hr*1.1,hr*1.18);pu();tr(0,-hr*.8,-hr*.55);rx(.25);dCon(hr*.95,hr*1.7,'cn');po();po()}
 else if(ht==11){pu();tr(0,hr*.3,0);dHem(hr*1.04,hr*.9,hr*1.04);mat('#fff0c0',.2);tr(0,hr*.92,0);dSph(2.4,2.4,2.4,'spl');po()}
 else if(ht==12){mat('#2b2f3a',0,.5);pu();tr(0,hr*.1,0);rx(Math.PI/2);rz(0);dTor(hr*1.08,'tor3',1);po();for(const s of[-1,1]){pu();tr(s*hr*1.05,0,0);dSph(2.8,3.4,3.4,'spl');po()}mat('#4dd0ff',1.3,.4);pu();tr(0,0,0);po()}
 else if(ht==13){mat('#ffd36b',.9,.7);for(let k=0;k<6;k++){const a=k/6*TAU;pu();tr(Math.cos(a)*hr*.78,hr*.75,Math.sin(a)*hr*.78);dCon(2.2,hr*.9,'cn4');po()}pu();tr(0,hr*.62,0);dCyl(hr*.82,2,'cy');po()}
 else if(ht==15){pu();tr(0,hr*.2,0);dHem(hr*1.03,hr*.75,hr*1.03);pu();tr(0,-.2,hr*.9);bxAt(0,0,0,hr*1.3,1.2,hr*.8);po();po()}}
/* ===== مشخصاتِ ساکنان ===== */
const gl_=(c)=>({c:c});
const CH={
'کافه‌چیِ مهربون':{c:'#ffb86b',b:1,h:22,w:10,hr:8.5,hat:6,e:0,ac:d=>{mat('#f6f1e6',.05,.3,3,1/16,.4);bxAt(0,d.ll+4,d.w*.9,d.w*1.5,d.h*.62,1.5);mat('#4a3a2a',0,.3);pu();tr(0,d.hy-d.hr*.45,d.hr*.8);dSph(d.hr*.7,d.hr*.14,d.hr*.14,'spl');po();mat('#c9b8d8',.1,.5);pu();tr(d.w+4,d.ll+d.h*.38,d.w*.6);dSph(5,4,5,'spl');tr(0,4,0);dCyl(2.2,2,'cy');po()}},
'بچه‌ی همسایه':{c:'#8fd3ff',b:0,h:14,w:6.5,hr:8,hat:7,hcl:'#ff7eb6',e:0,ac:d=>{mat('#e07a5f',0,.2,3,1/16);bxAt(0,d.ll+2,-d.w-2,d.w*1.5,d.h*.7,3.4)}},
'پیرمردِ نیمکت':{c:'#d9c8a0',b:2,h:22,w:8.5,hr:8,hat:15,hcl:'#6a6a72',e:3,ac:d=>{mat('#f2f2f2',.05,.3,3,1/16,.5);pu();tr(0,d.hy-d.hr*.9,d.hr*.45);rx(.15);dCon(d.hr*.8,d.hr*1.5,'cn');po();mat('#6a4a2a',0,.3,2,1/20,1);pu();tr(d.w+7,0,d.w*.6);dCyl(1,28,'cyl');tr(0,28,0);dSph(2,2,2,'spl');po()}},
'رزیستورفروش':{c:'#e07a5f',b:3,h:22,w:9,hr:8.5,hat:15,hcl:'#2b3a4a',e:0,ac:d=>{mat('#3a2a22',0,.3,2,1/20,1);bxAt(0,d.ll+3,-d.w-4,d.w*1.9,d.h*.8,5);for(let k=0;k<6;k++){const cl=['#c9a36a','#6aa0c9','#c98a6a','#9ac96a'][k%4];pu();tr(-d.w*.7+(k%3)*d.w*.7,d.ll+d.h*.8+3,-d.w-4);rz(Math.PI/2);mat(cl,0,.4);dCyl(1.8,9,'cy');mat('#8a3a1a');pu();tr(0,2,0);dCyl(1.9,1.1,'cy');po();pu();tr(0,6,0);mat('#101010');dCyl(1.9,1.1,'cy');po();po()}}},
'دختر کوچولوی جنگل':{c:'#7bd88f',b:0,h:15,w:6.8,hr:8.6,hat:10,hcl:'#3a8a4a',e:4,ac:d=>{mat('#ffd36b',.3,.3);for(const s of[-1,1]){pu();tr(s*(d.hr+1),d.hy-d.hr*.5,-d.hr*.2);dSph(2.6,2.6,2.6,'spl');po()}mat('#ff9aa8',.5,.3);pu();tr(d.hr*.75,d.hy+d.hr*.75,d.hr*.4);dSph(2.4,2.4,1.2,'spl');po()}},
'جنگل‌بان':{c:'#a8d5ba',b:3,h:28,w:10,hr:8.5,hat:8,hcl:'#6a5a30',e:0,ac:d=>{mat('#e8e8e0',.05,.3,3,1/16,.5);pu();tr(0,d.hy-d.hr*.85,d.hr*.55);dCon(d.hr*.75,d.hr*1.2,'cn');po();mat('#2b3a2a',0,.3);bxAt(0,d.ll+d.h*.35,0,d.w*2.1,2,d.w*1.8);mat('#3a3f30',0,.5);pu();tr(d.w+6,d.ll+d.h*.35,5);dCyl(3,6,'cy');mat('#ffd36b',1.5,.3);tr(0,1,0);dSph(2.7,3,2.7,'spl');po();L3.push([0,d.w+6,d.ll+d.h*.35+4,5,70,[1,.75,.4],.9])}},
'ساقیِ بار':{c:'#ff7eb6',b:0,h:26,w:8.5,hr:8.3,hat:0,e:0,ac:d=>{mat('#1a1420',0,.4,3,1/16);pu();tr(0,d.hy+d.hr*.2,-d.hr*.1);dHem(d.hr*1.05,d.hr*.8,d.hr*1.05);po();mat('#101018');bxAt(0,d.ll+d.h*.5,d.w*.78,d.w*1.5,d.h*.5,1.4);mat('#ff4d6d',.3,.4);pu();tr(0,d.ll+d.h*.88,d.w*.9);dSph(3,2,1.5,'spl');po();mat('#bfc7d6',0,.9);pu();tr(d.w+4,d.ll+d.h*.35,5);dCyl(2.6,8,'c7');po()}},
'رقصنده‌ی خیابون':{c:'#ffd1e8',b:2,h:26,w:7,hr:8,hat:12,e:4,dance:1,ac:d=>{mat('#ff7eb6',1.0,.4);for(const s of[-1,1]){pu();tr(s*(d.w+3),d.ll+d.h*.5,0);rz(s*.5);dCyl(.6,d.h*.7,'cyl');po()}}},
'تماشاچی':{c:'#c9b6ff',b:1,h:20,w:10,hr:8.5,hat:11,hcl:'#ffb347',e:0,ac:d=>{mat('#7be3ff',1.6,.5);pu();tr(d.w+4,d.ll+d.h*.55,6);rx(.5);dCyl(.9,14,'cyl');po();L3.push([0,d.w+4,d.ll+d.h*.7,10,60,[.4,.9,1],.8])}},
'فال‌گیر':{c:'#b58cff',b:2,h:30,w:9,hr:8.4,hat:9,hcl:'#5a2f8a',e:3,ac:d=>{mat('#7be3ff',1.2,.9);pu();tr(0,d.hy+d.hr*.85,d.hr*.9);dGem(2.4,3,'gm4');po();mat('#8a9bd8',.9,.9);pu();tr(d.w+8,d.ll+d.h*.52+Math.sin(d.t*2)*1.5,8);dSph(5,5,5);po();mat('#5a2f8a',0,.4);pu();tr(d.w+8,d.ll+d.h*.52-6,8);dCyl(3,3,'cy');po();L3.push([0,d.w+8,d.ll+d.h*.52+4,8,80,[.55,.65,1],1])}},
'شاگردِ ستاره‌شناس':{c:'#d7c4ff',b:0,h:19,w:7.5,hr:8.2,hat:2,hcl:'#3a2f8a',e:0,ac:d=>{mat('#2a3a8a',0,.3,3,1/16);pu();tr(d.w+3,d.ll+d.h*.35,7);rx(-.5);bxAt(0,0,0,9,1.8,11);po();mat('#f2e6d0',.2);pu();tr(d.w+3,d.ll+d.h*.35+1,7);rx(-.5);bxAt(0,0,0,8,.6,10);po()}},
'مسافرِ خسته':{c:'#cfd8ff',b:2,h:23,w:9,hr:8.2,hat:10,hcl:'#6a7488',e:4,lean:.08,ac:d=>{mat('#5a4a3a',0,.3,3,1/16);bxAt(0,d.ll+2,-d.w-5,d.w*1.8,d.h*.9,9);mat('#a8845a',0,.3);bxAt(0,d.ll+d.h*.6,-d.w-10,d.w*1.5,5,2);mat('#6a4a2a',0,.3,2,1/20,1);pu();tr(-d.w-7,0,6);dCyl(1.1,32,'cyl');po()}},
'معدن‌چیِ شمع‌به‌دست':{c:'#ffd36b',b:3,h:24,w:10,hr:8.5,hat:14,hcl:'#d9a23a',e:0,ac:d=>{mat('#6a4a2a',0,.3,2,1/20,1);pu();tr(d.w+7,d.ll+d.h*.1,6);rz(-.3);dCyl(1,26,'cyl');mat('#8a9098',0,.7,1,1/20);pu();tr(0,26,0);bxAt(0,0,0,12,2.2,2.2);po();po();mat('#f1e2b8',0,.3);pu();tr(-d.w-6,d.ll+d.h*.35,6);dCyl(2.2,7,'cy');mat('#ffb347',1.8,.2);tr(0,8,0);dSph(1.8,3.3,1.8,'spl');po();L3.push([0,-d.w-6,d.ll+d.h*.35+11,6,120,[1,.65,.28],1.3])}},
'تکنسینِ شب‌کار':{c:'#9a8cff',b:3,h:25,w:9,hr:8.4,hat:12,e:1,ac:d=>{mat('#e8eaf2',.05,.4,3,1/16);bxAt(0,d.ll+2,0,d.w*2.25,d.h*.78,d.w*1.85);mat('#3a3f50',0,.5);bxAt(0,d.ll+d.h*.35,d.w*.95,d.w*2.3,2,.8);mat('#ffe9a0',1.5,.4);pu();tr(d.w+4,d.ll+d.h*.5,8);rx(Math.PI/2);dCyl(1.6,6,'cy');po()}},
'ذوب‌کار':{c:'#ffae6b',b:1,h:21,w:12,hr:8.8,hat:5,hcl:'#8a929c',e:0,ac:d=>{mat('#3a3a42',0,.5);bxAt(0,d.ll+d.h*.35,d.w*1.0,d.w*1.8,d.h*.55,1.4);mat('#5a5f6a',0,.7);pu();tr(0,d.hy+d.hr*.55,d.hr*.9);bxAt(0,0,0,d.hr*1.5,d.hr*.9,1.2);po();mat('#ff6a3d',1.7,.3);pu();tr(-d.w-6,d.ll+d.h*.4,8);rx(.9);bxAt(0,0,0,3,3,10);po();mat('#8a9098',0,.7);pu();tr(-d.w-6,d.ll+d.h*.4,2);rx(.9);bxAt(0,0,0,1,1,14);po();L3.push([0,-d.w-6,d.ll+d.h*.45,8,90,[1,.45,.2],1.1])}},
'سیم‌کش':{c:'#e8c27b',b:3,h:25,w:9.5,hr:8.4,hat:15,hcl:'#6a4a2a',e:0,ac:d=>{mat('#d98a3a',.15,.8,-1);pu();tr(-d.w-3,d.ll+d.h*.8,0);rz(Math.PI/2);for(let k=0;k<4;k++){pu();tr(0,k*3.4-5,0);dTor(7.5,'tor2',.6);po()}po();mat('#3a3f48',0,.5);bxAt(0,d.ll+d.h*.5,0,d.w*2.05,2.4,d.w*1.75)}},
'تپش‌نواز':{c:'#6bd1ff',b:1,h:21,w:11,hr:8.6,hat:12,e:4,drum:1,ac:d=>{mat('#8a4a2a',0,.3,2,1/20,1);pu();tr(0,d.ll+d.h*.2,d.w+9);dCyl(10,10,'cy');mat('#f1e2b8',.15,.3);tr(0,10,0);dCyl(9.4,.8,'cy');po();mat('#f1e2b8',0,.3);for(const s of[-1,1]){pu();tr(s*(d.w+3),d.ll+d.h*.7,2);rx(-.9+Math.abs(Math.sin(d.t*7+s*1.7))*.7);rz(s*.1);mat('#f1e2b8');dCyl(.8,11,'cyl');po()}}},
'مسافرِ عطشان':{c:'#b8e6ff',b:2,h:23,w:9,hr:8.3,hat:9,hcl:'#a8946a',e:4,lean:.18,ac:d=>{mat('#6a5a3a',0,.3,3,1/16);pu();tr(d.w+4,d.ll+d.h*.3,6);dCyl(3,7,'cy');po();mat('#a8946a',0,.2);bxAt(0,d.ll+d.h*.4,-d.w-3,d.w*1.2,6,2);mat('#7be3ff',1.4,.5);pu();tr(d.hr*.9,d.hy+Math.sin(d.t*2.2)*2+4,d.hr*.4);dSph(1.4,2.2,1.4,'spl');po()}},
'گارسونِ دیود':{c:'#9be07a',b:4,h:26,w:8,hr:8.2,hat:0,e:0,ac:d=>{mat('#222a22',0,.4);pu();tr(0,d.hy+d.hr*.1,0);dHem(d.hr*1.04,d.hr*.55,d.hr*1.04);po();mat('#1a1a22',0,.6);bxAt(0,d.ll+d.h*.04,d.w*1.35,d.w*2.2,1.8,1.4);mat('#bfc7d6',.1,.8);pu();tr(d.w+7,d.ll+d.h*.55,6);dCyl(10,1,'cy');pu();tr(0,1,0);mat('#e8e0d0');dCyl(2.6,4,'c7');po();po();mat('#ff4d6d',.4,.4);pu();tr(0,d.ll+d.h*.88,d.w*.85);dSph(2.8,1.8,1.4,'spl');po()}},
'مهندسِ آماتور':{c:'#c4f09a',b:0,h:21,w:8,hr:8.4,hat:5,hcl:'#e0b030',e:3,ac:d=>{mat('#9aa0aa',0,.8);pu();tr(d.w+7,d.ll+d.h*.45,6);rz(-.4);dCyl(1,15,'cyl');tr(0,15,0);bxAt(0,0,0,5,2.2,2);po();mat('#d9a23a',.1,.4);bxAt(0,d.ll+d.h*.42,d.w*.82,d.w*1.5,2,1.2)}},
'تکنسینِ نگران':{c:'#d9f2b3',b:3,h:23,w:8.5,hr:8.3,hat:0,e:3,arms:[-2.4,-2.4],ac:d=>{mat('#2a2a30',0,.3);pu();tr(0,d.hy+d.hr*.2,-d.hr*.1);dHem(d.hr*1.04,d.hr*.7,d.hr*1.04);po();mat('#7be3ff',.9,.5);pu();tr(d.hr*.9,d.hy-d.hr*.1-((d.t*18)%10),d.hr*.5);dSph(1.2,1.8,1.2,'spl');po();mat('#c93a2a',0,.4);pu();tr(d.w+6,0,5);bxAt(0,0,0,9,6,5);po()}},
'سایه‌ی ترسو':{c:'#5a3a8a',b:2,h:28,w:9,hr:8.4,lg:0,fl:5,ghost:1,hc:'#6a4aa0',e:2,ac:d=>{mat('#c36bff',1.3,.4);for(const s of[-1,1]){pu();tr(s*d.hr*.4,d.hy+d.hr*.05,d.hr*.9);dSph(2,2.6,1.2,'spl');po()}L3.push([0,0,d.hy,6,70,[.75,.4,1],.7])}},
'سایه‌ی مهربون':{c:'#7a52b0',b:2,h:30,w:9.5,hr:8.8,lg:0,fl:6,ghost:1,hc:'#8a62c0',e:2,ac:d=>{mat('#ffd9a0',1.3,.4);for(const s of[-1,1]){pu();tr(s*d.hr*.4,d.hy+d.hr*.05,d.hr*.9);dSph(2,2.6,1.2,'spl');po()}L3.push([0,0,d.hy,6,70,[1,.8,.6],.7])}},
'صاحبِ کافه':{c:'#ffb86b',b:1,h:22,w:10,hr:8.5,hat:6,e:0,ac:d=>CH['کافه‌چیِ مهربون'].ac(d)},
'فروشنده':{c:'#ffd36b',b:0,h:23,w:8.5,hr:8.4,hat:15,hcl:'#c93a2a',e:0,ac:d=>{mat('#ffd36b',.7,.8);pu();tr(d.w+4,d.ll+d.h*.5,7);rx(Math.PI/2);dCyl(2.6,1,'cy');po()}},
'مشتریِ آروم':{c:'#8fd3ff',b:1,h:19,w:9,hr:8.2,hat:11,hcl:'#3a6ea5',e:4,ac:d=>{mat('#f2e6d0',.1,.4);pu();tr(d.w+4,d.ll+d.h*.5,6);dCyl(2.3,3.6,'c7');po()}},
'مشتریِ قدیمی':{c:'#d9c8a0',b:2,h:22,w:8.5,hr:8,hat:15,hcl:'#4a3a2a',e:3,ac:d=>{mat('#f2e6d0',.1,.4);pu();tr(-d.w-4,d.ll+d.h*.5,6);dCyl(2.3,3.6,'c7');po()}}};
/* نورهای چراغ‌دستی‌ها: [شناسه،dx،y،dz،شعاع،رنگ،شدت] در فضای محلی؛ پس از رسم به لیست نور اضافه می‌شود */
let L3=[],CHX=0,CHZ=0,CHF=0;
function chrLights(x,z,face){const s=Math.sin(face),c=Math.cos(face);if(!GHOSTP)for(const q of L3)LNXa.push({x:x+q[1]*c+q[3]*s+RO[0],y:q[2],z:z-q[1]*s+q[3]*c+RO[1],r:q[4],cr:q[5][0]*q[6],cg:q[5][1]*q[6],cb:q[5][2]*q[6],pri:0});L3.length=0}
const NPCS=[
 {c:'#e8a23c',b:1,w:12,h:25,hr:9,hat:1,hcl:'#7a3b13',e:3,bands:[[.3,'#7a3b13'],[.5,'#e8c040'],[.7,'#1a1a1a']],ac:d=>{mat('#3a2418',0,.3);pu();tr(0,d.hy-d.hr*.45,d.hr*.82);dSph(d.hr*.75,d.hr*.14,d.hr*.14,'spl');po();mat('#aab0ba',0,.85);for(const s of[-1,1]){pu();tr(s*d.w*.6,d.ll+d.h+2,0);dCyl(.6,6,'cyl');po();pu();tr(s*d.w*.5,0,0);dCyl(.6,d.ll+1,'cyl');po()}}},
 {c:'#3a6ea5',b:3,w:9,h:21,hr:9.6,lg:0,e:0,tex:1,ac:d=>{mat('#aab3c4',0,.85);for(const s of[-1,1]){pu();tr(s*3.5,0,0);dCyl(.7,6,'cyl');po()}bxAt(0,d.h+d.ll-.2,0,d.w*2.05,1.4,d.w*1.75);mat('#e8ecf2',1.4,.4);bxAt(-4,d.ll+d.h*.55,d.w*.86,5,1.2,.6);bxAt(-4,d.ll+d.h*.55,d.w*.86,1.2,5,.6);bxAt(4,d.ll+d.h*.55,d.w*.86,5,1.2,.6);mat('#d8e4f8',.3,.5);bxAt(d.w*.7,d.ll+3,d.w*.8,2.4,d.h*.75,.8);mat('#1b2a4a',0,.4);bxAt(-d.w*.7,d.ll+3,d.w*.8,2.4,d.h*.75,.8)}},
 {c:'#ff4fa0',b:0,w:7,h:32,hr:8.4,hat:3,e:1,run:1,ac:d=>{mat('#4dd0ff',1.5,.4);for(const q of[.8,.5]){pu();tr(0,d.ll+d.h*q,d.w*.92);rz(.7);bxAt(0,0,0,13,1.4,.6);po();pu();tr(0,d.ll+d.h*q,d.w*.92);rz(-.7);bxAt(0,0,0,13,1.4,.6);po()}L3.push([0,0,d.hy,8,90,[1,.4,.7],.8])}},
 {c:'#4a3a8a',b:2,w:11,h:27,hr:8.6,hat:2,hcl:'#2a1f5a',e:3,ac:d=>{mat('#c9a227',.2,.8);pu();tr(d.w+8,0,5);dCyl(1.2,38,'cyl');po();mat('#7be3ff',1.5,.7);pu();tr(d.w+8,40,5);dGem(3.8,5.4,'gm4');po();L3.push([0,d.w+8,42,5,110,[.45,.85,1],1.3]);mat('#f2e6d0',.1,.3);bxAt(0,d.ll+d.h*.7,d.w*1.2,d.w*.5,d.h*.28,.7)}},
 {c:'#f1e2b8',b:0,w:9,h:25,hr:8.8,hat:0,lg:0,e:4,ac:d=>{mat('#8a4a6a',0,.3,3,1/16);pu();tr(0,d.ll+d.h*.62,0);dCon(d.w*1.7,d.h*.4,'cn');po();mat('#ffb347',1.7,.2);pu();tr(0,d.hy+d.hr*.9+Math.sin(d.t*8)*.5,0);dSph(3.2+Math.sin(d.t*9)*.3,6.5,3.2,'spl');po();mat('#ffe9a0',1.5);pu();tr(0,d.hy+d.hr*.9-1,0);dSph(1.6,3.2,1.6,'spl');po();L3.push([0,0,d.hy+d.hr+6,0,170,[1,.7,.32],1.5])}},
 {c:'#b0562f',b:1,w:13,h:21,hr:8.8,hat:4,hcl:'#6a2f18',e:0,ac:d=>{mat('#f1e2b8',.1,.3);pu();tr(0,d.ll+d.h*.35,0);dTor(d.w*1.32,'tor',.75);po();for(const s of[-1,1]){pu();tr(s*(d.w+4),d.ll+d.h*.75,3);rx(-.9+Math.abs(Math.sin(d.t*8+s))*.7);mat('#f1e2b8');dCyl(.8,12,'cyl');po()}}},
 {c:'#4a7a3a',b:3,w:10,h:25,hr:8.8,hat:5,hcl:'#4a5a6a',e:3,ac:d=>{mat('#5a4a3a',0,.3,1,1/24);bxAt(0,d.ll+2,-d.w-3,d.w*1.5,d.h*.8,5);mat('#9aa0aa',0,.8);pu();tr(d.w+8,d.ll+d.h*.2,6);rz(-.35);dCyl(1.2,18,'cyl');tr(0,18,0);bxAt(0,0,0,6,2.4,2);po()}}];
const KING={c:'#241a3c',b:2,w:15,h:32,hr:11,hat:13,lg:0,fl:7,e:2,hc:'#2a1a48',ac:d=>{mat('#ff4d6d',1.6,.4);for(const s of[-1,1]){pu();tr(s*d.hr*.42,d.hy+d.hr*.02,d.hr*.95);dSph(2.6,3.2,1.6,'spl');po()}mat('#3a2860',0,.3,3,1/16);for(let k=0;k<5;k++){const a=k/5*TAU+d.t;pu();tr(Math.cos(a)*d.w*1.45,3+Math.sin(d.t*2+k)*2,Math.sin(a)*d.w*1.45);dSph(3.5,6,3.5,'spl');po()}L3.push([0,0,d.hy,10,150,[.8,.35,1],1.2])}};
const GENERIC=(nm,cl)=>{const h=hs3(nm);return{c:cl,b:h%4,hat:(h>>2)%6?(h>>2)%6:0,e:(h>>5)%5,h:20+(h>>8)%10,w:8+(h>>11)%4,s:h%7,hcl:['#c9a227','#4a3a8a','#5a8a6a','#8a3a4a'][(h>>14)%4]}};
function folkSpec(f){let o=CH[f.nm];if(!o){o=GENERIC(f.nm,f.cl);CH[f.nm]=o}o.s=hs3(f.nm)%7;return o}

/* ===================== اشیا، حشره‌ها، باس‌ها و تجهیزاتِ مدار ===================== */
const ICO3={'🍵':1,'🪫':1,'🔋':1,'🥤':1,'🧯':1,'🧪':1,'🥁':1,'🕯️':1};
function ico3(x,z,e,t,sc_){const bob=Math.sin(t*3+x*.1)*2.2,y=15+bob;sc_=sc_||1;
 spr(x,3,z,17*sc_,1,.85,.45,.5,2);spr(x,y+3,z,26*sc_,1,.85,.45,.45,0);
 pu();tr(x,y,z);sc(sc_);ry(t*1.1);
 const M=(c,em,sp_)=>mat(c,em||0,sp_===undefined?.6:sp_,-1);
 switch(e){
  case'⚡':M('#bfe9ff',1.4,.8);pu();rz(.3);bxAt(1.5,0,0,5,8,3);pu();tr(-2,-5,0);rz(-.5);bxAt(0,-5,0,5,9,3);po();po();dGem(1,1,'gm4');break;
  case'🍵':M('#e8e0d0',.1,.5);pu();tr(0,-6,0);dCyl(5,6,'c7');M('#4a2a1a',.1);pu();tr(0,6,0);dCyl(4.2,.4,'cy');po();M('#e8e0d0',.1,.5);pu();tr(5.4,3,0);rx(Math.PI/2);dTor(2.6,'tor3',1);po();dCyl(6.4,1,'cy');po();break;
  case'📒':M('#c0672f',.1);bxAt(0,-8,0,11,16,4);M('#f2e6d0',.1);bxAt(1,-7,0,9.5,14,3.4);M('#8a3a1a');bxAt(-5,-8,0,1.6,16,4.2);break;
  case'🔩':case'⚙️':case'🔧':case'⛏️':{const c=e=='🔩'?'#c9a227':e=='⚙️'?'#9aa0aa':e=='🔧'?'#a9afb8':'#9a9aa2';M(c,.05,.85);
   if(e=='🔩'){pu();tr(0,-5,0);dCyl(5,3.5,'cy6');tr(0,3.5,0);dCyl(2.2,9,'cy');po()}
   else if(e=='⚙️'){pu();rx(Math.PI/2);tr(0,-1.5,0);dCyl(7,3,'cy');for(let k=0;k<10;k++){pu();ry(k/10*TAU);tr(7.4,0,0);bxAt(0,0,0,3.2,3,3);po()}M('#101216');tr(0,3.1,0);dCyl(2.3,.4,'cy');po()}
   else if(e=='🔧'){pu();rz(.7);bxAt(0,-9,0,3.2,18,2.6);pu();tr(0,9,0);M(c,.05,.85);dTor(4,'tor2',1);po();po()}
   else{M('#6a4a2a',0,.3,2);pu();rz(-.6);bxAt(0,-9,0,2.4,18,2.4);M(c,.05,.85);pu();tr(0,9,0);bxAt(0,0,0,16,3,3);po();po()}break}
  case'🪫':M('#5a5a64',.05,.7);pu();tr(0,-8,0);dCyl(4.5,13,'cy');M('#9aa0aa',0,.85);tr(0,13,0);dCyl(1.8,2.4,'cy');po();M('#c9302a',.5);bxAt(0,-4,4.6,6,2,.4);break;
  case'🔋':M('#2f9a46',.7,.7);pu();tr(0,-8,0);dCyl(4.5,13,'cy');M('#9aa0aa',0,.85);tr(0,13,0);dCyl(1.8,2.4,'cy');po();M('#d8ffe0',1.2);bxAt(0,-4,4.6,2,7,.4);break;
  case'💡':M('#ffe27a',1.3,.5);pu();tr(0,2,0);dSph(6,6.5,6);po();M('#9aa0aa',0,.8);pu();tr(0,-9,0);dCyl(3,5,'cy');po();break;
  case'🌿':M('#bfe0c4',.5,.9);pu();rz(.5);dSph(3.2,9,1.2,'spl');po();M('#5fae6a',.4);pu();rz(-.6);tr(2,0,0);dSph(2.6,7,1,'spl');po();break;
  case'🪵':M('#8a5a35',0,.3,2);pu();rz(Math.PI/2);tr(0,-8,0);dCyl(4.5,16,'cy');M('#c9a070');tr(0,16,0);dCyl(3.4,.3,'cy');po();break;
  case'🥤':M('#ff5f8a',.3,.6);pu();tr(0,-8,0);dCyl(4,13,'c7',5.4);M('#ffe9f0',.2);tr(0,13,0);dCyl(5.6,1,'cy');M('#7be3ff',.8);pu();tr(1.5,0,0);rz(-.15);dCyl(.7,8,'cyl');po();po();break;
  case'🎧':M('#2a2a35',0,.6);pu();rx(Math.PI/2);dTor(8,'tor',1);po();M('#4dd0ff',.9,.5);for(const s of[-1,1]){pu();tr(s*8,-1,0);dCyl(3.6,4,'cy');po()}break;
  case'💿':M('#b8c8ff',.3,.95);pu();rx(.5);dCyl(9,1.2,'cy');M('#10141c');tr(0,1.25,0);dCyl(2,.2,'cy');po();break;
  case'🎤':M('#8a8a92',0,.8);pu();tr(0,-9,0);dCyl(1.8,11,'c7');po();M('#c0c4cc',.1,.7);pu();tr(0,4,0);dSph(4.4,4.4,4.4);po();break;
  case'🔮':M('#8a5cff',1,.9);pu();tr(0,1,0);dSph(7,7,7);po();M('#3a2a5a',0,.4);pu();tr(0,-9,0);dCyl(5,3,'c5');po();break;
  case'📜':M('#e8d8a8',.1,.2);pu();rz(Math.PI/2);tr(0,-8,0);dCyl(3.4,16,'cy');po();M('#c9a070');for(const s of[-1,1]){pu();tr(s*8.4,0,0);rz(Math.PI/2);dCyl(1.6,1,'cy');po()}break;
  case'🪞':M('#9ad8ff',.5,.95);pu();rx(.4);dCyl(7,1.2,'cy');M('#c9a227',0,.8);dTor(7,'tor3',1);po();M('#c9a227',0,.8);pu();tr(0,-12,0);dCyl(1,7,'cyl');po();break;
  case'🧿':M('#2f6fd0',.7,.8);pu();dSph(7,7,7);po();M('#ffffff',.5);pu();tr(0,0,4.8);dSph(4.4,4.4,2,'spl');po();M('#1a2a6a',.3);pu();tr(0,0,6);dSph(2.6,2.6,1.2,'spl');po();M('#050508');pu();tr(0,0,6.8);dSph(1.2,1.2,.6,'spl');po();break;
  case'🕯️':M('#f4e6c0',.2,.3);pu();tr(0,-8,0);dCyl(3,14,'cy');po();M('#ffb347',1.8,.2);pu();tr(0,8,0);dSph(2.2,4.4,2.2,'spl');po();break;
  case'💎':M('#6fe0ff',1.0,.95);dGem(7,11,'gm4');break;
  case'🧯':M('#d6402f',.15,.6);pu();tr(0,-8,0);dCyl(4.2,14,'c7');M('#222');tr(0,14,0);dCyl(1.5,3,'cy');po();M('#222');bxAt(3,2,0,5,1.4,1.4);break;
  case'🥁':M('#b0562f',.1,.4,2);pu();tr(0,-7,0);dCyl(6.5,10,'cy');M('#f1e2b8',.2);tr(0,10,0);dCyl(6,.6,'cy');po();M('#f1e2b8');pu();tr(2,6,-2);rx(.6);dCyl(.7,10,'cyl');po();break;
  case'🧭':M('#c8a85a',.1,.85);pu();rx(.35);dCyl(7.5,2,'cy');M('#10141c');tr(0,2.05,0);dCyl(6.2,.2,'cy');M('#ff4d6d',.8);rz(0);bxAt(0,.2,0,1,.3,10);po();break;
  case'🧪':M('#7be39a',1,.9);pu();tr(0,-4,0);dSph(6,6,6);po();M('#cfe6ff',.1,.8);pu();tr(0,1,0);dCyl(2.4,9,'cy');po();M('#a8845a');pu();tr(0,10,0);dCyl(2.8,2,'cy');po();break;
  case'📯':M('#d8a640',.2,.9);pu();rz(-Math.PI/2);tr(0,-10,0);dCon(8,22,'cn');po();M('#a07820');pu();tr(-10,0,0);dSph(2,2,2,'spl');po();break;
  case'🔌':M('#3a3a44',0,.5);pu();rx(Math.PI/2);dTor(6,'tor',1);po();M('#9aa0aa',0,.85);bxAt(7,-3,0,4,6,3);bxAt(8,-1.8,-1,2.4,1.2,.8);bxAt(8,-1.8,1,2.4,1.2,.8);break;
  case'💾':M('#3a5aa0',.1,.5);bxAt(0,-8,0,14,16,2);M('#d8d8e0');bxAt(0,-7,1.1,10,6,.4);M('#9aa0aa',0,.8);bxAt(1,-1.5,1.1,6,5,.4);break;
  case'🛠️':M('#c0402f',.1,.5);bxAt(0,-6,0,16,10,8);M('#3a3f48',0,.6);pu();tr(0,4.3,0);rx(Math.PI/2);dTor(4,'tor3',1);po();break;
  case'📯':break;
  case'⭐':M('#ffd23f',1.5,.8);pu();ry(t*.6);dGem(8,9,'gm5');po();break;
  default:M('#ffd36b',1,.7);dSph(6,6,6)}
 po()}
/* ===== حشره‌ها ===== */
function bugM(b,t,ang){const gd=b.k=='z',sd=b.k=='s',ch=b.k=='y',rr=gd?13:sd?10:9,hurt=now<(b.hurt|0),col=hurt?'#ffffff':b.fz?'#5d7f8c':gd?'#5a1624':sd?'#16384a':ch?'#4a1230':'#2a1c44',ec=gd?'#ffd36b':sd?'#9ff':'#ff4d6d';
 const sc3=(b.x+b.y)*.1;pu();tr(b.x,0,b.y);ry(ang);const bob=Math.abs(Math.sin(t*10+sc3))*1.5;
 mat('#5a3a78',0,.3);for(let k=-1;k<=1;k++)for(const s of[-1,1]){const ph=Math.sin(t*14+k*2+s*(b.fz?0:1)),ly=3.5;pu();tr(s*rr*.7,ly,k*rr*.55);rz(-s*(1.05+ph*.18*(b.fz?0:1)));rx(k*.25+ph*.2*(b.fz?0:1));dCyl(.9,rr*1.1,'cyl');pu();tr(0,rr*1.1,0);rz(s*1.5);dCyl(.8,rr*.7,'cyl');po();po()}
 mat(col,gd||sd?.18:.1,.55,3,1/16,.5);pu();tr(0,6+bob,0);dSph(rr*.95,rr*.72,rr*1.2);po();mat(hurt?'#fff':gd?'#7a1a30':'#3a2860',.1,.6,3,1/16,.5);pu();tr(0,7+bob,rr*1.0);dSph(rr*.6,rr*.5,rr*.55);po();
 mat(ec,1.6,.4);for(const s of[-1,1]){pu();tr(s*rr*.3,8.5+bob,rr*1.36);dSph(2.1,2.4,1.6,'spl');po()}
 if(gd){mat('#ff4d6d',.9,.5);for(const k of[-1,0,1]){pu();tr(k*4,12+bob+(k?0:3),rr*.2);dCon(1.8,6,'cn4');po()}}
 if(sd){mat('#4dd0ff',1.3,.5);pu();tr(0,12+bob,0);rx(Math.PI/2);dTor(rr*1.15+Math.sin(t*5)*.8,'tor3',1);po()}
 if(ch){mat('#ff2e8a',.9,.5);for(const s of[-1,1]){pu();tr(s*rr*.5,12+bob,0);rz(-s*.5);dCon(1.4,6,'cn4');po()}}
 po();shw(b.x,b.y,13,.45);addL(b.x,9,b.y,gd||sd?55:42,gd?1:sd?.3:.75,gd?.3:sd?.9:.3,gd?.4:sd?1:1,.6);
 if(b.hp){for(let k=0;k<b.hp;k++){mat('#ff6b8a',1,.3);pu();tr(b.x-8+k*8,24,b.y);dSph(2,2,2,'spl');po()}}}
/* ===== مینی‌باس ===== */
function mbM(b,p,t){const h=now<(b.hurt|0),col=h?'#ffffff':p[2],ac=hx(p[2]);pu();tr(b.x,0,b.y);
 if(b.k=='c'){mat(col,.7,.95,-1);pu();tr(0,26,0);ry(t*1.1);dGem(22,50,'gm6');po();for(const s of[-1,1]){pu();tr(s*(30-Math.sin(t*2)*4),20+Math.sin(t*3+s)*5,0);ry(s*t*2);dGem(9,22,'gm4');po()}mat('#14101e',0,.5);pu();tr(0,32,0);dSph(7,7,7);po();mat('#ff4d6d',1.6);pu();tr(0,32,6.2);dSph(2.6,2.6,1.5,'spl');po()}
 else if(b.k=='d'){mat(h?'#fff':'#5a3220',.1,.4,2,1/20,1);dCyl(26,34,'cy');mat(h?'#fff':'#e8d6a8',.25,.3);pu();tr(0,34,0);dCyl(24,1.6,'cy');po();mat('#ffd36b',1.1+Math.sin(t*8)*.3,.4);pu();tr(0,35.8,0);dCyl(11+Math.sin(t*8)*2,.6,'cy');po();mat(col,.9,.5);pu();tr(0,17,0);dTor(26.5,'tor2',.55);po();mat('#f1e2b8',.2,.4);for(const s of[-1,1]){pu();tr(s*34,40+Math.sin(t*9+s)*6,0);rz(s*.9);dCyl(2,22,'cyl');po()}}
 else{mat(h?'#fff':'#2a3a1c',.1,.5,3,1/16,.5);pu();tr(0,16,0);dSph(22,17,22);tr(0,14,12);dSph(14,12,13);po();mat('#7aa64a',.2,.4);for(let k=-2;k<=2;k++)for(const s of[-1,1]){pu();tr(s*14,10,k*8);rz(-s*(1.1+Math.sin(t*9+k)*.2));dCyl(2.2,26,'cyl');po()}mat('#ff4d6d',1.6);for(const s of[-1,1]){pu();tr(s*5.6,34,20);dSph(3.4,3.4,2,'spl');po()}}
 po();shw(b.x,b.y,34,.5);addL(b.x,30,b.y,150,ac[0],ac[1],ac[2],.9)}
/* ===== شاه (باسِ نهایی) و ساکنِ اتاق ===== */
function npcM(n,face,t){const i=R.i;if(R.boss){const bs=R.boss;pu();if(bs.dead)setMP('alpha',.5);const hu=now<bs.hurt,sp_=hu?{...KING,c:'#ffffff',hc:'#ffffff'}:KING;chr3(n.px,n.py,sp_,face,t,{});setMP('alpha',1);po();shw(n.px,n.py,24,.5);return}
 const o=NPCS[i];if(!o)return;chr3(n.px,n.py+Math.sin(now/400+n.x)*0,o,face,t,{run:i==2&&R.i==2&&S.ns>=1&&S.ns<=3,arms:o.arms});shw(n.px,n.py,15,.5)}
/* ===== تجهیزات ===== */
function srcM(o,t){const on=o.on;pu();tr(o.px,0,o.py);shw(0,0,18,.5);mat('#2b2733',0,.4,1,1/36,.9);bxAt(0,0,0,24,30,18);mat('#3d3649',0,.5,1,1/36);bxAt(0,30,0,25,4,19);mat(on?'#ffb347':'#4a3a2c',on?1.5:0,.5);bxAt(0,8,9.1,15,15,1);mat('#14101a',0,.4);for(const s of[-1,1]){pu();tr(s*6,34,0);dCyl(2.6,5,'cy');po()}mat('#aab0ba',0,.8);bxAt(-6,39,0,3,1.5,3);bxAt(6,39,0,3,1.5,3);if(on){spr(o.px,16,o.py+10,34,1,.65,.2,.7+Math.sin(t*4)*.15)}po();
 if(on)addL(o.px,18,o.py+14,120,1,.6,.25,1.1)}
function rlM(o,t){const A=pwA(),B=pwB(),st=R.rst;pu();tr(o.px,0,o.py);shw(0,0,16,.5);mat('#2b2733',0,.4,1,1/36,.9);bxAt(0,0,0,26,26,22);mat('#3d3649',0,.5);bxAt(0,26,0,27,4,23);mat('#aab0ba',0,.85);pu();tr(0,26,0);dCyl(3,3,'cy');po();mat('#ffb347',.5,.7);pu();tr(0,32,0);rz(st?-.8:.8);dCyl(1.6,12,'cy');tr(0,12,0);mat('#ff9d2e',1.2);dSph(3.4,3.4,3.4,'spl');po();
 for(const[xx,on]of[[-7,A],[7,B]]){mat(on?'#ffd36b':'#3a3025',on?1.7:0,.6);pu();tr(xx,17,11.3);dSph(2.6,2.6,1.2,'spl');po();if(on)spr(o.px+xx,17,o.py+12,16,1,.8,.3,.5)}po()}
function tlM(o,t){const on=pwA(),pl=R.pl?Math.max(0,R.pl(o.px,o.py)):on?1:0,fl=on?1:(Math.sin(now/90+o.x*3)>.93?.5:0),k=Math.max(pl,fl*.4);pu();tr(o.px,0,o.py);shw(0,0,10,.5);mat('#31494b',0,.5,1,1/30,.6);dCyl(5,5);dCyl(2.1,44,'c7');mat('#2a3d3f',0,.5);bxAt(0,44,0,9,2,9);mat(k>.1?'#ffc070':'#2f2a24',k>.1?1.2*k:0,.4);pu();tr(0,50,0);dSph(7.5,8.5,7.5);po();mat('#3a4b4d',0,.6);pu();tr(0,55,0);dCon(8,5,'cn');po();mat('#3a4b4d',0,.6);pu();tr(0,47.5,0);dTor(7.4,'tor3',1);po();
 if(k>.05)spr(o.px,52,o.py,50*k+8,1,.75,.35,.55*k);po();if(k>.02)addL(o.px,52,o.py,215,1,.72,.38,1.7*k)}
function lampI(o,t){const on=o.on;pu();tr(o.px,0,o.py);shw(0,0,10,.5);mat('#31494b',0,.5,1,1/30,.6);dCyl(4,4);dCyl(1.9,22,'c7');mat('#2a3d3f',0,.5);bxAt(0,22,0,5,1.5,5);mat(on?'#ffb347':'#3b3a35',on?1.0:0,.5);pu();tr(0,29,0);dSph(8,8,8);po();mat('#3a4b4d',0,.6);pu();tr(0,29,0);dTor(8.2,'tor3',1);po();if(on){spr(o.px,29,o.py,46,1,.62,.2,.65);addL(o.px,30,o.py,170,1,.62,.25,1.4)}po()}
function crysI(o,t){const on=o.on;pu();tr(o.px,0,o.py);shw(0,0,12,.5);mat('#2b3a46',0,.4,0,1/30,1);dCyl(10,4,'c7');mat(on?'#7be3ff':'#2b4a56',on?1.6:0,.95,-1);pu();tr(0,6,0);ry(t*(on?1.2:.2));dGem(10,24,'gm4');po();mat(on?'#cfffff':'#3a5a66',on?1.2:0,.9);pu();tr(0,6,0);dGem(5,12,'gm4');po();if(on){spr(o.px,22,o.py,48,.3,.75,1,.6);addL(o.px,22,o.py,160,.35,.75,1,1.4)}po()}
function btnI(o,ac,t){const on=val(o),X=o.x*T+16,Z=o.y*T+16;pu();tr(X,0,Z);mat('#0b1214',0,.5,1,1/30,.6);bxAt(0,0,0,26,2.2,26);mat(ac,-.9,.5);bxAt(0,2.2,0,26,.8,2.2);bxAt(0,2.2,13,2.2,.8,26);bxAt(0,2.2,-13,26,.8,2.2);bxAt(13,2.2,0,2.2,.8,26);bxAt(-13,2.2,0,2.2,.8,26);mat(on?ac:'#10191b',on?1.2:0,.7);bxAt(0,2.2,0,19,on?1:2,19);if(on){addL(X,8,Z,85,ac[0],ac[1],ac[2],.9);spr(X,4,Z,22,ac[0],ac[1],ac[2],.5)}po()}
function padI(o,ac,t){const bl=o.q&&!o.lit&&Math.sin(now/700)>0,on=o.lit||bl,X=o.x*T+16,Z=o.y*T+16;pu();tr(X,0,Z);mat('#0b1214',0,.5,1,1/30,.6);dCyl(13,2,'cy');mat(on?ac:'#16282c',on?1.3:0,.7);pu();tr(0,2,0);dCyl(10,.8,'cy');po();mat(ac,-.9,.5);pu();tr(0,2,0);dTor(12,'tor3',.5);po();if(on){addL(X,8,Z,95,ac[0],ac[1],ac[2],1);spr(X,5,Z,26,ac[0],ac[1],ac[2],.5)}po()}
function rockM(r,hid){const X=r.x*T+16,Z=r.y*T+16;pu();tr(X,0,Z);shw(0,0,16,.55);mat('#3f5052',.02,.25,0,1/32,1.3);pu();tr(0,8,0);dSph(13,10,12,'spl');po();mat('#566a6c',.02,.2,0,1/32,1.3);pu();tr(-5,13,-3);dSph(8,6,8,'spl');po();mat('#2f3e40',.0,.2,0,1/32,1.3);pu();tr(7,5,5);dSph(7,5,6,'spl');po();po()}
function gateM(g,rm,t){const a=g.open?Math.max(0,1-(now-g.t)/700):1;if(a<=0)return;const X=g.x*T+16,Z=5*T+16,p=rm.p||RM[rm.i].p;pu();tr(X,0,Z);setMP('fx',2);setMP('alpha',.55*a);mat('#ff3a42',1.4,.2);bxAt(0,0,0,5,46,30);setMP('fx',0);setMP('alpha',1);mat('#c8262c',1,.5);bxAt(0,0,-17,7,50,5);bxAt(0,0,17,7,50,5);bxAt(0,46,0,7,5,36);po();spr(X,24,Z,70,1,.25,.25,.5*a);addL(X,24,Z,120,1,.25,.25,.7*a)}
function orbM(o){mat('#c36bff',1.6,.5);pu();tr(o.x,10,o.y);dSph(6,6,6,'spl');po();spr(o.x,10,o.y,22,.75,.4,1,.8)}
function boltM(b){mat('#bfe3ff',1.8,.5);const a=Math.atan2(b.vx,b.vy);pu();tr(b.x,12,b.y);ry(a);rx(Math.PI/2);dCyl(1.6,14,'cy');po();spr(b.x,12,b.y,26,.5,.8,1,.9)}
function memM(m,a,t){mat('#fff1b8',1.4,.9,-1);pu();tr(m.px,14+Math.sin(t*3+m.n)*2,m.py);ry(t*1.5);dGem(5,10,'gm4');po();spr(m.px,14,m.py,34,1,.95,.7,a*.7)}
function svM(v,t){pu();tr(v.px,0,v.py);mat('#2b3a46',0,.4,0,1/30,1);dCyl(10,3,'c7');mat('#9fe8ff',1.5,.95,-1);pu();tr(0,10+Math.sin(t*2.3)*2,0);ry(t*1.3);dGem(8,20,'gm6');po();po();spr(v.px,14,v.py,56,.4,.9,1,.65);spr(v.px,2,v.py,26,.4,.9,1,.5,2);addL(v.px,20,v.py,120,.4,.85,1,1.1)}
function towerM(o,t){const on=S.done;pu();tr(o.px,0,o.py);shw(0,0,28,.55);mat('#2b2733',0,.4,1,1/40,1);dCyl(22,10,'c7');mat('#3d3649',0,.4,1,1/40,1);dCyl(16,66,'c7',10);mat('#4a4256',0,.5);for(let k=0;k<4;k++){pu();tr(0,14+k*15,0);dTor(13-k*.6,'tor',1);po()}
 mat('#1a1620',0,.5);pu();tr(0,76,0);dCyl(17,4,'cy');po();mat(on?'#fff1b8':'#2a4a5a',on?2.2:.3,.9);pu();tr(0,92,0);dSph(13,13,13);po();mat('#aab0ba',0,.8);for(let k=0;k<6;k++){const a=k/6*TAU;pu();tr(Math.cos(a)*11,80,Math.sin(a)*11);dCyl(1,24,'cyl');po()}pu();tr(0,106,0);dCon(15,12,'cn');po();
 const k=on?1:(Math.sin(t*3)>.2?.5:.15);spr(o.px,92,o.py,on?190:70,1,.85,.45,.9*k);spr(o.px,92,o.py,on?90:40,1,.95,.8,k);addL(o.px,92,o.py,on?600:240,on?1:.5,on?.85:.8,on?.5:1,on?3:1.4);if(on){for(let k=0;k<5;k++)spr(o.px,92+k*34,o.py,120-k*14,1,.9,.55,.3)}po()}
function evM(e,al){const x=e.px,z=e.py;mat('#e8d8a8',.35,.2);pu();tr(x,.6,z);ry(.4);bxAt(0,0,0,14,.8,10);mat('#6a5a3a');for(let q=0;q<3;q++)bxAt(0,.8,-3+q*3,9-q*2,.2,.7);po();spr(x,4,z,26,1,.9,.6,al*.55)}
/* ===== کابل‌ها (شبکه‌ی جریان) ===== */
function netM(){if(!R.src||!R.net)return;const on={a:pwA(),b:pwB(),f:R.src.on},t=now/1000;
 for(const g of['f','a','b'])for(const pl of R.net[g]){for(let i=1;i<pl.length;i++){const[x0,y0]=pl[i-1],[x1,y1]=pl[i],ax=x0*T+16,az=y0*T+16,bx=x1*T+16,bz=y1*T+16,len=Math.hypot(bx-ax,bz-az);if(len<1)continue;const horiz=Math.abs(bx-ax)>Math.abs(bz-az);
   mat('#2a2216',0,.4);pu();tr((ax+bx)/2,0,(az+bz)/2);bxAt(0,0,0,horiz?len+6:6,1.8,horiz?6:len+6);po();
   if(on[g]){const col=g=='b'?'#7be3ff':'#ffb347';mat(col,1.5,.3);const sg=Math.sign(horiz?bx-ax:bz-az),n=Math.floor(len/26),off=((t*40)%26);for(let k=-1;k<=n;k++){const d=clp(k*26+off,0,len),d2=clp(k*26+off+11,0,len);if(d2-d<1)continue;const m=(d+d2)/2;pu();tr(horiz?ax+sg*m:ax,0,horiz?az:az+sg*m);bxAt(0,1.8,0,horiz?d2-d:2.8,.7,horiz?2.8:d2-d);po()}}}}}
function convM(){const bon=machOK('conv'),t=now/1000;for(const q of R.conv){const X=q.x*T+16,Z=q.y*T+16;pu();tr(X,0,Z);mat('#1c1a16',0,.4,1,1/30,.5);bxAt(0,0,0,30,1.8,30);pu();ry(Math.atan2(q.dx,q.dy));mat(bon?'#ffb347':'#55401f',bon?-.5:0,.4);bxAt(-14,1.8,0,2,.8,30);bxAt(14,1.8,0,2,.8,30);mat('#ffb347',bon?1.3:.12,.3);const off=bon?(t*16)%14:0;for(let k=0;k<3;k++){const z0=-14+k*14+off-7;if(z0<-13||z0>13)continue;for(const s of[-1,1]){pu();tr(s*4.5,1.8,z0);ry(-s*.7);bxAt(0,0,0,9,.8,2.2);po()}}po();po()}}

/* ===================== رسمِ فریم: محیط، نور، اتاق‌ها، HUD ===================== */
const vcx=()=>camX+gW/Z/2,vcy=()=>camY+gH/Z/2;
const RG={},prepQ=[];let lastD=0,GLERR=null;
const PREP={g:null,i:-1,plan:null,rm:null};
function finishRoom(rm,plan,fl){const s=buildSolid(rm,plan);return RG[rm.in?'c'+rm.i:rm.i]={fl,sol:s.solid,lights:s.lights,signs:s.signs,plan,rm0:rm.in?rm.i:RS[rm.i]}}
function ensureRoom(rm){const key=rm.in?'c'+rm.i:rm.i;let g=RG[key];if(g&&(rm.in?g.rm0===rm.i:true))return g;
 if(!rm.in&&PREP.g&&PREP.rm===RS[rm.i]){const fl=runGen(PREP.g);PREP.g=null;return finishRoom(PREP.rm,PREP.plan,fl)}
 const plan=mkPlan(rm);return finishRoom(rm,plan,runGen(floorGenG(rm,plan)))}
/* پیش‌ساختنِ اتاق‌های همسایه در پس‌زمینه: هر فریم فقط یک مرحله */
function prepStep(){if(!PREP.g){while(prepQ.length){const i=prepQ.shift();if(RS[i]&&!RG[i]){PREP.rm=RS[i];PREP.plan=mkPlan(RS[i]);PREP.g=floorGenG(RS[i],PREP.plan);break}}return}
 const r=PREP.g.next();if(r.done){PREP.g=null;if(!RG[PREP.rm.i])finishRoom(PREP.rm,PREP.plan,r.value)}}
function disposeFar(ci){for(const k of Object.keys(RG)){if(k[0]=='c')continue;if(Math.abs(+k-ci)>3){const g=RG[k];GL.deleteTexture(g.fl.a);GL.deleteTexture(g.fl.n);delete RG[k]}}}
function schedulePrep(i){prepQ.length=0;for(const d of[0,1,-1,2,-2,3])if(i+d>=0&&i+d<8&&!RG[i+d])prepQ.push(i+d)}
const s2w=(sx,sy,k)=>{const[x,z]=unproj(sx,sy);return[x-OX[k],z-OY[k]]};
const pj3=(k,x,y,h)=>proj(x+OX[k],h||0,y+OY[k]);
const pwOf=rm=>rm.in?1:rm.i==7?.4:(rm.src&&rm.src.on&&(!rm.relay||!rm.rst))?1:0;
/* محیطِ هر اتاق: تاریکیِ مشترک در همه‌ی مدارها؛ با روشن‌شدنِ باتری از سمت باتری شروع به روشن‌شدن می‌کند */
function roomEnvOf(rm,pf,dn){const p=RM[rm.i].p,ac=hx(p[2]),wl=hx(p[3]),cool=mixc([.42,.52,.7],ac,.2),k=.075+.34*pf+dn*.9,
 amT=cool.map(v=>v*k),amG=cool.map((v,j)=>v*k*.38+wl[j]*.4*pf),fog=wl.map(v=>clp(v*1.5+.012,0,.2)*(.7+pf)+(rm.i==7?.02:0)*0);
 const r0=lrp(165,340,pf)+dn*5e4,r1=lrp(420,820,pf)+dn*1e5;return{amT,amG,fog,ac,r0,r1}}
function player3(t){const x=P.x,z=P.y,y=15+Math.sin(t*3.2)*2;
 if(!(now>=inv||Math.floor(now/90)%2))return;
 mat('#e8f6ff',2.2,.9,-1);pu();tr(x,y,z);dSph(7.4+Math.sin(t*5)*.4);po();mat('#7bd0ff',1.8,.9);for(let k=0;k<3;k++){const a=t*3.1+k*TAU/3;pu();tr(x+Math.cos(a)*12,y+Math.sin(a*1.7+k)*4,z+Math.sin(a)*12);dSph(1.8,1.8,1.8,'spl');po()}
 spr(x,y,z,30,.45,.75,1,.6);spr(x,y,z,11,1,1,1,.8);spr(x,1,z,22,.45,.75,1,.5,2);shw(x,z,10,.45)}
function drawRoom(rm,k,g,pf,env,dn){
 R=rm;const ox=OX[k],oy=OY[k],t=now/1000;RO[0]=ox;RO[1]=oy;
 roomEnv(env.amT,env.amG,env.fog,env.ac,env.r0,env.r1,pf,t);GL.uniform1f(GU.uEmP,.12+.88*pf+dn);
 /* کف */
 GL.activeTexture(GL.TEXTURE4);GL.bindTexture(GL.TEXTURE_2D,g.fl.a);GL.activeTexture(GL.TEXTURE5);GL.bindTexture(GL.TEXTURE_2D,g.fl.n);
 GL.uniform1f(GU.uFloor,1);GL.uniform4f(GU.uFR,ox,oy,rm.w*T,rm.h*T);GL.uniform1f(GU.uNS,1);mReset();tr(ox+rm.w*T/2,0,oy+rm.h*T/2);sc(rm.w*T,1,rm.h*T);mat('#ffffff');dr(SH.qud);GL.uniform1f(GU.uFloor,0);GL.uniform1f(GU.uNS,.8);
 setMP('occ',1);drawStatic(g.sol,ox,oy);setMP('occ',0);
 mReset();tr(ox,0,oy);
 /* تابلوها */
 for(const s of g.signs){if(CAM.eye[2]<s.z+oy)continue;const tx=signTex(s.t,s.col),a=.55+.45*pf;SQS.push([s.x+ox,s.y,s.z+oy+.3,1,1,1,1,a,3,0,tx,s.hw,s.hh])}
 const p=RM[rm.i].p,ac=env.ac;
 if(!rm.in){convM();netM();
  for(const o of rm.ins){if(o.k=='btn')btnI(o,ac,t);else if(o.k=='pad')padI(o,ac,t)}
  for(const o of rm.sol){if(o.k=='lamp')lampI(o,t);else if(o.k=='crys')crysI(o,t);else if(o.k=='src')srcM(o,t);else if(o.k=='relay')rlM(o,t);else if(o.k=='tlamp')tlM(o,t)}
  for(const r of rm.rocks)rockM(r,r.h);
  for(const e of rm.ev){if(S.ev[rm.i+'_'+e.id])continue;const d=Math.hypot(P.x-e.px,P.y-e.py);if(rm.i!=cI||!pwA()||d>260)continue;evM(e,clp((260-d)/140,0,1))}
  rm.items.forEach(o=>{if(o.v)ico3(o.px,o.py,{zap:'⚡',drink:'🥤',candle:'🕯️'}[o.kind],t,1.15)});
  rm.stars.forEach(s=>ico3(s.x,s.y,'⭐',t,1.3));if(rm.star)ico3(rm.star.x,rm.star.y,'⭐',t,1.3);
  rm.qit.forEach(q=>ico3(q.px,q.py,q.e.split(' ')[0],t,1.1));
  if(rm.sv&&rm.i<7)svM(rm.sv,t);
  rm.mem.forEach(m=>{if(S.mm[m.key]||rm.i!=cI)return;const d=Math.hypot(P.x-m.px,P.y-m.py),a=clp((170-d)/100,0,1);if(a>0)memM(m,a,t)});
  rm.G&&rm.gate&&rm.G.forEach(gt=>gateM(gt,rm,t));
  if(rm.gate){const gx=15*T+16,gz=5*T+16,o=rm.gOpen;mat(ac,o?1.4:.5,.5);pu();tr(gx,1,gz);dTor(13+Math.sin(t*4)*1.4,'tor',.14);po();if(o){spr(gx,6,gz,60,ac[0],ac[1],ac[2],.7);addL(gx,12,gz,130,ac[0],ac[1],ac[2],1)}}
  if(rm.tower)towerM(rm.tower,t);}
 /* ساکنان */
 const face=(o,x,y)=>{const d=Math.hypot(P.x-x,P.y-y),ta=d<230?Math.atan2(P.x-x,P.y-y):vA;let da=((ta-(o.fa==null?ta:o.fa)+Math.PI)%TAU+TAU)%TAU-Math.PI;o.fa=(o.fa==null?ta:o.fa)+da*Math.min(1,(now-(o.ft||now))*.006);o.ft=now;return o.fa};
 for(const f of rm.folk){const sp_=folkSpec(f),fa=face(f,f.px,f.py);chr3(f.px,f.py,sp_,fa,t+hs3(f.nm)%9,{arms:sp_.dance?[Math.sin(t*5)*1.2-1.6,Math.sin(t*5+3)*1.2-1.6]:sp_.arms,lean:sp_.lean});shw(f.px,f.py,sp_.ghost?0:13,.5);chrLights(f.px,f.py,fa);addL(f.px,22,f.py,50,.9,.85,.7,.32)}
 if(rm.npc&&!(rm.in)){const n=rm.npc,fa=face(n,n.px,n.py);npcM(n,fa,t);chrLights(n.px,n.py,fa);addL(n.px,24,n.py,78,.9,.85,.7,.4)}
 for(const b of rm.bugs){if(!b.a)continue;const bx=b._x==null?b.x:b._x,by=b._y==null?b.y:b._y,mvx=b.x-bx,mvy=b.y-by;if(Math.hypot(mvx,mvy)>.05)b._fa=Math.atan2(mvx,mvy);b._x=b.x;b._y=b.y;bugM(b,t,b._fa||0)}
 if(rm.mb&&!rm.mb.dead&&!rm.in)mbM(rm.mb,p,t);
 for(const o of rm.orbs)orbM(o);for(const b of rm.bolts)boltM(b);
 if(rm==R&&rm.i==cI)player3(t);
 /* آب و میدانِ نیرو (شفاف) */
 for(const o of rm.props){if(o.k!='pond')continue;setMP('fx',1);setMP('alpha',.72);GL.uniform1f(GU.uNS,.5);mat('#10404c',0,1,-1);pu();tr(o.x*T+o.w*T/2,1.5,o.y*T+o.h*T/2);sc(o.w*T-6,1,o.h*T-6);dr(SH.qud);po();setMP('fx',0);setMP('alpha',1);GL.uniform1f(GU.uNS,.8)}
 /* نورهای ثابت */
 const lv=(x,z)=>pwLvl(rm,x,z,pf);
 for(const l of g.lights){const q=l.pw==1?lv(l.x,l.z):l.pw==2?.4+.6*pf:1;addLT(l.x+ox,l.y,l.z+oy,l.r,l.c[0],l.c[1],l.c[2],l.k*q*(1+dn*.6))}}
function pwLvl(rm,x,z,pf){if(!rm.src)return pf;const d=Math.hypot(x-rm.src.px,z-rm.src.py)/700;return clp(pf*1.6-d*.6,0,1)}
/* سایه‌ی شبحیِ اشیای مهم پشتِ دیوار/خانه */
function ghostPass(rm,k){R=rm;RO[0]=OX[k];RO[1]=OY[k];const t=now/1000;mReset();tr(OX[k],0,OY[k]);GHOSTP=true;
 rm.items.forEach(o=>{if(o.v)ico3(o.px,o.py,{zap:'⚡',drink:'🥤',candle:'🕯️'}[o.kind],t,1.15)});rm.stars.forEach(s=>ico3(s.x,s.y,'⭐',t,1.3));if(rm.star)ico3(rm.star.x,rm.star.y,'⭐',t,1.3);rm.qit.forEach(q=>ico3(q.px,q.py,q.e.split(' ')[0],t,1.1));if(rm.sv&&rm.i<7)svM(rm.sv,t);
 if(rm==R&&rm.i==cI)player3(t);GHOSTP=false}
function draw(){
 if(!GL){c.setTransform(1,0,0,1,0,0);c.fillStyle='#050708';c.fillRect(0,0,cv.width,cv.height);c.fillStyle='#fff';c.font='16px Vazirmatn,Tahoma';c.textAlign='center';c.fillText(GLERR||'WebGL پشتیبانی نمی‌شود',cv.width/2,cv.height/2);return}
 const cur=R,dtm=Math.min(.1,(now-lastD)/1000);lastD=now;GO=OX[cur.i];GOY=OY[cur.i];cI=cur.i;glResize();
 const fx=vcx(),fz=vcy();camBuild(fx,fz);
 const rooms=cur.in?[[cur,cur.i]]:[cur.i-1,cur.i,cur.i+1].filter(k=>RS[k]).map(k=>[k==cur.i?cur:RS[k],k]);
 const dn=S.done?1:0;if(!cur.in)prepStep();
 const gs=rooms.map(([rm])=>ensureRoom(rm));
 LT.length=0;for(const l of LPVa)LT.push(l);LPVa=LNXa;LNXa=[];
 const envs=rooms.map(([rm])=>{rm.pf=rm.pf==null?pwOf(rm):rm.pf;rm.pf+=(pwOf(rm)-rm.pf)*Math.min(1,dtm*(pwOf(rm)>rm.pf?1.1:3));return roomEnvOf(rm,rm.pf,dn)});
 /* نورِ جرقه‌ی بازیکن */
 const pk=cur,ox0=OX[cur.i],oy0=OY[cur.i];addLT(P.x+ox0,22,P.y+oy0,pk.src&&!pwA()?250:300,.5,.78,1,pk.src&&!pwA()?1.5:1.1,1);
 rooms.forEach(([rm,k],j)=>{const g=gs[j];rm.pl=(x,y)=>pwLvl(rm,x,y,rm.pf)});
 GL.viewport(0,0,GC.width,GC.height);const e0=envs[rooms.findIndex(([r])=>r==cur)];GL.clearColor(e0.fog[0],e0.fog[1],e0.fog[2],1);GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);
 mainBegin();GL.enable(GL.BLEND);GL.blendFunc(GL.SRC_ALPHA,GL.ONE_MINUS_SRC_ALPHA);GL.uniform3f(GU.uFoc,P.x+ox0,16,P.y+oy0);
 /* نورهای ثابتِ اتاق‌ها پیش از آپلود جمع می‌شوند */
 rooms.forEach(([rm,k],j)=>{RO[0]=OX[k];RO[1]=OY[k];for(const l of gs[j].lights){const q=l.pw==1?pwLvl(rm,l.x,l.z,rm.pf):l.pw==2?.4+.6*rm.pf:1;addLT(l.x+OX[k],l.y,l.z+OY[k],l.r,l.c[0],l.c[1],l.c[2],l.k*q*(1+dn*.6))}});
 lightsUpload(P.x+ox0,P.y+oy0);
 rooms.forEach(([rm,k],j)=>{drawRoomX(rm,k,gs[j],rm.pf,envs[j],dn)});
 R=cur;GL.useProgram(PM);sprFlush();
 /* ایکس‌ری */
 mainBegin();GL.enable(GL.BLEND);GL.depthFunc(GL.GREATER);GL.depthMask(false);setMP('ghost',1);setMP('alpha',.34);roomEnv([0,0,0],[0,0,0],[0,0,0],[1,1,1],1e9,2e9,0,0);
 rooms.forEach(([rm,k])=>{if(rm==cur||rm.items.length||rm.qit.length)ghostPass(rm,k)});setMP('ghost',0);setMP('alpha',1);GL.depthFunc(GL.LEQUAL);GL.depthMask(true);R=cur;
 const e=GL.getError();if(e&&!GLERR)console.warn('GL error',e);
 /* ترکیب با بومِ دوبعدی و HUD */
 c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,cv.width,cv.height);c.drawImage(GC,0,0,cv.width,cv.height);c.setTransform(dpr,0,0,dpr,0,0);adaptQ(dtm);
 hud(cur,rooms,dn)}
function drawRoomX(rm,k,g,pf,env,dn){drawRoom(rm,k,g,pf,env,dn);R=rm}
/* ---- برچسب‌ها، علامت‌ها و HUD ---- */
function lbl(txt,x,y,col,fs,al){c.globalAlpha=al;c.font='700 '+fs+'px Vazirmatn,Tahoma';c.textAlign='center';c.lineWidth=3;c.strokeStyle='rgba(5,8,10,.85)';c.strokeText(txt,x,y);c.fillStyle=col;c.fillText(txt,x,y);c.globalAlpha=1}
function hud(cur,rooms,dn){const m=RM[cur.i],ems={zap:'⚡',drink:'🥤',candle:'🕯️'};
 for(const[rm,k]of rooms){const near=o=>Math.hypot(o.px-P.x,o.py-P.y)+(k==cur.i?0:400);
  for(const f of rm.folk){const a=clp(1-(near(f)-240)/260,0,1);if(a<=0)continue;const p0=pj3(k,f.px,f.py,0);if(!p0)continue;lbl(f.nm,p0[0],p0[1]+16,'#cfe3e3',10*Math.max(.9,Z*.85),a*.9);
   if(f.qk&&[0,2,4].includes(S.q[f.qk]|0)){const p1=pj3(k,f.px,f.py,56);if(p1){c.font='700 19px sans-serif';c.textAlign='center';c.fillStyle='#ffd36b';c.fillText('!',p1[0],p1[1]+Math.sin(now/200)*2)}}}
  if(rm.npc&&!rm.in){const n=rm.npc,a=clp(1-(near(n)-260)/260,0,1),p0=pj3(k,n.px,n.py,0);if(p0&&a>0)lbl(rm.boss?'':RM[rm.i].nm,p0[0],p0[1]+18,'#cfe3e3',11*Math.max(.9,Z*.85),a)}
  if(rm.src&&rm.i==cur.i){const p0=pj3(k,rm.src.px,rm.src.py,0);if(p0)lbl('باتری',p0[0],p0[1]+17,'#cfe3e3',10,.8)}
  if(rm.relay&&rm.i==cur.i)for(const r of rm.rls){const p0=pj3(k,r.px,r.py,0);if(p0)lbl('ریله',p0[0],p0[1]+17,'#cfe3e3',10,.8)}}
 /* نشانگرِ اشیای مهم: همیشه دیده می‌شوند، حتی پشتِ دیوار یا بیرونِ صفحه */
 const tg_=[];cur.items.forEach(o=>{if(o.v)tg_.push([o.px,o.py,ems[o.kind]])});cur.qit.forEach(q=>tg_.push([q.px,q.py,q.e.split(' ')[0]]));cur.stars.forEach(s=>tg_.push([s.x,s.y,'⭐']));if(cur.star)tg_.push([cur.star.x,cur.star.y,'⭐']);
 const mg=34,tt=now/1000;for(const[x,y,em]of tg_){const p0=pj3(cur.i,x,y,34+Math.sin(tt*3+x)*3);if(!p0)continue;let sx=p0[0],sy=p0[1];const off=sx<mg||sx>gW-mg||sy<mg+60||sy>gH-mg-40;
  if(off){const ang=Math.atan2(sy-gH/2,sx-gW/2);sx=clp(sx,mg,gW-mg);sy=clp(sy,mg+60,gH-mg-40);c.save();c.translate(sx,sy);c.globalAlpha=.9;c.fillStyle='rgba(20,16,10,.82)';c.strokeStyle='#ffd36b';c.lineWidth=2;c.beginPath();c.arc(0,0,17,0,TAU);c.fill();c.stroke();c.rotate(ang);c.fillStyle='#ffd36b';c.beginPath();c.moveTo(24,0);c.lineTo(17,-5);c.lineTo(17,5);c.fill();c.rotate(-ang);c.font='18px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.fillText(em,0,1);c.restore()}
  else{c.save();c.globalAlpha=.92;c.font='17px sans-serif';c.textAlign='center';c.textBaseline='middle';c.shadowColor='rgba(255,210,110,.9)';c.shadowBlur=10;c.fillStyle='#fff';c.fillText(em,sx,sy-12);c.shadowBlur=0;c.fillStyle='#ffd36b';c.beginPath();c.moveTo(sx-5,sy-1);c.lineTo(sx+5,sy-1);c.lineTo(sx,sy+6);c.fill();c.restore()}}
 c.textBaseline='alphabetic';
 /* HUD */
 c.font='20px sans-serif';c.textAlign='left';for(let k=0;k<S.mh;k++){c.fillStyle=k<hp?'#ff4d6d':'#3a2a30';c.fillText('♥',16+k*24,98)}c.font='700 14px Vazirmatn,Tahoma';c.fillStyle='#ffd36b';c.fillText('🪙 '+fa(S.coin|0),16,122);c.fillStyle='#fff4c8';c.fillText('✧ '+fa(Object.keys(S.mm).length)+'/۱۴',16,144);
 if(now<cur.ban){c.globalAlpha=Math.min(1,(cur.ban-now)/600);c.textAlign='center';c.font='400 22px "Archivo Black",sans-serif';c.fillStyle=m.p[2];c.fillText(cur.i+1+' · '+m.c,gW/2,130);c.font='700 16px Vazirmatn,Tahoma';c.fillStyle='#eef5f5';c.fillText(m.n,gW/2,156);c.globalAlpha=1}
 if(cur.mb&&cur.mb.on&&!cur.mb.dead&&!cur.in){c.textAlign='center';c.font='700 13px Vazirmatn,Tahoma';c.fillStyle='#eef5f5';c.fillText(MBN[cur.mb.k],gW/2,78);c.fillStyle='#2a1a3a';c.fillRect(gW/2-90,84,180,8);c.fillStyle=m.p[2];c.fillRect(gW/2-90,84,180*cur.mb.hp/cur.mb.max,8)}
 if(cur.boss&&S.t[7]&&!cur.boss.dead){c.fillStyle='#2a1a3a';c.fillRect(gW/2-90,84,180,8);c.fillStyle='#c36bff';c.fillRect(gW/2-90,84,180*cur.boss.hp/12,8)}
 if(fin){const t=now-fin,end=1800+2200*(finL||FIN).length+2500;if(t>end)fin=0;else{const a=Math.min(1,t/2500)*Math.min(1,(end-t)/2500),W2=gW*dpr,H2=gH*dpr,g=c.createRadialGradient(W2/2,H2/2,0,W2/2,H2/2,Math.max(W2,H2)*(.25+.6*a));c.setTransform(1,0,0,1,0,0);g.addColorStop(0,'rgba(255,246,208,'+.9*a+')');g.addColorStop(1,'rgba(255,214,120,'+.15*a+')');c.fillStyle=g;c.fillRect(0,0,cv.width,cv.height);
  const i=Math.floor((t-1800)/2200);if(i>=0&&i<(finL||FIN).length){const f=((t-1800)%2200)/2200;c.setTransform(dpr,0,0,dpr,0,0);c.globalAlpha=Math.min(1,f*4,(1-f)*4);c.textAlign='center';c.fillStyle='#2a1a00';c.font='700 20px Vazirmatn,Tahoma';c.fillText((finL||FIN)[i],gW/2,gH/2);c.globalAlpha=1}c.setTransform(dpr,0,0,dpr,0,0)}}
 if(now<inv-900){c.fillStyle='rgba(200,40,80,'+.3*(inv-900-now)/400+')';c.fillRect(0,0,gW,gH)}
 const wo=dlg&&dlg.who||cur.npc,el=dlg?gnpc:gbub,wx=dlg?wo.px:bo?bo.px:P.x,wy=dlg?wo.py:bo?bo.py:P.y,p0=pj3(cI,wx,wy,46);
 if(p0){el.style.left=Math.max(130,Math.min(gW-130,p0[0]))+'px';el.style.top=Math.max(76,p0[1]-10)+'px'}}


/* ---------- راه‌اندازیِ موتور ---------- */
try{glInit()}catch(err){GL=null;GLERR='این مرورگر WebGL ندارد؛ بازی بدونِ آن اجرا نمی‌شود. ('+err.message+')';console.error(err)}
function frame(t){raf=requestAnimationFrame(frame);now=t;const dt=Math.min(.05,(t-last)/1000);last=t;update(dt);camUp(dt);draw()}
const startLoop=()=>{if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}},stopLoop=()=>{cancelAnimationFrame(raf);raf=0};
function save(){try{localStorage.setItem('gk_g3',JSON.stringify(S))}catch(e){}}
function reset(first,full){let sv=null;if(first)try{sv=JSON.parse(localStorage.getItem('gk_g3'))}catch(e){}
 if(full){S=fresh();try{localStorage.removeItem('gk_g3')}catch(e){}}else if(sv)S=Object.assign(fresh(),sv);
 hp=S.mh;dlg=null;gnpc.classList.remove('on');tg=pend=null;RS=[];for(let i=0;i<8;i++)build(i,false);R=RS[S.room];P={...R.st};camUp(0,1);upd();schedulePrep(R.i);
 say(full?'از اول شروع کردیم!':sv?'برگشتم! بریم ادامه بدیم.':'…اینجا کجاست؟ همه‌جا تاریکه. (کلیک یا WASD برای حرکت)')}
function gSize(){dpr=Math.min(2,devicePixelRatio||1);gW=gameEl.clientWidth;gH=gameEl.clientHeight;cv.width=gW*dpr;cv.height=gH*dpr;Z=Math.max(.9,Math.min(1.5,gW/560));if(GL)glResize()}
function gLoad(){loading=true;gload.classList.remove('off');const fl=$('gfl'),dot=$('gdot'),pc=$('gpct'),len=fl.getTotalLength(),t0=performance.now();
 const tick=n=>{const t=Math.min(1,(n-t0)/1800),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,p=fl.getPointAtLength(len*e);fl.setAttribute('stroke-dashoffset',100*(1-e));dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);pc.textContent=Math.round(e*100)+'%';
  if(t<1)requestAnimationFrame(tick);else setTimeout(()=>{gload.classList.add('off');loading=false;started=true;reset(true);if(document.body.dataset.state=='steps')startLoop()},300)};requestAnimationFrame(tick)}
window.gameOnState=id=>{if(id!='steps'){stopLoop();return}gSize();if(!started&&!loading)gLoad();else if(started)startLoop()};
const pickList=()=>[R.npc,...R.folk,...R.rls,...(R.src?[R.src]:[]),...R.ins.filter(o=>o.k=='lamp'||o.k=='crys'),...R.items.filter(o=>o.v)].filter(o=>o&&!(R.boss&&S.t[7]&&o==R.boss));
/* انتخابِ اشیا روی صفحه (قدِ آدم‌ها هم حساب می‌شود) */
function pickAt(sx,sy){let best=null,bd=40*Math.max(.8,Z*.8);for(const o of pickList()){const hh=o.k=='folk'||o.k=='npc'?18:o.k=='lamp'?24:14,p0=pj3(R.i,o.px,o.py,hh);if(!p0)continue;const d=Math.hypot(p0[0]-sx,p0[1]-sy);if(d<bd){bd=d;best=o}}return best}
cv.addEventListener('pointerdown',e=>{if(!started||loading)return;e.preventDefault();if(dlg){adv();return}hold=true;
 const r=cv.getBoundingClientRect(),sx=e.clientX-r.left,sy=e.clientY-r.top,[wx,wy]=s2w(sx,sy,R.i),o=pickAt(sx,sy);
 if(o){pend=o;tg={x:o.px,y:o.py}}else{pend=null;tg={x:wx,y:wy}}});
cv.addEventListener('pointermove',e=>{if(hold&&!dlg&&started&&!pend){const r=cv.getBoundingClientRect();const q=s2w(e.clientX-r.left,e.clientY-r.top,R.i);tg={x:q[0],y:q[1]}}});
addEventListener('pointerup',()=>{hold=false});cv.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(document.body.dataset.state!='steps'||!started)return;
 if(e.code=='ShiftLeft'||e.code=='ShiftRight'||e.code=='KeyX'){dash();e.preventDefault()}
 if(e.code=='KeyZ')rotV(-1);if(e.code=='KeyC')rotV(1);if(e.code=='KeyV')togV();
 if(/^(Arrow|Key[WASD])/.test(e.code)||e.code=='Space'){e.preventDefault();keys[e.code]=true}
 if(e.code=='Space'||e.code=='Enter'||e.code=='KeyE'){if(dlg)adv();else if(e.code=='Space')fire();else{const o=[R.npc,...R.folk,...R.rls,...(R.src?[R.src]:[]),...R.ins.filter(o=>o.k=='lamp'||o.k=='crys'),...R.items.filter(o=>o.v)].find(o=>o&&Math.hypot(P.x-o.px,P.y-o.py)<56);o&&act(o)}}});
addEventListener('keyup',e=>{keys[e.code]=false});
const bar=document.querySelector('.gbar'),mk=(t,f)=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.addEventListener('click',f);return b};
const zb=mk('⚡ شلیک',fire),db=mk('💨 جاخالی',dash),rb=mk('🔄 چرخش',()=>rotV(1)),vb=mk('🧊 نما',togV);bar.prepend(vb);bar.prepend(rb);bar.prepend(db);bar.prepend(zb);$('gReset').textContent='ریست اتاق';
$('gReset').addEventListener('click',()=>{if(started){hp=S.mh;dlg=null;gnpc.classList.remove('on');build(R.i)}});
bar.append(mk('بازی از اول',()=>{if(started&&confirm('همه‌ی پیشرفت پاک شه؟'))reset(false,true)}));
addEventListener('resize',()=>{if(gameEl.clientWidth)gSize()});
})();