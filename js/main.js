class Monitor {
    constructor ({rows, columns}) {
        this.rows=rows;
        this.columns=columns;
        this.allBrick=this.rows*this.columns;
        this.map=[];
        this.menuSwitch=true;
        this.divMonitor=document.getElementById('monitor');
        this.divHead=document.getElementById('head');
        this.divMenu=document.getElementById('menu');
        this.divDisplay=document.getElementById('display');
        this.divDisplay.style.display="none";
        this.divDisplay.style.innerHTML="";
        this.createBrick();
        this.mapCreate();
        this.onresizeWindow();
        window.onresize = this.onresizeWindow;
    }

    createAnyElement = (name, attributes) => {
        let element=document.createElement(name);
        for (let n in attributes) { element.setAttribute(n, attributes[n]); }
        return element;
    }

    createBrick = () => {
        let dominoColums="";
        let dominoRows="";

        for (let n=0; n<this.columns; n++) {
            dominoColums+="1fr ";
        }
        for (let m=0; m<this.rows; m++) {
            dominoRows+="1fr ";
        }
        this.divDisplay.style.gridTemplateColumns=dominoColums;
        this.divDisplay.style.gridTemplateRows=dominoRows;

        for (let l=0; l<this.allBrick; l++) {
            let creatDiv=document.createElement("div");
            creatDiv.setAttribute("id", l);
            creatDiv.setAttribute("class", "brick");
            this.divDisplay.appendChild(creatDiv);
        }
    }

    clrScr = () => {
        for (let n=0; n<this.allBrick; n++) {
            document.getElementById(n).style.backgroundImage="none";
        }
    }

    mapCreate = () => {
        let value="empty";
        for (let n=0; n<this.allBrick; n++) {
            this.map.push(value);
        }
    }

    seeMapIds = (seeId) => {
        let find=false;
        if (this.map[seeId]!="empty") { find=true; }
        return find;
    }

    mapDrawAll = () => {
        for (let n=0; n<this.allBrick; n++) {
            if (this.map[n]!="empty") {
                document.getElementById(n).style.backgroundImage="url('./img/"+this.map[n]+".svg')";
            }
        }
    }

    insertItem = (thing) => {
        let thingId;
        let notGood;
        do {
            notGood = false;
            thingId=Math.floor(Math.random()*this.allBrick);
            if (snake1.seeSnakeIds(thingId)) { notGood = true; }
            if (game.playerNumber==2) {
                if (snake2.seeSnakeIds(thingId)) { notGood = true; }
            }
            if (this.seeMapIds(thingId)) { notGood = true; }

            if (screen.map[thingId]!="empty") { notGood = true; }

        } while (notGood);

        this.map[thingId]=thing;
        if (thing=="shear") { game.shearId=thingId; }

        document.getElementById(thingId).style.backgroundImage="url('./img/"+this.map[thingId]+".svg')";
    }

    percentage = (inValue, percentage) => {
        let returnValue=Math.floor((inValue/100)*percentage);
        return returnValue;
    }

    mapElement1Insert = () => {
        for (let n=0; n<this.rows; n++) { this.map[n]="wall1"; }
        for (let n=this.allBrick; n>this.allBrick-this.rows; n--) { this.map[n]="wall1"; }
        let upper=this.rows-1;
        for (let n=0; n<this.rows; n++) { this.map[upper]="wall1"; upper=upper+this.rows; }
        upper=0;
        for (let n=0; n<this.rows; n++) { this.map[upper]="wall1"; upper=upper+this.rows; }
    }

    mapElement2Insert = () => {
        let space=this.percentage(this.rows,33);
        for (let n=space; n<this.rows-space; n++) { this.map[n]="empty"; }
        let start=this.allBrick-this.rows;
        for (let n=start+space; n<this.allBrick-space; n++) { this.map[n]="empty"; }
        let upper=this.rows*space;
        for (let n=0; n<=space; n++) {
            this.map[upper]="empty";
            this.map[upper+this.rows-1]="empty";
            upper=upper+this.rows;
        }
    }
    
    mapElement3Insert = () => {
        let ration=this.percentage(this.rows,33);
        let mod; mapSize==20 || mapSize==60 ? mod=1 : mod=0;
        let upper=(ration*this.rows)+ration;
        for (let n=0; n<=ration; n++) {
            this.map[upper]="wall1";
            this.map[upper+ration+mod]="wall1";
            upper=upper+this.rows;
        }
    }

    mapElement4Insert = () => {
        let top=this.percentage(this.rows,15);
        let long=this.percentage(this.rows,66);
        let upper=(top*this.rows)+this.rows/2;
        for (let n=0; n<=long; n++) {
            this.map[upper]="wall1";
            this.map[upper-1]="wall1";
            if (mapSize==60) {
                this.map[upper-2]="wall1";
            }
            upper=upper+this.rows;
        }
    }
    
    onresizeWindow = () => {
        let headHeight = this.divHead.offsetHeight;
        let displayHeight = window.innerHeight-headHeight-10;
        
        if (window.innerWidth>displayHeight) {
            this.divDisplay.style.width=displayHeight+"px";
            this.divDisplay.style.height=displayHeight+"px";
            this.divMenu.style.width=displayHeight+"px";

            this.divHead.style.width=displayHeight+"px";
            head
        } else {
            this.divDisplay.style.width=window.innerWidth+"px";
            this.divDisplay.style.height=window.innerWidth+"px";
            this.divMenu.style.width=window.innerWidth+"px";
            this.divHead.style.width=window.innerWidth+"px";
        }   
    }
}

