"""
Módulo Intérprete de Pila (StackInterpreter).

Ejecuta la lista de Instrucciones generadas por el StackCompiler,
manteniendo la pila de ejecución (Stack) y la memoria de variables
(dict). Produce un ExecutionStep por cada instrucción ejecutada,
permitiendo a la vista reproducir la traza paso a paso de forma
completamente desacoplada del motor de ejecución.
"""

from typing import Any
from models.stack_instruction import Instruction, OpCode
from models.stack_structure import Stack, StackUnderflowError


class InterpreterError(Exception):
    """Excepción en tiempo de ejecución del intérprete."""
    pass


class ExecutionStep:
    """Instantánea del estado de la máquina tras ejecutar una instrucción.

    Attributes:
        step_num         (int):         Número de paso (base 0).
        instruction      (Instruction): Instrucción que se acaba de ejecutar.
        stack_snapshot   (list):        Copia del contenido de la pila.
        memory_snapshot  (dict):        Copia del mapa de variables.
        result           (Any):         Valor calculado si aplica, None si no.
        error            (str | None):  Mensaje de error si hubo excepción.
    """

    def __init__(
        self,
        step_num: int,
        instruction: Instruction,
        stack_snapshot: list[Any],
        memory_snapshot: dict[str, Any],
        result: Any = None,
        error: str | None = None,
    ):
        self.step_num        = step_num
        self.instruction     = instruction
        self.stack_snapshot  = stack_snapshot
        self.memory_snapshot = memory_snapshot
        self.result          = result
        self.error           = error

    def describe(self) -> str:
        """Descripción en lenguaje natural del paso para el usuario.

        Returns:
            str: Frase explicativa de la operación realizada.
        """
        op = self.instruction.opcode
        arg = self.instruction.operand

        descriptions = {
            OpCode.PUSH:          f"Se apila el valor {arg}",
            OpCode.POP:           "Se descarta el valor del tope",
            OpCode.LOAD:          f"Se carga la variable '{arg}' → {self.result}",
            OpCode.STORE:         f"Se guarda el tope en la variable '{arg}'",
            OpCode.ADD:           f"Se suma: resultado = {self.result}",
            OpCode.SUB:           f"Se resta: resultado = {self.result}",
            OpCode.MUL:           f"Se multiplica: resultado = {self.result}",
            OpCode.DIV:           f"Se divide: resultado = {self.result}",
            OpCode.CMP_EQ:        f"Comparación ==: {'verdadero' if self.result else 'falso'}",
            OpCode.CMP_NEQ:       f"Comparación !=: {'verdadero' if self.result else 'falso'}",
            OpCode.CMP_LT:        f"Comparación <:  {'verdadero' if self.result else 'falso'}",
            OpCode.CMP_GT:        f"Comparación >:  {'verdadero' if self.result else 'falso'}",
            OpCode.CMP_LTE:       f"Comparación <=: {'verdadero' if self.result else 'falso'}",
            OpCode.CMP_GTE:       f"Comparación >=: {'verdadero' if self.result else 'falso'}",
            OpCode.JUMP:          f"Salto incondicional → {arg}",
            OpCode.JUMP_IF_FALSE: f"Condición {'falsa → salta' if self.result == 'jumped' else 'verdadera → continúa'} ({arg})",
            OpCode.LABEL:         f"Etiqueta '{arg}' alcanzada",
        }

        if self.error:
            return f"Error: {self.error}"
        return descriptions.get(op, repr(self.instruction))


