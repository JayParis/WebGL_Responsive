
var hovered = false;
var currentHover = false;
var needsHoverChange = false;
var hoverChangeDelay = 0.1;

const root = document.querySelector(':root');
var fadeState = 2;

var hideContDelay = -10;
var hoverOut = false;

var paraFadeTop = 0;
var paraFadeBottom = 0;
var shortPara = false;

var mute = false;
var lastVolume = "50";
var soundOnDraw = "m 89.253645,128.18816 c -0.617819,-0.15792 -1.763593,-0.61216 -2.546165,-1.00944 -0.782571,-0.39727 -8.545737,-5.42034 -17.251481,-11.16237 L 53.627376,105.5763 H 45.69893 c -8.751357,0 -9.577258,-0.0643 -11.689045,-0.90989 -2.938631,-1.17669 -5.425689,-3.66457 -6.603277,-6.605458 -0.912869,-2.279782 -0.924251,-2.498291 -0.873518,-16.771366 0.04547,-12.791928 0.04953,-12.94487 0.374736,-14.096534 0.180823,-0.640362 0.647902,-1.786136 1.037952,-2.546165 0.580518,-1.131161 0.968682,-1.641704 2.139506,-2.814038 1.265627,-1.267259 1.611408,-1.520279 3.002956,-2.197363 2.709271,-1.318248 2.345572,-1.277002 12.131728,-1.375829 l 8.612029,-0.08697 15.27699,-10.094952 c 17.266402,-11.409547 17.219777,-11.3798 18.777882,-11.980027 3.29456,-1.269159 6.071883,-0.860472 8.018035,1.179865 0.998566,1.046892 1.719163,2.490085 2.132123,4.270154 0.267018,1.150969 0.277968,2.741919 0.277968,40.364205 0,37.442298 -0.0121,39.218748 -0.274559,40.364208 -1.099849,4.79977 -4.414109,7.02971 -8.786791,5.91202 z m 23.847415,-22.4691 c -1.64611,-0.82257 -2.47833,-2.15301 -2.47833,-3.96201 0,-1.16798 0.31449,-2.058123 1.02353,-2.897086 0.6555,-0.775597 1.45291,-1.198171 3.03618,-1.608953 3.53925,-0.918261 5.89837,-2.201393 8.10566,-4.408683 4.54666,-4.546659 5.90691,-11.323052 3.47038,-17.288432 -1.16718,-2.857617 -3.3738,-5.54532 -5.90999,-7.198496 -1.67493,-1.091771 -2.85207,-1.61604 -4.92071,-2.191548 -2.62607,-0.730592 -3.69352,-1.622857 -4.25592,-3.557453 -0.74912,-2.576852 1.18296,-5.381414 3.9005,-5.661889 1.92068,-0.198232 6.50157,1.36453 9.56105,3.261739 6.93861,4.302688 11.44135,11.735759 11.92383,19.683728 0.37233,6.133378 -1.26419,11.713153 -4.89797,16.699848 -1.0511,1.44244 -3.66935,4.060695 -5.11179,5.111795 -3.02579,2.20488 -6.14045,3.63357 -9.12417,4.18524 -2.29348,0.42404 -3.20898,0.3885 -4.32225,-0.1678 z";
var soundOffDraw = "m 89.451372,128.72099 c -1.161236,-0.25285 -2.485667,-0.81297 -3.861376,-1.63304 -0.601092,-0.35831 -8.077538,-5.25896 -16.614327,-10.89033 l -15.521432,-10.23886 -7.912196,-0.003 c -4.43797,-0.002 -8.373911,-0.0687 -8.963705,-0.15275 -4.719212,-0.6722 -8.52734,-4.00619 -9.869163,-8.640389 L 26.363677,95.969426 V 82.224701 c 0,-12.867297 0.01756,-13.807054 0.275101,-14.721125 1.031111,-3.659663 3.584024,-6.594411 6.979689,-8.023626 2.098725,-0.883341 2.087675,-0.882418 11.349941,-0.949474 l 8.540287,-0.06183 2.800989,-1.840235 c 1.540543,-1.012128 8.681926,-5.71744 15.869741,-10.456247 7.187815,-4.738809 13.60953,-8.902057 14.270479,-9.251664 3.785172,-2.00216 7.264615,-1.795366 9.47046,0.562859 0.766687,0.819651 1.576224,2.407561 1.979455,3.88271 0.252606,0.924112 0.266899,3.116275 0.266899,40.933742 0,38.243719 -0.01178,39.999209 -0.274518,40.933739 -1.22339,4.35135 -4.343319,6.37963 -8.440828,5.48744 z M 117.5751,101.51858 c -2.07265,-0.56863 -3.31403,-2.197107 -3.31403,-4.34743 0,-1.935141 3e-4,-1.935437 6.94988,-8.900319 l 6.18288,-6.196438 -6.32407,-6.346561 c -5.90624,-5.927248 -6.3414,-6.399947 -6.58636,-7.154577 -0.34183,-1.053052 -0.25247,-2.693939 0.19416,-3.565146 0.80419,-1.568707 2.64737,-2.579434 4.41208,-2.419415 1.66443,0.150924 1.83512,0.289942 8.50016,6.923255 l 6.19642,6.166923 6.27147,-6.244778 c 7.03266,-7.00273 6.78995,-6.817093 8.90024,-6.80729 0.92168,0.0043 1.26662,0.07813 1.89623,0.405983 2.14291,1.115855 3.06017,3.688267 2.07624,5.822729 -0.31951,0.69311 -1.37718,1.823726 -6.5665,7.019293 l -6.18565,6.193105 6.24655,6.274787 c 5.88371,5.910301 6.26607,6.327138 6.58278,7.176078 0.71134,1.906778 0.13448,4.020702 -1.42087,5.206831 -0.85806,0.65436 -1.79443,0.94774 -2.94908,0.924 -1.66341,-0.0342 -1.75232,-0.10595 -8.57997,-6.923717 l -6.2715,-6.262425 -6.2715,6.260786 c -6.66645,6.655066 -6.7678,6.738846 -8.38199,6.929716 -0.46093,0.0545 -1.05303,0.003 -1.55757,-0.13539 z";