class Snake {
    constructor({ name, startSnakeLength, startId, way, color, mapLength, mapColumns }) {
        this.pushButton=false;
        this.license=true;
        this.life=3;
        this.snakeAnim={"switch": false, "value": 0, "endValue": 10, "end": false};
        this.name=name;
        this.startSnakeLength=startSnakeLength;
        this.startWay=way;
        this.way=way;
        this.startId=startId;
        this.color=color;
        this.mapLength=mapLength;
        this.mapColumns=mapColumns;
        this.snakeBody=[];
        this.apple=0;
        this.appleElement;
        this.lifesElement;
        this.headCreateElements();
        this.newSnake();
    }

    newSnake = () => {
        this.snakeBody=[];
        let maskInsert;
        for (let n = 0; n <= this.startSnakeLength; n++) {
            let insertMapId;
            if (n == 0) {
                insertMapId = this.startId;
                maskInsert="H"+this.startWay;
            } else if (n == this.startSnakeLength) {
                insertMapId = this.wayMapIdCreator({ "way": this.startWay, "mapId": this.snakeBody[n-1].mapId });
                maskInsert =  this.wayInverter(this.snakeBody[this.snakeBody.length-1].mask[1])+"E";
            } else {
                insertMapId = this.wayMapIdCreator({ "way": this.startWay, "mapId": this.snakeBody[n-1].mapId });
                maskInsert = this.startWay+this.wayInverter(this.startWay);
            }
            this.snakeBody.push({ "id": n, "mapId": insertMapId, "way": this.startWay, "mask": maskInsert });
        }
        this.way = this.wayInverter(this.startWay);
    }

    headCreateElements = () => {
        let element = screen.createAnyElement('div', {"class":"head-player apples-text" });
        this.appleElement = screen.createAnyElement('span', {"class":"apples-text"});
        let lifesElement = screen.createAnyElement('span', {"class":"apples-text"});
        this.lifesElementValue = screen.createAnyElement('span', {"class":"apples-text"});
        element.innerHTML= "<strong>"+this.name+"</strong> Apples: ";
        lifesElement.innerHTML="<br> Lifes: ";
        this.lifesElementValue.innerHTML=this.life;
        this.appleElement.innerHTML="0";
        element.appendChild(this.appleElement);
        element.appendChild(lifesElement);
        element.appendChild(this.lifesElementValue);
        screen.divHead.appendChild(element);
    }

