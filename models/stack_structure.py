"""
Módulo de Estructura de Datos Pila (Stack) para el Intérprete.

Implementa la pila como clase con encapsulamiento completo, exponiendo
solo las operaciones necesarias (push, pop, peek, is_empty, snapshot).
El método snapshot permite capturar el estado de la pila en cada paso
de ejecución sin exponer la lista interna.
"""

from typing import Any


class StackUnderflowError(Exception):
    """Lanzada cuando se intenta hacer pop/peek en una pila vacía."""
    pass


class Stack:
    """Estructura de datos pila con soporte de instantáneas para trazas.

    Attributes:
        _data (list): Lista interna; el tope está en el último índice.
    """

    def __init__(self):
        """Inicializa la pila vacía."""
        self._data: list[Any] = []

    # ------------------------------------------------------------------ #
    # Operaciones fundamentales                                            #
    # ------------------------------------------------------------------ #

    def push(self, value: Any) -> None:
        """Apila un valor en el tope.

        Args:
            value: Valor a insertar (número, booleano, etc.).
        """
        self._data.append(value)

    def pop(self) -> Any:
        """Retira y retorna el valor del tope.

        Returns:
            Any: El valor que estaba en el tope.

        Raises:
            StackUnderflowError: Si la pila está vacía.
        """
        if self.is_empty():
            raise StackUnderflowError("Operación pop sobre pila vacía.")
        return self._data.pop()

    def peek(self) -> Any:
        """Retorna el valor del tope sin retirarlo.

        Returns:
            Any: El valor en el tope.

        Raises:
            StackUnderflowError: Si la pila está vacía.
        """
        if self.is_empty():
            raise StackUnderflowError("Operación peek sobre pila vacía.")
        return self._data[-1]

    def is_empty(self) -> bool:
        """Indica si la pila no contiene elementos."""
        return len(self._data) == 0

    # ------------------------------------------------------------------ #
    # Soporte para traza visual                                            #
    # ------------------------------------------------------------------ #

    def snapshot(self) -> list[Any]:
        """Devuelve una copia del estado actual de la pila.

        El primer elemento de la lista es el fondo; el último es el tope.
        La vista invierte la lista para mostrar el tope arriba.

        Returns:
            list[Any]: Copia inmutable del contenido de la pila.
        """
        return list(self._data)

    def __len__(self) -> int:
        """Número de elementos en la pila."""
        return len(self._data)

    def __repr__(self) -> str:
        """Representación visual con el tope al final."""
        return f"Stack({self._data}  ← tope)"
