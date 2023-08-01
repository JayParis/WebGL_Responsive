var hasInit = false;
var needsInvert = false;

var remoteImagesLoadStep = 10; // 1 for all images, 2 for every other
var imageList = [];
var vID = 0;
var previous_vID = 0;

const _supabaseUrl = 'https://cfzcrwfmlxquedvdajiw.supabase.co';

var equiImage = new Image();

function LoadRenderer(){
    equiImage.onload = function() {
        console.log("Equi Image Loaded");
        loadImageURLs(true);
	};
    equiImage.src = './Images/Page_1_Frame_1_Equi4K_JPG3.jpg';
}

function loadImageURLs(HQ){
    let path = HQ ? '/storage/v1/object/public/main-pages/Page_1_Main_' 
        : '/storage/v1/object/public/main-pages/750/Page_1_Main_';
    
    for (let i = 1; i <= 160; i += remoteImagesLoadStep) { //160
        let end = i.toString().padStart(4,'0');
        fetch(_supabaseUrl + path + end + '.webp')
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], i.toString(), {type: blob.type});
                createImageBitmap(file).then(img => {
                    imageList.push([img, i]);
                    
                    console.log(i);

                    if(imageList.length == (160 / remoteImagesLoadStep))
                        SortImages();
                });
            })
    }
}

function SortImages(){
    imageList.sort((a, b) => {
        if(a[1] > b[1])
            return 1;
        if(a[1] < b[1])
            return -1;
        return 0;
    });
    console.log(imageList[0]);
    loadShadersAndInitRenderer();
}

async function loadShadersAndInitRenderer(){

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
    const OBJIndices = [];
  
    // same order as `f` indices
    let webglVertexData = [
      [],   // positions
      [],   // texcoords
      [],   // normals
    ];
  
    const keywords = {
      v(parts) {
        webglVertexData[0].push(...parts.map(parseFloat));
      },
      vt(parts) {
		webglVertexData[1].push(...parts.map(parseFloat));
      },
      f(parts) {
        for (let i = 0; i < parts.length; i++) {
            let firstVal = parts[i].split('/')[0];
            OBJIndices.push(parseInt(firstVal) - 1);
        }
      },
    };
  
    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
      const line = lines[lineNo].trim();
      if (line === '' || line.startsWith('#')) {
        continue;
      }
      const m = keywordRE.exec(line);
      if (!m) {
        continue;
      }
      const [, keyword, unparsedArgs] = m;
      const parts = line.split(/\s+/).slice(1);
      const handler = keywords[keyword];
      if (!handler) {
        continue;
      }
      handler(parts, unparsedArgs);
    }
  
    return {
      position: webglVertexData[0],
      texcoord: webglVertexData[1],
      normal: webglVertexData[2],
      indices: OBJIndices,
    };
}

