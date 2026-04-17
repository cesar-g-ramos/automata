from models.regex_node import RegexNode

class ThompsonBuilder:
    """Generador de AFN basado en la estructura de la Regex (Algoritmo de Thompson)."""

    def __init__(self):
        """Inicializa el contador de nodos."""
        self.node_count = 0

    def create_node(self):
        """Crea un nuevo nodo con ID incremental."""
        node = RegexNode(self.node_count)
        self.node_count += 1
        return node

    def build_basic(self, char):
        """Construye un AFN básico para un carácter."""
        start = self.create_node()
        end = self.create_node()
        start.add_transition(char, end)
        return start, end

    def build_union(self, start1, end1, start2, end2):
        """Construye la unión de dos fragmentos de AFN."""
        start = self.create_node()
        end = self.create_node()
        start.add_epsilon(start1)
        start.add_epsilon(start2)
        end1.add_epsilon(end)
        end2.add_epsilon(end)
        return start, end

    def build_concat(self, start1, end1, start2, end2):
        """Concatena dos fragmentos de AFN."""
        end1.add_epsilon(start2)
        return start1, end2

    def build_kleene(self, start_inner, end_inner):
        """Aplica el cierre de Kleene (*)."""
        start = self.create_node()
        end = self.create_node()
        start.add_epsilon(start_inner)
        start.add_epsilon(end)
        end_inner.add_epsilon(start_inner)
        end_inner.add_epsilon(end)
        return start, end

    def build_positive(self, start_inner, end_inner):
        """Aplica el cierre positivo (+)."""
        start = self.create_node()
        end = self.create_node()
        start.add_epsilon(start_inner)
        end_inner.add_epsilon(start_inner)
        end_inner.add_epsilon(end)
        return start, end