//var isTouch = false; //is_touch_enabled(); // detectMob();
var inputting = false;
var tapPos = [0,0];
var holdPos = [0,0];

var inputType = 0;
var scrubLeft = true;
//Viewer
var vSens = 0.215;
var tap_vID = 0;
var canvasLeft = 0;
var canvasWidth = 0;

// Equi
var lookX = 0;
var lookY = 0;
var lastLookX = 0;
var lastLookY = 0;
var lookSens = 0.000001;
// var equiLooking = false;
var doubleTapDelay = 0;
var tapHoldTime = 0;
var firstTapInCanvas = false;
var firstCanvasInteraciton = false;
var equiReleased = false;

var currentPage = 1;

var revealTapPos = [0,0];
var revealHoldPos = [0,0];


//console.log("isTouch: " + isTouch);
document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener("touchstart", e => { inputDown(e); });
document.addEventListener("touchmove", e => { inputMove(e); });
document.addEventListener("touchend", e => { inputUp(e); });
document.addEventListener("mousedown", e => { inputDown(e); });
document.addEventListener("mousemove", e => { inputMove(e); });
document.addEventListener("mouseup", e => { inputUp(e); });



function inputDown(event) {

    let screenX = event.changedTouches ? event.changedTouches[0].clientX : event.x;
    let screenY = event.changedTouches ? event.changedTouches[0].clientY : event.y;
    let inCanvas = screenX > canvasLeft && screenX < (canvasLeft + canvasWidth);

    inputting = inCanvas;

    if(!revealed && inCanvas){
        revealTapPos = [screenX, screenY];
        revealHoldPos = [screenX, screenY];
        console.log(revealTapPos);
        return;
    }
    if(!mainControl)
        return;

    let equi = event.changedTouches ? false : event.which == 3;

    if(inCanvas){
        inputType = event.changedTouches ? 1 : event.which;
        event.preventDefault();

        if(hasInit && doubleTapDelay > 0){
            if(Math.abs(tapPos[0] - screenX) < 20 && Math.abs(tapPos[1] - screenY) < 20) {
                console.log("Double Tapped");
                equi = true;
            }
        }
        doubleTapDelay = 1.0;
        firstCanvasInteraciton = true;
    }

    if(inCanvas){
        //state = equi ? 2 : 0;
        if(equi && !updatingUniforms){
            lookX = screenX;
            lookY = screenY;
            lastLookX = screenX;
            lastLookY = screenY;
            target_camFov = 51.6;
            equiReleased = false;
            state = 2;
        }else if(!equi){
            tap_vID = vID;
        }
    }

    firstTapInCanvas = inCanvas;

    tapPos = [screenX, screenY];
    holdPos = [screenX, screenY];
}

