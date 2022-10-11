# Computación Gráfica - TP1

## Sistema de camaras
Usamos 1 sola camara y le cambiamos de objetivo. 
Para cambiarla de objetivo, le cambiamos el objeto padre a uno de los Object3D creados para cada objetivo.

## Impresora
### Clipping Plane
Usamos un clipping plane en el material para simular el efecto de impresión.

Dividimos la impresion en 3 estados: "imprimiendo", "volviendo al origen" y "terminado".

## Auto Elevador
### Movimiento
Para el movimiento del auto se decidió utilizar un modelo con volante en el que para realizar un giro se tiene que girar el volante y avanzar al mismo tiempo. Esto se implementó haciendo que la velocidad de giro dependa linealmente de la velocidad del vehiculo.

### Agarrar
Para implementar la funcionalidad de agarrar piezas cercanas con el auto elevador se definió piezas cercanas como piezas que se encuentren a una distancia menor a 0.5 unidades de la pala.
Cuando se detecta que se presionó la tecla de agarrar, si la pala no tenía nada encima, se itera sobre todos los objetos con name = "printed-object" y se busca el que tiene menos distancia y que esta sea menor al umbral de 0.5 unidades.
Para medir la distancia de un objeto a la pala de ubicó un Object3D en el medio de la plataforma de la misma y se calcula la distancia con las posiciones globales.

## Generación de modelos
Las figuras 2D que se usan de base para la generación de modelos fueron creadas a partir de splines. Los segmentos de lineas rectas fueron construidos con splines de 2 puntos para que ThreeJS no las muestree solo en los extremos.
Los modelos de revolución se generan con LatheGeometry, a partir de los puntos muestreados con Shape.extractPoints. Los de barrido se generan con ExtrudeGeometry, habilitando la generación de bevel.

