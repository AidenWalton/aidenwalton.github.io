'use strict';

var svg = document.querySelector('svg');
var tween = TweenLite;

// -------------------------   lines   ------------------------ //

var LINE_MIN_WIDTH = 100;
var LINE_MAX_WIDTH = 500;
var COLORS = ['#0ADCF2', '#EC7376', '#FCD380', '#E1EAF6', '#8DC8DC', '#4DEBC3'];
var SPEED_TABLE = {
  get 1() {
    return getRandomInt(65, 70);
  },
  get 2() {
    return getRandomInt(50, 55);
  },
  get 3() {
    return getRandomInt(45, 50);
  },
  get 4() {
    return getRandomInt(35, 40);
  },
  get 5() {
    return getRandomInt(30, 35);
  }
};
var viewportWidth = svg.viewBox.baseVal.width;
var viewportHeight = svg.viewBox.baseVal.height;
var lines = void 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initialPosition(width, direction) {
  if (direction === 1) {
    return -width;
  } else {
    return viewportWidth;
  }
}

function lineHeight(width) {
  if (width < LINE_MAX_WIDTH / 2) {
    return 1;
  } else {
    return 2;
  }
}

function resetLine(direction, width, i) {
  var color = randomColor();
  return {
    attr: {
      width: width,
      height: lineHeight(width)
    },
    stroke: color,
    fill: color,
    x: initialPosition(width, direction),
    y: getY(i)
  };
}

function getY(i) {
  var sectionHeight = viewportHeight / lines.length;
  var vPadding = 20;
  return getRandomInt(sectionHeight * i + vPadding, sectionHeight * i + sectionHeight - vPadding);
}

function randomDirection() {
  return Math.round(Math.random()) * 2 - 1;
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getSpeed(width) {
  var scaleFactor = Math.floor(width / 75);
  return SPEED_TABLE[scaleFactor];
}

function translateX(direction, elementWidth) {
  var sign = '+';
  if (direction < 0) sign = '-';
  return sign + '=' + (viewportWidth + elementWidth);
}

function animateLine(el, i) {
  var width = getRandomInt(LINE_MIN_WIDTH, LINE_MAX_WIDTH);
  var direction = randomDirection();

  TweenLite.set(el, resetLine(direction, width, i));
  TweenLite.to(el, getSpeed(width), {
    x: translateX(direction, width),
    delay: 0.8 * i,
    onComplete: animateLine,
    onCompleteParams: [el, i]
  });
}

function animateLines(svg) {
  lines = svg.querySelectorAll('.Line');

  for (var i = 0; i < lines.length; i++) {
    animateLine(lines[i], i);
  };
}

// -------------------------   parallax   ------------------------ //

var translations = {};

function translateLayer(id, hDistance, vDistance, factor) {
  var hDistanceScaled = hDistance / factor;
  var vDistanceScaled = vDistance / factor;

  var counter = { value: 0 };
  var precision = 40.0;
  
  TweenLite.killTweensOf(id);

  var thisTranslations = translations[id] || {};
  var x = thisTranslations.x || 0;
  var y = thisTranslations.y || 0;
  var finalX = hDistanceScaled;
  var finalY = vDistanceScaled;
  var stepX = (finalX - x) / precision;
  var stepY = (finalY - y) / precision;

  TweenLite.to(counter, 0.2, {
    value: precision,
    onUpdate: function onUpdate() {
      var currentX = x + stepX * counter.value;
      var currentY = y + stepY * counter.value;
      $(svg).find(id)[0].setAttribute('transform', 'translate(' + currentX + ', ' + currentY + ')');
      translations[id] = { x: currentX, y: currentY };
    }
  });
}

function parallax(e) {
  var amountMovedX = e.pageX;
  var amountMovedY = e.pageY;
  var hDistance = window.innerWidth / 2 - amountMovedX;
  var vDistance = window.innerHeight / 2 - amountMovedY;

  translateLayer("#lines", hDistance, vDistance, 85);
  translateLayer("#distance-3x", hDistance, vDistance, 45);
  translateLayer("#distance-2x", hDistance, vDistance, -65);
  translateLayer("#distance-1x", hDistance, vDistance, 85);
}

svg.addEventListener("mousemove", parallax, false);
animateLines(svg);