function inputMove(event) {
    let screenX = event.changedTouches ? event.changedTouches[0].clientX : event.x;
    let screenY = event.changedTouches ? event.changedTouches[0].clientY : event.y;

    if(!revealed && inputting){
        revealHoldPos = [screenX,screenY];
        let r_delta = [Math.abs(revealTapPos[0] - revealHoldPos[0]), Math.abs(revealTapPos[1] - revealHoldPos[1])];
        let mag = Math.sqrt(r_delta[0] * r_delta[0] + r_delta[1] * r_delta[1]);
        target_revealProgress = mag * 0.0015;
        console.log(target_revealProgress);
        return;
    }
    if(!inputting || !mainControl)
        return;
    
    if((state == 1 || (state == 2 && equiReleased)) && firstTapInCanvas)
        state = 0;

    if(state == 0){
        if(inputType == 1){
            tapHoldTime = -20;
            holdPos = [screenX, screenY];
    
            let moduloVal = 160 / remoteImagesLoadStep;
            vID = Math.abs(Mod(tap_vID + Math.trunc((tapPos[0] * vSens) - (holdPos[0] * vSens)), moduloVal));
            //console.log("vID:" + vID);
        }
    } else if(state == 1){

    } else if(state == 2 && equiReady){
        lookX = screenX;
        lookY = screenY;
    }
    
    if(inputType != 0){
        event.preventDefault();
    }

}

function inputUp(event) {
    inputting = false;
    if(!revealed){
        revealTapPos = [0,0];
        revealHoldPos = [0,0];
        if(target_revealProgress > 0.27){
            target_revealProgress = 2;
            revealed = true;
            if(loadIntro)
                PlayIntroVideo();
        }else{
            target_revealProgress = 0;
        }
        return;
    }
    if(!mainControl) 
        return;

    let screenX = event.changedTouches ? event.changedTouches[0].clientX : event.x;
    let screenY = event.changedTouches ? event.changedTouches[0].clientY : event.y;

    if(inputType != 0){
        event.preventDefault();
    }

    if(inputType == 1){
        if(vID + 1 > imageList.length - 1)
            vID--;
        else if(vID - 1 < 0)
            vID++;
        
        if(vID % 2 != 0){
            vID += scrubLeft ? 1 : -1;
        }
        tap_vID = vID;
        //console.log("Snapped vID: " + vID);
        //console.log(vID);
        //console.log(imageList[vID]);
        if(!preLoadEqui){
            console.log("PRE-LOAD EQUI");
            let imgPath = _supabaseUrl + _storyUrl + ('/P'+currentPage.toString()) + '/Eq/Eq_' + "1".padStart(4,'0') + '.webp';
            equiImage.src = imgPath;
            preLoadEqui = true;
        }
    }

    //if(equiLooking)
    //    state = 0;
    if(state == 2){
        target_xRot = 0;
        target_yRot = 0;
        target_camFov = initial_camFov;
        equiReleased = true;
    }
    lookX = screenX;
    lookY = screenY;
    lastLookX = screenX;
    lastLookY = screenY;
    inputType = 0;
    tapHoldTime = 0;
    firstTapInCanvas = false;
}

