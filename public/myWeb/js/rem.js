function getFontSize() {
    var htmlFontSize=document.documentElement.offsetWidth/10;

    document.querySelector('html').style.fontSize = htmlFontSize+'px';
}

getFontSize();
window.addEventListener('resize',getFontSize);