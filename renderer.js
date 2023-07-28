var hasInit = false;
var needsInvert = false;

var remoteImagesLoadStep = 10; // 1 for all images, 2 for every other
var imageList = [];
var vID = 0;
var previous_vID = 0;

const _supabaseUrl = 'https://cfzcrwfmlxquedvdajiw.supabase.co';


function LoadRenderer(){
    loadImageURLs(true);
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
    loadShadersAndRunDemo();
}

async function loadShadersAndRunDemo(){

    const vertexShaderText = await fetch('./Shaders/main_vertex.glsl')
        .then(result => result.text());
    const fragmentShaderText = await fetch('./Shaders/main_fragment.glsl')
        .then(result => result.text());
    const downsampleShaderText = await fetch('./Shaders/downsample_fragment.glsl')
        .then(result => result.text());
    
    hasInit = true;
    RunDemo(vertexShaderText,fragmentShaderText,downsampleShaderText);
}

var RunDemo = function(vertexShaderText, fragmentShaderText, downsampleShaderText){
    var canvas = document.getElementById('application');
    var gl = canvas.getContext('webgl2');
    if(!gl) { console.log("WebGL not supported, falling back on experimental"); gl = canvas.getContext('experimental-webgl'); }

    //const ext = gl.getExtension('GMAN_webgl_memory'); // Memory Extension

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(vertexShader))
    };
        
    const downsampleShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(downsampleShader, downsampleShaderText); //fragmentShaderText
    gl.compileShader(downsampleShader);
    if (!gl.getShaderParameter(downsampleShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(downsampleShader))
    };

    const mainShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(mainShader, fragmentShaderText);
    gl.compileShader(mainShader);
    if (!gl.getShaderParameter(mainShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(mainShader))
    };
    
    const prg_1 = gl.createProgram();
    gl.attachShader(prg_1, vertexShader);
    gl.attachShader(prg_1, downsampleShader);
    gl.linkProgram(prg_1);
    if (!gl.getProgramParameter(prg_1, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prg_1))
    };

    const prg_2 = gl.createProgram();
    gl.attachShader(prg_2, vertexShader);
    gl.attachShader(prg_2, mainShader);
    gl.linkProgram(prg_2);
    if (!gl.getProgramParameter(prg_2, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(prg_2))
    };
    
    const positionLoc = gl.getAttribLocation(prg_1, 'vertPosition');    const main_positionLoc = gl.getAttribLocation(prg_2, 'vertPosition');
    const texcoordLoc = gl.getAttribLocation(prg_1, 'vertTexCoord');    const main_texcoordLoc = gl.getAttribLocation(prg_2, 'vertTexCoord');

    const mWorldLoc = gl.getUniformLocation(prg_1, 'mWorld');           const main_mWorldLoc = gl.getUniformLocation(prg_2, 'mWorld');
    const mViewLoc = gl.getUniformLocation(prg_1, 'mView');             const main_mViewLoc = gl.getUniformLocation(prg_2, 'mView');
    const mProjLoc = gl.getUniformLocation(prg_1, 'mProj');             const main_mProjLoc = gl.getUniformLocation(prg_2, 'mProj');
    const sampler1Loc = gl.getUniformLocation(prg_1, 'sampler_1');      const main_sampler1Loc = gl.getUniformLocation(prg_2, 'sampler_1');
    const topAndBottomLoc = gl.getUniformLocation(prg_2, 'topAndBottom'); const main_sampler2Loc = gl.getUniformLocation(prg_2, 'sampler_2');
    //const sampler2Loc = gl.getUniformLocation(prg_1, 'sampler_2');

    var planeVertices = 
	[ // X, Y, Z
		// Front
		1.0, 1.0, 1.0,      
		1.0, -1.0, 1.0,     
		-1.0, -1.0, 1.0,    
		-1.0, 1.0, 1.0,     
	];

    var planeTexCoords = 
    [ // U V
        1.0, 0.0, canvas.width, canvas.height,
        1.0, 1.0, canvas.width, canvas.height,
        0.0, 1.0, canvas.width, canvas.height,
        0.0, 0.0, canvas.width, canvas.height
    ]

    var planeIndices =
	[
		// Front
		1, 0, 2,
		3, 2, 0,
	];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeVertices), gl.STATIC_DRAW);
    
    const texCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeTexCoords), gl.STATIC_DRAW);

    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(planeIndices), gl.STATIC_DRAW);

    // Texture setup

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
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbTexture, 0);


    // ------------ Rendering ->

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.05, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(
        positionLoc,  // location
        3,            // size (components per iteration)
        gl.FLOAT,     // type of to get from buffer
        false,        // normalize
        0,            // stride (bytes to advance each iteration)
        0,            // offset (bytes from start of buffer)
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(
        texcoordLoc,  // location
        4,            // size (components per iteration)
        gl.FLOAT,     // type of to get from buffer
        false,        // normalize
        0,            // stride (bytes to advance each iteration)
        0,            // offset (bytes from start of buffer)
    );
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);

    gl.useProgram(prg_1);

    let texUnit = 6;
    gl.activeTexture(gl.TEXTURE0 + texUnit);
    gl.bindTexture(gl.TEXTURE_2D, mainTexture);
    gl.uniform1i(sampler1Loc, texUnit);

    var worldMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    gl.uniformMatrix4fv(mWorldLoc, gl.FALSE, worldMatrix);

    var viewMatrix = new Float32Array(16); 
    //mat4.lookAt(viewMatrix, [0,0,-5], [0,0,0], [0,1,0]);
    mat4.identity(viewMatrix);
    gl.uniformMatrix4fv(mViewLoc, gl.FALSE, viewMatrix);

    var projMatrix = new Float32Array(16);
    //mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    mat4.identity(projMatrix);
    gl.uniformMatrix4fv(mProjLoc, gl.FALSE, projMatrix);
    
    gl.drawElements(gl.TRIANGLES, planeIndices.length, gl.UNSIGNED_SHORT, 0);




    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(main_positionLoc);
    gl.vertexAttribPointer(
        positionLoc,  // location
        3,            // size (components per iteration)
        gl.FLOAT,     // type of to get from buffer
        false,        // normalize
        0,            // stride (bytes to advance each iteration)
        0,            // offset (bytes from start of buffer)
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
    gl.enableVertexAttribArray(main_texcoordLoc);
    gl.vertexAttribPointer(
        main_texcoordLoc,  // location
        4,            // size (components per iteration)
        gl.FLOAT,     // type of to get from buffer
        false,        // normalize
        0,            // stride (bytes to advance each iteration)
        0,            // offset (bytes from start of buffer)
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);

    gl.useProgram(prg_2);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    texUnit = 3;
    gl.activeTexture(gl.TEXTURE0 + texUnit);
    gl.bindTexture(gl.TEXTURE_2D, fbTexture);

    gl.uniform1i(main_sampler1Loc, texUnit);
    gl.uniformMatrix4fv(main_mWorldLoc, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(main_mViewLoc, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(main_mProjLoc, gl.FALSE, projMatrix);

    gl.clearColor(0.05, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, planeIndices.length, gl.UNSIGNED_SHORT, 0);

    
    // discard and detatch?

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
                1.0, enableVideo ? uTop : 1 - uTop, canvas.width, displayHeight,
                1.0, enableVideo ? uBottom : 1 - uBottom, canvas.width, displayHeight,
                0.0, enableVideo ? uBottom : 1 - uBottom, canvas.width, displayHeight,
                0.0, enableVideo ? uTop : 1 - uTop, canvas.width, displayHeight,
            ]

            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newPlaneTexCoords), gl.STATIC_DRAW);
            gl.useProgram(prg_2);
            gl.uniform2fv(topAndBottomLoc, [correctUV[2],correctUV[3]]);
            
            
            // pro2
            needsInvert = false;
        }

        return needResize;
    }

    // ------------ Render Loop ->
    var then = 0;

    function render(now) {
        now *= 0.001;
        var deltaTime = now - then;
        then = now;
        
        let resized = resizeCanvasToDisplaySize(gl.canvas);
        let redraw = previous_vID != vID || resized;

        if(redraw){
            /*
            gl.clearColor(0.75, 0.85, 0.8, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
            gl.texImage2D(
                gl.TEXTURE_2D, 
                0,                  // mip level
                gl.RGBA,            // internal format
                gl.RGBA,            // format
                gl.UNSIGNED_BYTE,   // type
                imageList[vID][0]     // data
            );

            gl.drawElements(gl.TRIANGLES, planeIndices.length, gl.UNSIGNED_SHORT, 0);
            */

            gl.viewport(0, 0, fbTextureWidth, fbTextureHeight);
            gl.clearColor(0.05, 0.85, 0.8, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

            gl.useProgram(prg_1);
            texUnit = 6;
            gl.activeTexture(gl.TEXTURE0 + texUnit);
            gl.bindTexture(gl.TEXTURE_2D, mainTexture);
            gl.texImage2D(
                gl.TEXTURE_2D, 
                0,                  // mip level
                gl.RGBA,            // internal format
                gl.RGBA,            // format
                gl.UNSIGNED_BYTE,   // type
                imageList[vID][0]     // data
            );
            gl.uniform1i(sampler1Loc, texUnit);

            gl.drawElements(gl.TRIANGLES, planeIndices.length, gl.UNSIGNED_SHORT, 0);

            gl.useProgram(prg_2);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            
            texUnit = 3;
            gl.activeTexture(gl.TEXTURE0 + texUnit);
            gl.bindTexture(gl.TEXTURE_2D, fbTexture);
            gl.uniform1i(main_sampler1Loc, texUnit);
            texUnit = 4;
            gl.activeTexture(gl.TEXTURE0 + texUnit);
            gl.bindTexture(gl.TEXTURE_2D, mainTexture);
            gl.uniform1i(main_sampler2Loc, texUnit);

            gl.drawElements(gl.TRIANGLES, planeIndices.length, gl.UNSIGNED_SHORT, 0);

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