function LoadedPage() {
    window.addEventListener("resize", () => {
        SendCSSHeight();
        CheckParaScroll();
    });
    SendCSSHeight();
    document.getElementById('olt-id').innerHTML = is_touch_enabled();

    document.getElementById('pb-id').addEventListener('scroll', function(){
        let para = document.getElementById('pb-id');
        var scrollTop = para.scrollTop;
        var scrollHeight = para.scrollHeight; // added
        var offsetHeight = para.offsetHeight;
        // var clientHeight = document.getElementById('box').clientHeight;

        if(!shortPara){
            var contentHeight = scrollHeight - offsetHeight; // added
            if (contentHeight <= scrollTop && fadeState != 0) {
                //console.log("Scroll end");
                fadeState = 0;
            }
            if (scrollTop <= 0 && fadeState != 2) {
                //console.log("Scroll top");
                fadeState = 2;
            }
            if( scrollTop >= 10 && contentHeight >= (scrollTop + 10)  && fadeState != 1){
                //console.log("Scroll middle");
                fadeState = 1;
            }
        }
    }, false);

    // i just retrieved the id for a demo
    //$(document).mouseover(function(e){ console.log($(e.target).attr('id')); });
    
    
    let vcid = document.getElementById("vc-id");
    vcid.addEventListener('mouseover', function(){
        //console.log("Mouse Entered");
        if(firstTapInCanvas)
            return;
        hovered = true;
        if(hoverChangeDelay > 0)
            hoverChangeDelay = 0.1;
        needsHoverChange = true;
    }, false);
    vcid.addEventListener('mouseout', function(){
        //console.log("Mouse Exit");
        hovered = false;
        needsHoverChange = true;
        hoverChangeDelay = 0.1;
    }, false);

    SetUpIconEvent('path2820', 'hover-volume-id', '--sound-icon','sound');
    SetUpIconEvent('path3969', 'hover-settings-id', '--settings-icon','settings');
    SetUpIconEvent('path4373', 'hover-exit-id', '--exit-icon', 'exit');
    SetUpIconEvent('path11457', 'hover-pause-id', '--pause-icon', 'pause');
    SetUpIconEvent('path1695', 'hover-replay-id', '--replay-icon', 'replay');

    SetUpIconEvent('path4865', 'pa-id', '--prev-arrow', 'prev');
    SetUpIconEvent('path4866', 'na-id', '--next-arrow', 'next');
    //SetUpIconEvent('path1695', 'hover-replay-id', '--replay-icon', 'replay');

    document.getElementById('hover-replay-id').addEventListener('mousedown', () => { //Replay Pressed
        if(hasInit && mainControl){
            videoElement.pause();
            videoElement.src = null;
            videoElement.load();
            copyVideo = false;
            PlayIntroVideo();
        }
    });

    document.getElementById('hover-volume-id').addEventListener('mousedown', () => {
        console.log("Sound Pressed");
        if(mute){
            if(lastVolume == 100){
                lastVolume = 90;
            }
        }
        SetMute(!mute);
        document.getElementById('v-slider-id').value = mute ? "100" : lastVolume.toString();
    });

    document.getElementById('hover-exit-id').addEventListener('mousedown', () => {
        console.log("Exit Pressed");
    });

    let custom_scroll = document.getElementById('pb-id');
    let scroll_timeout = undefined;
    let ratio = 0.25;//change this to increase/descrease scroll speed/step
    custom_scroll.addEventListener("wheel", (event) => {
        event.preventDefault();

        clearTimeout(scroll_timeout);//if the previous scroll didn't finish, need to stop it to prevent infinite scroll.

        let target = custom_scroll.scrollTop + event.deltaY * ratio;
        let step = target > custom_scroll.scrollTop ? 1 : -1;

        let frame = () => {
            custom_scroll.scrollTop += step;
            if((target < custom_scroll.scrollTop && step < 0) || (target > custom_scroll.scrollTop && step > 0)) {
              scroll_timeout = setTimeout(frame, 5);
            }
        }
        frame();
    });
    
    LoadParaFile();
    RunApp();
}

function SetUpIconEvent(pathID, hoverID, varName, animName, timing){
    var path = document.getElementById(pathID);
    path.style.fill = getComputedStyle(document.documentElement).getPropertyValue(varName);
    let hrid = document.getElementById(hoverID);
    hrid.addEventListener('mouseover', function() {
        path.style.animation = animName + "_hover";
        path.style.animationTimingFunction = timing;
        path.style.animationFillMode = "both";
        path.style.animationDuration = "0.15s";
    }, false);
    hrid.addEventListener('mouseout', function() {
        path.style.animation = animName + "_unhover";
        path.style.animationTimingFunction = timing;
        path.style.animationFillMode = "both";
        path.style.animationDuration = "0.15s";
    }, false);
}