    wayMapIdCreator = ({ way, mapId }) => {
        let backMapId;
        switch (way) {
            case "U":
                if (mapId - this.mapColumns < 0) {
                    backMapId = (mapId - this.mapColumns)+this.mapLength; } else { backMapId = mapId - this.mapColumns; }
                break;
            case "D":
                if (mapId + this.mapColumns >= this.mapLength) { 
                    backMapId = ((mapId + this.mapColumns)-this.mapLength); } else { backMapId = mapId + this.mapColumns; }
                break;
            case "L":
                if (mapId - 1 < 0) { backMapId = this.mapColumns-1; } else { if (mapId % screen.columns==0) { backMapId = mapId + this.mapColumns-1 } else { backMapId = mapId - 1; } }
                break;
            case "R":
                if (mapId + 1 == this.mapLength) { backMapId = this.mapLength-this.mapColumns; break; } else { if ((mapId+1) % screen.columns==0) { backMapId = mapId - this.mapColumns+1 } else { backMapId = mapId + 1; } }
                break;
            default:
                backMapId=mapId;
        }
        return backMapId;
    }

    drawSnake = () => {
        for (let list of this.snakeBody) {
            this.drawSnakeElements({ "mapId":list.mapId, "mask":list.mask, "color":this.color, "id": list.id });
        }
    }

    earseSnake = () => {
        for (let list of this.snakeBody) {
            this.drawSnakeElements({ "mapId":list.mapId, "mask":"none", "color":this.color, "id": list.id });
        }
    }

    drawSnakeElements = ({ mapId, mask, color}) => {
        let issetSnake2;
        this.name=="Player 2" ? issetSnake2="2" : issetSnake2="";
        if (color) { document.getElementById(mapId).style.backgroundColor = color; }
        if (mask == "none") { document.getElementById(mapId).style.backgroundImage = "none"; }
        if (mask == "HU") { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"H0.svg')"; }
        if (mask == "HD") { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"H6.svg')"; }
        if (mask == "HL") { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"H9.svg')"; }
        if (mask == "HR") { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"H3.svg')"; }
        if (mask == "UE") { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"E6.svg')"; }
        if (mask == "DE") { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"E0.svg')"; }
        if (mask == "LE") { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"E3.svg')"; }
        if (mask == "RE") { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"E9.svg')"; }
        if (mask == "UD" || mask == "DU") 
            { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"B06.svg')"; }
        if (mask == "UL" || mask == "LU") 
            { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"B09.svg')"; }
        if (mask == "LR" || mask == "RL") 
            { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"B39.svg')"; }
        if (mask == "UR" || mask == "RU") 
            { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"B03.svg')"; }
        if (mask == "DL" || mask == "LD") 
            { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"B69.svg')"; }
        if (mask == "RD" || mask == "DR") 
            { document.getElementById(mapId).style.backgroundImage = "url('./img/"+issetSnake2+"B36.svg')"; }
    }

    consoleSnakeDatas = () => {
        console.log("this.snakeBody.length : ", this.snakeBody.length);
        for (let list of this.snakeBody) {
            console.log("list.snakeBody.id : ", list.id);
            console.log("list.snakeBody.way : ", list.way);
            console.log("list.snakeBody.mapid : ", list.mapId);
            console.log("list.snakeBody.mask : ", list.mask);
        }
    }

    wayInverter = (way) => {
        let invertWay="";
        if (way=="L") { invertWay="R"; };
        if (way=="R") { invertWay="L"; };
        if (way=="U") { invertWay="D"; };
        if (way=="D") { invertWay="U"; };
        return invertWay;
    }

    seeSnakeIds = (seeId) => {
        let find=false;        
        for (let m=0; m<this.snakeBody.length; m++) {
            if (this.snakeBody[m].mapId==seeId) { find=true; }
        }
        return find;
    }

    period = () => {
        this.pushButton=false;
        if (this.license) {
            this.moveOn();
            this.drawSnake();
        } else {
            if (this.snakeAnim.switch) {
                this.endAnim();
            }
        }
    }

