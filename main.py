import streamlit as st
from views.math_view import MathView
from views.regex_view import RegexView

class CompilerApp:
    """Orquestador principal de la aplicación."""

    def __init__(self):
        """Configuración de página y vistas."""
        st.set_page_config(page_title="Compiladores Lab Pro", layout="wide")
        self.math_view = MathView()
        self.regex_view = RegexView()

    def show_sidebar(self):
        """Muestra las notas académicas."""
        st.sidebar.markdown("### Notas Académicas")
        st.sidebar.write("""
        El **Algoritmo de Thompson** construye AFNs agregando estados auxiliares.
        - Flechas grises (&epsilon;): Transiciones espontáneas.
        - Círculo doble verde: Estado final.
        - **Naranja:** Estados actuales.
        """)

    def run(self):
        """Loop principal."""
        st.title("🎓 Laboratorio de Teoría de Compiladores")
        self.show_sidebar()
        
        tabs = st.tabs(["🧮 Análisis Matemático", "🔍 Lenguajes Regulares"])
        with tabs[0]: self.math_view.show()
        with tabs[1]: self.regex_view.show()

if __name__ == "__main__":
    app = CompilerApp()
    app.run()