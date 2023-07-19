var toggleHover = false;

function LoadedPage(){
    document.getElementById('pb-id').addEventListener(
        'scroll',
        function()
        {
            let para = document.getElementById('pb-id');
            var scrollTop = para.scrollTop;
            var scrollHeight = para.scrollHeight; // added
            var offsetHeight = para.offsetHeight;
            // var clientHeight = document.getElementById('box').clientHeight;
            var contentHeight = scrollHeight - offsetHeight; // added
            if (contentHeight <= scrollTop)
            {
                console.log("Scroll end");
                /*
                para.style.animation = "fade_para_top";
                para.style.animationTimingFunction = "linear";
                para.style.animationFillMode = "both";
                para.style.animationDuration = "0.25s";
                */
                
            }
            if (scrollTop <= 0)
            {
                console.log("Scroll top");
                /*
                para.style.animation = "fade_para_bottom";
                para.style.animationTimingFunction = "linear";
                para.style.animationFillMode = "both";
                para.style.animationDuration = "0.25s";
                */
                
            }
        },
        false
    );
}

function ContButtonClicked(){
    console.log("ContButtonClicked");

    toggleHover = !toggleHover;

    /*
    let outline = document.getElementById("path5649");
    outline.style.animation = toggleHover ? "path5649_d" : "path5649_s";
    outline.style.animationTimingFunction = "linear";
    outline.style.animationFillMode = "both";
    outline.style.animationDuration = "0.25s";
    */

    ks.globalPlay();
    if(!toggleHover){
            ks.animate("#path5649",[{p:'d',t:[0,250],v:["path('M66.2,516.6C35.2,514.1,18.5,498.6,14.7,468.8C14.2,464.1,14.1,453.3,14.1,268C14.1,151.3,14.1,-152.7,14.4,-174.1C14.6,-190.4,14.9,-191.1,15.6,-194.5C15.9,-196,16.5,-198.6,16.9,-200.3C22.3,-219.9,36.3,-232.1,57.7,-235.7C67.9,-237.5,89.5,-237.6,100.5,-235.9C124.3,-232.4,139.1,-218.5,143.7,-195.7C144.5,-191.7,144.9,-191.8,145.1,-171.7C145.4,-148.7,145.4,156.2,145.4,267.9C145.4,457.2,145.3,465.1,144.7,469.7C140.9,497.4,125.9,512.3,98.1,516.1C93.4,516.7,72.1,517,66.2,516.6ZM97,508.7C104.7,507.7,110.4,506.1,115.4,503.5C127.9,497.1,134.7,486.4,137.3,469C137.9,465.1,137.9,452.9,138,271.8C138.1,166.1,138.1,-149.8,137.9,-172.5C137.9,-178.5,137.8,-181.9,137.8,-182.8C136.6,-200.8,131.5,-212.3,121.4,-219.9C116,-224,108.8,-226.9,100.5,-228.4C92.4,-229.8,74.3,-230.1,64,-229C41.1,-226.7,27.5,-215.3,23.3,-195C22.5,-191,22,-191.6,21.8,-174.5C21.5,-153.6,21.5,149.1,21.4,262.6C21.4,390.3,21.4,456,21.7,460.7C22.3,472.4,23.8,479.2,27.4,486.4C31.2,494.3,36.6,499.7,44.5,503.5C51.1,506.8,58.4,508.5,67.9,509.2C74.2,509.6,92.3,509.3,97,508.7Z')","path('M66.2,516.6C35.2,514.1,18.5,498.6,14.7,468.8C14.2,464.1,14.1,453.3,14.1,268C14.1,151.3,14.1,102.9,14.4,81.5C14.6,65.3,14.9,64.6,15.6,61.1C15.9,59.7,16.5,57.1,16.9,55.3C22.3,35.7,36.3,23.6,57.7,19.9C67.9,18.1,89.5,18,100.5,19.7C124.3,23.3,139.1,37.1,143.7,60C144.5,63.9,144.9,63.8,145.1,83.9C145.4,106.9,145.4,156.2,145.4,267.9C145.4,457.2,145.3,465.1,144.7,469.7C140.9,497.4,125.9,512.3,98.1,516.1C93.4,516.7,72.1,517,66.2,516.6ZM97,508.7C104.7,507.7,110.4,506.1,115.4,503.5C127.9,497.1,134.7,486.4,137.3,469C137.9,465.1,137.9,452.9,138,271.8C138.1,166.1,138.1,105.8,137.9,83.2C137.9,77.1,137.8,73.7,137.8,72.9C136.6,54.8,131.5,43.3,121.4,35.7C116,31.6,108.8,28.7,100.5,27.3C92.4,25.9,74.3,25.5,64,26.6C41.1,29,27.5,40.3,23.3,60.6C22.5,64.6,22,64,21.8,81.2C21.5,102,21.5,149.1,21.4,262.6C21.4,390.3,21.4,456,21.7,460.7C22.3,472.4,23.8,479.2,27.4,486.4C31.2,494.3,36.6,499.7,44.5,503.5C51.1,506.8,58.4,508.5,67.9,509.2C74.2,509.6,92.3,509.3,97,508.7Z')"],e:[[1,.8,0,.2,1],[0]]}],
                        {autoremove:false}).range(0,250);
    }else{
            ks.animate("#path5649",[{p:'d',t:[0,250],v:["path('M66.1587,516.553C35.1564,514.051,18.4817,498.567,14.7485,468.816C14.1577,464.108,14.1239,453.263,14.1239,268.048C14.1239,151.262,14.109,102.939,14.3708,81.5363C14.5699,65.2582,14.9291,64.5527,15.5767,61.1434C15.8531,59.6882,16.4698,57.0688,16.9472,55.3225C22.3025,35.7317,36.2893,23.5718,57.692,19.8999C67.9451,18.1408,89.502,18.0369,100.513,19.6934C124.282,23.2693,139.142,37.1105,143.733,59.9511C144.528,63.9078,144.935,63.8216,145.143,83.944C145.379,106.91,145.357,156.201,145.357,267.871C145.357,457.235,145.332,465.083,144.708,469.66C140.923,497.426,125.939,512.349,98.085,516.092C93.3562,516.728,72.1189,517.034,66.1587,516.553ZM97.0267,508.663C104.666,507.663,110.391,506.051,115.391,503.494C127.888,497.103,134.681,486.401,137.314,468.954C137.889,465.149,137.934,452.943,138.044,271.752C138.108,166.093,138.072,105.833,137.926,83.1575C137.887,77.0934,137.84,73.7172,137.785,72.8795C136.603,54.8496,131.539,43.3354,121.429,35.6911C116.018,31.6004,108.796,28.6961,100.48,27.2674C92.3614,25.8725,74.3432,25.5439,64.042,26.603C41.1475,28.9567,27.5438,40.3212,23.2941,60.6436C22.4628,64.619,22.0318,64.0408,21.797,81.1686C21.5111,102.018,21.5162,149.105,21.4443,262.579C21.3634,390.266,21.4436,455.954,21.6861,460.68C22.2853,472.361,23.7864,479.182,27.3513,486.422C31.2447,494.33,36.6098,499.699,44.4628,503.546C51.0683,506.782,58.4224,508.549,67.9082,509.179C74.1989,509.597,92.3493,509.276,97.0267,508.663Z')","path('M66.1587,516.553C35.1564,514.051,18.4817,498.567,14.7485,468.816C14.1577,464.108,14.1239,453.263,14.1239,268.048C14.1239,151.262,14.109,-152.701,14.3708,-174.104C14.5699,-190.382,14.9291,-191.087,15.5767,-194.497C15.8531,-195.952,16.4698,-198.571,16.9472,-200.318C22.3025,-219.908,36.2893,-232.068,57.692,-235.74C67.9451,-237.499,89.502,-237.603,100.513,-235.947C124.282,-232.371,139.142,-218.53,143.733,-195.689C144.528,-191.732,144.935,-191.818,145.143,-171.696C145.379,-148.73,145.357,156.201,145.357,267.871C145.357,457.235,145.332,465.083,144.708,469.66C140.923,497.426,125.939,512.349,98.085,516.092C93.3562,516.728,72.1189,517.034,66.1587,516.553ZM97.0267,508.663C104.666,507.663,110.391,506.051,115.391,503.494C127.888,497.103,134.681,486.401,137.314,468.954C137.889,465.149,137.934,452.943,138.044,271.752C138.108,166.093,138.072,-149.807,137.926,-172.483C137.887,-178.547,137.84,-181.923,137.785,-182.761C136.603,-200.79,131.539,-212.305,121.429,-219.949C116.018,-224.04,108.796,-226.944,100.48,-228.373C92.3614,-229.768,74.3432,-230.096,64.042,-229.037C41.1475,-226.683,27.5438,-215.319,23.2941,-194.996C22.4628,-191.021,22.0318,-191.599,21.797,-174.471C21.5111,-153.622,21.5162,149.105,21.4443,262.579C21.3634,390.266,21.4436,455.954,21.6861,460.68C22.2853,472.361,23.7864,479.182,27.3513,486.422C31.2447,494.33,36.6098,499.699,44.4628,503.546C51.0683,506.782,58.4224,508.549,67.9082,509.179C74.1989,509.597,92.3493,509.276,97.0267,508.663Z')"],e:[[1,0.77,0,0.175,1],[0]]}],
                {autoremove:false}).range(0,250);   
    }

    let vc = document.getElementById("vc-id");
    vc.style.animation = toggleHover ? "show_slider" : "hide_slider";
    vc.style.animationTimingFunction = "cubic-bezier(.42,0,.58,1)";
    vc.style.animationFillMode = "both";
    vc.style.animationDuration = "0.25s";

    let sb = document.getElementById("sb-id");
    sb.style.animation = toggleHover ? "grow_sb" : "shrink_sb";
    sb.style.animationTimingFunction = "cubic-bezier(.42,0,.58,1)";
    sb.style.animationFillMode = "both";
    sb.style.animationDuration = "0.25s";

    let vs = document.getElementById("v-slider-id");
    vs.style.display = toggleHover ? "block" : "none";
    vs.style.animation = toggleHover ? "grow_track" : "shrink_track";
    vs.style.animationTimingFunction = "cubic-bezier(.17,.67,.83,.67)"; // cubic-bezier(.42,0,.58,1)
    vs.style.animationFillMode = "both";
    vs.style.animationDuration = "0.25s";

    
}

