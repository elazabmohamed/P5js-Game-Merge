//       kullanacağımız değikenleri tanımlama işlemi
var daire=[2];
var butonlar=[];
var oklar=[]
var renkler1=['#c2bf5f','#1f7d93', '#1f936f'];
var renkler2=['#9a4022','#6d1691', '#2e3ba6'];
var circleSize=155;
var renk;
var ivme1=0.6;
var ivme2=-0.6;
var baslangicKontrol=0;
var levelKontrol=0;
var myFont;
var startSong;
var playSong;
var levelSong;
var finishSong;
var timer=10;
var timerChange=5;
var score=0;
var renk1='#0d88a5';
var renk2='#1f936f';
var renkFont='#DD255D';

function preload() {
  //      Ses dosyaları setup fn'dan önce çalışacak preload fn'da yazdık ve ses seviyesini belirttik
  myFont = loadFont('libraries/Fonts/StartingFont.ttf');
  startSong = loadSound("libraries/Sounds/Game-Project-8-StartingMusic.mp3");
  playSong = loadSound("libraries/Sounds/Game-Project-8-PlayingMusic.mp3");
  levelSong = loadSound("libraries/Sounds/Game-Project-8-LevelMusic.mp3");
  finishSong = loadSound("libraries/Sounds/Game-Project-8-FinishingMusic.mp3");
  startSong.setVolume(0.1);
  playSong.setVolume(0.1);
  levelSong.setVolume(0.1);
  finishSong.setVolume(0.1);
}

function setup() {
  createCanvas(900, 600, WEBGL);
  background(51);
  Giris();
}

function Giris() {
  // Giriş ekranın nasıl bir formatı olacağını buradan ayarladık
  startSong.loop();
  fill(renkFont);
  textFont(myFont);
  textSize(20);
  textAlign(CENTER);
  text('Press Space to Start The Game!', 0,0);
  text('HAVE FUN!', 0, -(height/2)+25);
//  en altta olan classları kullanarak oyuncunun yönlendirmesi için girş ekranında buton şekillerini oluşturduk
  butonlar[1]=new Buton('W', -width/4-40,height/2-150,40);
  butonlar[1].show();
  butonlar[2]=new Buton('A', -width/4-100,height/2-90,40);
  butonlar[2].show();
  butonlar[3]=new Buton('S', -width/4-40,height/2-90,40);
  butonlar[3].show();
  butonlar[4]=new Buton('D', -width/4+20,height/2-90,40);
  butonlar[4].show();
//  oklar için rectlerin içi boş bırakıldı
  butonlar[5]=new Buton('', width/4-40,height/2-155,40);
  butonlar[5].show();
  butonlar[6]=new Buton('', width/4-100,height/2-95,40);
  butonlar[6].show();
  butonlar[7]=new Buton('', width/4-40,height/2-95,40);
  butonlar[7].show();
  butonlar[8]=new Buton('', width/4+20,height/2-95,40);
  butonlar[8].show();
//  okları göstermek için show, gerekirse yönünü değiştirmek translate sonra rotate + push ve pop fonksiyonlarını kullandık
  angleMode(DEGREES);
  oklar[1]=new Ok(width/4-40,height/2-177.5, 10);
  oklar[1].show();
  push();
  translate(width/4-112.5,height/2-105);
  rotate(-90);
  oklar[2]=new Ok(0,0, 10);
  oklar[2].show();
  pop();

  push();
  translate(width/4-40,height/2-94);
  rotate(180);
  oklar[3]=new Ok(0,0, 10);
  oklar[3].show();
  pop();

  push();
  translate(width/4+32.5,height/2-105);
  rotate(90);
  oklar[4]=new Ok(0,0, 10);
  oklar[4].show();
  pop();

}


