var hasInit = false;

var rebindBuffer = false;
var videoElement = undefined;
var enableVideo = false;
var copyVideo = false;
var setFrameVideo = false;
var equiRender = false;

var remoteImagesLoadStep = 1; // 1 for all images, 2 for every other, 10 for quick debug
var HQ = false;

var remoteLoad = false;
var finishedRemoteLoad = false;
var targetLoadProg = 0;
var imageList = [];
var vID = 0;
var previous_vID = 1;
var state = 0;
var previous_state = 1;
var idleTime = 0;

var initVideo = false;

var equiImage = new Image();
var preLoadEqui = false;
var equiReady = false;
var equiTime = 0;

var camFov = 35.6; // 35.6
var target_camFov = 51.6; // 35.6
var initial_camFov = 35.6; // 35.6
var fovGrowSpeed = 0;
var target_xRot = 0;
var target_yRot = 0;
var xRot = 0;
var yRot = 0;

const _supabaseUrl = 'https://cfzcrwfmlxquedvdajiw.supabase.co';
var _storyUrl = '/storage/v1/object/public/main-pages/Sy79ca1a1f537259a7';

var mainControl = false;
var updatingUniforms = false;
var fadeTintVal = [0.091,0.051,0.061];
var target_fadeTintVal = [0.091,0.051,0.061];
var mainTintVal = [0.25,0.25,0.25];
var target_mainTintVal = [0.25,0.25,0.25];
var fullBlurVal = 1.0;
var target_fullBlurVal = 1.0;
var blurModVal = 1.0;
var finishedInitUniform = false;

var loadIntro = true;
var introFirstFrame = undefined;

function LoadRenderer(){
    //loadImageURLs();
    vID = 0;
    tap_vID = 0;
    RemoteImage(1,true);
}

function RemoteImage(index, firstImage){
    let end = index.toString().padStart(4,'0');
    let qualityPath = HQ ? 'HQ' : 'LQ';
    let filename = '/Mn' + qualityPath + '_' + end;
    let fullPath = _supabaseUrl + _storyUrl + ('/P'+currentPage.toString()) + '/Mn/' + qualityPath + filename + '.webp';
    if(firstImage && loadIntro){
        fullPath = _supabaseUrl + _storyUrl + ('/P'+currentPage.toString()) + '/In/InFrame.webp';
    }
    fetch(fullPath)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], index.toString(), {type: blob.type});
                createImageBitmap(file).then(img => {
                    
                    if(firstImage){
                        console.log("LoadShadersAndInit");
                        if(loadIntro)
                            introFirstFrame = img;
                        else
                            imageList.push([img, index]);
                        LoadShadersAndInitRenderer();
                        return;
                    }
                    imageList.push([img, index]);

                    let lp = imageList.length / (160 / remoteImagesLoadStep);
                    targetLoadProg = lp;

                    let strokeDashOffset = Lerp(1116,493,lp);
                    root.style.setProperty('--loading-prog', strokeDashOffset + 'px');

                    if(lp >= 1)
                        SortImages();
                })
            });
}

function loadImageURLs(){
    for (let i = 1; i <= 160; i += remoteImagesLoadStep) { //160
        if(i == 1 && !loadIntro) continue;
        RemoteImage(i,false);
    }
}

function SortImages(){
    let leaf_s = document.getElementById("small-leaf");
    leaf_s.style.animation = "small-leaf_o";
    leaf_s.style.animationTimingFunction = "linear";
    leaf_s.style.animationFillMode = "both";
    leaf_s.style.animationDuration = "0.3s";
    let leaf_b = document.getElementById("big-leaf");
    leaf_b.style.animation = "small-leaf_o";
    leaf_b.style.animationTimingFunction = "linear";
    leaf_b.style.animationFillMode = "both";
    leaf_b.style.animationDuration = "0.3s";

    imageList.sort((a, b) => {
        if(a[1] > b[1])
            return 1;
        if(a[1] < b[1])
            return -1;
        return 0;
    });
    setTimeout(HideLoader, 500);
    //LoadShadersAndInitRenderer();
}