    moveOn = () => {
        let movingResolve = true;
        let newMoveMapIdCord = this.wayMapIdCreator({ "way": this.way, "mapId": this.snakeBody[0].mapId });

        // WALL AND SNAKE BITES HIMSELF
        if (this.seeSnakeIds(newMoveMapIdCord) || screen.map[newMoveMapIdCord]=="wall1") {
            playAudio("horn");
            movingResolve=false;
            this.license=false;
            this.snakeAnim.switch=true;
        }

        // SNAKES CRASH
        if (game.playerNumber==2) {
            if (this.name=="Player 1") { 
                if (snake2.seeSnakeIds(newMoveMapIdCord)) {
                    playAudio("crash");
                    movingResolve=false;
                    this.license=false;
                    this.snakeAnim.switch=true;
                }
            } else { 
                if (snake1.seeSnakeIds(newMoveMapIdCord)) {
                    playAudio("crash");
                    movingResolve=false;
                    this.license=false;
                    this.snakeAnim.switch=true;
                }
            }
        }
        
        // SNAKE MOVEING
        if (movingResolve) {
            // SHEAR TO APPER
            if (game.sheareWaitTime>0) { game.sheareWaitTime--; }
            else {
                if (game.shearId=="empty") {
                    game.sheareSeeTime=game.sheareSeeTimeDefault;
                    screen.insertItem("shear"); }
                else {
                    if (game.sheareSeeTime>0) {
                        game.sheareSeeTime--;
                    } else {
                        document.getElementById(game.shearId).style.backgroundImage="none";
                        screen.map[game.shearId]="empty";
                        game.shearId="empty";
                        game.sheareWaitTime=game.sheareWaitTimeDefault;
                    }
                }
            }

            // SHEAR EAT
            if (screen.map[newMoveMapIdCord]=="shear") {
                playAudio("shear");
                screen.map[newMoveMapIdCord]="empty";
                game.shearId="empty";
                game.sheareWaitTime=game.sheareWaitTimeDefault;
                //  levon kígyóhossz
                for (let n=0; n<game.sheareCut; n++) {
                    if (this.snakeBody.length>3) {
                        document.getElementById(this.snakeBody[this.snakeBody.length-1].mapId).style.backgroundImage="none";
                         this.snakeBody.pop(this.snakeBody.length);
                        screen.mapDrawAll();
                    }
                }
            }
            
            // APPLE
            if (screen.map[newMoveMapIdCord]=="apple") {
                let rand = Math.floor(Math.random()*2);
                rand ? playAudio("eat") : playAudio("eat2");
                screen.map[newMoveMapIdCord]="empty";
                this.apple++;
                this.appleElement.innerHTML=this.apple;
                screen.insertItem("apple");
            } else {
                let clearId=this.snakeBody[this.snakeBody.length-1].mapId;
                document.getElementById(clearId).style.backgroundImage="none";
                let newEndMask= this.wayInverter(this.snakeBody[this.snakeBody.length-2].mask[1])+"E";
                this.snakeBody[this.snakeBody.length-2].mask=newEndMask;
                this.snakeBody.pop();
            }

            let newBodyMask=this.snakeBody[0].mask[1]+this.way;
            this.snakeBody[0].mask=newBodyMask;
            this.snakeBody.unshift({ "id": 0, "mapId": newMoveMapIdCord, "way": this.way });
            let newHeadMask = "H"+this.wayInverter(this.way);
            this.snakeBody[0].mask=newHeadMask;
            let newId = 0;
            for (let list of this.snakeBody) { list.id = newId; newId++; }
        }

    }

    endAnim = () => {
        this.snakeAnim.value++;
        if (this.snakeAnim.value == this.snakeAnim.endValue) {
            this.snakeAnim.value = 0; this.snakeAnim.switch = false; this.snakeAnim.end=true;
        }

        if (this.snakeAnim.value % 2 == 0) { this.drawSnake(); } else { this.earseSnake(); }
    }

    lives = () => {
        if (this.life>0) {
            this.life--;
            this.license=true;
            this.snakeAnim.end=false;
            this.snakeAnim.switch=false;
            this.earseSnake();
            this.newSnake();
            this.lifesElementValue.innerHTML=this.life;
        }
    }

    snakeKeys = (useKey, keys) => {
        if (this.license) {
            if (!this.pushButton) {
                for (let wayL in keys ) {
                    if (useKey.keyCode == keys[wayL]) { if ( this.wayInverter(this.way)!=wayL) { this.way = wayL; } }
                }
            }
            this.pushButton=true;
        } else {
            for (let wayL in keys ) {
                if (useKey.keyCode == keys[wayL]) {
                    if (this.snakeAnim.end) { this.lives(); }
                }
            }
        }
    }
}