function draw() {
//    Space'e basıldığı an baslangıcKontrol değişkeni 0dan 1e set edilerek oyunu başlatmış oluyoruz
  if(baslangicKontrol==1){
  background(51);
  fill(renkFont);
  textFont(myFont);
  textSize(20);
  //  Score ve Timerin nerede gösterileceğini buradan ayarladık,
  //  timer-1 şeklinde göstermemizin sebebi timer sıfırlandığı
  //  anda -1 göstermemesi için 0a gelince bitimiş gibi görünecek.
  text((timer-1)+'sc',  (width/2)-40,-(height/2)+20);
  text('score '+score, -(width/2)+70,-(height/2)+20);
  // timer başlatılıyor
  timerF();
  //  iki dairenin intialladıktan sonra hareketlerini güncellemek için update,
  //  arasındaki bağlantıyı göstermek için show,
  //  ve sınırlara temas etme kontrolu için checkGameStatus() fonksiyonlarını kullandık
  daire[1].update();
  daire[1].show( daire[2]);
  daire[1].checkGameStatus();
  daire[2].update();
  daire[2].show( daire[1]);
  daire[2].checkGameStatus();
//  eğer daireler birbiriyle birleişirse bir sonraki levele atlayacak ve
//  oyunu zorlaştımak için dairelerin constructorlarına daha küçük size verilecek
  while (daire[1].merge(daire[2])) {
    //  kullanıcı kaç saniyede level atlyabilirse ona bağlı olarak kendine performansına özel score'u olacak-
    //  küçük bir sayı olmasın diye keyfi olarak 10 sayısını ekledik
    score+=10+timer;
    //  kullanıcının level atladığı anda kısa bir müzik çalacak
    //  sonra levelKontrol değişkenine hangi levelde olunduğu atılacak
    levelSong.play();
    levelKontrol++;
    levelAtla(circleSize-=25, levelKontrol);
    // timer değişmesi şu şekilde çalışır; timerin orijinal değerine reset edip sonra timerChange deki olan değeri ekliyor.
    // eklemenin sebebi de level atladıkça zaman artacak
    // ama oyunun zorlaştığı için bir önceki levelle daha aynı süre verilmesi mantıklı olmaz.
    // bu yüzden abartılı olmayan şekilde arttırmamız lazım.
    timer=7+timerChange;
    // bir sonraki levelin süresine  ekleyeceğimiz saniye sayısı daha az olacak.
    timerChange--;
      }
  }
}

//    daireleri ilk halini başlatan fonksiyon
function baslat(){
  daire[1] = new Daire(random(-(width/2)+120,(width/2)-120),random(-(height/2)+120, (height/2)-120),150, random(renkler1));
  daire[2] = new Daire(random(-(width/2)+120,(width/2)-120),random(-(height/2)+120, (height/2)-120),150, random(renkler2));
  //  daireler uygun olmayan bir yerde başlarsa otomatik olarak yeniden başlatır,
  //  örneğin; bir daire temas yapmış şekilde ya da
  //  sınrı aşmış şekilde başlarsa kazanılıp ya da kaydedilip değil de oyun baştan başlatılır
  while(daire[1].merge(daire[2]) || daire[1].checkTheFirstGameStatus() || daire[2].checkTheFirstGameStatus() ){baslat();}
}


//    oyunun bir sonraki leveline atlıyor
function levelAtla(size, levelKontrol){
  // altıncı levelde oyunu tamamladık
  if(levelKontrol==6){
    finishGame('Congrats!', 'You have reached the final level!', score);
  }
  else{
    daire[1] = new Daire(random(-(width/2)+120,(width/2)-120),random(-(height/2)+120, (height/2)-120),size, random(renkler1));
    daire[2] = new Daire(random(-(width/2)+120,(width/2)-120),random(-(height/2)+120, (height/2)-120),size, random(renkler2));
    while(daire[1].merge(daire[2]) || daire[1].checkTheFirstGameStatus() || daire[2].checkTheFirstGameStatus() ){levelAtla(this.size());}
  }
}