function HideLoader(){
    document.getElementById("lc-id").style.display = "none";
    

    mainControl = true;
    target_fadeTintVal = [0.091,0.051,0.061];
    target_mainTintVal = [1.0,1.0,1.0]
    target_fullBlurVal = 0.0;
    if(loadIntro)
        PlayIntroVideo();
}

function PlayIntroVideo(){
    state = 1;
    setVideo(1, true);
    equiImage.src = null;
    setFrameVideo = true;
}

async function LoadShadersAndInitRenderer(){

    const mainVertexShaderText = await fetch('./Shaders/main_vertex.glsl')
        .then(result => result.text());
    const equiVertexShaderText = await fetch('./Shaders/equi_vertex.glsl')
        .then(result => result.text());

    const fragmentShaderText = await fetch('./Shaders/main_fragment.glsl')
        .then(result => result.text());
    const downsampleShaderText = await fetch('./Shaders/downsample_fragment.glsl')
        .then(result => result.text());
    const equiShaderText = await fetch('./Shaders/equi_fragment.glsl')
        .then(result => result.text());

    const EquiObjText = await fetch('./EquiSphere.obj')
        .then(result => result.text());
    
    hasInit = true;
    InitRenderer(mainVertexShaderText,equiVertexShaderText,fragmentShaderText,downsampleShaderText, equiShaderText, EquiObjText);
}

function parseOBJ(text) {
    const objPositions = [[0, 0, 0]];
    const objTexcoords = [[0, 0]];
    const objNormals = [[0, 0, 0]];

    const objVertexData = [
      objPositions,
      objTexcoords,
      objNormals,
    ];
  
    let webglVertexData = [
      [],   // positions
      [],   // texcoords
      [],   // normals
    ];
  
    function addVertex(vert) {
      const ptn = vert.split('/');
      ptn.forEach((objIndexStr, i) => {
        if (!objIndexStr) {
          return;
        }
        const objIndex = parseInt(objIndexStr);
        const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
        webglVertexData[i].push(...objVertexData[i][index]);
      });
    }
  
    const keywords = {
      v(parts) {
        objPositions.push(parts.map(parseFloat));
      },
      vn(parts) {
        objNormals.push(parts.map(parseFloat));
      },
      vt(parts) {
        objTexcoords.push(parts.map(parseFloat));
      },
      f(parts) {
        const numTriangles = parts.length - 2;
        for (let tri = 0; tri < numTriangles; ++tri) {
          addVertex(parts[0]);
          addVertex(parts[tri + 1]);
          addVertex(parts[tri + 2]);
        }
      },
    };
    
    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
      const line = lines[lineNo].trim();
      if (line === '' || line.startsWith('#')) { continue; }
      const m = keywordRE.exec(line);
      if (!m) { continue; }
      const [, keyword, unparsedArgs] = m;
      const parts = line.split(/\s+/).slice(1);
      const handler = keywords[keyword];
      if (!handler) { continue; }
      handler(parts, unparsedArgs);
    }
  
    return {
      position: webglVertexData[0],
      texcoord: webglVertexData[1],
      normal: webglVertexData[2],
    };
}