class Engine {
    constructor () {
        this.engine;
        this.gameSpeedValue = 120;
        this.playerNumber = 1;
        this.speedValues= [450,400,350,300,250,120,100,85,65,45,30];
        this.mapElements = {"one": "none", "two": "none"}
        this.sheareCut = 3;
        this.sheareWaitTimeDefault = 300;
        this.sheareSeeTimeDefault = 60;
        this.sheareWaitTime = this.sheareWaitTimeDefault;
        this.sheareSeeTime= this.sheareSeeTimeDefault;
        this.shearId = "empty";

        this.designValue = 0;
        this.startBtn=document.getElementById("startBtn");
        this.onePlayer=document.getElementById("one");
        this.twoPlayer=document.getElementById("two");
        this.gameSpeed=document.getElementById("gameSpeed");
        this.snakeLogo=document.getElementById('snake-logo');
        this.soundIcon=document.getElementById('soundicon');
        this.soundIconHead=document.getElementById('soundiconhead');

        this.mapSize=document.querySelectorAll("[name=mapsize]");
        this.type1=document.querySelectorAll("[name=type1]");
        this.type2=document.querySelectorAll("[name=type2]");
        this.design=document.querySelectorAll("[name=design]");

        this.startBtn.addEventListener("click", this.startEngine);
        this.snakeLogo.addEventListener("click", this.stopEngine);

        this.menuColor("bg1");

        document.body.addEventListener('contextmenu', (event) => { 
            event.preventDefault();
        });
        
        this.gameSpeed.addEventListener('input', (e) => {
            this.gameSpeedValue=this.speedValues[e.target.value];
            playAudio("click");
        });

        for (let radio of this.mapSize) {
                radio.addEventListener('input', () => {
                if (radio.value=="small") { mapSize=20; snakeStartLong=3; }
                if (radio.value=="medium") { mapSize=40; snakeStartLong=6; }
                if (radio.value=="large") { mapSize=60; snakeStartLong=9; }
                playAudio("click");
            });
        }

        for (let radio of this.type1) { radio.addEventListener('input', () => { this.mapElements.one=radio.value; playAudio("click2"); }); }
        for (let radio of this.type2) { radio.addEventListener('input', () => { this.mapElements.two=radio.value; playAudio("click"); }); }
        
        for (let radio of this.design) { 
            radio.addEventListener('input', () => { 
                this.designValue=radio.value;             
                this.menuColor(this.designValue);
                playAudio("click2");
            });
        }

        this.soundIcon.onclick = () => { this.soundSwitch() };
        this.soundIconHead.onclick = () => { this.soundSwitch() };

        this.soundSwitch = () => {
            if (soundSwitch==true) {
                console.log(soundSwitch);
                soundSwitch=false;
                this.soundIcon.style.backgroundImage="url('img/soundoff.svg')";
                this.soundIconHead.style.backgroundImage="url('img/soundoff.svg')";
            } else if (soundSwitch==false) {
                soundSwitch=true;
                this.soundIcon.style.backgroundImage="url('img/soundon.svg')";
                this.soundIconHead.style.backgroundImage="url('img/soundon.svg')";
                playAudio("click2");
            }
        }

        this.onePlayer.onclick = () => { this.playerNumber=1; playAudio("click"); this.players(); };
        this.twoPlayer.onclick = () => { this.playerNumber=2; playAudio("click2"); this.players(); };
        this.players();
    }

    menuColor = (value) => {
        let returnValue = [];
        if (value == "bg1") { returnValue = ["#71881e","#88a814","657c12"] }
        if (value == "bg2") { returnValue = ["#48711e","#3a7112","193209"] }
        if (value == "bg3") { returnValue = ["#d38e45","#cc7525","a94a12"] }
        document.getElementById("menu").style.backgroundColor=returnValue[0];
        document.getElementById("menu").style.border="4mm ridge "+returnValue[1];
        document.getElementById("display").style.backgroundImage="url('img/"+value+".jpg')";
    }

    players = () => {
        if (this.playerNumber==1) {
            this.onePlayer.style.backgroundColor="var(--button-selected)";
            this.twoPlayer.style.backgroundColor="var(--button)";
        } else {
            this.twoPlayer.style.backgroundColor="var(--button-selected)";
            this.onePlayer.style.backgroundColor="var(--button)";
        }
    }
    
