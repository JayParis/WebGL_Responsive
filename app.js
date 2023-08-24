
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
var playedRevealMain = false;


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
    if(!mainControl)
        return;
    inputting = inCanvas && mainRevealFinished;
    firstTapInCanvas = inCanvas;

    if(!revealed && inCanvas){
        //if(!mainRevealFinished) return;
        revealTapPos = [screenX, screenY];
        revealHoldPos = [screenX, screenY];
        console.log(revealTapPos);
        return;
    }
    

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


    tapPos = [screenX, screenY];
    holdPos = [screenX, screenY];
}

function inputMove(event) {
    let screenX = event.changedTouches ? event.changedTouches[0].clientX : event.x;
    let screenY = event.changedTouches ? event.changedTouches[0].clientY : event.y;
    
    if(!inputting || !mainControl)
        return;
    if(!revealed && inputting){
        //if(!mainRevealFinished) return;
        revealHoldPos = [screenX,screenY];
        let r_delta = [Math.abs(revealTapPos[0] - revealHoldPos[0]), Math.abs(revealTapPos[1] - revealHoldPos[1])];
        let mag = Math.sqrt(r_delta[0] * r_delta[0] + r_delta[1] * r_delta[1]);
        target_revealProgress = mag * 0.0015;
        if(!playedRevealMain && target_revealProgress > 0.05){
            RevealSVGAnim(1,true);
            playedRevealMain = true;
        }
        return;
    }
    
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
    if(!mainControl) 
        return;
    if(!revealed){
        revealTapPos = [0,0];
        revealHoldPos = [0,0];
        if(target_revealProgress > 0.27){
            target_revealProgress = 2;
            target_brightness = Json_BCS[0];
            target_contrast = Json_BCS[1];
            target_saturation = Json_BCS[2];
            revealed = true;
            if(loadIntro)
                PlayIntroVideo();
        }else{
            if(playedRevealMain){ // Needs reset fade in
                needsToResetReveal = true;
                if(mainRevealFinished){
                    FadeInReveal("reveal_fade_in",0.3);
                    RevealSVGAnim(0,false);
                }
            }else if (firstTapInCanvas){
                RevealSVGAnim(0,false); // needs to be in canvas
            }
            target_revealProgress = 0;
            target_brightness = Json_revealBCS[0];
            target_contrast = Json_revealBCS[1];
            target_saturation = Json_revealBCS[2];
            playedRevealMain = false;
        }
        return;
    }

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
        if(!hasInit || !mainControl || !revealed)
            return;
        videoElement.pause();
        videoElement.src = null;
        videoElement.load();
        copyVideo = false;
        PlayIntroVideo();
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
        ks.animate("#cont2",[{p:'d',t:[0,250],v:["path('M21.6613,570.968C21.5005,570.523,21.0637,567.759,20.7438,565.163L20.429,562.609L20.4352,557.67L20.4414,552.731L20.7448,550.438C21.8613,541.997,24.7791,534.425,29.2466,528.373C31.8649,524.826,35.7142,521.332,40.439,518.213C45.9536,514.573,53.2531,511.977,61.4293,510.748C65.713,510.104,68.5162,509.943,78.1863,509.785C83.5705,509.698,89.0474,509.575,90.3571,509.513C100.194,509.047,108.143,507.259,114.818,504.009C122.79,500.13,128.664,494.302,132.521,486.446C135.954,479.452,137.597,472.06,138.156,461.097C138.398,456.359,138.397,79.0083,138.156,74.2761C137.736,66.05,136.772,60.2167,134.912,54.6498C132.737,48.1381,129.713,43.1156,125.338,38.7487C118.255,31.6777,108.696,27.7573,95.2078,26.3904C88.34,25.6944,71.7423,25.6906,64.7807,26.3834C46.8046,28.1724,35.0561,34.8932,28.1672,47.3285C24.2958,54.3169,22.3088,62.8713,21.7442,74.9817C21.6286,77.461,21.5657,143.358,21.5625,265.305L21.5576,451.837L21.5698,452.21C21.6155,453.606,20.3887,454.834,17.7635,454.746C15.1435,454.778,14.3693,453.149,14.4113,452.155L14.4216,451.911L14.4216,262.498L14.4216,72.6004L14.6503,70.131C15.9967,55.5904,19.3084,45.9894,25.9248,37.444C27.44,35.4871,31.2682,31.6553,33.207,30.155C41.1394,24.0166,51.0284,20.4146,63.3695,19.1683C71.8912,18.3078,88.2913,18.3042,96.5306,19.1611C105.388,20.0823,112.418,21.9976,118.844,25.2404C123.772,27.7273,127.477,30.4186,131.015,34.0818C139.231,42.5887,143.605,53.2958,145.13,68.6317C145.744,74.8087,145.762,81.5228,145.696,272.625L145.631,461.185L145.422,463.566C144.666,472.215,143.708,477.414,141.834,483.032C137.922,494.764,130.637,503.7,120.35,509.386C114.835,512.434,108.648,514.509,101.579,515.683C97.4704,516.365,95.6581,516.486,86.9174,516.659C73.8567,516.918,68.15,517.508,62.0466,519.231C57.5627,520.496,52.7886,522.747,49.6959,525.054C48.2439,526.138,44.5959,529.831,42.1331,532.711C38.0707,537.461,35.4137,542.646,34.4234,547.755C34.2353,548.725,34.1061,549.544,34.1362,549.574C34.1663,549.604,34.7259,548.763,35.3798,547.704C38.6909,542.346,42.3459,538.644,48.0237,534.9C50.8109,533.062,53.0026,531.938,56.3923,530.609C59.8551,529.251,62.2165,528.556,64.4691,528.232C66.9381,527.877,69.2444,527.709,69.6971,527.853L70.0723,527.972L70.0713,528.886C70.0688,531.071,69.2003,535.185,68.0342,538.535C66.4481,543.092,63.442,549.253,61.225,552.492C55.1789,561.325,44.3815,566.999,27.2098,570.368C25.4151,570.72,23.4524,571.055,22.8483,571.111L21.75,571.214ZM38.8515,506.586C35.3435,506.189,32.5603,505.349,29.4863,503.76C22.5722,500.186,17.4554,493.747,14.5154,484.918C13.4482,481.714,12.3932,476.487,12.3932,474.405L12.3932,473.599L13.5838,473.699C21.298,474.345,24.5426,474.81,29.0786,475.919C37.6768,478.022,42.933,480.977,46.4746,485.698C47.731,487.372,49.5237,490.973,50.3992,493.58C51.4523,496.715,52.022,499.876,51.5831,500.148C51.3753,500.276,47.3469,498.852,44.902,497.786C40.4918,495.863,32.2744,490.904,27.8272,487.481C25.9091,486.004,25.8891,485.994,26.2496,486.698C26.7553,487.685,28.9765,490.885,30.456,492.758C33.2577,496.304,39.1615,501.854,43.7601,505.265L45.4013,506.482L45.1691,506.629C44.8768,506.814,40.6115,506.785,38.8515,506.586Z')","path('M21.6613,570.968C21.5005,570.523,21.0637,567.759,20.7438,565.163L20.429,562.609L20.4352,557.67L20.4414,552.731L20.7448,550.438C21.8613,541.997,24.7791,534.425,29.2466,528.373C31.8649,524.826,35.7142,521.332,40.439,518.213C45.9536,514.573,53.2531,511.977,61.4293,510.748C65.713,510.104,68.5162,509.943,78.1863,509.785C83.5705,509.698,89.0474,509.575,90.3571,509.513C100.194,509.047,108.143,507.259,114.818,504.009C122.79,500.13,128.664,494.302,132.521,486.446C135.954,479.452,137.597,472.06,138.156,461.097C138.398,456.359,138.397,-176.147,138.156,-180.879C137.736,-189.105,136.772,-194.939,134.912,-200.505C132.737,-207.017,129.713,-212.04,125.338,-216.407C118.255,-223.478,108.696,-227.398,95.2078,-228.765C88.34,-229.461,71.7423,-229.465,64.7807,-228.772C46.8046,-226.983,35.0561,-220.262,28.1672,-207.827C24.2958,-200.838,22.3088,-192.284,21.7442,-180.174C21.6286,-177.694,21.5657,143.358,21.5625,265.305L21.5576,451.837L21.5698,452.21C21.6155,453.606,20.3887,454.834,17.7635,454.746C15.1435,454.778,14.3693,453.149,14.4113,452.155L14.4216,451.911L14.4216,262.498L14.4216,-182.555L14.6503,-185.024C15.9967,-199.565,19.3084,-209.166,25.9248,-217.711C27.44,-219.668,31.2682,-223.5,33.207,-225C41.1394,-231.139,51.0284,-234.741,63.3695,-235.987C71.8912,-236.847,88.2913,-236.851,96.5306,-235.994C105.388,-235.073,112.418,-233.158,118.844,-229.915C123.772,-227.428,127.477,-224.737,131.015,-221.073C139.231,-212.567,143.605,-201.859,145.13,-186.524C145.744,-180.347,145.762,81.5228,145.696,272.625L145.631,461.185L145.422,463.566C144.666,472.215,143.708,477.414,141.834,483.032C137.922,494.764,130.637,503.7,120.35,509.386C114.835,512.434,108.648,514.509,101.579,515.683C97.4704,516.365,95.6581,516.486,86.9174,516.659C73.8567,516.918,68.15,517.508,62.0466,519.231C57.5627,520.496,52.7886,522.747,49.6959,525.054C48.2439,526.138,44.5959,529.831,42.1331,532.711C38.0707,537.461,35.4137,542.646,34.4234,547.755C34.2353,548.725,34.1061,549.544,34.1362,549.574C34.1663,549.604,34.7259,548.763,35.3798,547.704C38.6909,542.346,42.3459,538.644,48.0237,534.9C50.8109,533.062,53.0026,531.938,56.3923,530.609C59.8551,529.251,62.2165,528.556,64.4691,528.232C66.9381,527.877,69.2444,527.709,69.6971,527.853L70.0723,527.972L70.0713,528.886C70.0688,531.071,69.2003,535.185,68.0342,538.535C66.4481,543.092,63.442,549.253,61.225,552.492C55.1789,561.325,44.3815,566.999,27.2098,570.368C25.4151,570.72,23.4524,571.055,22.8483,571.111L21.75,571.214ZM38.8515,506.586C35.3435,506.189,32.5603,505.349,29.4863,503.76C22.5722,500.186,17.4554,493.747,14.5154,484.918C13.4482,481.714,12.3932,476.487,12.3932,474.405L12.3932,473.599L13.5838,473.699C21.298,474.345,24.5426,474.81,29.0786,475.919C37.6768,478.022,42.933,480.977,46.4746,485.698C47.731,487.372,49.5237,490.973,50.3992,493.58C51.4523,496.715,52.022,499.876,51.5831,500.148C51.3753,500.276,47.3469,498.852,44.902,497.786C40.4918,495.863,32.2744,490.904,27.8272,487.481C25.9091,486.004,25.8891,485.994,26.2496,486.698C26.7553,487.685,28.9765,490.885,30.456,492.758C33.2577,496.304,39.1615,501.854,43.7601,505.265L45.4013,506.482L45.1691,506.629C44.8768,506.814,40.6115,506.785,38.8515,506.586Z')"],e:[[1,0.77,0,0.175,1],[0]]}],
            {autoremove:false}).range(0,250);
    } else {
        ks.animate("#cont2",[{p:'d',t:[0,250],v:["path('M21.6613,570.968C21.5005,570.523,21.0637,567.759,20.7438,565.163L20.429,562.609L20.4352,557.67L20.4414,552.731L20.7448,550.438C21.8613,541.997,24.7791,534.425,29.2466,528.373C31.8649,524.826,35.7142,521.332,40.439,518.213C45.9536,514.573,53.2531,511.977,61.4293,510.748C65.713,510.104,68.5162,509.943,78.1863,509.785C83.5705,509.698,89.0474,509.575,90.3571,509.513C100.194,509.047,108.143,507.259,114.818,504.009C122.79,500.13,128.664,494.302,132.521,486.446C135.954,479.452,137.597,472.06,138.156,461.097C138.398,456.359,138.397,-176.147,138.156,-180.879C137.736,-189.105,136.772,-194.939,134.912,-200.505C132.737,-207.017,129.713,-212.04,125.338,-216.407C118.255,-223.478,108.696,-227.398,95.2078,-228.765C88.34,-229.461,71.7423,-229.465,64.7807,-228.772C46.8046,-226.983,35.0561,-220.262,28.1672,-207.827C24.2958,-200.838,22.3088,-192.284,21.7442,-180.174C21.6286,-177.694,21.5657,143.358,21.5625,265.305L21.5576,451.837L21.5698,452.21C21.6155,453.606,20.3887,454.834,17.7635,454.746C15.1435,454.778,14.3693,453.149,14.4113,452.155L14.4216,451.911L14.4216,262.498L14.4216,-182.555L14.6503,-185.024C15.9967,-199.565,19.3084,-209.166,25.9248,-217.711C27.44,-219.668,31.2682,-223.5,33.207,-225C41.1394,-231.139,51.0284,-234.741,63.3695,-235.987C71.8912,-236.847,88.2913,-236.851,96.5306,-235.994C105.388,-235.073,112.418,-233.158,118.844,-229.915C123.772,-227.428,127.477,-224.737,131.015,-221.073C139.231,-212.567,143.605,-201.859,145.13,-186.524C145.744,-180.347,145.762,81.5228,145.696,272.625L145.631,461.185L145.422,463.566C144.666,472.215,143.708,477.414,141.834,483.032C137.922,494.764,130.637,503.7,120.35,509.386C114.835,512.434,108.648,514.509,101.579,515.683C97.4704,516.365,95.6581,516.486,86.9174,516.659C73.8567,516.918,68.15,517.508,62.0466,519.231C57.5627,520.496,52.7886,522.747,49.6959,525.054C48.2439,526.138,44.5959,529.831,42.1331,532.711C38.0707,537.461,35.4137,542.646,34.4234,547.755C34.2353,548.725,34.1061,549.544,34.1362,549.574C34.1663,549.604,34.7259,548.763,35.3798,547.704C38.6909,542.346,42.3459,538.644,48.0237,534.9C50.8109,533.062,53.0026,531.938,56.3923,530.609C59.8551,529.251,62.2165,528.556,64.4691,528.232C66.9381,527.877,69.2444,527.709,69.6971,527.853L70.0723,527.972L70.0713,528.886C70.0688,531.071,69.2003,535.185,68.0342,538.535C66.4481,543.092,63.442,549.253,61.225,552.492C55.1789,561.325,44.3815,566.999,27.2098,570.368C25.4151,570.72,23.4524,571.055,22.8483,571.111L21.75,571.214ZM38.8515,506.586C35.3435,506.189,32.5603,505.349,29.4863,503.76C22.5722,500.186,17.4554,493.747,14.5154,484.918C13.4482,481.714,12.3932,476.487,12.3932,474.405L12.3932,473.599L13.5838,473.699C21.298,474.345,24.5426,474.81,29.0786,475.919C37.6768,478.022,42.933,480.977,46.4746,485.698C47.731,487.372,49.5237,490.973,50.3992,493.58C51.4523,496.715,52.022,499.876,51.5831,500.148C51.3753,500.276,47.3469,498.852,44.902,497.786C40.4918,495.863,32.2744,490.904,27.8272,487.481C25.9091,486.004,25.8891,485.994,26.2496,486.698C26.7553,487.685,28.9765,490.885,30.456,492.758C33.2577,496.304,39.1615,501.854,43.7601,505.265L45.4013,506.482L45.1691,506.629C44.8768,506.814,40.6115,506.785,38.8515,506.586Z')","path('M21.6613,570.968C21.5005,570.523,21.0637,567.759,20.7438,565.163L20.429,562.609L20.4352,557.67L20.4414,552.731L20.7448,550.438C21.8613,541.997,24.7791,534.425,29.2466,528.373C31.8649,524.826,35.7142,521.332,40.439,518.213C45.9536,514.573,53.2531,511.977,61.4293,510.748C65.713,510.104,68.5162,509.943,78.1863,509.785C83.5705,509.698,89.0474,509.575,90.3571,509.513C100.194,509.047,108.143,507.259,114.818,504.009C122.79,500.13,128.664,494.302,132.521,486.446C135.954,479.452,137.597,472.06,138.156,461.097C138.398,456.359,138.397,79.0083,138.156,74.2761C137.736,66.05,136.772,60.2167,134.912,54.6498C132.737,48.1381,129.713,43.1156,125.338,38.7487C118.255,31.6777,108.696,27.7573,95.2078,26.3904C88.34,25.6944,71.7423,25.6906,64.7807,26.3834C46.8046,28.1724,35.0561,34.8932,28.1672,47.3285C24.2958,54.3169,22.3088,62.8713,21.7442,74.9817C21.6286,77.461,21.5657,143.358,21.5625,265.305L21.5576,451.837L21.5698,452.21C21.6155,453.606,20.3887,454.834,17.7635,454.746C15.1435,454.778,14.3693,453.149,14.4113,452.155L14.4216,451.911L14.4216,262.498L14.4216,72.6004L14.6503,70.131C15.9967,55.5904,19.3084,45.9894,25.9248,37.444C27.44,35.4871,31.2682,31.6553,33.207,30.155C41.1394,24.0166,51.0284,20.4146,63.3695,19.1683C71.8912,18.3078,88.2913,18.3042,96.5306,19.1611C105.388,20.0823,112.418,21.9976,118.844,25.2404C123.772,27.7273,127.477,30.4186,131.015,34.0818C139.231,42.5887,143.605,53.2958,145.13,68.6317C145.744,74.8087,145.762,81.5228,145.696,272.625L145.631,461.185L145.422,463.566C144.666,472.215,143.708,477.414,141.834,483.032C137.922,494.764,130.637,503.7,120.35,509.386C114.835,512.434,108.648,514.509,101.579,515.683C97.4704,516.365,95.6581,516.486,86.9174,516.659C73.8567,516.918,68.15,517.508,62.0466,519.231C57.5627,520.496,52.7886,522.747,49.6959,525.054C48.2439,526.138,44.5959,529.831,42.1331,532.711C38.0707,537.461,35.4137,542.646,34.4234,547.755C34.2353,548.725,34.1061,549.544,34.1362,549.574C34.1663,549.604,34.7259,548.763,35.3798,547.704C38.6909,542.346,42.3459,538.644,48.0237,534.9C50.8109,533.062,53.0026,531.938,56.3923,530.609C59.8551,529.251,62.2165,528.556,64.4691,528.232C66.9381,527.877,69.2444,527.709,69.6971,527.853L70.0723,527.972L70.0713,528.886C70.0688,531.071,69.2003,535.185,68.0342,538.535C66.4481,543.092,63.442,549.253,61.225,552.492C55.1789,561.325,44.3815,566.999,27.2098,570.368C25.4151,570.72,23.4524,571.055,22.8483,571.111L21.75,571.214ZM38.8515,506.586C35.3435,506.189,32.5603,505.349,29.4863,503.76C22.5722,500.186,17.4554,493.747,14.5154,484.918C13.4482,481.714,12.3932,476.487,12.3932,474.405L12.3932,473.599L13.5838,473.699C21.298,474.345,24.5426,474.81,29.0786,475.919C37.6768,478.022,42.933,480.977,46.4746,485.698C47.731,487.372,49.5237,490.973,50.3992,493.58C51.4523,496.715,52.022,499.876,51.5831,500.148C51.3753,500.276,47.3469,498.852,44.902,497.786C40.4918,495.863,32.2744,490.904,27.8272,487.481C25.9091,486.004,25.8891,485.994,26.2496,486.698C26.7553,487.685,28.9765,490.885,30.456,492.758C33.2577,496.304,39.1615,501.854,43.7601,505.265L45.4013,506.482L45.1691,506.629C44.8768,506.814,40.6115,506.785,38.8515,506.586Z')"],e:[[1,0.825,0,0.23,1],[0]]}],
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