var InitRenderer = function(mainVertexShaderText, equiVertexShaderText, fragmentShaderText, downsampleShaderText, equiShaderText, equiObjText){
    let mainCover = document.getElementById("mc-id");
    mainCover.style.animation = "fade_up_main";
    mainCover.style.animationTimingFunction = "linear";
    mainCover.style.animationFillMode = "both";
    mainCover.style.animationDuration = "0.3s";
    
    var canvas = document.getElementById('application');
    var gl = canvas.getContext('webgl2');
    if(!gl) { console.log("WebGL not supported, falling back on experimental"); gl = canvas.getContext('experimental-webgl'); }

    //const ext = gl.getExtension('GMAN_webgl_memory'); // Memory Extension

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    
    function createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
          return shader;
        }
        //console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
          return program;
        }
        //console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    var mainVertexShader = createShader(gl, gl.VERTEX_SHADER, mainVertexShaderText);
    var mainFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
    var prg_main = createProgram(gl, mainVertexShader, mainFragmentShader);

    var downsampleFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, downsampleShaderText);
    var prg_downsample = createProgram(gl, mainVertexShader, downsampleFragmentShader);
    
    var equiVertexShader = createShader(gl, gl.VERTEX_SHADER, equiVertexShaderText);
    var equiFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, equiShaderText);
    var prg_equi = createProgram(gl, equiVertexShader, equiFragmentShader);

    var main_positionAttributeLocation = gl.getAttribLocation(prg_main, "vertPosition");
    var main_texCoordAttributeLocation = gl.getAttribLocation(prg_main, "vertTexCoord");
    var main_mWorldUniformLocation = gl.getUniformLocation(prg_main, "mWorld");
    var main_mViewUniformLocation = gl.getUniformLocation(prg_main, "mView");
    var main_mProjUniformLocation = gl.getUniformLocation(prg_main, "mProj");
    var main_Sampler1UniformLocation = gl.getUniformLocation(prg_main, "sampler_1");
    var main_Sampler2UniformLocation = gl.getUniformLocation(prg_main, "sampler_2");
    var main_TopAndBottomUniformLocation = gl.getUniformLocation(prg_main, "topAndBottom");
    var main_fadeTintUniformLocation = gl.getUniformLocation(prg_main, "fadeTint");
    var main_mainTintUniformLocation = gl.getUniformLocation(prg_main, "mainTint");
    var main_blurModUniformLocation = gl.getUniformLocation(prg_main, "blurMod");
    var main_fullBlurUniformLocation = gl.getUniformLocation(prg_main, "fullBlur");

    var downsample_positionAttributeLocation = gl.getAttribLocation(prg_downsample, "vertPosition");
    var downsample_texCoordAttributeLocation = gl.getAttribLocation(prg_downsample, "vertTexCoord");
    var downsample_mWorldUniformLocation = gl.getUniformLocation(prg_downsample, "mWorld");
    var downsample_mViewUniformLocation = gl.getUniformLocation(prg_downsample, "mView");
    var downsample_mProjUniformLocation = gl.getUniformLocation(prg_downsample, "mProj");
    var downsample_Sampler1UniformLocation = gl.getUniformLocation(prg_downsample, "sampler_1");

    var equi_positionAttributeLocation = gl.getAttribLocation(prg_equi, "vertPosition");
    var equi_texCoordAttributeLocation = gl.getAttribLocation(prg_equi, "vertTexCoord");
    var equi_mWorldUniformLocation = gl.getUniformLocation(prg_equi, "mWorld");
    var equi_mViewUniformLocation = gl.getUniformLocation(prg_equi, "mView");
    var equi_mProjUniformLocation = gl.getUniformLocation(prg_equi, "mProj");
    var equi_Sampler1UniformLocation = gl.getUniformLocation(prg_equi, "sampler_1");

    const meshData = parseOBJ(equiObjText);

    var planePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, planePositionBuffer);
    var planeVertices = 
	[
		1.0, -1.0, 1.0,     
        1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0,    
        -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,  
	];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeVertices), gl.STATIC_DRAW); //planeVertices

    var planeTexCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, planeTexCoordsBuffer);
    var planeTexCoords = 
    [ // U V
        1.0, 0.0, canvas.width, canvas.height,
        1.0, 1.0, canvas.width, canvas.height,
        0.0, 0.0, canvas.width, canvas.height,
        0.0, 1.0, canvas.width, canvas.height,
        0.0, 0.0, canvas.width, canvas.height,
        1.0, 1.0, canvas.width, canvas.height,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeTexCoords), gl.STATIC_DRAW); //planeTexCoords

    var downsamplePlaneTexCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, downsamplePlaneTexCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeTexCoords), gl.STATIC_DRAW); //planeTexCoords

    var plane_worldMatrix = new Float32Array(16); mat4.identity(plane_worldMatrix);
    var plane_viewMatrix = new Float32Array(16); mat4.identity(plane_viewMatrix);
    var plane_projMatrix = new Float32Array(16); mat4.identity(plane_projMatrix);

    var equiPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, equiPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshData.position), gl.STATIC_DRAW);

    var equiTexCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, equiTexCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshData.texcoord), gl.STATIC_DRAW);

    // Bind equi mesh stuff here

    var equi_worldMatrix = new Float32Array(16); mat4.identity(equi_worldMatrix);
    var equi_viewMatrix = new Float32Array(16); mat4.lookAt(equi_viewMatrix, [0,0,-6], [0,0,0], [0,1,0]);
    var equi_projMatrix = new Float32Array(16); mat4.perspective(equi_projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    const mainTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, mainTexture);
    gl.texImage2D(
        gl.TEXTURE_2D, 
        0,                  // mip level
        gl.RGBA,            // internal format
        gl.RGBA,            // format
        gl.UNSIGNED_BYTE,   // type
        loadIntro ? introFirstFrame : imageList[0][0]     // data // imageList[0][0]
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT); // MIRRORED_REPEAT
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // ------------ Frame Buffer Setup ->

    const fbTextureWidth = 750;
    const fbTextureHeight = 938;
    const fbTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fbTexture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,                // mip level
        gl.RGBA,          // internal format
        fbTextureWidth,   // width
        fbTextureHeight,  // height
        0,                // border
        gl.RGBA,          // format
        gl.UNSIGNED_BYTE, // type
        null,             // data
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT); // MIRRORED_REPEAT
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);

    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbTexture, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.useProgram(prg_main);

    gl.uniform3fv(main_fadeTintUniformLocation,fadeTintVal);
    gl.uniform3fv(main_mainTintUniformLocation,mainTintVal);
    gl.uniform1f(main_blurModUniformLocation,blurModVal);
    gl.uniform1f(main_fullBlurUniformLocation,1.0);

    videoElement = document.createElement("video");
    if(loadIntro){
        videoElement.addEventListener("ended", (event) => {
            console.log("VID HAS ENDED");
            introFirstFrame = undefined;
            state = 0;
        });
    }
    
    // var currentVideo = setupVideo("https://cfzcrwfmlxquedvdajiw.supabase.co/storage/v1/object/public/main-pages/Video/Video_F0001_1500.mp4");

    // ------------ Resize ->

    const canvasToDisplaySizeMap = new Map([[canvas, [750, 938]]]);

    function onResize(entries) {
        for (const entry of entries) {
            let width;
            let height;
            let dpr = window.devicePixelRatio;
            if (entry.devicePixelContentBoxSize) {
                width = entry.devicePixelContentBoxSize[0].inlineSize;
                height = entry.devicePixelContentBoxSize[0].blockSize;
                dpr = 1; // it's already in width and height
            } else if (entry.contentBoxSize) {
                if (entry.contentBoxSize[0]) {
                    width = entry.contentBoxSize[0].inlineSize;
                    height = entry.contentBoxSize[0].blockSize;
                } else {
                    // legacy
                    width = entry.contentBoxSize.inlineSize;
                    height = entry.contentBoxSize.blockSize;
                }
            } else {
                // legacy
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }
            //const displayWidth = Math.round(width * dpr); //dpr
            //const displayHeight = Math.round(height * dpr); //dpr
            const displayWidth = 750;
            const displayHeight = parseInt(750 * (height / width));

            canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
        }
    }

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas, {box: 'content-box'});

    function resizeCanvasToDisplaySize(canvas) {
        const [displayWidth, displayHeight] = canvasToDisplaySizeMap.get(canvas);
        const needResize = canvas.width  !== displayWidth || canvas.height !== displayHeight || rebindBuffer;

        if (needResize) {
            let CanvasBC = canvas.getBoundingClientRect();
            canvasLeft = CanvasBC.left;
            canvasWidth = CanvasBC.width;

            canvas.width  = displayWidth;
            canvas.height = displayHeight;


            //let sa_t = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sat"));
            let sa_t = 0; //110
            sa_t *= (displayHeight / window.innerHeight);
            var correctUV = fitImageToUV(displayWidth, displayHeight, sa_t, true);
            var uTop = correctUV[0];
            var uBottom = correctUV[1];

            // let pageBlock = document.getElementById('page-block');
            // let paraOffset = getParaOffset(displayWidth, displayHeight, sa_t) * 0.9;
            // pageBlock.style.top = (100 * paraOffset).toString() + "vh";
            // pageBlock.style.height = ((1 - paraOffset) * 100).toString() + "vh";

            //let enableVideo = false;
            var newPlaneTexCoords = 
            [ // U V
                1.0, enableVideo && copyVideo ? uBottom : 1 - uBottom, canvas.width, displayHeight,
                1.0, enableVideo && copyVideo ? uTop : 1 - uTop, canvas.width, displayHeight,
                0.0, enableVideo && copyVideo ? uBottom : 1 - uBottom, canvas.width, displayHeight,
                0.0, enableVideo && copyVideo ? uTop : 1 - uTop, canvas.width, displayHeight,
                0.0, enableVideo && copyVideo ? uBottom : 1 - uBottom, canvas.width, displayHeight,
                1.0, enableVideo && copyVideo ? uTop : 1 - uTop, canvas.width, displayHeight,
            ]

            gl.bindBuffer(gl.ARRAY_BUFFER, planeTexCoordsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newPlaneTexCoords), gl.STATIC_DRAW);
            gl.uniform2fv(main_TopAndBottomUniformLocation, [correctUV[2],correctUV[3]]);

            console.log("Rebinding buffer data");
            rebindBuffer = false;
            if(state == 2)
                equiReady = true;
        }

        return needResize;
    }

    // ------------ Render Loop ->


    var then = 0;

    function render(now) {
        now *= 0.001;
        var deltaTime = now - then;
        then = now;

        let newState = previous_state != state;
        if(newState){
            if(state != 1 && videoElement.src != null){
                if(!videoElement.paused){
                    videoElement.pause();
                    videoElement.src = null;
                    videoElement.load();
                    console.log("EMPTYING VIDEO");
                }
            }
            if(state != 2){
                equiReady = false;
                target_xRot = 0;
                xRot = 0;
                target_yRot = 0;
                yRot = 0;
                lastLookX = lookX;
                lastLookY = lookY;
                target_camFov = 51.6;
                camFov = initial_camFov;
                fovGrowSpeed = 0;
                equiTime = 0;
                rebindBuffer = state == 0; // true
            } else {
                equiImage.onload = function() {
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, mainTexture);
                    gl.texImage2D(
                        gl.TEXTURE_2D, 
                        0,
                        gl.RGBA,
                        gl.RGBA,
                        gl.UNSIGNED_BYTE,
                        equiImage
                    );
                    rebindBuffer = true;
                };
                equiImage.crossOrigin = "anonymous";
                let imgPath = _supabaseUrl + _storyUrl + ('/P'+currentPage.toString()) + '/Eq/Eq_' + "1".padStart(4,'0') + '.webp';
                console.log(imgPath);
                equiImage.src = imgPath;
            }
            idleTime = 0;
            setFrameVideo = false;
            enableVideo = state == 1;
            copyVideo = false;
            equiRender = state == 2;
            console.log("New state: " + state);
        }

        let resized = resizeCanvasToDisplaySize(gl.canvas);
        let redraw = previous_vID != vID || resized || (enableVideo && copyVideo) || (state == 2 && equiReady) || updatingUniforms;
        //let canRedraw = state == 2 && enableVideo && copyVideo;

        if(redraw){
            //console.log("REDRAW");
            if(equiRender){
                gl.viewport(0, 0, fbTextureWidth, fbTextureHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

                gl.clearColor(0.25, 0.35, 0.8, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                gl.useProgram(prg_equi);

                gl.enableVertexAttribArray(equi_positionAttributeLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, equiPositionBuffer);
                gl.vertexAttribPointer(equi_positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

                gl.enableVertexAttribArray(equi_texCoordAttributeLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, equiTexCoordsBuffer);
                gl.vertexAttribPointer(equi_texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, mainTexture);

                camFov = Lerp(camFov, target_camFov, deltaTime * 2 * fovGrowSpeed);

                let clampXY = FOVClamp(camFov);
                target_xRot += (lastLookX - lookX) * 1.81;
                target_xRot = Clamp(target_xRot,-clampXY[0],clampXY[0]);
                target_yRot += (lastLookY - lookY) * 1.81;
                target_yRot = Clamp(target_yRot,-clampXY[1],clampXY[1]);

                xRot = Lerp(xRot,target_xRot,deltaTime * 16);
                yRot = Lerp(yRot,target_yRot,deltaTime * 16);

                mat4.identity(equi_worldMatrix);
                mat4.lookAt(
                    equi_viewMatrix,
                    [0,0,-0.00001], 
                    [xRot * lookSens * 0.01,yRot * lookSens * -0.01,0], 
                    [0,1,0]);
                mat4.perspective(equi_projMatrix, glMatrix.toRadian(camFov), fbTextureWidth / fbTextureHeight, 0.1, 1000.0);

                gl.uniform1i(equi_Sampler1UniformLocation, 0);
                gl.uniformMatrix4fv(equi_mWorldUniformLocation, gl.FALSE, equi_worldMatrix);
                gl.uniformMatrix4fv(equi_mViewUniformLocation, gl.FALSE, equi_viewMatrix);
                gl.uniformMatrix4fv(equi_mProjUniformLocation, gl.FALSE, equi_projMatrix);

                gl.drawArrays(gl.TRIANGLES, 0, meshData.position.length / 3); //6
            } else {
                gl.viewport(0, 0, fbTextureWidth, fbTextureHeight);
                gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

                gl.clearColor(0.25, 0.35, 0.8, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                gl.useProgram(prg_downsample);

                gl.enableVertexAttribArray(downsample_positionAttributeLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, planePositionBuffer);
                gl.vertexAttribPointer(downsample_positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

                gl.enableVertexAttribArray(downsample_texCoordAttributeLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, downsamplePlaneTexCoordsBuffer);
                gl.vertexAttribPointer(downsample_texCoordAttributeLocation, 4, gl.FLOAT, false, 0, 0);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, mainTexture);
                gl.texImage2D(
                    gl.TEXTURE_2D, 
                    0,                  // mip level
                    gl.RGBA,            // internal format
                    gl.RGBA,            // format
                    gl.UNSIGNED_BYTE,   // type
                    (enableVideo && copyVideo) ? videoElement : (introFirstFrame != null && loadIntro) ? introFirstFrame : imageList[vID][0]
                );

                gl.uniform1i(downsample_Sampler1UniformLocation, 0);
                gl.uniformMatrix4fv(downsample_mWorldUniformLocation, gl.FALSE, plane_worldMatrix);
                gl.uniformMatrix4fv(downsample_mViewUniformLocation, gl.FALSE, plane_viewMatrix);
                gl.uniformMatrix4fv(downsample_mProjUniformLocation, gl.FALSE, plane_projMatrix);

                gl.drawArrays(gl.TRIANGLES, 0, 6); //6
            }
            
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            gl.clearColor(0.25, 0.35, 0.8, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.useProgram(prg_main);

            gl.enableVertexAttribArray(main_positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, planePositionBuffer);
            gl.vertexAttribPointer(main_positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(main_texCoordAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, planeTexCoordsBuffer);
            gl.vertexAttribPointer(main_texCoordAttributeLocation, 4, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, fbTexture);
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, mainTexture);
            
            gl.uniform1i(main_Sampler1UniformLocation, 1);
            gl.uniform1i(main_Sampler2UniformLocation, equiRender ? 1 : 2);

            gl.uniform3fv(main_fadeTintUniformLocation,fadeTintVal);
            gl.uniform3fv(main_mainTintUniformLocation,mainTintVal);
            gl.uniform1f(main_blurModUniformLocation,blurModVal);
            gl.uniform1f(main_fullBlurUniformLocation,fullBlurVal);
            
            gl.uniformMatrix4fv(main_mWorldUniformLocation, gl.FALSE, plane_worldMatrix);
            gl.uniformMatrix4fv(main_mViewUniformLocation, gl.FALSE, plane_viewMatrix);
            gl.uniformMatrix4fv(main_mProjUniformLocation, gl.FALSE, plane_projMatrix);

            gl.drawArrays(gl.TRIANGLES, 0, 6); //6
        }

        if(vID != previous_vID){
            preLoadEqui = false;
            scrubLeft = vID >= previous_vID;
        }

        previous_vID = vID;
        previous_state = state;

        if(state == 2){
            lastLookX = lookX;
            lastLookY = lookY;
            
            if(equiTime < 5 && equiReady)
                equiTime += deltaTime;
            if(fovGrowSpeed < (equiReleased ? 5 : 2) && equiReady && equiTime > 0.15)
                fovGrowSpeed += deltaTime * (equiReleased ? 10 : 5);
            if(equiReleased && camFov < target_camFov + 0.5)
                state = 0;
        }

        if(state == 0){
            if(idleTime < 5 && firstCanvasInteraciton && !inputting)
                idleTime += deltaTime;
            if(idleTime > 1 && !setFrameVideo && !inputting){
                state = 1;
                setVideo(vID, false);
                equiImage.src = null;
                setFrameVideo = true;
            }
            if(redraw){
                idleTime = 0;
                setFrameVideo = false;
            }
        }

        if(doubleTapDelay > 0){
            doubleTapDelay -= deltaTime * 3;
        }

        if(inputting && tapHoldTime < 10 && tapHoldTime > -10){
            tapHoldTime += deltaTime;
            if(Math.abs(tapPos[0] - holdPos[0]) < 10 && Math.abs(tapPos[1] - holdPos[1]) < 10 && tapHoldTime > 0.30
            && vID == tap_vID && state != 2 && firstTapInCanvas && !updatingUniforms){
                state = 2;
                lookX = tapPos[0];
                lookY = tapPos[1];
                lastLookX = tapPos[0];
                lastLookY = tapPos[1];
                equiReleased = false;
            }
        }

        let updateColour = fadeTintVal[0] < target_fadeTintVal[0] - 0.001 || fadeTintVal[0] > target_fadeTintVal[0] + 0.001
                        || mainTintVal[0] < target_mainTintVal[0] - 0.001 || mainTintVal[0] > target_mainTintVal[0] + 0.001
                        || fullBlurVal < target_fullBlurVal - 0.001 || fullBlurVal > target_fullBlurVal + 0.001;
        if(!updateColour && updatingUniforms){
            console.log("Finished updating uniforms");
            fadeTintVal = target_fadeTintVal;
            mainTintVal = target_mainTintVal;
            fullBlurVal = target_fullBlurVal;
            gl.useProgram(prg_main);
            gl.uniform3fv(main_fadeTintUniformLocation,fadeTintVal);
            gl.uniform3fv(main_mainTintUniformLocation,mainTintVal);
            gl.uniform1f(main_fullBlurUniformLocation,fullBlurVal);
            finishedInitUniform = true;
        }
        updatingUniforms = updateColour;

        if(deltaTime < 0.1 && updatingUniforms){
            let uSpeed = finishedInitUniform ? 6 : 3;
            fadeTintVal = Lerp3(fadeTintVal, target_fadeTintVal, deltaTime * uSpeed);
            mainTintVal = Lerp3(mainTintVal, target_mainTintVal, deltaTime * uSpeed);
            fullBlurVal = Lerp(fullBlurVal, target_fullBlurVal, deltaTime * uSpeed);
        }

        // if (ext) { // Memory Info
        //     const info = ext.getMemoryInfo();
        //     document.querySelector('#info').textContent = JSON.stringify(info, null, 2);
        // }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    
    if(!remoteLoad){
        loadImageURLs();
        remoteLoad = true;
    }

    console.log("Renderer Setup Finished");
}

function setupVideo(url) {
    //video = document.createElement("video");
  
    let playing = false;
    let timeupdate = false;
  
    videoElement.crossOrigin = "anonymous";
    videoElement.playsInline = true;
    videoElement.muted = true;
    videoElement.loop = true;
  
    // Waiting for these 2 events ensures
    // there is data in the video
  
    videoElement.addEventListener(
      "playing",
      () => {
        playing = true;
        //console.log("Video wants to play");
        checkReady();
      },
      true
    );
  
    videoElement.addEventListener(
      "timeupdate",
      () => {
        timeupdate = true;
        //console.log("Video wants to update");
        checkReady();
      },
      true
    );
  
    videoElement.src = url;
    videoElement.play();
  
    function checkReady() {
      if (playing && timeupdate) {
        if(!copyVideo && state == 1){
            rebindBuffer = true;
        }
        copyVideo = true;
      }
    }
  
    return videoElement;
}

function setVideo(videoID, isIntro){
    //return;
    //let vidURL = isIntro ? 'https://cfzcrwfmlxquedvdajiw.supabase.co/storage/v1/object/public/main-pages/Video/IntroVideoV2_P10001-0120.mp4' 
    //: 'https://cfzcrwfmlxquedvdajiw.supabase.co/storage/v1/object/public/main-pages/Video/Video_F0001_1500.mp4';

    let q = HQ ? 'HQ' : 'LQ';
    let vidURL = _supabaseUrl + _storyUrl + ('/P'+currentPage.toString()) + '/Vd/' + q + '/Vd' + q + '_' + "1".padStart(4,'0') + '.mp4';
    if(isIntro)
        vidURL = _supabaseUrl + _storyUrl + ('/P'+currentPage.toString()) + '/In/InVd.mp4'
    console.log(vidURL);

    if(!initVideo){
        setupVideo(vidURL);
        initVideo = true;
    }else{
        videoElement.src = vidURL;
        videoElement.play();
    }
    videoElement.loop = !isIntro;
    //enableVideo = true;
    state = 1;
    console.log("Setting Video...");
}

function getParaOffset(containerWidth, containerHeight, safeArea){
    let card_prop = (containerWidth * 1.25066) / containerHeight;
    let sa_prop = safeArea / containerHeight;

    return card_prop + sa_prop;
}

function fitImageToUV(containerWidth, containerHeight, safeArea, desktop){
    let uvTop, uvBottom, pTop, pBottom;

    let v_B = (containerWidth * 1.25066) / containerHeight;
    if(desktop){
        let v_Bh = ((1 - v_B) / 2) * (1 / v_B);
        
        uvTop = 1.0 + v_Bh;
        uvBottom = 0.0 - v_Bh;

        pTop = (1.0 - v_B) / 2;
        pBottom = 1.0 - ((1.0 - v_B) / 2);

        return [uvTop, uvBottom, pTop, pBottom];

    } else {
        let a_off = ((1 - v_B) * (1 / v_B));
        let v_T = safeArea / containerHeight;
        let t_off = (v_T * (1 / v_B));

        uvTop = 1.0 + t_off;
        uvBottom = (-a_off) + t_off;

        pTop = 1.0 - (v_T + v_B);
        pBottom = 1.0 - v_T;
    
        return [uvTop, uvBottom, pTop, pBottom];
    }
}

function FOVClamp(fov){
    let clampX = 7050; //3600
    let clampY = 700; //475

    let fov_t = (fov - 20) / 70;
    let mod = 8 * (1.0 - fov_t) * 0.5;
    clampX = (fov * mod) ** 1.45 + 1050;

    clampY = Lerp(600,0, fov_t);

    return [clampX,clampY]; // [3600,475] 
}


// --------------- DEBUG

function DB_0(){
    state = 0;
    if(!hasInit){
        LoadRenderer();
        console.log("Init Renderer Button");
    }
}

function DB_1(){
    console.log(videoElement);
    //target_fullBlurVal = 1.0;
    //state = 1;
}

function DB_2(){
    state = 2;
}

function DB_3(){
    state = 0;
    HQ = true;
    //loadIntro = true;
    DB_0();
}

function DB_4(){
    vID = imageList.length - 1;
    console.log(vID);
    console.log(imageList[vID]);
    //console.log(imageList);
}