var InitRenderer = function(mainVertexShaderText, equiVertexShaderText, fragmentShaderText, downsampleShaderText, equiShaderText, equiObjText){
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
        console.log(gl.getShaderInfoLog(shader));
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
        console.log(gl.getProgramInfoLog(program));
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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeVertices), gl.STATIC_DRAW);

    var planeTexCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, planeTexCoordsBuffer);
    var planeTexCoords = 
    [ // U V
        1.0, 1.0, canvas.width, canvas.height,
        1.0, 0.0, canvas.width, canvas.height,
        0.0, 1.0, canvas.width, canvas.height,
        0.0, 0.0, canvas.width, canvas.height,
        0.0, 1.0, canvas.width, canvas.height,
        1.0, 0.0, canvas.width, canvas.height,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeTexCoords), gl.STATIC_DRAW);

    var plane_worldMatrix = new Float32Array(16); mat4.identity(plane_worldMatrix);
    var plane_viewMatrix = new Float32Array(16); mat4.identity(plane_viewMatrix);
    var plane_projMatrix = new Float32Array(16); mat4.identity(plane_projMatrix);

    // Bind equi mesh stuff here

    var equi_worldMatrix = new Float32Array(16); mat4.identity(equi_worldMatrix);
    var equi_viewMatrix = new Float32Array(16); mat4.lookAt(equi_viewMatrix, [0,0,-5], [0,0,0], [0,1,0]);
    var equi_projMatrix = new Float32Array(16); mat4.perspective(equi_projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    const mainTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, mainTexture);
    gl.texImage2D(
        gl.TEXTURE_2D, 
        0,                  // mip level
        gl.RGBA,            // internal format
        gl.RGBA,            // format
        gl.UNSIGNED_BYTE,   // type
        imageList[1][0]     // data
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT); // MIRRORED_REPEAT
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


    const meshData = parseOBJ(equiObjText);
    console.log(meshData);

    /*
    var planeIndices =
	[
		// Front
		1, 0, 2,
		3, 2, 0,
	];
    */

    // ------------ Resize ->

    const canvasToDisplaySizeMap = new Map([[canvas, [750, 938]]]);

    function onResize(entries) {
        for (const entry of entries) {
            let width;
            let height;
            let dpr = window.devicePixelRatio;
            if (entry.devicePixelContentBoxSize) {
                // NOTE: Only this path gives the correct answer
                // The other 2 paths are an imperfect fallback
                // for browsers that don't provide anyway to do this
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
        const needResize = canvas.width  !== displayWidth || canvas.height !== displayHeight || needsInvert;

        if (needResize) {
            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;

            //let sa_t = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sat"));
            let sa_t = 110; //0
            sa_t *= (displayHeight / window.innerHeight);
            var correctUV = fitImageToUV(displayWidth, displayHeight, sa_t, true);
            var uTop = correctUV[0];
            var uBottom = correctUV[1];

            // let pageBlock = document.getElementById('page-block');
            // let paraOffset = getParaOffset(displayWidth, displayHeight, sa_t) * 0.9;
            // pageBlock.style.top = (100 * paraOffset).toString() + "vh";
            // pageBlock.style.height = ((1 - paraOffset) * 100).toString() + "vh";

            console.log("VertBuffer Updating");

            console.log("Safe Area Top: " + sa_t);
            console.log("Width: " + displayWidth);
            console.log("Height: " + displayHeight);

            let enableVideo = false;
            var newPlaneTexCoords = 
            [ // U V
                1.0, enableVideo ? uBottom : 1 - uBottom, canvas.width, displayHeight,
                1.0, enableVideo ? uTop : 1 - uTop, canvas.width, displayHeight,
                0.0, enableVideo ? uBottom : 1 - uBottom, canvas.width, displayHeight,
                0.0, enableVideo ? uTop : 1 - uTop, canvas.width, displayHeight,
                0.0, enableVideo ? uBottom : 1 - uBottom, canvas.width, displayHeight,
                1.0, enableVideo ? uTop : 1 - uTop, canvas.width, displayHeight,
            ]

            gl.bindBuffer(gl.ARRAY_BUFFER, planeTexCoordsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newPlaneTexCoords), gl.STATIC_DRAW);
            gl.uniform2fv(main_TopAndBottomUniformLocation, [correctUV[2],correctUV[3]]);

            // gl.useProgram(prg_main);
            // gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
            // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newPlaneTexCoords), gl.STATIC_DRAW);
            // gl.uniform2fv(topAndBottomLoc, [correctUV[2],correctUV[3]]);
            
            // pro2
            needsInvert = false;
        }

        return needResize;
    }

    // ------------ Render Loop ->

    var equiRender = true;

    var then = 0;

    function render(now) {
        now *= 0.001;
        var deltaTime = now - then;
        then = now;
        
        let resized = resizeCanvasToDisplaySize(gl.canvas);
        let redraw = previous_vID != vID || resized;

        if(redraw){
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(0.85, 0.35, 0.8, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.useProgram(prg_main);

            gl.enableVertexAttribArray(main_positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, planePositionBuffer);
            gl.vertexAttribPointer(main_positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

            gl.enableVertexAttribArray(main_texCoordAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, planeTexCoordsBuffer);
            gl.vertexAttribPointer(main_texCoordAttributeLocation, 4, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, mainTexture);

            gl.uniform1i(main_Sampler1UniformLocation, 0);
            gl.uniformMatrix4fv(main_mWorldUniformLocation, gl.FALSE, plane_worldMatrix);
            gl.uniformMatrix4fv(main_mViewUniformLocation, gl.FALSE, plane_viewMatrix);
            gl.uniformMatrix4fv(main_mProjUniformLocation, gl.FALSE, plane_projMatrix);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        previous_vID = vID;

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    
    console.log("Running Demo");
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

function RendererDebugButton(){

    vID += 1;
    if(vID >= imageList.length - 1)
        vID = 0;

    console.log(vID);
    
    console.log("This is a renderer debug button");
}