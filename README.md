# Unknown parser

Esta librería está diseñada para interpretar y evaluar expresiones matemáticas. De momento es capaz de soportar los operadores básicos (`+`, `-`, `*`, `/` y `^`). Vea la sección issues para ver los progresos planificados para el proyecto.

## Uso

### Evaluate
```javascript
const { evaluate } = require('unknown-parser');

let unknowns, calc = evaluate('3x - y + 5');

console.log(unknowns) // [ 'x', 'y' ]
console.log(calc({ x: 5, y: 3 })); // 17
console.log(calc({ x: 2, y: 5 })); // 6
```

Nótese que la functión `evaluate` devuelve en primer lugar un array con información sobre las incógnitas que encontró, y luego una función que permite evaluar la ecuación contra distintos valores para las incógnitas. En el caso de llamar a `calc` incógnitas que no se correspondan con `unknowns`, la función devolverá un error. En caso de evaluar una expresión sin incógnitas, `unknowns` será un array vacío, y a `calc` deberá pasársele un objeto vacío. Sin embargo, para estos casos se recomienda la utilización de `fastEvaluate`.

Tanto `evaluate` como `fastEvaluate` (ver abajo) dependen de la función `parse`, también disponible para importar. Ésta genera un árbol de nodos con toda la información sobre la expresión recibida, teniendo en consideración la precedencia de operadores y las incógnitas a reemplazar. A partir de esto, `evaluate` carga al árbol con la funcionalidad necesaria para calcular la expresión, de forma que cada nodo tiene una función capaz de interpretar el operador, literal o variable al que corresponda. Este árbol de evaluación está contenido en la función `calc`. Así, la función `evaluate` consume un mayor tiempo en la generación del árbol de evaluación, pero permite posteriormente un cálculo rápido de la ecuación aunque varíen los valores de las incógnitas. Se recomienda esta función para aplicaciones donde la ecuación no varía frecuentemente, y en cambio es necesario evaluarla con diversos valores de sus incógnitas. Véase la comparación de ambas funciones más abajo.

### FastEvaluate

```javascript
const { fastEvaluate } = require('unknown-parser');

console.log(fastEvaluate('3x - y + 5', { x: 5, y: 3 })); // 17
console.log(fastEvaluate('3x - y + 5', { x: 2, y: 5 })); // 6
```

Esta función da resultados idénticos a la anterior, pero usa una aproximación diferente que permite al usuario optimizar su programa según sus necesidades específicas. A diferencia de `evaluate`, `fastEvaluate` no genera un árbol de evaluación, sino que utiliza el árbol provisto por `parse` y lo recorre directamente, aplicando los valores de las incógnitas pasadas. De esta forma tarda considerablemente menos que `evaluate`, pero cada cálculo toma más tiempo que un cálculo a partir del árbol de evaluación ya generado por `evaluate`. Entonces, esta función resulta útil cuando la ecuación varía constantemente, o sólo es necesario calcularla con pocos valores específicos de las incógnitas (particularmente con funciones constantes, se recomienda el uso de esta función). Véase la comparación de ambas funciones más abajo.

## Comparación de `evaluate` y `fastEvaluate`

| Repetitions | Generating the evaluation tree | Calculating with tree | Fast calculation |
| -------- | -------- | -------- | ---------- |
| 10,000 | 70ms | 5ms | 36ms |
| 100,000 | 388ms | 13ms | 318ms |
| 1,000,000 | 3608ms | 88ms | 3137ms |

Se observa que el cálculo de `evaluate` es considerablemente menor que el de `fastEvaluate`, pero el primero tiene la desventaja de necesitar la generación del árbol de evaluación. A muchas evaluaciones se aprecia la divergencia de `fastEvaluate`, que termina siendo mucho menos efectivo que su contraparte. El cálculo de la generación del árbol de evaluación repetidas veces permite apreciar que, a pocas repeticiones, la suma de `evaluate` y `calc` termina siendo menos efectiva que `fastEvaluate`.