// timer fonksiyonu
function timerF(){
  if(baslangicKontrol==1){
     // frameCount 60'a bölünüyorsa bir saniye geçmiş anlamına gelir
    if (frameCount % 60 == 0 && timer > 0) {
     timer --;
   }
   // sıfıra geldiğinde oyunu sonlandırıyor
   if (timer == 0) {
     fill(renkFont);
     textFont(myFont);
     textSize(20);
     finishGame("TIME OUT!", "", score);
     }
   }
}



//    oyunu sonlandıran fonksiyon,
//    iki keyfi doldurulabilecek text alanı verir + score'u gösterir
//    melankolik müzik çalmaya başlar
//    bütün reset edilmesi gereken fonksiyonları eski haline reset ediyoruz, boyut,levelKontrol, baslangicKontrol vs.
function finishGame(shownText, opText, opTextforScore){
  fill(renkFont);
  textFont(myFont);
  textSize(27);
  text(shownText, 0,(-height/2)+50);
  textSize(15);
  text(opText, 0,30);
  textSize(27);
  text('Your Score is ' + opTextforScore +' !', 0,(height/2)-100);
  playSong.stop();
  finishSong.loop();
  circleSize=155;
  ivme1=0.6;
  ivme2=-0.6;
  baslangicKontrol=0;
  levelKontrol=0;
  timer=10;
  timerChange=5;
  score=0;
  text('Press Space to Play Again!', 0,(height/2)-30);

}


//    objeleri hareket ettirmek için hangi butonların kullanılacağını ve ne işlemlerin yapılacağını buradan ayarlıyoruz
//    oyunu zorlaştırmak için herhangi bir butona basıldığı an yön değişmekle berbaber ivme artıyor
function keyPressed(){
    // 1. dairenin hareketi
  if(keyCode==UP_ARROW){
  daire[1].direction(0, ivme2-=0.5);
  }
  else if(keyCode==DOWN_ARROW){
   daire[1].direction(0, ivme1+=0.5);
  }
  else if(keyCode==RIGHT_ARROW){
   daire[1].direction(ivme1+=0.5, 0);
  }
  else if(keyCode==LEFT_ARROW){
   daire[1].direction(ivme2-=0.5, 0);
  }
  // 2. dairenin hareketi
  if(keyCode==87){
  daire[2].direction(0, ivme2-=0.5);
  }
  else if(keyCode==83){
   daire[2].direction(0, ivme1+=0.5);
  }
  else if(keyCode==68){
   daire[2].direction(ivme1+=0.5, 0);
  }
  else if(keyCode==65){
   daire[2].direction(ivme2-=0.5, 0);
  }
//    space basılıysa oyunu başlatır ve baslangıcKontrol 0dan b1e alıre
//    burada space butonunu ile beraber baslangıcKontrol değişkenini logical AND işlemine sokmamızın sebebi
//    oyuncuya kaybedene/kazanana kadar oyun ortasında oyunu yeniden başlatma hakkı sağlamamak
  if(keyCode==32&&baslangicKontrol==0){
  baslangicKontrol=1;
  // oyun esnasında çalacak müziği buradan başlatılıyoruz döngüye sokulmuş şekilde
  finishSong.pause();
  startSong.pause();
  playSong.loop();
  baslat();
  }
}