    startEngine = () => {
        screen = new Monitor({"rows": mapSize, "columns": mapSize});
        screen.divDisplay.style.display="grid";
        screen.divMenu.style.display="none";
        screen.divHead.style.display="block";
        if (this.mapElements.one=="1") { screen.mapElement1Insert(); }
        if (this.mapElements.one=="2") { screen.mapElement1Insert(); screen.mapElement2Insert(); }
        if (this.mapElements.two=="1") { screen.mapElement3Insert(); }
        if (this.mapElements.two=="2") { screen.mapElement4Insert(); }
        screen.mapDrawAll();
        // ONE PLAYER
        if (this.playerNumber==1) {
            let snakeStartId = ((mapSize*mapSize/2)+mapSize/2)-(snakeStartLong*mapSize)+1;
            snake1 = new Snake({ "name":"Player 1", "startSnakeLength":snakeStartLong, "startId": snakeStartId, "way": "D", color: "", "mapLength": screen.allBrick, "mapColumns": screen.columns });
            snake1.drawSnake(); screen.insertItem("apple"); game.keyboardNavigator();
            screen.onresizeWindow();
            this.engine = setInterval(this.onePlayerEngineRepeat, this.gameSpeedValue);  // start ENGINE
        } else {
            //TWO PLAYER
            let snake1StartId;
            let snake2StartId;
            if (mapSize==60) {
                snake1StartId = Math.floor(((mapSize*mapSize/6)*2)+mapSize/3);
                snake2StartId = Math.floor(((mapSize*mapSize/6)*4)-mapSize/3);
            } else {
                snake1StartId = Math.floor(((mapSize*mapSize/6)*2));
                snake2StartId = Math.floor(((mapSize*mapSize/6)*4));
            }
            if (screen.rows==40 || screen.rows==20) { snake1StartId++; snake2StartId++ }
            snake1 = new Snake({ "name":"Player 1", "startSnakeLength":snakeStartLong, "startId": snake1StartId, "way": "U", color: "", "mapLength": screen.allBrick, "mapColumns": screen.columns });
            snake2 = new Snake({ "name":"Player 2", "startSnakeLength":snakeStartLong, "startId": snake2StartId, "way": "D", color: "", "mapLength": screen.allBrick, "mapColumns": screen.columns });
            snake1.drawSnake(); snake2.drawSnake(); screen.insertItem("apple"); game.keyboardNavigator();
            screen.onresizeWindow();
            // START ENGINE
            this.engine = setInterval(this.twoPlayerEngineRepeat, this.gameSpeedValue);  
        }
    }
    
    stopEngine = () => {
        clearInterval(this.engine);
        window.location.reload();
    }

    // ONE PLAYER
    onePlayerEngineRepeat = () => {
        snake1.period();
    }

    // TWO PLAYERS
    twoPlayerEngineRepeat = () => {
        snake1.period();
        snake2.period();
    }

    keyboardNavigator = () => {  
        document.addEventListener('keydown', (useKey) => {
            if (useKey.keyCode == 27) { this.stopEngine(); }
            snake1.snakeKeys (useKey, {"L":37, "R":39, "U":38, "D":40 });
            if (this.playerNumber==2) {                
                snake2.snakeKeys (useKey, {"L":65, "R":68, "U":87, "D":83 });
            }
        });
    }
}

function soundLoad() {
    let audioElements = [ 
        { id: "eat", src: "sound/eat.mp3" },
        { id: "eat2", src: "sound/eat2.mp3" },
        { id: "horn", src: "sound/horn.mp3" },
        { id: "crash", src: "sound/crash.mp3" },
        { id: "click", src: "sound/click.mp3" },
        { id: "click2", src: "sound/click2.mp3" },
        { id: "shear", src: "sound/shear.mp3" },
    ];

    for (let attribute of audioElements) {
        let audio = document.createElement('audio');
        for (let key in attribute) {
            audio.setAttribute(key, attribute[key]);
        }
        document.getElementById("audios").appendChild(audio);
    }
}

function playAudio (soundname) {
    if (soundSwitch==true) {
        document.getElementById(soundname).play();
    }
}

soundLoad();
let snake1;
let snake2;
let mapSize=20;
let snakeStartLong=3;
let soundSwitch=false;
let game = new Engine();