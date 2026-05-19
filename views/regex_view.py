"""
Módulo de Interfaz para Visualización de AFN.

Encargado de la representación visual del procesamiento de lenguajes regulares. 
Implementa una interfaz interactiva que permite generar autómatas a partir de Regex, 
simular la evaluación de cadenas paso a paso y visualizar dinámicamente los estados 
activos y finales del AFN mediante el uso de grafos dirigidos y controles de navegación.
"""

import streamlit as st
import pandas as pd
from models.regex_engine import RegexEngine
from views.nav_controls import step_navigator          # ← nuevo


class RegexView:
    """Visualización del AFN con navegación enriquecida paso a paso."""

    def __init__(self):
        """Inicializa el motor y el estado de la sesión."""
        self.engine = RegexEngine()
        if "reg_step" not in st.session_state:
            st.session_state.reg_step = 0

    def generate_afn_dot(self, start_node, accept_node, active_nodes=None):
        """Genera el código DOT resaltando los nodos activos."""
        if active_nodes is None:
            active_nodes = set()
        active_ids = {n.id for n in active_nodes}

        dot = 'digraph AFN {\n  rankdir=LR;\n  node [shape=circle, fontname="Arial", style=filled, fillcolor=white];\n'
        visited = set()
        queue = [start_node]

        accept_attr = "shape=doublecircle, color=green"
        if accept_node.id in active_ids:
            accept_attr += ', fillcolor="#ffe0b2", color="#fb8c00", penwidth=3'
        dot += f"  {accept_node.name} [{accept_attr}];\n"

        dot += f"  secret_init [style=invis];\n  secret_init -> {start_node.name};\n"

        while queue:
            curr = queue.pop(0)
            if curr.id in visited:
                continue
            visited.add(curr.id)

            if curr.id in active_ids and curr.id != accept_node.id:
                dot += f'  {curr.name} [fillcolor="#ffe0b2", color="#fb8c00", penwidth=3];\n'

            for next_node in curr.epsilon_transitions:
                dot += f'  {curr.name} -> {next_node.name} [label="&epsilon;", color=gray, fontcolor=gray];\n'
                queue.append(next_node)

            for char, nodes in curr.transitions.items():
                for next_node in nodes:
                    dot += f'  {curr.name} -> {next_node.name} [label="{char}"];\n'
                    queue.append(next_node)

        return dot + "}"

    def show(self):
        """Muestra la interfaz de Regex con navegación enriquecida por pasos."""
        st.header("🧬 Generador y Traza de AFN")
        col_input, col_viz = st.columns([1, 1.5])

        with col_input:
            st.subheader("Configuración")
            regex_input = st.text_input("Regex:", value="ab*", key="reg_input")
            test_string = st.text_input("Cadena:", value="abbb", key="str_input")

            st.markdown("---")
            st.info("**Símbolos:** a|b (Unión), ab (Concat), a* (Kleene), a+ (Positivo)")

        with col_viz:
            if regex_input:
                start_n, end_n = self.engine.parse_regex_to_afn(regex_input)
                if start_n:
                    history  = self.engine.simulate_afn(start_n, test_string)
                    max_step = len(history) - 1

                    # Reiniciar índice cuando cambia la regex o la cadena
                    current_id = regex_input + test_string
                    if (
                        "last_reg_id" not in st.session_state
                        or st.session_state.last_reg_id != current_id
                    ):
                        st.session_state.reg_step  = max_step
                        st.session_state.reg_slider = 0   # ← limpiar slider
                        st.session_state.last_reg_id = current_id

                    # ── Navegación enriquecida (reemplaza los 3 botones) ── #
                    st.session_state.reg_step = step_navigator(
                        current   = st.session_state.reg_step,
                        max_steps = max_step,
                        key       = "reg",
                    )

                    current_data = history[st.session_state.reg_step]
                    dot_code = self.generate_afn_dot(start_n, end_n, current_data["Estados"])
                    st.graphviz_chart(dot_code)

                    names = sorted([n.name for n in current_data["Estados"]])
                    st.code(
                        f"Leyendo: '{current_data['Carácter']}'\n"
                        f"Estados activos: {', '.join(names)}"
                    )

                    if any(n.id == end_n.id for n in history[-1]["Estados"]):
                        st.success("✔️ Cadena ACEPTADA")
                    else:
                        st.warning("❌ Cadena RECHAZADA")