//  daire classı
class Daire{
  //    dairenin koordinatlarını boyutunu ve rengini buradan ayarlıyoruz
  constructor(x,y,size, renk){
  let xvelocity, yvelocity;
  this.x=x;
  this.y=y;
  this.size=size;
  this.renk=renk;
  this.xvelocity=1;
  this.yvelocity=0;
  }
  update(){
  //  üstteki draw fonksiyonun içinde hareketi gücellemek için kullandığımız update fonksiyonun işlemi buradan yapıyoruz
  this.x = this.x + this.xvelocity;
  this.y = this.y + this.yvelocity;
  }
  //  objeyle ilgili bütün her şeyi görmemizi sağlayan fonksiyon
  show(obje){
    noFill();
    strokeWeight(10);
    stroke(this.renk);
    //  oyuncunun orijinal olarak hareket ettirdiği daire bir sonraki satırda bulunur
    ellipse(this.x, this.y, this.size);
//          dairenin içindeki şekilleri buradan yapıyoruz +
//          farklı boyutlarda daireler şeklinde iki dairenin arasındaki bağlantıyı buradan oluşutuyoruz
    strokeWeight(1);
    for(let i=0; i<15; i++){
      //  görsel bir etki eklemek amacyla diğer daireler ile bağlanıtılı olsun diye daire objesini show fonksiyonu içine attık
      //  ve buradan koordinatlarına göre bağlantıyı kurduk
                  circle(random(this.x,obje.x/2),random(this.y,obje.y/2),random(30));
    }
//         görsel bir etki eklemek için daire içi şekiller
    for(let i=0; i<9; i++){
               circle(this.x,this.y,random(50));
    }
    strokeWeight(1);
    rectMode(CENTER);
    for(let i=0; i<9; i++){
              rect(this.x,this.y,random(50),random(50));
    }
}
//                               yön beliritilir.
  direction(x,y){
   this.xvelocity=x;
   this.yvelocity=y;
  }
//                           objelerin birleşip birleşmediği kontrol edilir.
  merge(obje){
    var d = dist(this.x, this.y, obje.x, obje.y);

    if (d <=17) {
      //  geçmesi çok hızlı olan bir daire şekli gösterilir level atlandığı anda
      noFill();
      strokeWeight(random(7));
      stroke(renkFont);
      circle(this.x-20, this.y-20, random(200));
      //  asıl olan fonksiyonun amacı burada, birleşirse true gönderir ve draw fonksiyonunda level atlanır
    return true;
    } else {
    return false;
    }
  }
//        baslat ve levelAtla fonksiyonlarında oyunun uygun halde başlayıp başlamadğını kontrol eden kullandığımız fonksiyon
  checkTheFirstGameStatus(){
    if (
      //  5 eklememizin sebebi ellipselerin stroke'a sahip olması
      this.x> (width/2)-(5+this.size/2) ||
      this.x < (-width/2)+(5+this.size/2) ||
      this.y> (height/2)-(5+this.size/2)||
      this.y < (-height/2)+(5+this.size/2))
      {
        return true;
      }
  }
  //   draw fonksiyonunda dairelerin frame sınırlarını aşıp aşmadığını kontrol ederek aşarsa oyunu sonlandıran fonksiyonu çağıran fonksiyon
  checkGameStatus() {
  if (
    this.x> (width/2)-(5+this.size/2) ||
    this.x < (-width/2)+(5+this.size/2) ||
    this.y> (height/2)-(5+this.size/2)||
    this.y < (-height/2)+(5+this.size/2)){
    finishGame('Game Ended!','', score);
  }
}
}

//    Giriş ekranında oyuncunun nasıl oynayacağını gösteren ok ve buton şekillerini iki farklı class yaparak oluştruyoruz
class Buton{
  constructor(harf,x,y,size){
this.harf=harf;
this.x=x;
this.y=y;
this.size=size;
  }
show(){
rectMode(CENTER);
textAlign(CENTER);
strokeWeight(1);
noFill();
stroke(renkFont);
rect(this.x,this.y-10,this.size,this.size);
fill(renkFont);
textFont(myFont);
textSize(this.size-20);
text(this.harf, this.x, this.y);
  }
}
class Ok{
  constructor(x,y,size){
  this.x=x;
  this.y=y;
  this.size=size;
    }
show(){
  noFill();
  strokeCap(ROUND);
  strokeWeight(3);
  beginShape(LINES);
  vertex(this.x,this.y);
  vertex(this.x-this.size,this.y+this.size*2);
  vertex(this.x+this.size,this.y+this.size*2);
  vertex(this.x-this.size,this.y+this.size*2);
  vertex(this.x+this.size,this.y+this.size*2);
  endShape(CLOSE);
  }
}
