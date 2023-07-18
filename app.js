var toggleHover = false;

function ContButtonClicked(){
    console.log("ContButtonClicked");

    toggleHover = !toggleHover;

    let outline = document.getElementById("path5649");
    outline.style.animation = toggleHover ? "path5649_d" : "path5649_s";
    outline.style.animationTimingFunction = "linear";
    outline.style.animationFillMode = "both";
    outline.style.animationDuration = "0.25s";

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
    vs.style.animationTimingFunction = "cubic-bezier(.42,0,.58,1)";
    vs.style.animationFillMode = "both";
    vs.style.animationDuration = "0.25s";

}