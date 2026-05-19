"""
Módulo de Interfaz para el Intérprete Basado en Pila.

Define la capa de presentación del intérprete de lenguaje simple.
Gestiona la entrada de código fuente, orquesta la compilación y
ejecución, y renderiza la traza paso a paso de forma visual e
interactiva mediante Streamlit: pila animada, memoria de variables,
código intermedio generado y navegación enriquecida.
"""

import streamlit as st
import pandas as pd

from models.stack_compiler import StackCompiler, CompilerError
from models.stack_lexer import LexerError
from models.stack_interpreter import StackInterpreter, ExecutionStep
from models.stack_instruction import OpCode
from views.nav_controls import step_navigator          # ← nuevo


# ── Código de ejemplo que se muestra al cargar la vista ──────────────── #
_EXAMPLE_BASIC = """\
x = 5
y = x + 3
z = y * 2
"""

_EXAMPLE_IF = """\
a = 10
b = 4
if (a > b) {
    resultado = a - b
} else {
    resultado = b - a
}
"""

_EXAMPLE_WHILE = """\
n = 1
acum = 0
while (n <= 5) {
    acum = acum + n
    n = n + 1
}
"""

_EXAMPLES = {
    "📦 Variables y aritmética": _EXAMPLE_BASIC,
    "🔀 Condicional IF / ELSE":  _EXAMPLE_IF,
    "🔁 Ciclo WHILE":            _EXAMPLE_WHILE,
}