function ToggleHoverState(hov){

    ks.globalPlay();
    if(hov){
        ks.animate("#path5649",[{p:'d',t:[0,250],v:["path('M66.1587,516.553C35.1564,514.051,18.4817,498.567,14.7485,468.816C14.1577,464.108,14.1239,453.263,14.1239,268.048C14.1239,151.262,14.109,102.939,14.3708,81.5363C14.5699,65.2582,14.9291,64.5527,15.5767,61.1434C15.8531,59.6882,16.4698,57.0688,16.9472,55.3225C22.3025,35.7317,36.2893,23.5718,57.692,19.8999C67.9451,18.1408,89.502,18.0369,100.513,19.6934C124.282,23.2693,139.142,37.1105,143.733,59.9511C144.528,63.9078,144.935,63.8216,145.143,83.944C145.379,106.91,145.357,156.201,145.357,267.871C145.357,457.235,145.332,465.083,144.708,469.66C140.923,497.426,125.939,512.349,98.085,516.092C93.3562,516.728,72.1189,517.034,66.1587,516.553ZM97.0267,508.663C104.666,507.663,110.391,506.051,115.391,503.494C127.888,497.103,134.681,486.401,137.314,468.954C137.889,465.149,137.934,452.943,138.044,271.752C138.108,166.093,138.072,105.833,137.926,83.1575C137.887,77.0934,137.84,73.7172,137.785,72.8795C136.603,54.8496,131.539,43.3354,121.429,35.6911C116.018,31.6004,108.796,28.6961,100.48,27.2674C92.3614,25.8725,74.3432,25.5439,64.042,26.603C41.1475,28.9567,27.5438,40.3212,23.2941,60.6436C22.4628,64.619,22.0318,64.0408,21.797,81.1686C21.5111,102.018,21.5162,149.105,21.4443,262.579C21.3634,390.266,21.4436,455.954,21.6861,460.68C22.2853,472.361,23.7864,479.182,27.3513,486.422C31.2447,494.33,36.6098,499.699,44.4628,503.546C51.0683,506.782,58.4224,508.549,67.9082,509.179C74.1989,509.597,92.3493,509.276,97.0267,508.663Z')","path('M66.1587,516.553C35.1564,514.051,18.4817,498.567,14.7485,468.816C14.1577,464.108,14.1239,453.263,14.1239,268.048C14.1239,151.262,14.109,-152.701,14.3708,-174.104C14.5699,-190.382,14.9291,-191.087,15.5767,-194.497C15.8531,-195.952,16.4698,-198.571,16.9472,-200.318C22.3025,-219.908,36.2893,-232.068,57.692,-235.74C67.9451,-237.499,89.502,-237.603,100.513,-235.947C124.282,-232.371,139.142,-218.53,143.733,-195.689C144.528,-191.732,144.935,-191.818,145.143,-171.696C145.379,-148.73,145.357,156.201,145.357,267.871C145.357,457.235,145.332,465.083,144.708,469.66C140.923,497.426,125.939,512.349,98.085,516.092C93.3562,516.728,72.1189,517.034,66.1587,516.553ZM97.0267,508.663C104.666,507.663,110.391,506.051,115.391,503.494C127.888,497.103,134.681,486.401,137.314,468.954C137.889,465.149,137.934,452.943,138.044,271.752C138.108,166.093,138.072,-149.807,137.926,-172.483C137.887,-178.547,137.84,-181.923,137.785,-182.761C136.603,-200.79,131.539,-212.305,121.429,-219.949C116.018,-224.04,108.796,-226.944,100.48,-228.373C92.3614,-229.768,74.3432,-230.096,64.042,-229.037C41.1475,-226.683,27.5438,-215.319,23.2941,-194.996C22.4628,-191.021,22.0318,-191.599,21.797,-174.471C21.5111,-153.622,21.5162,149.105,21.4443,262.579C21.3634,390.266,21.4436,455.954,21.6861,460.68C22.2853,472.361,23.7864,479.182,27.3513,486.422C31.2447,494.33,36.6098,499.699,44.4628,503.546C51.0683,506.782,58.4224,508.549,67.9082,509.179C74.1989,509.597,92.3493,509.276,97.0267,508.663Z')"],e:[[1,0.77,0,0.175,1],[0]]}],
                {autoremove:false}).range(0,250);  
    } else {
        ks.animate("#path5649",[{p:'d',t:[0,250],v:["path('M66.2,516.6C35.2,514.1,18.5,498.6,14.7,468.8C14.2,464.1,14.1,453.3,14.1,268C14.1,151.3,14.1,-152.7,14.4,-174.1C14.6,-190.4,14.9,-191.1,15.6,-194.5C15.9,-196,16.5,-198.6,16.9,-200.3C22.3,-219.9,36.3,-232.1,57.7,-235.7C67.9,-237.5,89.5,-237.6,100.5,-235.9C124.3,-232.4,139.1,-218.5,143.7,-195.7C144.5,-191.7,144.9,-191.8,145.1,-171.7C145.4,-148.7,145.4,156.2,145.4,267.9C145.4,457.2,145.3,465.1,144.7,469.7C140.9,497.4,125.9,512.3,98.1,516.1C93.4,516.7,72.1,517,66.2,516.6ZM97,508.7C104.7,507.7,110.4,506.1,115.4,503.5C127.9,497.1,134.7,486.4,137.3,469C137.9,465.1,137.9,452.9,138,271.8C138.1,166.1,138.1,-149.8,137.9,-172.5C137.9,-178.5,137.8,-181.9,137.8,-182.8C136.6,-200.8,131.5,-212.3,121.4,-219.9C116,-224,108.8,-226.9,100.5,-228.4C92.4,-229.8,74.3,-230.1,64,-229C41.1,-226.7,27.5,-215.3,23.3,-195C22.5,-191,22,-191.6,21.8,-174.5C21.5,-153.6,21.5,149.1,21.4,262.6C21.4,390.3,21.4,456,21.7,460.7C22.3,472.4,23.8,479.2,27.4,486.4C31.2,494.3,36.6,499.7,44.5,503.5C51.1,506.8,58.4,508.5,67.9,509.2C74.2,509.6,92.3,509.3,97,508.7Z')","path('M66.2,516.6C35.2,514.1,18.5,498.6,14.7,468.8C14.2,464.1,14.1,453.3,14.1,268C14.1,151.3,14.1,102.9,14.4,81.5C14.6,65.3,14.9,64.6,15.6,61.1C15.9,59.7,16.5,57.1,16.9,55.3C22.3,35.7,36.3,23.6,57.7,19.9C67.9,18.1,89.5,18,100.5,19.7C124.3,23.3,139.1,37.1,143.7,60C144.5,63.9,144.9,63.8,145.1,83.9C145.4,106.9,145.4,156.2,145.4,267.9C145.4,457.2,145.3,465.1,144.7,469.7C140.9,497.4,125.9,512.3,98.1,516.1C93.4,516.7,72.1,517,66.2,516.6ZM97,508.7C104.7,507.7,110.4,506.1,115.4,503.5C127.9,497.1,134.7,486.4,137.3,469C137.9,465.1,137.9,452.9,138,271.8C138.1,166.1,138.1,105.8,137.9,83.2C137.9,77.1,137.8,73.7,137.8,72.9C136.6,54.8,131.5,43.3,121.4,35.7C116,31.6,108.8,28.7,100.5,27.3C92.4,25.9,74.3,25.5,64,26.6C41.1,29,27.5,40.3,23.3,60.6C22.5,64.6,22,64,21.8,81.2C21.5,102,21.5,149.1,21.4,262.6C21.4,390.3,21.4,456,21.7,460.7C22.3,472.4,23.8,479.2,27.4,486.4C31.2,494.3,36.6,499.7,44.5,503.5C51.1,506.8,58.4,508.5,67.9,509.2C74.2,509.6,92.3,509.3,97,508.7Z')"],e:[[1,.8,0,.2,1],[0]]}],
                    {autoremove:false}).range(0,250); 
    }

    let vc = document.getElementById("vc-id");
    vc.style.animation = hov ? "show_slider" : "hide_slider";
    vc.style.animationTimingFunction = "cubic-bezier(.42,0,.58,1)";
    vc.style.animationFillMode = "both";
    vc.style.animationDuration = "0.25s";

    let sb = document.getElementById("sb-id");
    sb.style.animation = hov ? "grow_sb" : "shrink_sb";
    sb.style.animationTimingFunction = "cubic-bezier(.42,0,.58,1)";
    sb.style.animationFillMode = "both";
    sb.style.animationDuration = "0.25s";

    let vs = document.getElementById("v-slider-id");
    vs.style.display = hov ? "block" : "none";
    vs.style.animation = hov ? "grow_track" : "shrink_track";
    vs.style.animationTimingFunction = "cubic-bezier(.17,.67,.83,.67)"; // cubic-bezier(.42,0,.58,1)
    vs.style.animationFillMode = "both";
    vs.style.animationDuration = "0.25s";

    let vidc = document.getElementById("video-controls-id");
    vidc.style.animation = hov ? "vc_spacing_hover" : "vc_spacing_unhover";
    vidc.style.animationTimingFunction = "cubic-bezier(.17,.67,.83,.67)"; // cubic-bezier(.42,0,.58,1)
    vidc.style.animationFillMode = "both";
    vidc.style.animationDuration = "0.25s";

    // vs.addEventListener('change', function(evt){
    //     console.log("Change Method: " + this.value);
    // });
}



