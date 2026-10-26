const IMG=document.body.dataset.img||'img/';
const SEANCES=[
 {t:"Première séance",d:"75 min",p:70,img:IMG+"respiration.jpg",alt:"Main posée sur la poitrine, respiration calme",txt:"Un temps pour faire connaissance, comprendre ce qui vous amène et découvrir vos premiers exercices.",l:["Échange sur vos attentes","Premiers exercices de respiration","Un exercice à refaire chez vous"]},
 {t:"Séance de suivi",d:"60 min",p:60,img:IMG+"feuilles.jpg",alt:"Feuilles d'eucalyptus dans une lumière douce",txt:"On reprend où l'on s'était arrêté et on approfondit les exercices qui vous font du bien.",l:["Point sur la semaine écoulée","Pratique guidée","Ajustement de vos exercices"]},
 {t:"Séance en visio",d:"60 min",p:60,img:IMG+"cabinet.jpg",alt:"Fauteuil près d'une fenêtre, à la maison",txt:"La même séance, depuis chez vous, avec un simple lien vidéo envoyé après confirmation.",l:["Lien envoyé par e-mail","Pratique depuis votre fauteuil","Idéal hors de Marseille"]},
 {t:"Forfait 5 séances",d:"5 × 60 min",p:275,img:IMG+"mer.jpg",alt:"Femme assise face à la mer au coucher du soleil",txt:"Un accompagnement complet sur quelques semaines, pour installer durablement de nouveaux repères.",l:["Cinq séances à votre rythme","Programme adapté à votre objectif","Réservation de la première séance"]}
];
const $=s=>document.querySelector(s);
const etat={seance:null,jour:null,heure:null};

/* menu mobile */
const burger=$('.burger'),menu=$('#menu');
burger.addEventListener('click',()=>{const o=menu.classList.toggle('ouvert');burger.setAttribute('aria-expanded',o)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('ouvert');burger.setAttribute('aria-expanded',false)}));

if(document.getElementById('choix-seance')){
/* réservation */
const pas=document.querySelectorAll('.pas i');
function ecran(n){document.querySelectorAll('.ecran').forEach(e=>e.classList.remove('on'));$('#e'+n).classList.add('on');pas.forEach((p,k)=>p.classList.toggle('on',k<Math.min(n,4)));const h=$('#e'+n+' h3');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}}
const cs=$('#choix-seance');
SEANCES.forEach((s,i)=>{const b=document.createElement('button');b.setAttribute('aria-pressed','false');b.innerHTML=`<span>${s.t}<small>${s.d}</small></span><b>${s.p} €</b>`;b.addEventListener('click',()=>choisirSeance(i,true));cs.appendChild(b)});
function choisirSeance(i,resterIci){
  etat.seance=i;cs.querySelectorAll('button').forEach((b,k)=>b.setAttribute('aria-pressed',k===i));
  $('#s1').disabled=false;recap();
}
$('#s1').addEventListener('click',()=>ecran(2));

const nomsJ=['lun','mar','mer','jeu','ven','sam','dim'];
const auj=new Date();auj.setHours(0,0,0,0);
const jours=$('#jours');
$('#mois').textContent=auj.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}).replace(/^./,c=>c.toUpperCase());
nomsJ.forEach(n=>{const s=document.createElement('span');s.className='nom';s.textContent=n;jours.appendChild(s)});
const debut=new Date(auj);debut.setDate(auj.getDate()-((auj.getDay()+6)%7));
for(let k=0;k<21;k++){
  const d=new Date(debut);d.setDate(debut.getDate()+k);
  const b=document.createElement('button');b.className='jour';b.textContent=d.getDate();
  const ferme=d<=auj||d.getDay()===0||d.getDay()===1||k%9===4;
  b.disabled=ferme;b.setAttribute('aria-label',d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})+(ferme?' (indisponible)':''));
  b.setAttribute('aria-pressed','false');
  b.addEventListener('click',()=>{etat.jour=d;etat.heure=null;jours.querySelectorAll('.jour').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');heures(d);recap();$('#s2').disabled=true});
  jours.appendChild(b);
}
function heures(d){
  const base=['9 h 30','11 h','14 h','15 h 30','17 h','18 h 30'];
  const libres=base.filter((h,i)=>(d.getDate()+i)%4!==0);
  const z=$('#zone-heures');z.innerHTML='<div class="heures"></div>';
  libres.forEach(h=>{const b=document.createElement('button');b.className='heure';b.textContent=h;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{etat.heure=h;z.querySelectorAll('.heure').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');$('#s2').disabled=false;recap()});z.firstChild.appendChild(b)});
}
$('#s2').addEventListener('click',()=>ecran(3));
$('#s3').addEventListener('click',()=>{
  const ids=['prenom','nom','email','tel'];
  for(const id of ids){const el=$('#'+id);if(!el.value.trim()||(id==='email'&&!/^\S+@\S+\.\S+$/.test(el.value))){$('#err').textContent=id==='email'&&el.value?'Cette adresse e-mail ne semble pas valide.':'Merci de remplir ce champ.';el.focus();return}}
  $('#err').textContent='';ecran(4);
});
$('#s4').addEventListener('click',()=>{const s=SEANCES[etat.seance];$('#msg-ok').textContent=`${s.t} le ${etat.jour.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})} à ${etat.heure}. Laure confirme votre rendez-vous sous 24 h par e-mail ; vous recevrez un rappel la veille.`;ecran(5)});
document.querySelectorAll('[data-retour]').forEach(b=>b.addEventListener('click',()=>ecran(+b.dataset.retour)));
$('#recommencer').addEventListener('click',()=>{Object.assign(etat,{seance:null,jour:null,heure:null});cs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));jours.querySelectorAll('.jour').forEach(x=>x.setAttribute('aria-pressed','false'));$('#zone-heures').innerHTML='<p class="vide">Choisissez un jour pour voir les horaires disponibles.</p>';$('#s1').disabled=true;$('#s2').disabled=true;recap();ecran(1)});
const pS=new URLSearchParams(location.search).get('s');if(pS!==null&&SEANCES[+pS])choisirSeance(+pS);
function recap(){
  const s=etat.seance!=null?SEANCES[etat.seance]:null;
  $('#r-seance').textContent=s?s.t:'—';
  $('#r-date').textContent=etat.jour?etat.jour.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}):'—';
  $('#r-heure').textContent=etat.heure||'—';
  $('#r-prix').textContent=s?s.p+' €':'—';
}

}
/* apparitions */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vu');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