class StackInterpreter:
    """Intérprete de instrucciones de pila con ejecución paso a paso.

    Attributes:
        _stack        (Stack):              Pila de ejecución.
        _memory       (dict[str, Any]):     Memoria de variables.
        _instructions (list[Instruction]):  Programa cargado.
        _ip           (int):               Puntero de instrucción actual.
        _label_map    (dict[str, int]):    Mapa de etiqueta → índice.
    """

    MAX_STEPS = 1000   # Límite de seguridad para ciclos infinitos

    def __init__(self):
        """Inicializa el intérprete en estado limpio."""
        self._stack:        Stack                  = Stack()
        self._memory:       dict[str, Any]         = {}
        self._instructions: list[Instruction]      = []
        self._ip:           int                    = 0
        self._label_map:    dict[str, int]         = {}

    # ------------------------------------------------------------------ #
    # Interfaz pública                                                     #
    # ------------------------------------------------------------------ #

    def run(self, instructions: list[Instruction]) -> list[ExecutionStep]:
        """Ejecuta el programa completo y retorna todos los pasos.

        Args:
            instructions: Lista de instrucciones generada por StackCompiler.

        Returns:
            list[ExecutionStep]: Traza completa de la ejecución.
        """
        self.reset()
        self._instructions = instructions
        self._build_label_map()

        steps: list[ExecutionStep] = []
        guard = 0

        while self._ip < len(self._instructions):
            guard += 1
            if guard > self.MAX_STEPS:
                steps.append(ExecutionStep(
                    step_num=len(steps),
                    instruction=self._instructions[self._ip],
                    stack_snapshot=self._stack.snapshot(),
                    memory_snapshot=dict(self._memory),
                    error=f"Límite de {self.MAX_STEPS} pasos alcanzado. ¿Ciclo infinito?",
                ))
                break

            step = self.step()
            steps.append(step)
            if step.error:
                break

        return steps

    def step(self) -> ExecutionStep:
        """Ejecuta la instrucción actual y avanza el puntero.

        Returns:
            ExecutionStep: Estado tras la ejecución de la instrucción.
        """
        instr  = self._instructions[self._ip]
        result = None
        error  = None

        try:
            result = self._execute(instr)
        except (StackUnderflowError, InterpreterError, ZeroDivisionError) as exc:
            error = str(exc)

        step = ExecutionStep(
            step_num=self._ip,
            instruction=instr,
            stack_snapshot=self._stack.snapshot(),
            memory_snapshot=dict(self._memory),
            result=result,
            error=error,
        )

        if not error:
            self._ip += 1

        return step

    def reset(self) -> None:
        """Reinicia el intérprete a estado inicial."""
        self._stack        = Stack()
        self._memory       = {}
        self._instructions = []
        self._ip           = 0
        self._label_map    = {}

    # ------------------------------------------------------------------ #
    # Lógica de ejecución por opcode                                      #
    # ------------------------------------------------------------------ #

    def _build_label_map(self) -> None:
        """Precompila el mapa etiqueta → índice para saltos O(1)."""
        self._label_map = {}
        for idx, instr in enumerate(self._instructions):
            if instr.opcode == OpCode.LABEL:
                self._label_map[instr.operand] = idx

    def _execute(self, instr: Instruction) -> Any:
        """Despacha la instrucción a su manejador; retorna valor relevante."""
        op  = instr.opcode
        arg = instr.operand

        # ── Pila ────────────────────────────────────────────────────────
        if op == OpCode.PUSH:
            self._stack.push(arg)
            return arg

        if op == OpCode.POP:
            return self._stack.pop()

        # ── Memoria ─────────────────────────────────────────────────────
        if op == OpCode.LOAD:
            if arg not in self._memory:
                raise InterpreterError(
                    f"Variable '{arg}' no definida. "
                    "Asígnala antes de usarla."
                )
            value = self._memory[arg]
            self._stack.push(value)
            return value

        if op == OpCode.STORE:
            value = self._stack.pop()
            self._memory[arg] = value
            return value

        # ── Aritmética ───────────────────────────────────────────────────
        if op in (OpCode.ADD, OpCode.SUB, OpCode.MUL, OpCode.DIV):
            b = self._stack.pop()
            a = self._stack.pop()
            if op == OpCode.ADD: res = a + b
            elif op == OpCode.SUB: res = a - b
            elif op == OpCode.MUL: res = a * b
            else:
                if b == 0:
                    raise InterpreterError("División por cero.")
                res = a / b
                # Convertir a entero si el resultado es exacto
                if isinstance(res, float) and res.is_integer():
                    res = int(res)
            self._stack.push(res)
            return res

        # ── Comparación ─────────────────────────────────────────────────
        cmp_ops = {
            OpCode.CMP_EQ:  lambda a, b: a == b,
            OpCode.CMP_NEQ: lambda a, b: a != b,
            OpCode.CMP_LT:  lambda a, b: a <  b,
            OpCode.CMP_GT:  lambda a, b: a >  b,
            OpCode.CMP_LTE: lambda a, b: a <= b,
            OpCode.CMP_GTE: lambda a, b: a >= b,
        }
        if op in cmp_ops:
            b = self._stack.pop()
            a = self._stack.pop()
            res = 1 if cmp_ops[op](a, b) else 0
            self._stack.push(res)
            return res

        # ── Saltos ───────────────────────────────────────────────────────
        if op == OpCode.JUMP:
            self._ip = self._label_map[arg] - 1  # -1 porque step() sumará 1
            return f"→ {arg}"

        if op == OpCode.JUMP_IF_FALSE:
            cond = self._stack.pop()
            if not cond:
                self._ip = self._label_map[arg] - 1
                return "jumped"
            return "continue"

        # ── Etiquetas ────────────────────────────────────────────────────
        if op == OpCode.LABEL:
            return f"[{arg}]"   # sin efecto en ejecución; solo marcador

        raise InterpreterError(f"OpCode desconocido: {op}")
