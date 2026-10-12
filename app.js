(function(){
  var $=function(s){return document.querySelector(s)};
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

  /* ---------- data ---------- */
  var SIZES=[{id:2,l:'Couple',s:'2 servings a night'},{id:3,l:'Family of 3',s:'3 servings a night'},{id:4,l:'Family of 4',s:'4 servings a night'},{id:5,l:'Family of 5',s:'5 servings a night'},{id:6,l:'Family of 6',s:'6 servings a night'}];
  var BUDGETS=[{id:'tight',l:'Lean',per:2.6,s:'About $2.60 per serving'},{id:'balanced',l:'Balanced',per:4,s:'About $4.00 per serving'},{id:'comfy',l:'Roomy',per:6,s:'About $6.00 per serving'}];
  var TIMES=[{id:15,l:'15 min'},{id:30,l:'30 min'},{id:45,l:'45 min'}];
  var STYLES=[{id:'fresh',l:'Mostly fresh',s:'Fresh ingredients, more chopping.'},{id:'mixed',l:'Mixed',s:'A mix of fresh, frozen and precooked.'},{id:'easy',l:'Shortcuts',s:'Leans on frozen and precooked to save time.'}];

  // type: fresh | frozen | precooked | batch. mins = hands-on minutes.
  var MEALS=[
    {id:1,n:'Sheet-pan chicken thighs with broccoli and potatoes',mins:15,c:3.2,k:520,t:'fresh',i:['chicken thighs','broccoli','potatoes']},
    {id:2,n:'Frozen dumplings with stir-fried vegetables',mins:12,c:2.4,k:480,t:'frozen',i:['frozen dumplings','frozen stir-fry veg','soy sauce']},
    {id:3,n:'Turkey and bean chili (makes extra to freeze)',mins:15,c:2.1,k:540,t:'batch',i:['ground turkey','canned beans','canned tomatoes','onion']},
    {id:4,n:'Pasta with frozen meatballs and spinach',mins:18,c:2.6,k:610,t:'frozen',i:['pasta','frozen meatballs','marinara','spinach']},
    {id:5,n:'Rotisserie chicken tacos',mins:10,c:3.0,k:560,t:'precooked',i:['rotisserie chicken','tortillas','lettuce','cheese']},
    {id:6,n:'Spinach and cheese omelets with toast',mins:12,c:1.6,k:430,t:'fresh',i:['eggs','milk','spinach','bread','cheese']},
    {id:7,n:'Baked salmon with rice and peas',mins:20,c:4.8,k:590,t:'frozen',i:['frozen salmon','rice','frozen peas']},
    {id:8,n:'Red lentil soup (makes extra to freeze)',mins:15,c:1.3,k:420,t:'batch',i:['lentils','carrots','onion','canned tomatoes']},
    {id:9,n:'Precooked pulled pork sliders with slaw',mins:10,c:3.4,k:620,t:'precooked',i:['pulled pork','buns','coleslaw mix']},
    {id:10,n:'Bean and cheese quesadillas with salsa',mins:10,c:1.8,k:500,t:'fresh',i:['tortillas','cheese','canned beans','salsa']},
    {id:11,n:'Egg fried rice with frozen vegetables',mins:15,c:1.7,k:510,t:'frozen',i:['rice','eggs','frozen peas','soy sauce']},
    {id:12,n:'Beef and broccoli over rice',mins:25,c:5.2,k:560,t:'fresh',i:['beef strips','broccoli','rice','soy sauce']},
    {id:13,n:'Stovetop mac and cheese with steamed broccoli',mins:15,c:1.9,k:570,t:'fresh',i:['pasta','milk','cheese','broccoli']},
    {id:14,n:'Caesar salad kit with precooked chicken strips',mins:8,c:3.6,k:450,t:'precooked',i:['chicken strips','salad kit']},
    {id:15,n:'Garlic shrimp pasta',mins:20,c:5.6,k:600,t:'frozen',i:['frozen shrimp','pasta','spinach']},
    {id:16,n:'Veggie fried-egg bowls over rice',mins:15,c:1.5,k:480,t:'fresh',i:['rice','eggs','carrots','soy sauce']}
  ];
  var TYPE_L={fresh:'Fresh',frozen:'Frozen',precooked:'Precooked',batch:'Batch cook'};
  var AISLE={'chicken thighs':'Meat & fish','ground turkey':'Meat & fish','beef strips':'Meat & fish','rotisserie chicken':'Deli & precooked','pulled pork':'Deli & precooked','chicken strips':'Deli & precooked',
    'broccoli':'Produce','potatoes':'Produce','spinach':'Produce','onion':'Produce','carrots':'Produce','lettuce':'Produce','salad kit':'Produce','coleslaw mix':'Produce',
    'milk':'Dairy & eggs','eggs':'Dairy & eggs','cheese':'Dairy & eggs',
    'frozen dumplings':'Freezer','frozen stir-fry veg':'Freezer','frozen meatballs':'Freezer','frozen salmon':'Freezer','frozen peas':'Freezer','frozen shrimp':'Freezer'};
  var DEALS=[
    {i:'frozen salmon',now:7.99,was:11.49,note:'2 lb bag · ends Thu'},
    {i:'rotisserie chicken',now:4.99,was:7.49,note:'Whole bird · all week'},
    {i:'frozen dumplings',now:3.49,was:6.99,note:'Buy one, get one · ends Wed'},
    {i:'eggs',now:2.79,was:4.29,note:'Dozen · ends Sun'},
    {i:'broccoli',now:1.49,was:2.49,note:'Per crown · ends Tue'},
    {i:'ground turkey',now:4.49,was:6.29,note:'1 lb · ends Fri'}
  ];
  DEALS.forEach(function(d){d.p=Math.round((1-d.now/d.was)*100)});
  var DEAL_STORE={'frozen salmon':'Aldi','rotisserie chicken':'Costco','frozen dumplings':"Trader Joe's",'eggs':'Walmart','broccoli':'Kroger','ground turkey':'Safeway'};
  DEALS.forEach(function(d){d.s=DEAL_STORE[d.i]});
  [{i:'frozen shrimp',now:9.99,was:13.99,note:'1 lb bag · ends Sat',s:'Costco'},{i:'cheese',now:2.99,was:4.49,note:'8 oz block · ends Tue',s:'Target'},{i:'frozen peas',now:0.99,was:1.69,note:'12 oz · ends Thu',s:'Aldi'}]
    .forEach(function(d){d.p=Math.round((1-d.now/d.was)*100);DEALS.push(d)});
  function dealOn(d){return !state.stores.length||state.stores.indexOf(d.s)>=0}
  function dealFor(i){for(var k=0;k<DEALS.length;k++)if(DEALS[k].i===i&&dealOn(DEALS[k]))return DEALS[k];return null}
  // sample distance from the zip; a real store locator replaces this
  function dist(s){var h=0,t=(state.zip||'0')+s;for(var q=0;q<t.length;q++)h=(h*31+t.charCodeAt(q))%997;return (0.6+(h%90)/10).toFixed(1)}
  var FLAGS={1:['meat'],2:['pork','gluten'],3:['meat'],4:['meat','gluten'],5:['meat','gluten','dairy'],6:['egg','dairy','gluten'],7:['fish'],8:[],9:['meat','pork','gluten'],10:['dairy','gluten'],11:['egg'],12:['meat'],13:['dairy','gluten'],14:['meat','dairy','gluten'],15:['fish','gluten'],16:['egg']};
  var DIET_X={'Vegetarian':['meat','fish','pork'],'No pork':['pork'],'Dairy-free':['dairy'],'Gluten-free':['gluten'],'Nut allergy':[]};
  function allowed(m){return state.diet.every(function(dt){return (DIET_X[dt]||[]).every(function(f){return (FLAGS[m.id]||[]).indexOf(f)<0})})}

  /* ---------- state ---------- */
  var state={size:4,budget:'balanced',time:30,style:'mixed',out:2,outCost:12,share:50,years:20,rate:5,real:true,name:'',kids:0,country:'US',zip:'',radius:5,stores:[],pref:'',other:'',saves:[],loyalty:'',diet:[],remindOn:true,remind:'6pm',onboarded:false,pantry:[
    {n:'milk',d:2,r:true},{n:'spinach',d:3,r:false},{n:'bread',d:4,r:false},{n:'chicken thighs',d:2,r:true},{n:'eggs',d:9,r:false},{n:'cheese',d:14,r:false},
    {n:'rice',d:999,r:false},{n:'pasta',d:999,r:false},{n:'soy sauce',d:999,r:false},{n:'onion',d:20,r:false},{n:'canned beans',d:999,r:false}
  ]};
  var over={};   // day index -> meal id (swaps)
  var checked={};
  var BASE=JSON.stringify(state);
  try{var s=JSON.parse(localStorage.getItem('wp-state')||'null');if(s&&s.size&&s.pantry){for(var k0 in s)state[k0]=s[k0]}}catch(e){}
  function persist(){try{localStorage.setItem('wp-state',JSON.stringify(state))}catch(e){}}

  /* dates: plan starts tomorrow */
  var DAYS=[];(function(){var t=new Date();for(var i=1;i<=7;i++){var d=new Date(t.getFullYear(),t.getMonth(),t.getDate()+i);DAYS.push(d)}})();
  var WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function dl(d){return WD[d.getDay()]+' '+MO[d.getMonth()]+' '+d.getDate()}
  function weekend(d){return d.getDay()===0||d.getDay()===6}
  var money=function(x){return '$'+x.toFixed(2).replace(/\.00$/,'')};

  /* ---------- planning ---------- */
  function perServ(){return BUDGETS.filter(function(b){return b.id===state.budget})[0].per}
  function pantryDays(name){var f=state.pantry.filter(function(p){return p.n===name});return f.length?f[0].d:null}
  function adjCost(m){ // dollars per serving after sale prices
    var c=m.c;
    m.i.forEach(function(g,ix){var d=dealFor(g);if(d)c-=m.c*(ix===0?0.35:0.15)*(d.p/100)*1.4});
    return Math.max(c,m.c*0.6);
  }
  function score(m,day){
    var s=0, ps=perServ(), c=adjCost(m);
    s-=(c/ps)*3;
    if(c>ps*1.25)s-=4;
    m.i.forEach(function(g){
      var d=pantryDays(g);
      if(d!==null&&d<=6&&day<=d)s+=2.5;           // use it before it goes off
      if(dealFor(g))s+=1;
    });
    if(state.style==='fresh')s+=m.t==='fresh'?1:0;
    if(state.style==='easy')s+=(m.t==='frozen'||m.t==='precooked')?1.5:(m.t==='batch'?.5:-.5);
    return s;
  }
  function limit(day){return state.time+(weekend(DAYS[day])?20:0)}
  function ranked(day,exclude){
    return MEALS.filter(function(m){return m.mins<=limit(day)&&exclude.indexOf(m.id)<0&&allowed(m)})
      .sort(function(a,b){return score(b,day)-score(a,day)});
  }
  function buildPlan(){
    var plan=[],used=[];
    for(var d=0;d<7;d++){
      var pick=null;
      if(over[d]){pick=MEALS.filter(function(m){return m.id===over[d]})[0]}
      if(!pick){
        var r=ranked(d,used);
        if(plan.length){var prev=plan[d-1].t;r.sort(function(a,b){return (score(b,d)-(b.t===prev?1:0))-(score(a,d)-(a.t===prev?1:0))})}
        if(!r.length)r=ranked(d,[]);   // few allowed meals: repeat rather than break a diet rule
        pick=r[0]||MEALS.filter(allowed)[0]||MEALS[0];
      }
      plan.push(pick);used.push(pick.id);
    }
    return plan;
  }

  /* ---------- rendering ---------- */
  function seg(id,items,cur,cb){
    var el=$(id);el.innerHTML=items.map(function(x){return '<button type="button" data-v="'+x.id+'" aria-pressed="'+(String(x.id)===String(cur))+'">'+esc(x.l)+'</button>'}).join('');
    el.onclick=function(e){var b=e.target.closest('button');if(b){cb(b.dataset.v)}};
  }
  function renderControls(){
    seg('#sizeSeg',SIZES,state.size,function(v){state.size=+v;over={};persist();render()});
    seg('#budgetSeg',BUDGETS,state.budget,function(v){state.budget=v;over={};persist();render()});
    seg('#timeSeg',TIMES,state.time,function(v){state.time=+v;over={};persist();render()});
    seg('#styleSeg',STYLES,state.style,function(v){state.style=v;over={};persist();render()});
    $('#sizeSub').textContent=SIZES.filter(function(x){return x.id===state.size})[0].s;
    $('#budgetSub').textContent=BUDGETS.filter(function(x){return x.id===state.budget})[0].s+' · '+money(perServ()*state.size*7)+' a week';
    $('#styleSub').textContent=STYLES.filter(function(x){return x.id===state.style})[0].s;
  }

  function renderProfile(){
    var el=$('#profile');
    if(!state.onboarded){el.hidden=true;return}
    el.hidden=false;
    var st=state.stores.length?state.stores.join(', '):'all sample stores';
    el.innerHTML='<div><b>Hi'+(state.name?', '+esc(state.name):'')+'</b><span>'+esc(state.zip)+' · '+esc(st)+' · within '+state.radius+' mi</span></div><div class="pbtn"><button class="btn" type="button" id="editProf">Edit profile</button><button class="btn" type="button" id="delData">Delete my data</button></div>';
  }
  function render(){
    renderProfile();
    renderControls();
    var plan=buildPlan();
    var weekCost=0,mins=0,kcal=0,freshMins=0,dealHits=0;
    plan.forEach(function(m){weekCost+=adjCost(m)*state.size;mins+=m.mins;kcal+=m.k;freshMins+=(m.t==='fresh'?m.mins:m.mins+15);m.i.forEach(function(g){if(dealFor(g))dealHits++})});
    var budget=perServ()*state.size*7, pct=Math.min(100,weekCost/budget*100), isOver=weekCost>budget;
    var saved=freshMins-mins;
    $('#stats').innerHTML=
      '<div class="stat"><div class="k">Estimated dinners cost</div><div class="v">'+money(weekCost)+'</div><div class="bar'+(isOver?' over':'')+'"><i style="width:'+pct+'%"></i></div><div class="d '+(isOver?'bad':'good')+'">'+(isOver?money(weekCost-budget)+' over':money(budget-weekCost)+' under')+' your '+money(budget)+' budget</div></div>'+
      '<div class="stat"><div class="k">Hands-on cooking, whole week</div><div class="v">'+Math.floor(mins/60)+'h '+(mins%60)+'m</div><div class="d">About '+Math.round(mins/7)+' min a night</div></div>'+
      '<div class="stat"><div class="k">Dinner calories per person</div><div class="v">'+Math.round(kcal/7)+'</div><div class="d">About '+Math.round(kcal/7/2000*100)+'% of a 2,000 kcal day. Kids need less.</div></div>'+
      '<div class="stat"><div class="k">Time saved vs. all-fresh</div><div class="v">'+Math.max(saved,0)+' min</div><div class="d">From frozen, precooked and batch meals</div></div>';

    $('#week').innerHTML=plan.map(function(m,d){
      var tags='<span class="tag'+(m.t==='fresh'?'':' acc')+'">'+TYPE_L[m.t]+'</span>';
      var saleItems=m.i.filter(function(g){return dealFor(g)});
      if(saleItems.length)tags+='<span class="tag good">On sale: '+esc(saleItems[0])+'</span>';
      var soon=m.i.filter(function(g){var p=pantryDays(g);return p!==null&&p<=4&&d<=p});
      if(soon.length)tags+='<span class="tag warn">Uses your '+esc(soon[0])+'</span>';
      if(m.t==='batch')tags+='<span class="tag">Freeze half</span>';
      return '<article class="day"><div class="dh"><span>'+dl(DAYS[d])+'</span><span>'+m.mins+' min</span></div><h3>'+esc(m.n)+'</h3>'+
        '<div class="meta"><span>'+m.k+' kcal each</span><span>'+money(adjCost(m)*state.size)+' for '+state.size+'</span></div>'+
        '<div class="tags">'+tags+'</div>'+
        '<div class="foot"><span class="ing">'+m.i.length+' ingredients</span><button class="btn" type="button" data-swap="'+d+'">Swap</button></div></article>';
    }).join('');

    renderSavings(plan);
    renderPantry(plan);
    renderDeals(plan);
    renderShop(plan);
    renderTips(plan,mins,saved);
  }

  $('#week').addEventListener('click',function(e){
    var b=e.target.closest('[data-swap]');if(!b)return;
    var d=+b.dataset.swap, plan=buildPlan(), others=plan.map(function(m){return m.id}).filter(function(_,i){return i!==d});
    var r=ranked(d,others), cur=plan[d].id, ix=-1;
    r.forEach(function(m,i){if(m.id===cur)ix=i});
    var nxt=r[(ix+1)%r.length];
    if(nxt){over[d]=nxt.id;render()}
  });

  function bell(on){return '<svg viewBox="0 0 24 24" fill="'+(on?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>'}
  function renderPantry(plan){
    var items=state.pantry.slice().sort(function(a,b){return a.d-b.d});
    $('#pantry').innerHTML=items.map(function(p){
      var staple=p.d>=60, usedOn=null;
      plan.forEach(function(m,i){if(usedOn===null&&m.i.indexOf(p.n)>=0)usedOn=i});
      var status=staple?'Staple':(p.d<=0?'Expires today':p.d+(p.d===1?' day left':' days left'));
      var cls=staple?'':(p.d<=2?'warn':(p.d<=4?'':'good'));
      var extra=usedOn!==null?' · planned '+WD[DAYS[usedOn].getDay()]:(!staple&&p.d<=3?' · not in this plan':'');
      return '<li class="pi"><div class="n"><b>'+esc(p.n)+'</b><span>'+status+esc(extra)+'</span></div>'+
        (staple?'':'<span class="tag '+cls+'">'+(p.d<=2?'Use soon':(p.d<=4?'This week':'Fresh'))+'</span>')+
        (staple?'':'<button type="button" class="ico-btn" data-bell="'+esc(p.n)+'" aria-pressed="'+!!p.r+'" aria-label="Reminder for '+esc(p.n)+'">'+bell(p.r)+'</button>')+
        '<button type="button" class="ico-btn" data-del="'+esc(p.n)+'" aria-label="Remove '+esc(p.n)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></li>';
    }).join('')||'<li class="empty">Nothing added yet.</li>';

    var rem=items.filter(function(p){return p.r&&p.d<60}).map(function(p){
      var exp=new Date();exp.setDate(exp.getDate()+p.d);
      var ev=new Date(exp);ev.setDate(ev.getDate()-1);
      var when=p.d<=0?'Today':(p.d===1?'Tonight, '+state.remind:'Ping on '+dl(ev)+', '+state.remind);
      return '<li class="pi"><div class="n"><b>'+esc(p.n)+'</b><span>Expires '+dl(exp)+'</span></div><span class="tag warn">'+when+'</span></li>';
    });
    $('#reminders').innerHTML=rem.join('')||'<li class="empty">No reminders set. Tap a bell above.</li>';
  }
  $('#pantry').addEventListener('click',function(e){
    var b=e.target.closest('[data-bell]'),x=e.target.closest('[data-del]');
    if(b){state.pantry.forEach(function(p){if(p.n===b.dataset.bell)p.r=!p.r})}
    else if(x){state.pantry=state.pantry.filter(function(p){return p.n!==x.dataset.del})}
    else return;
    persist();render();
  });
  $('#addForm').addEventListener('submit',function(e){
    e.preventDefault();
    var n=$('#addName').value.trim().toLowerCase(), d=parseInt($('#addDays').value,10);
    if(!n||!d)return;
    var ex=state.pantry.filter(function(p){return p.n===n})[0];
    if(ex){ex.d=d}else{state.pantry.push({n:n,d:d,r:state.remindOn&&d<=3})}
    $('#addName').value='';persist();render();
  });

  function renderDeals(plan){
    var ids=[];plan.forEach(function(m){m.i.forEach(function(g){ids.push(g)})});
    $('#dealSub').textContent=state.stores.length?state.stores.join(', '):'sample stores';
    var list=DEALS.filter(dealOn).sort(function(a,b){return (b.s===state.pref)-(a.s===state.pref)});
    $('#deals').innerHTML=list.map(function(d){
      var used=ids.indexOf(d.i)>=0;
      return '<li class="deal"><div class="n"><b>'+esc(d.i)+'</b><span>'+esc(d.note)+'<br>'+esc(d.s)+(d.s===state.pref?' ★':'')+' · about '+dist(d.s)+' mi</span></div>'+
        (used?'<span class="tag good">In your plan</span>':'<span class="tag">Not planned</span>')+
        '<div class="price"><b>'+money(d.now)+'</b><s>'+money(d.was)+'</s><div style="font-size:12px;color:var(--good)">'+d.p+'% off</div></div></li>';
    }).join('')||'<li class="empty">No sample deals at your chosen stores this week.</li>';
  }

  function renderShop(plan){
    var need={};
    plan.forEach(function(m){m.i.forEach(function(g){
      var p=pantryDays(g);
      if(p!==null&&p>=60)return;               // staples already at home
      if(!need[g])need[g]={n:g,c:0,short:false};
      need[g].c++;
      if(p!==null&&p<plan.length&&p>=0){}      // have some, may run out
    })});
    var groups={};
    Object.keys(need).forEach(function(k){
      var have=pantryDays(k)!==null;
      if(have&&need[k].c<=1)return;            // one use is covered by what you have
      var a=AISLE[k]||'Pantry';(groups[a]=groups[a]||[]).push(need[k]);
    });
    var order=['Produce','Meat & fish','Deli & precooked','Dairy & eggs','Freezer','Pantry'];
    var html='',total=0;
    order.forEach(function(a){
      if(!groups[a])return;
      html+='<h3>'+a+'</h3><ul>'+groups[a].map(function(x){
        total++;var d=dealFor(x.n),id='chk-'+x.n.replace(/\W/g,'');
        return '<li><input type="checkbox" id="'+id+'"'+(checked[x.n]?' checked':'')+' data-chk="'+esc(x.n)+'"><label for="'+id+'">'+esc(x.n)+(x.c>1?' <span style="color:var(--muted)">· '+x.c+' meals</span>':'')+'</label>'+(d?'<span class="tag good">'+money(d.now)+' sale</span>':'')+'</li>';
      }).join('')+'</ul>';
    });
    $('#shop').innerHTML=html||'<p class="empty">You have everything you need.</p>';
    $('#shopSub').textContent=total+' items to buy. Things you already have are left off.';
  }
  $('#shop').addEventListener('change',function(e){var c=e.target.closest('[data-chk]');if(c)checked[c.dataset.chk]=c.checked});

  function renderTips(plan,mins,saved){
    var tips=[];
    var frozenSale=DEALS.filter(function(d){return /^frozen/.test(d.i)||d.i==='rotisserie chicken'});
    frozenSale.forEach(function(d){
      var nights=[];plan.forEach(function(m,i){if(m.i.indexOf(d.i)>=0)nights.push(WD[DAYS[i].getDay()])});
      if(nights.length)tips.push('<b>'+esc(d.i)+' is '+d.p+'% off.</b> You plan it on '+nights.join(' and ')+'. '+(/^frozen/.test(d.i)?'Buy a second bag at '+money(d.now)+' and keep it in the freezer for next week.':'Pull the meat off the bone in one go and keep it for the next night too.'));
    });
    var batch=plan.filter(function(m){return m.t==='batch'});
    if(batch.length)tips.push('<b>Double the '+esc(batch[0].n.split(' (')[0].toLowerCase())+'.</b> It freezes well, so one cooking session covers a night next week as well.');
    var easy=plan.filter(function(m){return m.t==='frozen'||m.t==='precooked'}).length;
    if(easy>=3)tips.push('<b>'+easy+' of 7 dinners are frozen or precooked.</b> Buying the larger family pack of frozen meals or proteins usually costs 10 to 20% less per serving. Check the price per pound on the shelf tag.');
    else tips.push('<b>Want more evenings off?</b> Switch cooking style to Shortcuts to see how many frozen and precooked dinners fit your budget.');
    var soon=state.pantry.filter(function(p){return p.d<=2&&p.d<60});
    soon.forEach(function(p){
      var used=plan.some(function(m,i){return m.i.indexOf(p.n)>=0&&i<=p.d});
      if(!used)tips.push('<b>'+esc(p.n)+' runs out in '+p.d+' day'+(p.d===1?'':'s')+' and no dinner uses it in time.</b> Add it to breakfast or lunch, or freeze it if you can.');
    });
    if(mins/7>25)tips.push('<b>Your nights average '+Math.round(mins/7)+' minutes.</b> Lower the cooking time limit to find quicker meals.');
    $('#tips').innerHTML=tips.map(function(t){return '<div class="tip"><span class="dot"></span><p>'+t+'</p></div>'}).join('');
  }

  $('#ingList').innerHTML=Object.keys(AISLE).concat(['rice','pasta','bread','flour','butter','yogurt']).map(function(n){return '<option value="'+esc(n)+'">'}).join('');
  /* ---------- savings and investing illustration ---------- */
  var INFL=0.025;
  function whole(x){return '$'+Math.round(x).toLocaleString('en-US')}
  function sChips(key,vals,fmt){return '<div class="chips">'+vals.map(function(v){return chip('data-sv="'+key+'" data-v="'+v+'"',fmt(v),state[key]===v)}).join('')+'</div>'}
  function renderSavings(plan){
    var n=state.size, regPer=0, deal=0, planCost=0, rescued=0;
    plan.forEach(function(m,d){
      regPer+=m.c/7; deal+=(m.c-adjCost(m))*n; planCost+=adjCost(m)*n;
      m.i.forEach(function(g){var p=pantryDays(g);if(p!==null&&p<60&&d<=p)rescued++});
    });
    var takeout=Math.max(0,state.out*n*(state.outCost-regPer));
    var waste=rescued*3;
    var week=takeout+deal+waste, year=week*52;
    var left='<h2>Savings</h2><p class="s">A week of planned dinners for '+n+' compared with ordering out '+state.out+(state.out===1?' night':' nights')+' and paying full price.</p>'+
      '<div class="sv-big">'+money(week)+' <small>a week</small></div><p class="s" style="margin:2px 0 0">About '+whole(year)+' a year</p>'+
      '<div class="sv-h">Where it comes from</div>'+
      '<div class="sv-line"><span>Fewer takeout dinners</span><b>'+money(takeout)+'</b></div>'+
      '<div class="sv-line"><span>Sale prices on your plan</span><b>'+money(deal)+'</b></div>'+
      '<div class="sv-line"><span>Food used before it spoils ('+rescued+' items at about $3)</span><b>'+money(waste)+'</b></div>'+
      '<div class="sv-line"><span>Planned dinners this week</span><b>'+money(planCost)+'</b></div>'+
      '<div class="sv-h">Without a plan, I order out about</div>'+sChips('out',[0,1,2,3,4],function(v){return v+(v===1?' night':' nights')})+
      '<div class="sv-h">A takeout serving costs about</div>'+sChips('outCost',[8,12,16,20],function(v){return '$'+v})+
      '<p class="note" style="margin-top:12px">These are estimates from the assumptions above. Your real savings depend on what you actually buy and eat.</p>';
    $('#svLeft').innerHTML=left;

    // investing illustration: monthly deposits, monthly compounding
    var sh=state.share/100, mon=week*sh*52/12, Y=state.years;
    var R=state.real?((1+state.rate/100)/(1+INFL)-1):state.rate/100, rm=Math.pow(1+R,1/12)-1;
    var bal=0, pts=[{y:0,v:0,c:0}];
    for(var mo=1;mo<=Y*12;mo++){bal=bal*(1+rm)+mon;if(mo%12===0)pts.push({y:mo/12,v:bal,c:mon*mo})}
    var contrib=mon*Y*12, growth=bal-contrib;
    var W=600,H=220,L=52,T=12,Rm=12,B=28, mx=Math.max(pts[pts.length-1].v,1);
    var step=Math.pow(10,Math.floor(Math.log(mx)/Math.LN10)); var top=Math.ceil(mx/step)*step; if(top/step<2)top=step*2;
    var X=function(y){return L+(W-L-Rm)*y/Y}, Yp=function(v){return T+(H-T-B)*(1-v/top)};
    var line=function(k){return pts.map(function(p,i){return (i?'L':'M')+X(p.y).toFixed(1)+' '+Yp(p[k]).toFixed(1)}).join(' ')};
    var grid='',lab='';
    for(var g=0;g<=2;g++){var gv=top*g/2;grid+='<line x1="'+L+'" x2="'+(W-Rm)+'" y1="'+Yp(gv).toFixed(1)+'" y2="'+Yp(gv).toFixed(1)+'" stroke="var(--line)" stroke-width="1"/>';lab+='<text x="'+(L-6)+'" y="'+(Yp(gv)+4).toFixed(1)+'" text-anchor="end">'+whole(gv)+'</text>'}
    [0,Math.round(Y/2),Y].forEach(function(y){lab+='<text x="'+X(y).toFixed(1)+'" y="'+(H-8)+'" text-anchor="'+(y===0?'start':(y===Y?'end':'middle'))+'">'+(y===0?'Today':y+' yrs')+'</text>'});
    var chart='<svg class="sv-chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Projected value after '+Y+' years: '+whole(bal)+' from '+whole(contrib)+' deposited">'+grid+
      '<path d="'+line('v')+' L'+X(Y).toFixed(1)+' '+Yp(0).toFixed(1)+' L'+X(0).toFixed(1)+' '+Yp(0).toFixed(1)+' Z" fill="var(--accent-soft)" stroke="none"/>'+
      '<path d="'+line('c')+'" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>'+
      '<path d="'+line('v')+'" fill="none" stroke="var(--accent)" stroke-width="2.5"/>'+
      '<circle cx="'+X(Y).toFixed(1)+'" cy="'+Yp(bal).toFixed(1)+'" r="4" fill="var(--accent)"/>'+lab+'</svg>';
    var right='<h2>If you invested some of it</h2><p class="s">An illustration of compounding, using your savings from the left.</p>'+
      '<div class="sv-big">'+whole(bal)+' <small>after '+Y+' years</small></div>'+
      '<p class="s" style="margin:2px 0 0">'+whole(contrib)+' put in, '+whole(growth)+' growth'+(state.real?' (in today\'s dollars)':'')+'</p>'+chart+
      '<div class="sv-legend"><span><i></i>Projected value</span><span><i class="d"></i>Money you deposited</span></div>'+
      '<div class="sv-h">Share of savings invested</div>'+sChips('share',[25,50,100],function(v){return v+'%'})+
      '<div class="sv-line"><span>Monthly deposit</span><b>'+money(mon)+'</b></div>'+
      '<div class="sv-h">For how long</div>'+sChips('years',[5,10,20,30],function(v){return v+' years'})+
      '<div class="sv-h">Assumed yearly return</div>'+sChips('rate',[3,5,7],function(v){return v+'%'})+
      '<div class="chips">'+chip('data-svtog="real"','Adjust for 2.5% inflation',state.real)+'</div>'+
      '<p class="note" style="margin-top:12px"><b>Hypothetical illustration, not investment advice.</b> Real returns are not guaranteed, vary year to year and can be negative. Funds that hold many companies at once, such as broad index funds and ETFs, spread risk, and low fees matter over long periods. Pick based on your own goals, or talk to a licensed adviser.</p>';
    $('#svRight').innerHTML=right;
  }
  $('#savings').addEventListener('click',function(e){
    var t=e.target.closest('button');if(!t)return;
    if(t.dataset.sv){state[t.dataset.sv]=+t.dataset.v}
    else if(t.dataset.svtog){state[t.dataset.svtog]=!state[t.dataset.svtog]}
    else return;
    persist();renderSavings(buildPlan());
  });

  /* ---------- onboarding ---------- */
  var STORES=['Walmart','Kroger','Aldi','Costco','Target',"Trader Joe's",'Safeway','Whole Foods'];
  var SAVES=['Weekly flyer sales','Store-brand swaps','Buy in bulk','Frozen and precooked deals','Coupons and loyalty apps'];
  var DIETS=['Vegetarian','No pork','Dairy-free','Gluten-free','Nut allergy'];
  var PERISH=['milk','eggs','spinach','bread','chicken thighs','cheese'];
  var STAPLES=['rice','pasta','canned beans','soy sauce'];
  var ZIPRE={US:/^\d{5}$/,CA:/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,UK:/^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/};
  var ZIPHINT={US:'5 digits, like 60614',CA:'like M5V 2T6',UK:'like SW1A 1AA'};
  var NST=7, ob={step:0,d:null,perish:{},staple:{},err:''}, obEl=null;

  function chip(attr,label,on){return '<button type="button" class="chip" aria-pressed="'+!!on+'" '+attr+'>'+esc(label)+'</button>'}
  function inRange(){return STORES.filter(function(s){return +dist(s)<=ob.d.radius})}

  function startOb(editing){
    ob.d=JSON.parse(JSON.stringify(state));ob.err='';ob.step=0;ob.perish={};ob.staple={};
    if(editing||state.onboarded){
      state.pantry.forEach(function(p){if(p.d>=60){if(STAPLES.indexOf(p.n)>=0)ob.staple[p.n]=true}else if(PERISH.indexOf(p.n)>=0)ob.perish[p.n]=p.d});
    }else{
      STAPLES.forEach(function(n){ob.staple[n]=true});
      try{var sv=JSON.parse(localStorage.getItem('wp-ob')||'null');if(sv&&sv.d){ob.d=sv.d;ob.step=sv.step||0;ob.perish=sv.perish||{};ob.staple=sv.staple||{}}}catch(e){}
    }
    if(!obEl){obEl=document.createElement('div');obEl.className='ob';obEl.setAttribute('role','dialog');obEl.setAttribute('aria-label','Set up your profile');document.body.appendChild(obEl)}
    obEl.hidden=false;document.body.style.overflow='hidden';drawOb();
  }
  function saveDraft(){try{localStorage.setItem('wp-ob',JSON.stringify({d:ob.d,step:ob.step,perish:ob.perish,staple:ob.staple}))}catch(e){}}

  function drawOb(){
    var d=ob.d,s=ob.step,h='';
    if(s===0){
      h='<h2>What should we call you?</h2><p class="obs">Just a first name.</p><input type="text" data-f="name" value="'+esc(d.name)+'" maxlength="30" placeholder="First name" aria-label="First name">'+
        '<h3>Who is eating dinner?</h3><div class="chips">'+SIZES.map(function(z){return chip('data-set="size" data-v="'+z.id+'"',z.l,d.size===z.id)}).join('')+'</div>'+
        '<h3>Any kids under 12?</h3><div class="chips">'+[0,1,2,3,4].map(function(k){return chip('data-set="kids" data-v="'+k+'"',k===0?'None':String(k),d.kids===k)}).join('')+'</div>'+
        (d.kids>0?'<p class="obs">Kids eat less than the per-person calories shown. Treat those numbers as an adult figure.</p>':'');
    }else if(s===1){
      h='<h2>Where do you shop?</h2><p class="obs">We use this to find sales at stores near you.</p>'+
        '<div class="row2"><select data-f="country" aria-label="Country"><option value="US"'+(d.country==='US'?' selected':'')+'>US</option><option value="CA"'+(d.country==='CA'?' selected':'')+'>Canada</option><option value="UK"'+(d.country==='UK'?' selected':'')+'>UK</option></select>'+
        '<input type="text" data-f="zip" value="'+esc(d.zip)+'" placeholder="Zip or postal code" maxlength="8" autocomplete="postal-code" aria-label="Zip or postal code"></div>'+
        '<p class="obs" style="margin-top:6px">'+ZIPHINT[d.country]+'. We store the code only, not your exact location.</p>';
    }else if(s===2){
      d.stores=d.stores.filter(function(x){return inRange().indexOf(x)>=0});
      h='<h2>Pick your stores</h2><p class="obs">Tap the stores you shop at. Star your favorite and we show its deals first.</p>'+
        '<h3>How far will you go for a deal?</h3><div class="chips">'+[3,5,10].map(function(r){return chip('data-set="radius" data-v="'+r+'"','Within '+r+' mi',d.radius===r)}).join('')+'</div>'+
        (inRange().length?inRange().map(function(n){var on=d.stores.indexOf(n)>=0;return '<div class="srow">'+chip('data-store="'+esc(n)+'"',n+' · about '+dist(n)+' mi',on)+(on?'<button type="button" class="star" data-pref="'+esc(n)+'" aria-pressed="'+(d.pref===n)+'" aria-label="Favorite '+esc(n)+'">★</button>':'')+'</div>'}).join(''):'<p class="obs">No sample stores in that range. Try a larger distance.</p>')+
        '<h3>Another store?</h3><input type="text" data-f="other" value="'+esc(d.other)+'" placeholder="Store name (optional)" maxlength="40" aria-label="Another store">'+
        '<p class="consent">Store names and distances are examples. A live version looks up real stores near your zip code.</p>';
    }else if(s===3){
      h='<h2>How do you like to save?</h2><p class="obs">Pick any that apply.</p><div class="chips">'+SAVES.map(function(v){return chip('data-tog="saves" data-v="'+esc(v)+'"',v,d.saves.indexOf(v)>=0)}).join('')+'</div>'+
        '<h3>Loyalty cards you have</h3><input type="text" data-f="loyalty" value="'+esc(d.loyalty)+'" placeholder="e.g. Kroger Plus, Target Circle" maxlength="80" aria-label="Loyalty cards">';
    }else if(s===4){
      h='<h2>Budget, time and style</h2>'+
        '<h3>Weekly dinner budget</h3><div class="chips">'+BUDGETS.map(function(b){return chip('data-set="budget" data-v="'+b.id+'"',b.l+' · '+money(b.per*d.size*7)+'/wk',d.budget===b.id)}).join('')+'</div>'+
        '<h3>Longest weeknight cook</h3><div class="chips">'+TIMES.map(function(t){return chip('data-set="time" data-v="'+t.id+'"',t.l,d.time===t.id)}).join('')+'</div>'+
        '<h3>Cooking style</h3><div class="chips">'+STYLES.map(function(t){return chip('data-set="style" data-v="'+t.id+'"',t.l,d.style===t.id)}).join('')+'</div>'+
        '<h3>Food needs</h3><div class="chips">'+DIETS.map(function(v){return chip('data-tog="diet" data-v="'+esc(v)+'"',v,d.diet.indexOf(v)>=0)}).join('')+'</div>'+
        (d.diet.indexOf('Nut allergy')>=0?'<p class="obs">None of the 16 sample dinners use nuts, but always check labels.</p>':'');
    }else if(s===5){
      h='<h2>What\'s in your kitchen?</h2><p class="obs">Tap what you have. We plan around what runs out first.</p>'+
        '<div class="chips">'+PERISH.map(function(n){return chip('data-per="'+esc(n)+'"',n,ob.perish[n]!==undefined)}).join('')+'</div>'+
        PERISH.filter(function(n){return ob.perish[n]!==undefined}).map(function(n){return '<div class="prow"><b>'+esc(n)+'</b><select data-perd="'+esc(n)+'" aria-label="Days left for '+esc(n)+'">'+[1,2,3,4,5,7,10,14].map(function(v){return '<option value="'+v+'"'+(ob.perish[n]===v?' selected':'')+'>'+v+(v===1?' day left':' days left')+'</option>'}).join('')+'</select></div>'}).join('')+
        '<h3>Staples you always keep</h3><div class="chips">'+STAPLES.map(function(n){return chip('data-stp="'+esc(n)+'"',n,ob.staple[n])}).join('')+'</div>'+
        '<h3>Expiry reminders</h3><div class="chips">'+chip('data-rem="1"','Remind me the evening before',d.remindOn)+'</div>'+
        (d.remindOn?'<div class="chips">'+['5pm','6pm','7pm'].map(function(t){return chip('data-set="remind" data-v="'+t+'"',t,d.remind===t)}).join('')+'</div>':'');
    }else{
      var bud=BUDGETS.filter(function(b){return b.id===d.budget})[0];
      var rows=[['You',(d.name||'—')+' · '+SIZES.filter(function(z){return z.id===d.size})[0].l,0],
        ['Location',d.zip.toUpperCase()+' ('+d.country+'), within '+d.radius+' mi',1],
        ['Stores',(d.stores.length?d.stores.join(', '):'None picked, showing all samples')+(d.pref?' · favorite '+d.pref:'')+(d.other?' · also '+d.other:''),2],
        ['Saving',d.saves.length?d.saves.join(', '):'No preference',3],
        ['Dinner plan',bud.l+' budget · '+d.time+' min · '+STYLES.filter(function(t){return t.id===d.style})[0].l+(d.diet.length?' · '+d.diet.join(', '):''),4],
        ['Kitchen',Object.keys(ob.perish).length+' fresh items, '+Object.keys(ob.staple).filter(function(k){return ob.staple[k]}).length+' staples',5]];
      h='<h2>Ready to plan, '+esc(d.name||'friend')+'</h2><p class="obs">Check your details. Tap Edit to change any of them.</p>'+
        rows.map(function(r){return '<div class="sum-row"><div><span>'+r[0]+'</span>'+esc(r[1])+'</div><button type="button" class="btn" data-goto="'+r[2]+'">Edit</button></div>'}).join('')+
        '<p class="consent">Your zip code and store choices are used only to find deals for you. They stay on this device. You can change or delete them any time from the top of the page.</p>';
    }
    var empty=(s===2&&!d.stores.length&&!d.other)||(s===3&&!d.saves.length&&!d.loyalty)||(s===5&&!Object.keys(ob.perish).length);
    obEl.innerHTML='<div class="ob-card"><div class="ob-top"><span>Step '+(s+1)+' of '+NST+'</span><span>Pinch</span></div><div class="ob-bar"><i style="width:'+((s+1)/NST*100)+'%"></i></div>'+h+
      (ob.err?'<p class="err" role="alert">'+esc(ob.err)+'</p>':'')+
      '<div class="ob-nav">'+(s>0?'<button type="button" class="btn ghost" data-nav="back">Back</button>':'')+
      '<button type="button" class="btn primary" data-nav="next">'+(s===NST-1?'Build my week':(empty?'Skip':'Next'))+'</button></div></div>';
  }

  function validate(){
    var d=ob.d;
    if(ob.step===0&&!d.name.trim())return 'Enter a first name so we know what to call you.';
    if(ob.step===1&&!ZIPRE[d.country].test(d.zip.trim()))return 'That code does not look right. Try '+ZIPHINT[d.country]+'.';
    return '';
  }
  function finish(){
    var d=ob.d;
    ['name','kids','country','zip','radius','stores','pref','other','saves','loyalty','diet','remindOn','remind','size','budget','time','style'].forEach(function(k){state[k]=d[k]});
    state.name=state.name.trim();state.zip=state.zip.trim().toUpperCase();
    var keep=state.onboarded?state.pantry.filter(function(p){return PERISH.indexOf(p.n)<0&&STAPLES.indexOf(p.n)<0}):[];
    var pantry=keep;
    Object.keys(ob.perish).forEach(function(n){pantry.push({n:n,d:ob.perish[n],r:state.remindOn&&ob.perish[n]<=3})});
    STAPLES.forEach(function(n){if(ob.staple[n])pantry.push({n:n,d:999,r:false})});
    state.pantry=pantry;state.onboarded=true;over={};
    persist();try{localStorage.removeItem('wp-ob')}catch(e){}
    obEl.hidden=true;document.body.style.overflow='';
    render();window.scrollTo(0,0);
  }

  document.addEventListener('click',function(e){
    if(!obEl||obEl.hidden||!obEl.contains(e.target))return;
    var t=e.target.closest('button');if(!t)return;
    var d=ob.d, a;
    if((a=t.dataset.nav)){
      if(a==='back'){ob.step--;ob.err=''}
      else{var er=validate();if(er){ob.err=er}else{ob.err='';if(ob.step===NST-1)return finish();ob.step++}}
      saveDraft();drawOb();obEl.scrollTop=0;return;
    }
    if(t.dataset.set){var v=t.dataset.v,k=t.dataset.set;d[k]=(k==='size'||k==='kids'||k==='radius'||k==='time')?+v:v}
    else if(t.dataset.tog){var arr=d[t.dataset.tog],i=arr.indexOf(t.dataset.v);if(i<0)arr.push(t.dataset.v);else arr.splice(i,1)}
    else if(t.dataset.store){var st=d.stores,j=st.indexOf(t.dataset.store);if(j<0)st.push(t.dataset.store);else{st.splice(j,1);if(d.pref===t.dataset.store)d.pref=''}}
    else if(t.dataset.pref){d.pref=d.pref===t.dataset.pref?'':t.dataset.pref}
    else if(t.dataset.per){var n=t.dataset.per;if(ob.perish[n]!==undefined)delete ob.perish[n];else ob.perish[n]=PERISH.indexOf(n)<0?5:({milk:5,eggs:10,spinach:4,bread:5,'chicken thighs':2,cheese:14}[n]||5)}
    else if(t.dataset.stp){ob.staple[t.dataset.stp]=!ob.staple[t.dataset.stp]}
    else if(t.dataset.rem){d.remindOn=!d.remindOn}
    else if(t.dataset.goto!==undefined){ob.step=+t.dataset.goto}
    else return;
    saveDraft();drawOb();
  });
  document.addEventListener('input',function(e){
    if(!obEl||obEl.hidden||!obEl.contains(e.target))return;
    var f=e.target.dataset.f;if(f){ob.d[f]=e.target.value;saveDraft()}
  });
  document.addEventListener('change',function(e){
    if(!obEl||obEl.hidden||!obEl.contains(e.target))return;
    var t=e.target;
    if(t.dataset.perd){ob.perish[t.dataset.perd]=+t.value;saveDraft()}
    if(t.dataset.f==='country'){ob.err='';drawOb()}
  });

  $('#profile').addEventListener('click',function(e){
    var id=e.target.id, box=e.currentTarget.querySelector('.pbtn');
    if(id==='editProf')startOb(true);
    else if(id==='delData')box.innerHTML='<span style="color:var(--muted)">Delete your profile and pantry?</span><button class="btn" type="button" id="delNo">Cancel</button><button class="btn" type="button" id="delYes" style="color:var(--bad)">Yes, delete</button>';
    else if(id==='delNo')renderProfile();
    else if(id==='delYes'){
      state=JSON.parse(BASE);over={};checked={};
      try{localStorage.removeItem('wp-state');localStorage.removeItem('wp-ob')}catch(er){}
      render();startOb(false);
    }
  });

  render();
  if(!state.onboarded)startOb(false);
})();