class StackInterpreterView:
    """Vista del intérprete de pila con navegación enriquecida paso a paso.

    Utiliza el componente step_navigator (nav_controls.py) compartido con
    MathView y RegexView, manteniendo consistencia visual en las 3 pestañas.
    """

    def __init__(self):
        """Inicializa el compilador, el intérprete y el estado de sesión."""
        self._compiler    = StackCompiler()
        self._interpreter = StackInterpreter()

        defaults = {
            "si_steps":       [],
            "si_step_idx":    0,
            "si_bytecode":    [],
            "si_last_source": "",
            "si_error":       None,
        }
        for key, value in defaults.items():
            if key not in st.session_state:
                st.session_state[key] = value

    # ------------------------------------------------------------------ #
    # Punto de entrada llamado por CompilerApp                            #
    # ------------------------------------------------------------------ #

    def show(self) -> None:
        """Renderiza la UI completa del intérprete."""
        self._render_header()

        col_left, col_right = st.columns([1.1, 1])

        with col_left:
            self._render_editor()

        with col_right:
            self._render_trace_panel()

    # ------------------------------------------------------------------ #
    # Secciones de la UI                                                   #
    # ------------------------------------------------------------------ #

    def _render_header(self) -> None:
        """Encabezado con descripción breve y selector de ejemplos."""
        st.markdown(
            "Escribe código fuente en el editor, compílalo y observa "
            "cómo el intérprete lo ejecuta **instrucción por instrucción** "
            "sobre la pila."
        )

        example_key = st.selectbox(
            "Cargar ejemplo:",
            options=list(_EXAMPLES.keys()),
            key="si_example_select",
        )
        if st.button("📂 Cargar ejemplo", key="si_load_example"):
            st.session_state["si_source_input"] = _EXAMPLES[example_key]
            self._reset_state()

    def _render_editor(self) -> None:
        """Panel izquierdo: editor de código + código intermedio."""
        st.subheader("✏️ Editor de código")

        source = st.text_area(
            "Código fuente:",
            height=200,
            key="si_source_input",
            placeholder="x = 5\ny = x + 3\n",
        )

        col_compile, col_clear = st.columns([2, 1])
        with col_compile:
            compile_btn = st.button(
                "▶ Compilar y ejecutar", key="si_compile_btn", type="primary"
            )
        with col_clear:
            if st.button("🗑 Limpiar", key="si_clear_btn"):
                self._reset_state()
                st.rerun()

        if compile_btn and source.strip():
            self._compile_and_run(source)

        if st.session_state["si_error"]:
            st.error(f"⚠️ {st.session_state['si_error']}")
        elif st.session_state["si_bytecode"]:
            st.subheader("🔢 Código intermedio generado")
            self._render_bytecode_table()

    def _render_trace_panel(self) -> None:
        """Panel derecho: navegación enriquecida, pila y memoria."""
        steps: list[ExecutionStep] = st.session_state["si_steps"]

        if not steps:
            st.info("💡 Escribe código y presiona **Compilar y ejecutar** para ver la traza.")
            return

        st.subheader("⚙️ Traza de ejecución")

        max_idx = len(steps) - 1

        # ── Navegación enriquecida (reemplaza los 3 botones) ─────────── #
        st.session_state["si_step_idx"] = step_navigator(
            current   = st.session_state["si_step_idx"],
            max_steps = max_idx,
            key       = "si",
        )

        idx     = st.session_state["si_step_idx"]
        current = steps[idx]

        # ── Instrucción actual ───────────────────────────────────────── #
        instr_color = "#ffcccc" if current.error else "#d4edda"
        st.markdown(
            f"<div style='background:{instr_color};padding:10px;"
            f"border-radius:8px;font-family:monospace;font-size:15px'>"
            f"<b>Instrucción:</b>  {current.instruction}"
            f"</div>",
            unsafe_allow_html=True,
        )

        st.caption(current.describe())

        if current.error:
            st.error(f"Error en ejecución: {current.error}")
            return

        st.markdown("**🥞 Estado de la pila** *(tope arriba)*")
        self._render_stack_visual(current.stack_snapshot)

        st.markdown("**🗄️ Memoria de variables**")
        self._render_memory_table(current.memory_snapshot)

    # ------------------------------------------------------------------ #
    # Renderizado de sub-componentes                                       #
    # ------------------------------------------------------------------ #

    def _render_bytecode_table(self) -> None:
        """Tabla del código intermedio con el paso actual resaltado."""
        bytecode = st.session_state["si_bytecode"]
        idx      = st.session_state["si_step_idx"]
        steps    = st.session_state["si_steps"]

        current_instr_idx = steps[idx].step_num if steps else -1

        rows = []
        for i, instr in enumerate(bytecode):
            marker = "▶" if i == current_instr_idx else ""
            rows.append({
                " ":       marker,
                "#":       i,
                "Opcode":  instr.opcode.name,
                "Operando": str(instr.operand) if instr.operand is not None else "",
            })

        df = pd.DataFrame(rows)
        st.dataframe(df, use_container_width=True, hide_index=True, height=220)

    def _render_stack_visual(self, snapshot: list) -> None:
        """Renderiza la pila como celdas apiladas (tope arriba)."""
        if not snapshot:
            st.markdown(
                "<div style='text-align:center;color:gray;font-style:italic;"
                "padding:16px;border:1px dashed #ccc;border-radius:8px'>"
                "Pila vacía"
                "</div>",
                unsafe_allow_html=True,
            )
            return

        reversed_snap = list(reversed(snapshot))
        html_cells = ""
        for i, val in enumerate(reversed_snap):
            is_top   = (i == 0)
            bg_color = "#1a7a4a" if is_top else "#2e9c6a"
            border   = "3px solid #0d5c37" if is_top else "1px solid #1a7a4a"
            label    = " ← tope" if is_top else ""
            html_cells += (
                f"<div style='background:{bg_color};color:#ffffff;"
                f"border:{border};padding:8px 16px;margin:2px 0;"
                f"border-radius:6px;font-family:monospace;font-size:14px;"
                f"display:flex;justify-content:space-between'>"
                f"<span>{val}</span>"
                f"<span style='opacity:0.7;font-size:12px'>{label}</span>"
                f"</div>"
            )

        st.markdown(
            f"<div style='border:1px solid #ccc;border-radius:8px;"
            f"padding:8px;max-height:200px;overflow-y:auto'>{html_cells}</div>",
            unsafe_allow_html=True,
        )

    def _render_memory_table(self, memory: dict) -> None:
        """Tabla de variables con nombre y valor actual."""
        if not memory:
            st.caption("Sin variables definidas aún.")
            return

        df = pd.DataFrame(
            [{"Variable": k, "Valor": v} for k, v in memory.items()]
        )
        st.dataframe(df, use_container_width=True, hide_index=True)

    # ------------------------------------------------------------------ #
    # Compilación y ejecución                                              #
    # ------------------------------------------------------------------ #

    def _compile_and_run(self, source: str) -> None:
        """Compila el fuente, ejecuta el intérprete y guarda la traza."""
        self._reset_state()

        try:
            bytecode = self._compiler.compile(source)
            st.session_state["si_bytecode"] = bytecode
        except (LexerError, CompilerError) as exc:
            st.session_state["si_error"] = str(exc)
            return

        steps = self._interpreter.run(bytecode)
        st.session_state["si_steps"]       = steps
        st.session_state["si_last_source"] = source

    def _reset_state(self) -> None:
        """Reinicia el estado de ejecución sin tocar el editor."""
        st.session_state["si_steps"]    = []
        st.session_state["si_step_idx"] = 0
        st.session_state["si_slider"]   = 0   # ← limpiar el slider explícitamente
        st.session_state["si_bytecode"] = []
        st.session_state["si_error"]    = None