function RunApp() {

    var then = 0;

    function render(now) {
        now *= 0.001;
        var deltaTime = now - then;
        then = now;

        if(hoverChangeDelay > 0){
            hoverChangeDelay -= deltaTime;
        }
        else if(needsHoverChange){
            //ToggleHoverState(hovered);
            if(currentHover != hovered){
                ToggleHoverState(hovered);
                console.log("New Hover State");
                currentHover = hovered;
            }
            console.log(currentHover + " " + Math.random(0,100).toString());
            needsHoverChange = false;
        }

        
        let updateTop = (fadeState == 2 && paraFadeTop < 0.95) || (fadeState != 2 && paraFadeTop > 0.05);
        let updateBottom = (fadeState == 0 && paraFadeBottom < 0.95) || (fadeState != 0 && paraFadeBottom > 0.05);
        
        paraFadeTop = Lerp(paraFadeTop, fadeState == 2 ? 1 : 0, deltaTime * 12);
        paraFadeBottom = Lerp(paraFadeBottom, fadeState == 0 ? 1 : 0, deltaTime * 12);
        
        if(updateTop){
            root.style.setProperty('--p0', 'rgb(0,0,0,' + paraFadeTop + ')');
            //console.log("Updating Top: " + paraFadeTop);
        }
        if(updateBottom){
            root.style.setProperty('--p1', 'rgb(0,0,0,' + paraFadeBottom + ')');
            //console.log("Updating Bottom: " + paraFadeBottom);
        }

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function OnSliderChange(sliderVal) {
    lastVolume = sliderVal;
    if(lastVolume == 100){
        if(!mute){
            SetMute(true);
            console.log("Set Icon Off");
        }
    }else{
        if(mute){
            SetMute(false);
            console.log("Set Icon On");
        }
    }
    //console.log("Value set: " + sliderVal);
}

function SetMute(isMute){
    mute = isMute;
    root.style.setProperty('--sound-icon', mute ? '#ffffff33' : '#ffffffe4');
    root.style.setProperty('--sound-icon-hover', mute ? '#ffffff80' : '#ffffffe4');
    document.getElementById("path2820").setAttribute('d',mute ? soundOffDraw : soundOnDraw);
}

function LoadParaFile(){
    fetch('./Story/Page_1.txt')
        .then(response => response.text())
        .then((data) => {
            //console.log(data)
            var separateLines = data.split('\n');
            var finalLines = [];
            for (let i = 0; i < separateLines.length; i++) {
                if(separateLines[i].length > 2) {
                    finalLines.push("<p>" + separateLines[i] + "</p>");
                }
            }
            document.getElementById('para-insert').innerHTML = finalLines.join('');
            console.log("Total number of separate lines is: " + separateLines.length);
            setTimeout(() => {
                CheckParaScroll();
            }, 500);
        })
}

// Misc Methods


function CheckParaScroll(){
    let para = document.getElementById('pb-id');
    shortPara = para.scrollHeight <= para.offsetHeight;
    if(shortPara){
        paraFadeTop = 1;
        paraFadeBottom = 1;
    }else{
        paraFadeTop = 1;
        paraFadeBottom = 0;
    }
    root.style.setProperty('--p0', 'rgb(0,0,0,' + paraFadeTop + ')');
    root.style.setProperty('--p1', 'rgb(0,0,0,' + paraFadeBottom + ')');
    console.log("Short Para: " + shortPara);
}

function SendCSSHeight(){
    let preMainInfo = document.getElementById("main-id").getBoundingClientRect();
    root.style.setProperty('--main-height', preMainInfo.height + 'px');
}

// Utils
function Clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
};

function Mod(n, m) {
    return ((n % m) + m) % m;
}

function Lerp (start, end, amt) {
    return (1-amt)*start+amt*end
}

function Lerp3 (start, end, amt) {
    return [
        Lerp(start[0], end[0], amt),
        Lerp(start[1], end[1], amt),
        Lerp(start[2], end[2], amt)
    ]
}

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

function is_touch_enabled() {
    return ( 'ontouchstart' in window ) ||
           ( navigator.maxTouchPoints > 0 ) ||
           ( navigator.msMaxTouchPoints > 0 );
}

// Debug

function ContButtonClicked(){
    console.log("ContButtonClicked");

}

function SendCSSWidth(){
    document.getElementById('ol-id').style.display = "none";
}