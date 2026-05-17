

from enum import Enum, auto
from typing import Any
Class opCode(enum):
    """Conjunto de instrucciones del lenguaje intermedio de pila."""
    # ── Pila ────────────────────────────────────────────────────────────
    PUSH  = auto()   # PUSH <valor>    → apila un literal numérico
    POP   = auto()   # POP             → desapila y descarta el tope

    # ── Memoria (variables) ─────────────────────────────────────────────
    LOAD  = auto()   # LOAD <nombre>   → apila el valor de la variable
    STORE = auto()   # STORE <nombre>  → desapila y guarda en variable

    # ── Aritmética ───────────────────────────────────────────────────────
    ADD   = auto()   # ADD             → desapila dos valores y apila su suma
    SUB   = auto()   # SUB             → desapila b, a; apila a - b
    MUL   = auto()   # MUL             → desapila dos valores y apila producto
    DIV   = auto()   # DIV             → desapila b, a; apila a / b

    # ── Comparación ─────────────────────────────────────────────────────
    CMP_EQ  = auto()  # == (igual)
    CMP_NEQ = auto()  # != (distinto)
    CMP_LT  = auto()  # <  (menor que)
    CMP_GT  = auto()  # >  (mayor que)
    CMP_LTE = auto()  # <= (menor o igual)
    CMP_GTE = auto()  # >= (mayor o igual)

    # ── Saltos (control de flujo) ────────────────────────────────────────
    JUMP           = auto()   # JUMP <label>          → salto incondicional
    JUMP_IF_FALSE  = auto()   # JUMP_IF_FALSE <label> → salta si tope == 0

    # ── Etiquetas ────────────────────────────────────────────────────────
    LABEL = auto()   # LABEL <nombre>  → marca de posición para saltos


# Representación legible de cada opcode para la traza visual
OPCODE_LABELS: dict[OpCode, str] = {
    OpCode.PUSH:          "PUSH",
    OpCode.POP:           "POP",
    OpCode.LOAD:          "LOAD",
    OpCode.STORE:         "STORE",
    OpCode.ADD:           "ADD",
    OpCode.SUB:           "SUB",
    OpCode.MUL:           "MUL",
    OpCode.DIV:           "DIV",
    OpCode.CMP_EQ:        "CMP ==",
    OpCode.CMP_NEQ:       "CMP !=",
    OpCode.CMP_LT:        "CMP <",
    OpCode.CMP_GT:        "CMP >",
    OpCode.CMP_LTE:       "CMP <=",
    OpCode.CMP_GTE:       "CMP >=",
    OpCode.JUMP:          "JUMP",
    OpCode.JUMP_IF_FALSE: "JUMP_IF_FALSE",
    OpCode.LABEL:         "LABEL",
}



class Instruction:
    """Unidad de código intermedio ejecutable por el StackInterpreter.

    Attributes:
        opcode  (OpCode): Operación a realizar.
        operand (Any):    Argumento opcional (literal, nombre de variable
                          o etiqueta de salto). None si no aplica.
    """

    def __init__(self, opcode: OpCode, operand: Any = None):
        """Inicializa la instrucción con su opcode y operando."""
        self.opcode  = opcode
        self.operand = operand

    def __repr__(self) -> str:
        """Representación de una línea para la columna 'Instrucción' de la traza."""
        label = OPCODE_LABELS.get(self.opcode, self.opcode.name)
        if self.operand is not None:
            return f"{label}  {self.operand}"
        return label
