/* eslint-disable */
(function () {
  // 适配方案，按照设计稿2560*1440
  function setRem() {
    var width = document.documentElement.clientWidth || document.body.clientWidth
    // if (width < 1600){
    var scale = (width / 2560).toFixed(2);
    document.getElementById('app').style.transform = "scale(" + scale + ")";
    document.getElementById('app').style.transformOrigin = "0px 0px 0px";
    // }
  }
  setRem()
  window.addEventListener('resize', function () {
    setRem()
  })
})()