import streamlit as st
import sympy as sp
import pandas as pd
import re
from models.math_automata import MathAutomata
from models.math_engine import MathEngine

class MathView:
    """Vista para el análisis matemático y el PDA con navegación por botones."""

    def __init__(self):
        """Inicializa motores y asegura el estado de la sesión."""
        self.automata = MathAutomata()
        self.engine = MathEngine()
        if 'math_step' not in st.session_state:
            st.session_state.math_step = 0

    def generate_graphviz(self, current_state=None):
        """Genera el grafo del PDA resaltando el estado actual."""
        dot = 'digraph G {\n  rankdir=LR;\n  node [fontname="Segoe UI", style=filled, fillcolor=white];\n'
        for s in self.automata.transitions.keys():
            attrs = []
            if s == current_state: attrs.extend(['fillcolor="#ffe0b2"', 'color="#fb8c00"', 'penwidth=3'])
            if s in self.automata.estados_aceptacion: attrs.append('shape=doublecircle')
            if s == "q_error": attrs.extend(['color=red', 'fontcolor=red'])
            dot += f'  {s} [{", ".join(attrs)}];\n'
        for src, trans in self.automata.transitions.items():
            dest_map = {}
            for label, dest in trans.items():
                dest_map.setdefault(dest, []).append(label)
            for dest, labels in dest_map.items():
                dot += f'  {src} -> {dest} [label="{", ".join(labels)}"];\n'
        return dot + '}'

    def show(self):
        """Renderiza la UI de matemáticas con navegación por botones."""
        col_main, col_side = st.columns([1.5, 1])
        
        with col_main:
            st.header("📝 Entrada Algebraica")
            user_expr = st.text_input("Ingresa la expresión:", value="(a+b)^2", key="m_ui")
            
            if user_expr:
                is_valid, history = self.automata.validate(user_expr)
                
                # Reiniciar índice si la expresión cambia
                if "last_math_expr" not in st.session_state or st.session_state.last_math_expr != user_expr:
                    st.session_state.math_step = len(history) - 1
                    st.session_state.last_math_expr = user_expr

                if is_valid:
                    st.success("✅ Estructura válida.")
                    opc = st.radio("Operación:", ["Simplificación", "Evaluación", "Resolución", "Ver Tuplas"], horizontal=True)
                    
                    if opc == "Simplificación":
                        res = self.engine.solve_symbolic(user_expr, mode="reduce")
                        st.latex(sp.latex(res) if not isinstance(res, str) else res)
                    elif opc == "Evaluación":
                        vars_needed = sorted(list(set(re.findall(r'[a-zA-Z][a-zA-Z0-9]*', user_expr))))
                        user_vals = {v: st.number_input(f"{v}:", value=1.0) for v in vars_needed}
                        res = self.engine.solve_symbolic(user_expr, mode="evaluate", var_values=user_vals)
                        st.metric("Resultado", str(res))
                    
                    elif opc == "Resolución":
                        if "=" in user_expr:
                            res = self.engine.solve_symbolic(user_expr, mode="solve")
                            
                            # Si el resultado es una cadena de error o aviso
                            if "Error" in res or "No se encontraron" in res:
                                st.warning(res)
                            else:
                                st.subheader("Soluciones halladas:")
                                # Mostramos el resultado en formato matemático (LaTeX)
                                # Usamos f-string para envolver el resultado en formato de conjunto o igualdad
                                st.latex(res)
                                st.info("Las soluciones se presentan en formato matemático estándar.")
                        else:
                            st.warning("Ingrese una igualdad (ej: x^2 = 4) para poder resolver.")

                    elif opc == "Ver Tuplas":
                        tokens = self.automata.process_to_tuples(user_expr)
                        st.table(pd.DataFrame(tokens, columns=["Categoría", "Lexema"]))
                else:
                    st.error("❌ Error de sintaxis.")

        with col_side:
            st.header("⚙️ Traza del PDA")
            if user_expr and 'history' in locals():
                # Controles de navegación
                max_step = len(history) - 1
                c1, c2, c3 = st.columns([1, 2, 1])
                
                if c1.button("⬅️", key="math_prev") and st.session_state.math_step > 0:
                    st.session_state.math_step -= 1
                
                c2.markdown(f"<center>Paso <b>{st.session_state.math_step}</b> de {max_step}</center>", unsafe_allow_html=True)
                
                if c3.button("➡️", key="math_next") and st.session_state.math_step < max_step:
                    st.session_state.math_step += 1

                current_step_data = history[st.session_state.math_step]
                st.graphviz_chart(self.generate_graphviz(current_step_data["Estado"]))
                st.code(f"Carácter: {current_step_data['Carácter']}\nEstado: {current_step_data['Estado']}\nPila: {current_step_data['Pila']}")