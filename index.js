/* crea una toolbar grossa gialla con un titolo enorme che poi cambieremo */
var toolbar = document.createElement('div');
toolbar.style.backgroundColor = 'yellow';
toolbar.style.height = '100px';
toolbar.style.width = '100%';
toolbar.style.position = 'fixed';
toolbar.style.top = '0px';
toolbar.style.left = '0px';
toolbar.style.zIndex = '100';
toolbar.style.textAlign = 'center';
toolbar.style.fontSize = '50px';
toolbar.innerHTML = 'Hello World';
document.body.appendChild(toolbar);
/* crea 2 bottoni start e stop nella toolbar */
var startButton = document.createElement('button');
startButton.innerHTML = 'Start';
startButton.style.fontSize = '20px';
startButton.style.margin = '10px';
startButton.style.padding = '10px';
startButton.style.backgroundColor = 'green';
startButton.style.color = 'white';
startButton.style.border = 'none';
startButton.style.borderRadius = '5px';
startButton.style.cursor = 'pointer';
toolbar.appendChild(startButton);
var stopButton = document.createElement('button');
stopButton.innerHTML = 'Stop';
stopButton.style.fontSize = '20px';
stopButton.style.margin = '10px';
stopButton.style.padding = '10px';
stopButton.style.backgroundColor = 'red';
stopButton.style.color = 'white';
stopButton.style.border = 'none';
stopButton.style.borderRadius = '5px';
stopButton.style.cursor = 'pointer';
toolbar.appendChild(stopButton);
/* posiziona i bottoni a destra */
startButton.style.float = 'right';
stopButton.style.float = 'right';
/* posiziona il titolo a sinistra e fallo imapct */
toolbar.style.fontFamily = 'Impact';
/* metti il titolo a sinistra */
toolbar.style.textAlign = 'left';
/* evita lo scroll */
document.body.style.overflow = 'hidden';
/* crea una canvas color panna che occupa il resto dello schermo */
var canvas = document.createElement('canvas');
canvas.style.backgroundColor = '#FFFACD';
canvas.style.height = '100%';
canvas.style.width = '100%';
canvas.style.position = 'absolute';
canvas.style.top = '100px';
canvas.style.left = '0px';
canvas.style.zIndex = '1';
document.body.appendChild(canvas);
/* crea le interfacce disegnabile,collidibile ; crea la classe OggettoMio che implementa collidibile e disegnabile,Ogni oggettoMio ha una posizione (x,y),altezza , largezza, colore */
var drawable = {
  draw: function() {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};
var collidable = {
  collidesWith: function(other) {
    return this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y;
  }
};
function OggettoMio(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
}
OggettoMio.prototype = Object.assign(OggettoMio.prototype, drawable, collidable);
/* crea la classe Muro che estende oggettoMio : si estende verso l'alto , ha largezza 20 , è nero */
function Muro(x, y) {
  OggettoMio.call(this, x, y, 20, canvas.height - y, 'black');
}
Muro.prototype = Object.create(OggettoMio.prototype);
/* crea la classe Pavimento che estende oggettoMio : si estende in orizzontale , ha largezza 20 , è nero */
function Pavimento(x, y) {
  OggettoMio.call(this, x, y, canvas.width - x, 20, 'black');
}
Pavimento.prototype = Object.create(OggettoMio.prototype);
/* crea la classe Elemento che estende oggettoMio :  soffre la gravità , può avere qualsiasi forma  o colore, può rimbalzare o roteare , non può mai sovrapporsi ad un istanza di tipo oggettoMio */
function Elemento(x, y, width, height, color) {
  OggettoMio.call(this, x, y, width, height, color);
  this.velocity = {
    x: 0,
    y: 0
  };
  this.acceleration = {
    x: 0,
    y: 0
  };
  this.rotation = 0;
  this.rotationVelocity = 0;
  this.rotationAcceleration = 0;
  this.bounce = 0;
  this.friction = 0;
}
Elemento.prototype = Object.assign(Elemento.prototype, drawable, collidable);
/* elimina il tasto stop */
stopButton.parentNode.removeChild(stopButton);
/* elimina hello world mantenendo il bottone start */
toolbar.innerHTML = '';
toolbar.appendChild(startButton);
/* Inventa e scrivi un titolo adeguato enorme usando il font impact sulla toolbar */
toolbar.innerHTML = '<span style="font-size:50px;font-family:Impact;">Falling Elements</span>';
/* riappendi start */
toolbar.appendChild(startButton);
/* quando clicco tutto trema */
canvas.addEventListener('click', function() {
  elements.forEach(function(element) {
    element.velocity.x += Math.random() * 10 - 5;
    element.velocity.y += Math.random() * 10 - 5;
  });
});
/* restart */
startButton.addEventListener('click', function() {
  elements = [];
  createElements();
});
/* gli elementi hanno dimensioni e colori randomici */
function createElements() {
  for (var i = 0; i < 20; i++) {
    var element = new Elemento(Math.random() * canvas.width, 0, Math.random() * 20 + 10, Math.random() * 20 + 10, '#' + Math.floor(Math.random() * 16777215).toString(16));
    element.velocity.y = Math.random() * 10;
    element.acceleration.y = 0.1;
    element.bounce = 0.7;
    element.friction = 0.01;
    element.shape = Math.random() > 0.5 ? 'circle' : 'triangle';
    elements.push(element);
  }
}
/* crea un animazione : 30 elementi  cadono su un pavimento, gli elementi si respingono */
var elements = [];
createElements();
var walls = [
  new Muro(0, 0),
  new Muro(canvas.width - 20, 0),
  new Pavimento(0, canvas.height - 20)
];
function draw() {
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  elements.forEach(function(element) {
    element.draw();
  });
  walls.forEach(function(wall) {
    wall.draw();
  });
}
function update() {
  elements.forEach(function(element) {
    element.velocity.x += element.acceleration.x;
    element.velocity.y += element.acceleration.y;
    element.x += element.velocity.x;
    element.y += element.velocity.y;
    element.rotationVelocity += element.rotationAcceleration;
    element.rotation += element.rotationVelocity;
    element.velocity.x *= 1 - element.friction;
    element.velocity.y *= 1 - element.friction;
    element.rotationVelocity *= 1 - element.friction;
    walls.forEach(function(wall) {
      if (element.collidesWith(wall)) {
        if (element.x < wall.x) {
          element.x = wall.x - element.width;
          element.velocity.x *= -element.bounce;
        } else if (element.x + element.width > wall.x + wall.width) {
          element.x = wall.x + wall.width;
          element.velocity.x *= -element.bounce;
        }
        if (element.y < wall.y) {
          element.y = wall.y - element.height;
          element.velocity.y *= -element.bounce;
        } else if (element.y + element.height > wall.y + wall.height) {
          element.y = wall.y + wall.height;
          element.velocity.y *= -element.bounce;
        }
      }
    });
    elements.forEach(function(other) {
      if (element !== other && element.collidesWith(other)) {
        if (element.x < other.x) {
          element.x = other.x - element.width;
          element.velocity.x *= -element.bounce;
        } else if (element.x + element.width > other.x + other.width) {
          element.x = other.x + other.width;
          element.velocity.x *= -element.bounce;
        }
        if (element.y < other.y) {
          element.y = other.y - element.height;
          element.velocity.y *= -element.bounce;
        } else if (element.y + element.height > other.y + other.height) {
          element.y = other.y + other.height;
          element.velocity.y *= -element.bounce;
        }
      }
    });
  });
}
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
/* gli elementi sono anelli */
function drawCircle(ctx, x, y, radius, startAngle, endAngle, anticlockwise) {
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  ctx.fill();
}
Elemento.prototype.draw = function() {
  var ctx = canvas.getContext('2d');
  ctx.save();
  ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
  ctx.rotate(this.rotation);
  ctx.fillStyle = this.color;
  if (this.shape === 'circle') {
    drawCircle(ctx, -this.width / 2, -this.height / 2, this.width / 2, 0, 2 * Math.PI, false);
  } else {
    ctx.beginPath();
    ctx.moveTo(-this.width / 2, -this.height / 2);
    ctx.lineTo(this.width / 2, -this.height / 2);
    ctx.lineTo(0, this.height / 2);
    ctx.fill();
  }
  ctx.restore();
};
/* crea altri 2 bottoni */
var addButton = document.createElement('button');
addButton.innerHTML = 'Add';
addButton.style.fontSize = '20px';
addButton.style.margin = '10px';
addButton.style.padding = '10px';
addButton.style.backgroundColor = 'blue';
addButton.style.color = 'white';
addButton.style.border = 'none';
addButton.style.borderRadius = '5px';
addButton.style.cursor = 'pointer';
toolbar.appendChild(addButton);
var removeButton = document.createElement('button');
removeButton.innerHTML = 'Remove';
removeButton.style.fontSize = '20px';
removeButton.style.margin = '10px';
removeButton.style.padding = '10px';
removeButton.style.backgroundColor = 'blue';
removeButton.style.color = 'white';
removeButton.style.border = 'none';
removeButton.style.borderRadius = '5px';
removeButton.style.cursor = 'pointer';
toolbar.appendChild(removeButton);
/* prepara una funzione trasforma per trasformare un gruppo di elementi in rettangoli */
function transform(shape) {
  elements.forEach(function(element) {
    element.shape = shape;
  });
}
/* se clicchi add chiami transform */
addButton.addEventListener('click', function() {
  transform('rectangle');
});
/* /* scrivi triangoli sul bottone add */ 
addButton.innerHTML = 'Triangles';
/* il bottone remove chiama trasform passandogli una forma assurda */
removeButton.addEventListener('click', function() {
  transform('circle');
});
/* crea 60 elementi rotanti */
function createElements() {
  for (var i = 0; i < 60; i++) {
    var element = new Elemento(Math.random() * canvas.width, 0, Math.random() * 20 + 10, Math.random() * 20 + 10, '#' + Math.floor(Math.random() * 16777215).toString(16));
    element.velocity.y = Math.random() * 10;
    element.acceleration.y = 0.1;
    element.bounce = 0.7;
    element.friction = 0.01;
    element.shape = Math.random() > 0.5 ? 'circle' : 'triangle';
    element.rotationVelocity = Math.random() * 0.1 - 0.05;
    elements.push(element);
  }
}
/* il testo di remove è circle */
removeButton.innerHTML = 'Circles';
/* metti i bottoni a destra */
addButton.style.float = 'right';
removeButton.style.float = 'right';
/* crea un altro bottone che di chiama ruota */
var rotateButton = document.createElement('button');
rotateButton.innerHTML = 'Rotate';
rotateButton.style.fontSize = '20px';
rotateButton.style.margin = '10px';
rotateButton.style.padding = '10px';
rotateButton.style.backgroundColor = 'blue';
rotateButton.style.color = 'white';
rotateButton.style.border = 'none';
rotateButton.style.borderRadius = '5px';
rotateButton.style.cursor = 'pointer';
toolbar.appendChild(rotateButton);
/* mettilo a destra */
rotateButton.style.float = 'right';
/* funzione ruota la canvas di 90 gradi */
function rotate() {
  var ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(Math.PI );
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
}
/* click rotate call rotate */
rotateButton.addEventListener('click', rotate);
/* crea un altro bottone gravità */
var gravityButton = document.createElement('button');
gravityButton.innerHTML = 'Gravity';
gravityButton.style.fontSize = '20px';
gravityButton.style.margin = '10px';
gravityButton.style.padding = '10px';
gravityButton.style.backgroundColor = 'blue';
gravityButton.style.color = 'white';
gravityButton.style.border = 'none';
gravityButton.style.borderRadius = '5px';
gravityButton.style.cursor = 'pointer';
toolbar.appendChild(gravityButton);
/* allinealo */
gravityButton.style.float = 'right';
/* cliccare gravity aumenta la forz di gravità */
gravityButton.addEventListener('click', function() {
  elements.forEach(function(element) {
    element.acceleration.y += 0.1;
  });
});