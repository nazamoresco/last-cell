# Last cell
### Code interative cellular automata system

### Defining behaviour
You can define the behaviour of a kind of cell with a javascript function.
The next object is expected to be returned from the function:
```
  returned_object = {
    x: x_position_to_move,
    y: y_position_to_move,
    action: action_to_perform
  } // any other key is ignored
```
You receive two arguments in the function, cell and surroundings:
* cell represents the cell object that is executing the function.
* surroundings represents a collection of surrounding objects.

the surrounding object represents a pixel with the following attributes: x,
y, contains.
* x represents the position in horizonal axis for the pixel
* y represents the position in vertical axis for the pixel
* contains is the ocupier cell identifier or "nothing"
if no cell is present.

### Availables actions

* ACTION_MOVE, the cell moves to the selected position
* ACTION_ATTACK, the cell destroys any ocupier cell in
  the selected position

